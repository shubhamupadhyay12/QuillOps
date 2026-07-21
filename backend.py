from __future__ import annotations

import json
import logging
import operator
import os
import re
import sqlite3
import time
from concurrent.futures import FIRST_COMPLETED, Future, ThreadPoolExecutor, wait
from contextvars import ContextVar
from datetime import date
from pathlib import Path
from typing import Annotated, Any, Callable, List, Literal, Optional, Type, TypeVar, TypedDict

from dotenv import load_dotenv
from pydantic import BaseModel, Field, ValidationError, field_validator, model_validator

from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage
from langchain_nvidia_ai_endpoints import ChatNVIDIA
from langgraph.graph import END, START, StateGraph
from langgraph.types import Command, Send, interrupt
from tavily import TavilyClient

load_dotenv()
logger = logging.getLogger(__name__)

# -----------------------------------------------------------------------------
# 1) Schemas
# -----------------------------------------------------------------------------


class Task(BaseModel):
    id: int
    title: str
    goal: str = Field(
        ...,
        description=(
            "One sentence describing what the reader should be able to do or "
            "understand after this section."
        ),
    )
    bullets: List[str] = Field(
        ...,
        min_length=3,
        max_length=6,
        description="3–6 concrete, non-overlapping subpoints to cover.",
    )
    target_words: int = Field(ge=120, le=550)
    tags: List[str] = Field(default_factory=list)
    requires_research: bool = False
    requires_citations: bool = False
    requires_code: bool = False

    @field_validator("title", "goal")
    @classmethod
    def require_meaningful_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("must not be empty")
        return value

    @field_validator("bullets")
    @classmethod
    def require_complete_bullets(cls, value: List[str]) -> List[str]:
        cleaned = [str(item).strip() for item in value]
        if any(not item for item in cleaned):
            raise ValueError("every bullet must contain text")
        return cleaned


class Plan(BaseModel):
    blog_title: str
    audience: str
    tone: str
    blog_kind: Literal[
        "explainer", "tutorial", "news_roundup", "comparison", "system_design"
    ] = "explainer"
    constraints: List[str] = Field(default_factory=list)
    requested_length: Literal["short", "standard", "long-form"] = "standard"
    target_words: int = Field(default=1900, ge=800, le=4000)
    tasks: List[Task] = Field(min_length=4, max_length=12)

    @model_validator(mode="after")
    def require_unique_section_titles(self) -> "Plan":
        normalized = [re.sub(r"\s+", " ", task.title.strip()).casefold() for task in self.tasks]
        if len(normalized) != len(set(normalized)):
            raise ValueError("section titles must be unique")
        return self


class EvidenceItem(BaseModel):
    title: str
    url: str
    published_at: Optional[str] = None
    snippet: Optional[str] = None
    source: Optional[str] = None


class RouterDecision(BaseModel):
    needs_research: bool
    mode: Literal["closed_book", "hybrid", "open_book"]
    queries: List[str] = Field(default_factory=list)


class EvidencePack(BaseModel):
    evidence: List[EvidenceItem] = Field(default_factory=list)


class State(TypedDict):
    topic: str
    as_of: str
    mode: str
    needs_research: bool
    queries: List[str]
    evidence: List[EvidenceItem]
    plan: Optional[Plan]
    sections: Annotated[List[tuple[int, str]], operator.add]
    final: str


class WorkerPayload(TypedDict):
    task: dict
    topic: str
    mode: str
    plan: dict
    evidence: List[dict]


# -----------------------------------------------------------------------------
# 2) Model setup
# -----------------------------------------------------------------------------

NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")
if not NVIDIA_API_KEY:
    raise RuntimeError("NVIDIA_API_KEY is missing from the environment.")

MODEL_NAME = os.getenv("NVIDIA_MODEL", "meta/llama-3.1-8b-instruct")

llm = ChatNVIDIA(
    model=MODEL_NAME,
    api_key=NVIDIA_API_KEY,
    temperature=0.2,
    max_completion_tokens=int(os.getenv("PLANNER_MAX_COMPLETION_TOKENS", "4000")),
    timeout=75,
)
tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

T = TypeVar("T", bound=BaseModel)
ProgressCallback = Callable[[str, int, str], None]
_progress_callback: ContextVar[ProgressCallback | None] = ContextVar(
    "quillops_progress_callback", default=None
)


class PlannerOutputError(RuntimeError):
    def __init__(self, code: str, message: str):
        super().__init__(message)
        self.code = code


class LengthPolicy(BaseModel):
    key: Literal["short", "standard", "long-form"]
    section_min: int
    section_max: int
    word_min: int
    word_max: int
    target_words: int


LENGTH_POLICIES = {
    "short": LengthPolicy(key="short", section_min=4, section_max=6, word_min=800, word_max=1200, target_words=1000),
    "standard": LengthPolicy(key="standard", section_min=6, section_max=9, word_min=1500, word_max=2300, target_words=1900),
    "long-form": LengthPolicy(key="long-form", section_min=8, section_max=12, word_min=2500, word_max=4000, target_words=3200),
}


class PlanPolicyError(ValueError):
    def __init__(self, diagnostics: list[dict[str, Any]]):
        super().__init__("; ".join(str(item["rule"]) for item in diagnostics))
        self.diagnostics = diagnostics


def length_policy_for_topic(topic: str) -> LengthPolicy:
    match = re.search(r"Target length:\s*([^.\n]+)", topic, re.IGNORECASE)
    raw = (match.group(1) if match else "standard").strip().lower().replace("_", "-")
    aliases = {"long": "long-form", "long form": "long-form", "brief": "short"}
    key = aliases.get(raw, raw)
    policy = LENGTH_POLICIES.get(key)
    if policy is None:
        raise PlannerOutputError("INVALID_LENGTH_POLICY", f"Unsupported target length: {raw}")
    return policy


def validate_plan_policy(plan: Plan, policy: LengthPolicy) -> Plan:
    diagnostics: list[dict[str, Any]] = []
    section_count = len(plan.tasks)
    total_words = sum(task.target_words for task in plan.tasks)
    tolerance_min = round(policy.target_words * 0.9)
    tolerance_max = round(policy.target_words * 1.1)
    if not policy.section_min <= section_count <= policy.section_max:
        diagnostics.append({
            "path": "tasks",
            "value": section_count,
            "rule": f"must contain {policy.section_min} to {policy.section_max} sections for {policy.key}",
        })
    if not tolerance_min <= total_words <= tolerance_max:
        diagnostics.append({
            "path": "tasks.*.target_words",
            "value": total_words,
            "rule": f"total must be {tolerance_min} to {tolerance_max} words (target {policy.target_words})",
        })
    if diagnostics:
        raise PlanPolicyError(diagnostics)
    return plan.model_copy(update={"requested_length": policy.key, "target_words": policy.target_words})


def normalize_plan_word_budgets(payload: Any, policy: LengthPolicy) -> Any:
    if not isinstance(payload, dict) or not isinstance(payload.get("tasks"), list) or not payload["tasks"]:
        return payload
    tasks = payload["tasks"]
    if not policy.section_min <= len(tasks) <= policy.section_max:
        return payload
    raw = []
    for task in tasks:
        try:
            raw.append(max(1, int(task.get("target_words", 1))))
        except (AttributeError, TypeError, ValueError):
            raw.append(1)
    scale = policy.target_words / sum(raw)
    budgets = [min(550, max(120, round(value * scale))) for value in raw]
    difference = policy.target_words - sum(budgets)
    cursor = 0
    while difference and cursor < len(budgets) * 600:
        index = cursor % len(budgets)
        step = 1 if difference > 0 else -1
        candidate = budgets[index] + step
        if 120 <= candidate <= 550:
            budgets[index] = candidate
            difference -= step
        cursor += 1
    if difference:
        return payload
    normalized = {**payload, "requested_length": policy.key, "target_words": policy.target_words}
    normalized_tasks = []
    seen_titles: set[str] = set()
    for index, (task, budget) in enumerate(zip(tasks, budgets), start=1):
        normalized_task = {**task, "target_words": budget}
        title = str(normalized_task.get("title") or "").strip()
        title_key = re.sub(r"\s+", " ", title).casefold()
        if title_key and title_key in seen_titles:
            goal_words = str(normalized_task.get("goal") or "").strip().rstrip(".").split()[:5]
            qualifier = " ".join(goal_words) or f"Section {index}"
            normalized_task["title"] = f"{title}: {qualifier} ({index})"
            title_key = normalized_task["title"].casefold()
            logger.info("planner_local_repair field_path=tasks.%s.title rule=made_duplicate_title_unique", index - 1)
        if title_key:
            seen_titles.add(title_key)
        bullets = normalized_task.get("bullets")
        if isinstance(bullets, list) and len(bullets) == 2 and all(str(item).strip() for item in bullets):
            bullet_title = str(normalized_task.get("title") or "this section").strip()
            normalized_task["bullets"] = [*bullets, f"Practical implications and decision criteria for {bullet_title}"]
            logger.info("planner_local_repair field_path=tasks.*.bullets rule=expanded_two_complete_bullets_to_three")
        normalized_tasks.append(normalized_task)
    normalized["tasks"] = normalized_tasks
    return normalized


def _emit_stage(status: str, progress: int, message: str) -> None:
    callback = _progress_callback.get()
    if callback:
        callback(status, progress, message)


def _message_text(message: Any) -> str:
    content = message.content if isinstance(message, BaseMessage) else message
    if isinstance(content, str):
        return content.strip()
    if isinstance(content, list):
        return "\n".join(
            str(item.get("text", "")) if isinstance(item, dict) else str(item)
            for item in content
        ).strip()
    return str(content).strip()


def _extract_json(text: str) -> Any:
    fenced = re.search(r"```(?:json)?\s*([\s\S]*?)```", text, re.IGNORECASE)
    candidate = fenced.group(1).strip() if fenced else text.strip()
    decoder = json.JSONDecoder()
    for marker in ("{", "["):
        start = candidate.find(marker)
        if start >= 0:
            try:
                value, _ = decoder.raw_decode(candidate[start:])
                return value
            except json.JSONDecodeError:
                continue
    raise json.JSONDecodeError("No complete JSON object was returned", candidate, 0)


def _looks_truncated_json(text: str) -> bool:
    candidate = text.strip()
    if not candidate:
        return False
    starts_json = candidate.startswith(("{", "[", "```json", "```"))
    return starts_json and (
        candidate.count("{") > candidate.count("}")
        or candidate.count("[") > candidate.count("]")
        or candidate.endswith((":", ",", "\\"))
    )


def _safe_value(value: Any) -> Any:
    if isinstance(value, (str, int, float, bool)) or value is None:
        rendered = str(value)
        return rendered[:120] + ("…" if len(rendered) > 120 else "")
    if isinstance(value, list):
        return f"list(length={len(value)})"
    if isinstance(value, dict):
        return f"object(keys={len(value)})"
    return type(value).__name__


def _validation_diagnostics(exc: Exception) -> list[dict[str, Any]]:
    if isinstance(exc, PlanPolicyError):
        return exc.diagnostics
    if isinstance(exc, ValidationError):
        return [
            {
                "path": ".".join(str(part) for part in error.get("loc", ())) or "$",
                "value": _safe_value(error.get("input")),
                "rule": error.get("msg", "must match the schema"),
            }
            for error in exc.errors(include_url=False)
        ]
    if isinstance(exc, json.JSONDecodeError):
        return [{"path": "$", "value": f"character {exc.pos}", "rule": exc.msg}]
    return [{"path": "$", "value": type(exc).__name__, "rule": str(exc)[:180]}]


def invoke_structured(
    model: ChatNVIDIA,
    messages: List[BaseMessage],
    schema: Type[T],
    attempts: int = 2,
    validation_stage: tuple[str, int, str] | None = None,
    pre_validate: Callable[[Any], Any] | None = None,
    post_validate: Callable[[T], T] | None = None,
) -> T:
    schema_json = json.dumps(schema.model_json_schema(), separators=(",", ":"))
    current_messages = [
        *messages,
        SystemMessage(
            content=(
                "Return exactly one JSON object and no prose or Markdown. "
                "The object must validate against this JSON Schema: " + schema_json
            )
        ),
    ]

    saw_parse_error = False
    saw_truncation = False
    for attempt in range(1, attempts + 1):
        response_text = ""
        parsed_payload = False
        parsed: Any = None
        try:
            response = model.invoke(current_messages)
            if validation_stage:
                _emit_stage(*validation_stage)
            parse_started = time.monotonic()
            response_text = _message_text(response)
            parsed = _extract_json(response_text)
            parsed_payload = True
            if pre_validate:
                parsed = pre_validate(parsed)
            validated = schema.model_validate(parsed)
            if post_validate:
                validated = post_validate(validated)
            logger.info(
                "structured_output_validated schema=%s parse_ms=%s attempt=%s",
                schema.__name__,
                round((time.monotonic() - parse_started) * 1000),
                attempt,
            )
            return validated
        except (json.JSONDecodeError, ValidationError, ValueError, TypeError) as exc:
            saw_parse_error = saw_parse_error or not parsed_payload or isinstance(exc, json.JSONDecodeError)
            saw_truncation = saw_truncation or _looks_truncated_json(response_text)
            diagnostics = _validation_diagnostics(exc)
            for diagnostic in diagnostics:
                logger.warning(
                    "structured_output_invalid schema=%s field_path=%s invalid_value=%s expected_rule=%s attempt=%s output_chars=%s",
                    schema.__name__,
                    diagnostic["path"],
                    diagnostic["value"],
                    diagnostic["rule"],
                    attempt,
                    len(response_text),
                )
            if attempt == attempts:
                code = (
                    "OUTPUT_TRUNCATED" if saw_truncation else
                    "PLANNER_PARSE_ERROR" if saw_parse_error else
                    "PLANNER_VALIDATION_ERROR"
                )
                raise PlannerOutputError(
                    code,
                    f"{schema.__name__} did not produce a valid JSON object after {attempts} attempts.",
                ) from exc
            invalid_json = json.dumps(parsed, separators=(",", ":")) if parsed_payload else response_text.strip()
            current_messages = [
                SystemMessage(content="Repair invalid JSON. Return exactly one corrected JSON object and no prose or Markdown."),
                HumanMessage(
                    content=(
                        f"Validation errors:\n{json.dumps(diagnostics, separators=(',', ':'))}\n\n"
                        f"Expected JSON Schema:\n{schema_json}\n\n"
                        f"Invalid JSON:\n{invalid_json}"
                    )
                ),
            ]

    raise RuntimeError("Structured invocation failed unexpectedly.")


# -----------------------------------------------------------------------------
# 3) Router
# -----------------------------------------------------------------------------

ROUTER_SYSTEM = """You are a routing module for a technical blog planner.

Decide whether web research is needed BEFORE planning.

Modes:
- closed_book: evergreen concepts.
- hybrid: evergreen plus current examples, tools, models, or releases.
- open_book: volatile news, pricing, policy, weekly roundups, or latest updates.

When research is needed:
- Return 3–10 high-signal queries.
- Use the supplied as-of date for current queries.
- Do not insert outdated years unless the user asks for history.
- Prefer official documentation, repositories, release notes, standards, papers,
  and other primary sources.
"""


def router_node(state: State) -> dict:
    _emit_stage("routing", 10, "Understanding your request")
    topic = state["topic"].split("\n\nAudience:", 1)[0].strip()
    lowered = topic.lower()
    volatile_markers = {
        "latest", "current", "today", "news", "pricing", "release",
        "benchmark", "version", "2025", "2026",
    }
    mode = "open_book" if any(marker in lowered for marker in volatile_markers) else "hybrid"
    decision = RouterDecision(
        needs_research=True,
        mode=mode,
        queries=[
            f"{topic} official documentation architecture",
            f"{topic} technical overview primary sources",
        ],
    )
    return {
        "needs_research": decision.needs_research,
        "mode": decision.mode,
        "queries": decision.queries,
    }


def route_next(state: State) -> str:
    return "research" if state["needs_research"] else "orchestrator"


# -----------------------------------------------------------------------------
# 4) Research
# -----------------------------------------------------------------------------


def _tavily_search(query: str, max_results: int = 5) -> List[dict]:
    response = tavily_client.search(
        query=query,
        search_depth="basic",
        max_results=max_results,
        include_raw_content=False,
        timeout=12,
    )
    results = response.get("results", []) if isinstance(response, dict) else []

    normalized: List[dict] = []
    for result in results or []:
        normalized.append(
            {
                "title": result.get("title") or "",
                "url": result.get("url") or "",
                "snippet": result.get("content") or result.get("snippet") or "",
                "published_at": result.get("published_date")
                or result.get("published_at"),
                "source": result.get("source"),
            }
        )
    return normalized


RESEARCH_SYSTEM = """You are a research synthesizer for technical writing.
Return a deduplicated EvidencePack from the supplied search results.
Keep every URL unchanged and never invent a source.
Prefer official documentation, official repositories, release notes, standards,
research papers, and other primary sources over comparison blogs.
"""


def research_node(state: State) -> dict:
    _emit_stage("researching", 28, "Reviewing technical sources")
    queries = state.get("queries", []) or []
    raw_results: List[dict] = []

    for query in queries[:3]:
        raw_results.extend(_tavily_search(query, max_results=3))

    if not raw_results:
        return {"evidence": []}

    # Deduplicate before sending results to the LLM.
    by_url: dict[str, dict] = {}
    for item in raw_results:
        url = item.get("url")
        if url and url not in by_url:
            by_url[url] = item

    _emit_stage("synthesizing_research", 46, "Organizing the evidence")
    cleaned_results = [
        {
            "title": item.get("title", ""),
            "url": item.get("url", ""),
            "snippet": item.get("snippet", "")[:500],
            "published_at": item.get("published_at"),
            "source": item.get("source"),
        }
        for item in list(by_url.values())[:8]
    ]
    pack = EvidencePack(evidence=[EvidenceItem.model_validate(item) for item in cleaned_results])
    return {"evidence": pack.evidence}


# -----------------------------------------------------------------------------
# 5) Planner
# -----------------------------------------------------------------------------

ORCH_SYSTEM = """You are a senior technical writer and developer advocate.
Create a concise, highly actionable article outline, not article prose.
Every section needs a unique title, one non-empty generation goal, 3-6 concrete
non-overlapping bullets, a 120-550 target_words budget, and only the supported
boolean requirement flags. Include practical depth such as code, failure modes,
performance, security, or observability where it serves the topic.
For hybrid or open_book work, mark fresh claims as requiring research and citations.
Output must strictly match the Plan schema.
"""


def orchestrator_node(state: State) -> dict:
    _emit_stage("planning_outline", 64, "Designing the article structure")
    evidence = state.get("evidence", [])
    policy = length_policy_for_topic(state["topic"])
    policy_prompt = (
        f"Length policy: {policy.key}; create {policy.section_min}-{policy.section_max} sections; "
        f"allocate approximately {policy.target_words} total words (accepted range "
        f"{round(policy.target_words * 0.9)}-{round(policy.target_words * 1.1)})."
    )
    plan = invoke_structured(
        llm,
        [
            SystemMessage(content=ORCH_SYSTEM),
            HumanMessage(
                content=(
                    f"Topic: {state['topic']}\n"
                    f"Mode: {state.get('mode', 'closed_book')}\n"
                    f"As-of date: {state['as_of']}\n"
                    f"{policy_prompt}\n\n"
                    f"Evidence:\n{[item.model_dump() for item in evidence][:8]}"
                )
            ),
        ],
        Plan,
        attempts=3,
        validation_stage=("validating_outline", 82, "Checking section coverage and order"),
        pre_validate=lambda payload: normalize_plan_word_budgets(payload, policy),
        post_validate=lambda candidate: validate_plan_policy(candidate, policy),
    )
    return {"plan": plan}


# -----------------------------------------------------------------------------
# 6) Human plan review interrupt
# -----------------------------------------------------------------------------


def review_plan_node(state: State) -> dict:
    if state.get("plan") is None:
        raise RuntimeError("Cannot review a missing plan.")

    _emit_stage("saving_checkpoint", 94, "Saving your review checkpoint")
    reviewed_plan = interrupt(
        {
            "type": "plan_review",
            "message": "Review, edit, and approve the outline before writing.",
            "plan": state["plan"].model_dump(),
        }
    )

    # The API resumes with either {"approved": true, "plan": {...}} or the plan.
    if isinstance(reviewed_plan, dict) and "plan" in reviewed_plan:
        if reviewed_plan.get("approved") is False:
            raise RuntimeError("Plan was rejected by the user.")
        reviewed_plan = reviewed_plan["plan"]

    return {"plan": Plan.model_validate(reviewed_plan)}


# -----------------------------------------------------------------------------
# 7) Fan-out and workers
# -----------------------------------------------------------------------------


def fanout(state: State):
    if state.get("plan") is None:
        raise RuntimeError("Cannot write sections without a plan.")

    return [
        Send(
            "worker",
            {
                "task": task.model_dump(),
                "topic": state["topic"],
                "mode": state["mode"],
                "plan": state["plan"].model_dump(),
                "evidence": [
                    item.model_dump() for item in state.get("evidence", [])
                ],
            },
        )
        for task in state["plan"].tasks
    ]


WORKER_SYSTEM = """You are a senior technical writer and developer advocate.
Write one section of a technical blog post in Markdown.

Rules:
- Start with `## <Section Title>`.
- Follow the goal and cover every bullet in order.
- Aim for the requested length.
- Return only the section, not the blog title or commentary.
- Use short paragraphs, bullets where helpful, and correct code fences.
- Avoid fluff, repetition, unsupported claims, and fake citations.
- When citations are required, use only supplied evidence URLs.
- If code is required, include at least one minimal and relevant snippet.
"""


class SectionGenerationError(RuntimeError):
    def __init__(self, task_id: int, message: str):
        super().__init__(message)
        self.task_id = task_id


class ArticleValidationError(RuntimeError):
    pass


def _balanced_code_fences(markdown: str) -> bool:
    return markdown.count("```") % 2 == 0


def validate_section_markdown(
    task: Task,
    markdown: str,
    evidence: list[EvidenceItem] | None = None,
) -> str:
    content = markdown.strip()
    if len(content) < 80 or len(content.split()) < 25:
        raise SectionGenerationError(task.id, "The section response was empty or too short.")
    if not _balanced_code_fences(content):
        raise SectionGenerationError(task.id, "The section contained an unbalanced code fence.")
    leaked_markers = (
        "system message:",
        "developer message:",
        "internal prompt",
        "you are chatgpt",
        "ignore previous instructions",
    )
    if any(marker in content.lower() for marker in leaked_markers):
        raise SectionGenerationError(task.id, "The section contained internal instruction text.")
    if task.requires_code and "```" not in content:
        raise SectionGenerationError(task.id, "The requested code example was missing.")
    usable_evidence = [item for item in (evidence or []) if item.url]
    if task.requires_citations and usable_evidence and not any(
        item.url in content for item in usable_evidence
    ):
        raise SectionGenerationError(task.id, "The requested evidence citation was missing.")

    lines = content.splitlines()
    while lines and not lines[0].strip():
        lines.pop(0)
    if lines and re.match(r"^#{1,2}\s+", lines[0]):
        lines[0] = f"## {task.title}"
    else:
        lines = [f"## {task.title}", "", *lines]
    return "\n".join(lines).strip()


def _invoke_section(payload: WorkerPayload) -> str:

    task = Task.model_validate(payload["task"])
    plan = Plan.model_validate(payload["plan"])
    evidence = [EvidenceItem.model_validate(item) for item in payload["evidence"]]

    worker_llm = ChatNVIDIA(
        model=MODEL_NAME,
        api_key=NVIDIA_API_KEY,
        temperature=0.3,
        max_completion_tokens=5000,
        timeout=180,
    )

    bullets_text = "\n- " + "\n- ".join(task.bullets)
    evidence_text = "\n".join(
        f"- {item.title} | {item.url} | {item.published_at or 'date:unknown'}"
        for item in evidence[:10]
    )

    response = worker_llm.invoke(
        [
            SystemMessage(content=WORKER_SYSTEM),
            HumanMessage(
                content=(
                    f"Blog title: {plan.blog_title}\n"
                    f"Audience: {plan.audience}\n"
                    f"Tone: {plan.tone}\n"
                    f"Blog kind: {plan.blog_kind}\n"
                    f"Constraints: {plan.constraints}\n"
                    f"Topic: {payload['topic']}\n"
                    f"Mode: {payload['mode']}\n\n"
                    f"Section title: {task.title}\n"
                    f"Goal: {task.goal}\n"
                    f"Target words: {task.target_words}\n"
                    f"requires_research: {task.requires_research}\n"
                    f"requires_citations: {task.requires_citations}\n"
                    f"requires_code: {task.requires_code}\n"
                    f"Bullets:{bullets_text}\n\n"
                    f"Evidence URLs:\n{evidence_text}"
                )
            ),
        ]
    )
    return validate_section_markdown(task, _message_text(response.content), evidence)


def generate_section_with_retry(payload: WorkerPayload, attempts: int = 2) -> str:
    task = Task.model_validate(payload["task"])
    last_error: Exception | None = None
    for attempt in range(1, attempts + 1):
        try:
            return _invoke_section(payload)
        except Exception as exc:
            last_error = exc
            logger.warning(
                "section_generation_attempt_failed section_id=%s attempt=%s error_type=%s",
                task.id,
                attempt,
                type(exc).__name__,
            )
    raise SectionGenerationError(
        task.id,
        f"Section {task.id} could not be generated after {attempts} attempts.",
    ) from last_error


def worker_node(payload: WorkerPayload) -> dict:
    task = Task.model_validate(payload["task"])
    section = generate_section_with_retry(payload)

    return {"sections": [(task.id, section)]}


# -----------------------------------------------------------------------------
# 8) Reducer
# -----------------------------------------------------------------------------


def assemble_article(plan: Plan, sections: dict[int, str]) -> str:
    expected_ids = [task.id for task in plan.tasks]
    if set(sections) != set(expected_ids):
        missing = [section_id for section_id in expected_ids if section_id not in sections]
        raise ArticleValidationError(f"Missing generated sections: {missing}")
    ordered_sections = [sections[section_id].strip() for section_id in expected_ids]
    if any(not section for section in ordered_sections):
        raise ArticleValidationError("One or more generated sections were empty.")
    article = f"# {plan.blog_title.strip()}\n\n" + "\n\n".join(ordered_sections) + "\n"
    validate_article_markdown(article, plan)
    return article


def validate_article_markdown(markdown: str, plan: Plan | None = None) -> str:
    content = markdown.strip()
    if not content or len(content.split()) < 50:
        raise ArticleValidationError("The assembled article was empty or too short.")
    if not _balanced_code_fences(content):
        raise ArticleValidationError("The assembled article had unbalanced code fences.")
    headings = re.findall(r"^(#{1,6})\s+(.+?)\s*$", content, flags=re.MULTILINE)
    if not headings or headings[0][0] != "#":
        raise ArticleValidationError("The article title heading was missing.")
    normalized_headings = [
        f"{level}:{title.strip().casefold()}"
        for level, title in headings
        if level in {"#", "##"}
    ]
    if len(normalized_headings) != len(set(normalized_headings)):
        raise ArticleValidationError("The article contained duplicate headings.")
    if plan is not None:
        expected = [task.title.strip().casefold() for task in plan.tasks]
        actual = [title.strip().casefold() for level, title in headings if level == "##"]
        if actual[: len(expected)] != expected:
            raise ArticleValidationError("The assembled section order did not match the approved plan.")
    return content


GenerationProgressCallback = Callable[[Task | None, str, str, str | None], None]


def generate_article(
    reviewed_plan: dict,
    topic: str,
    evidence_payload: list[dict] | None = None,
    existing_sections: dict[str, str] | None = None,
    progress_callback: GenerationProgressCallback | None = None,
) -> dict:
    plan = Plan.model_validate(reviewed_plan)
    evidence = [EvidenceItem.model_validate(item) for item in (evidence_payload or [])]
    completed: dict[int, str] = {
        int(section_id): content
        for section_id, content in (existing_sections or {}).items()
        if content
    }
    pending = [task for task in plan.tasks if task.id not in completed]

    def emit(task: Task | None, status: str, message: str, content: str | None = None) -> None:
        if progress_callback is not None:
            progress_callback(task, status, message, content)

    if pending:
        max_workers = min(3, len(pending))
        task_iterator = iter(pending)
        futures: dict[Future[str], Task] = {}

        def submit_next(executor: ThreadPoolExecutor) -> bool:
            try:
                task = next(task_iterator)
            except StopIteration:
                return False
            payload: WorkerPayload = {
                "task": task.model_dump(),
                "topic": topic,
                "mode": "approved_plan",
                "plan": plan.model_dump(),
                "evidence": [item.model_dump() for item in evidence],
            }
            emit(task, "generating", f'Generating “{task.title}”')
            futures[executor.submit(generate_section_with_retry, payload)] = task
            return True

        with ThreadPoolExecutor(max_workers=max_workers, thread_name_prefix="quillops-section") as executor:
            for _ in range(max_workers):
                submit_next(executor)
            first_failure: Exception | None = None
            while futures:
                finished, _ = wait(tuple(futures), return_when=FIRST_COMPLETED)
                for future in finished:
                    task = futures.pop(future)
                    try:
                        section = future.result()
                        completed[task.id] = section
                        emit(task, "completed", f"Section {task.id} completed", section)
                    except Exception as exc:
                        emit(task, "failed", f"Section {task.id} needs a retry")
                        first_failure = first_failure or exc
                    if first_failure is None:
                        submit_next(executor)
                if first_failure is not None:
                    for future in futures:
                        future.cancel()
                    break
            if first_failure is not None:
                raise first_failure

    emit(None, "assembling", "Assembling completed sections")
    final = assemble_article(plan, completed)
    emit(None, "validating_article", "Validating the assembled Markdown")
    return {
        "plan": plan.model_dump(),
        "evidence": [item.model_dump() for item in evidence],
        "sections": completed,
        "final": final,
    }


def reducer_node(state: State) -> dict:
    if state.get("plan") is None:
        raise RuntimeError("Cannot merge sections without a plan.")

    sections = {section_id: markdown for section_id, markdown in state["sections"]}
    return {"final": assemble_article(state["plan"], sections)}


# -----------------------------------------------------------------------------
# 9) Graph and durable checkpointer
# -----------------------------------------------------------------------------


def _build_graph_builder() -> StateGraph:
    graph = StateGraph(State)
    graph.add_node("router", router_node)
    graph.add_node("research", research_node)
    graph.add_node("orchestrator", orchestrator_node)
    graph.add_node("review_plan", review_plan_node)
    graph.add_node("worker", worker_node)
    graph.add_node("reducer", reducer_node)

    graph.add_edge(START, "router")
    graph.add_conditional_edges(
        "router",
        route_next,
        {"research": "research", "orchestrator": "orchestrator"},
    )
    graph.add_edge("research", "orchestrator")
    graph.add_edge("orchestrator", "review_plan")
    graph.add_conditional_edges("review_plan", fanout, ["worker"])
    graph.add_edge("worker", "reducer")
    graph.add_edge("reducer", END)
    return graph


_CHECKPOINTER_CONNECTION = None


def _create_checkpointer():
    global _CHECKPOINTER_CONNECTION

    from database import normalize_database_urls

    raw_url = os.getenv("DATABASE_URL")
    sqlalchemy_url, psycopg_url = normalize_database_urls(raw_url)

    if psycopg_url.startswith("postgresql://") or psycopg_url.startswith("postgres://"):
        import psycopg
        from psycopg.rows import dict_row
        from langgraph.checkpoint.postgres import PostgresSaver

        # A long-lived connection is kept for this worker/API process.
        _CHECKPOINTER_CONNECTION = psycopg.connect(
            psycopg_url,
            autocommit=True,
            row_factory=dict_row,
        )
        checkpointer = PostgresSaver(_CHECKPOINTER_CONNECTION)
        checkpointer.setup()
        return checkpointer

    from langgraph.checkpoint.sqlite import SqliteSaver

    sqlite_path = psycopg_url.removeprefix("sqlite:///")
    Path(sqlite_path).parent.mkdir(parents=True, exist_ok=True)
    _CHECKPOINTER_CONNECTION = sqlite3.connect(
        sqlite_path,
        check_same_thread=False,
    )
    return SqliteSaver(_CHECKPOINTER_CONNECTION)


checkpointer = _create_checkpointer()
app = _build_graph_builder().compile(checkpointer=checkpointer)

GRAPH_CONFIG = {
    "recursion_limit": 50,
    "max_concurrency": 1,
}


def thread_config(thread_id: str) -> dict:
    return {
        **GRAPH_CONFIG,
        "configurable": {
            "thread_id": thread_id,
        },
    }


def initial_state(topic: str) -> State:
    return {
        "topic": topic,
        "as_of": date.today().isoformat(),
        "mode": "",
        "needs_research": False,
        "queries": [],
        "evidence": [],
        "plan": None,
        "sections": [],
        "final": "",
    }


def start_generation(
    topic: str,
    thread_id: str,
    progress_callback: ProgressCallback | None = None,
) -> dict:
    """Run until the plan-review interrupt is reached."""
    token = _progress_callback.set(progress_callback)
    try:
        return app.invoke(initial_state(topic), config=thread_config(thread_id))
    finally:
        _progress_callback.reset(token)


def resume_generation(thread_id: str, reviewed_plan: dict) -> dict:
    """Resume a paused graph after the user approves or edits its plan."""
    return app.invoke(
        Command(resume={"approved": True, "plan": reviewed_plan}),
        config=thread_config(thread_id),
    )


# -----------------------------------------------------------------------------
# 10) AI editing helper
# -----------------------------------------------------------------------------

EDIT_SYSTEM = """You are a precise Markdown editor.
Apply only the requested change to the supplied blog.
Preserve unaffected sections, valid Markdown, code blocks, and useful citations.
Do not invent sources. Return only the complete revised Markdown document.
"""


def edit_blog_content(current_content: str, instruction: str) -> str:
    response = llm.invoke(
        [
            SystemMessage(content=EDIT_SYSTEM),
            HumanMessage(
                content=(
                    f"Editing instruction:\n{instruction}\n\n"
                    f"Current blog:\n{current_content}"
                )
            ),
        ]
    )
    return response.content.strip()
