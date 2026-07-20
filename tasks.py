from __future__ import annotations

import json
import logging
import os
import time

from celery import Celery
from sqlalchemy import select

from backend import (
    ArticleValidationError,
    PlannerOutputError,
    Plan,
    SectionGenerationError,
    edit_blog_content,
    generate_article,
    start_generation,
    validate_article_markdown,
)
from database import init_db, session_scope, utc_now
from models import Blog, BlogVersion

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
logger = logging.getLogger(__name__)

celery_app = Celery(
    "quillops",
    broker=REDIS_URL,
    backend=REDIS_URL,
)
celery_app.conf.update(
    task_track_started=True,
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    task_time_limit=1800,
    task_soft_time_limit=1740,
)


def _interrupt_payload(result: dict) -> dict | None:
    interrupts = result.get("__interrupt__")
    if not interrupts:
        return None

    first = interrupts[0]
    return first.value if hasattr(first, "value") else first


def _save_completed_blog(blog: Blog, result: dict) -> None:
    final_content = result.get("final", "")
    plan = result.get("plan")
    evidence = result.get("evidence", [])

    if hasattr(plan, "model_dump"):
        plan = plan.model_dump()
    evidence_json = [
        item.model_dump() if hasattr(item, "model_dump") else item for item in evidence
    ]

    blog.title = plan.get("blog_title") if isinstance(plan, dict) else blog.topic
    blog.content = final_content
    blog.plan = plan
    blog.evidence = evidence_json
    blog.status = "completed"
    blog.error_message = None
    blog.error_code = None
    blog.error_retryable = False
    blog.progress = 100
    blog.stage_message = "Article ready"
    sections = result.get("sections", {})
    blog.generated_sections = {str(key): value for key, value in sections.items()}
    blog.generation_state = build_generation_state(plan or {}, sections=sections, stage="completed")
    blog.current_version += 1
    blog.updated_at = utc_now()

    blog.versions.append(
        BlogVersion(
            version_number=blog.current_version,
            content=final_content,
            edit_instruction="Original AI generation",
        )
    )


def build_generation_state(
    plan: dict,
    sections: dict | None = None,
    stage: str = "queued",
) -> dict:
    completed = {str(key): value for key, value in (sections or {}).items() if value}
    tasks = plan.get("tasks", []) if isinstance(plan, dict) else []
    section_states = []
    for index, task in enumerate(tasks):
        section_id = str(task.get("id", index + 1))
        content = completed.get(section_id)
        section_states.append(
            {
                "id": task.get("id", index + 1),
                "title": task.get("title", f"Section {index + 1}"),
                "status": "completed" if content else "queued",
                "target_words": task.get("target_words", 0),
                "generated_words": len(content.split()) if content else None,
                "requires_research": bool(task.get("requires_research")),
                "requires_citations": bool(task.get("requires_citations")),
                "requires_code": bool(task.get("requires_code")),
            }
        )
    completed_count = sum(item["status"] == "completed" for item in section_states)
    return {
        "stage": stage,
        "completed_sections": completed_count,
        "total_sections": len(section_states),
        "sections": section_states,
        "message": "Waiting for the writing worker" if stage == "queued" else "Writing in progress",
    }


def _log_timing(event: str, blog_id: str, started_at: float, **fields) -> None:
    logger.info(
        json.dumps(
            {
                "event": event,
                "blog_id": blog_id,
                "elapsed_ms": round((time.monotonic() - started_at) * 1000),
                **fields,
            },
            sort_keys=True,
        )
    )


def _classify_planning_error(exc: Exception, stage: str) -> tuple[str, str, bool]:
    message = str(exc).lower()
    if isinstance(exc, PlannerOutputError):
        code = exc.code
        if code == "INVALID_LENGTH_POLICY":
            return code, "This planning request could not be completed because of a configuration problem.", False
        safe = "The outline could not be validated."
        return code, safe, code in {"PLANNER_VALIDATION_ERROR", "PLANNER_PARSE_ERROR", "OUTPUT_TRUNCATED"}
    if "guided_json" in message or "bad request" in message or "[400]" in message:
        return "PROVIDER_ERROR", "This planning request could not be completed because of a configuration problem.", False
    if "timeout" in message or "timed out" in message:
        if stage in {"researching", "synthesizing_research"}:
            return "RESEARCH_TIMEOUT", "The research service did not respond in time.", True
        return "PROVIDER_ERROR", "The planning provider temporarily became unavailable.", True
    if "checkpoint" in message or "psycopg" in message:
        return "CHECKPOINT_FAILURE", "The review checkpoint could not be saved.", True
    return "WORKER_FAILURE", "The background worker could not finish the planning step.", True


@celery_app.task(name="quillops.start_generation", bind=True, acks_late=True)
def generate_blog_task(self, blog_id: str) -> None:
    init_db()
    started_at = time.monotonic()
    current_stage = "queued"

    try:
        with session_scope() as db:
            blog = db.scalar(select(Blog).where(Blog.id == blog_id))
            if blog is None:
                return
            if blog.status != "queued":
                _log_timing("planning_job_duplicate_ignored", blog_id, started_at, status=blog.status)
                return
            blog.status = "routing"
            blog.progress = 5
            blog.stage_message = "Starting the planning workflow"
            blog.error_message = None
            blog.error_code = None
            blog.error_retryable = False
            topic = blog.topic
            thread_id = blog.thread_id
            attempt_number = blog.attempt_number

        _log_timing("planning_job_started", blog_id, started_at, attempt=attempt_number)

        def update_progress(status: str, progress: int, message: str) -> None:
            nonlocal current_stage
            current_stage = status
            write_started = time.monotonic()
            with session_scope() as progress_db:
                progress_blog = progress_db.scalar(select(Blog).where(Blog.id == blog_id))
                if progress_blog is None:
                    return
                progress_blog.status = status
                progress_blog.progress = progress
                progress_blog.stage_message = message
                progress_blog.updated_at = utc_now()
            event_names = {
                "routing": "routing_started",
                "researching": "research_started",
                "synthesizing_research": "research_completed",
                "planning_outline": "planner_started",
                "validating_outline": "planner_completed",
                "saving_checkpoint": "checkpoint_saving",
            }
            _log_timing(event_names.get(status, "planning_stage_updated"), blog_id, started_at, stage=status)
            logger.info(
                "planning_status_persisted blog_id=%s stage=%s db_write_ms=%s",
                blog_id,
                status,
                round((time.monotonic() - write_started) * 1000),
            )

        result = start_generation(
            topic=topic,
            thread_id=thread_id,
            progress_callback=update_progress,
        )
        interrupt_payload = _interrupt_payload(result)

        with session_scope() as db:
            blog = db.scalar(select(Blog).where(Blog.id == blog_id))
            if blog is None:
                return

            if interrupt_payload:
                blog.plan = interrupt_payload.get("plan")
                blog.status = "waiting_for_review"
                blog.progress = 100
                blog.stage_message = "Your outline is ready for review"
                blog.updated_at = utc_now()
                _log_timing("checkpoint_saved", blog_id, started_at)
            else:
                _save_completed_blog(blog, result)
        _log_timing("planning_job_completed", blog_id, started_at, status="waiting_for_review")

    except Exception as exc:
        error_code, safe_message, retryable = _classify_planning_error(exc, current_stage)
        with session_scope() as db:
            blog = db.scalar(select(Blog).where(Blog.id == blog_id))
            if blog is not None:
                blog.status = "failed"
                blog.progress = 0
                blog.stage_message = safe_message
                blog.error_message = safe_message
                blog.error_code = error_code
                blog.error_retryable = retryable
                blog.last_error_at = utc_now()
                blog.updated_at = utc_now()
        _log_timing(
            "planning_job_failed",
            blog_id,
            started_at,
            stage=current_stage,
            error_code=error_code,
            retryable=retryable,
        )
        logger.exception("Planning job %s failed with %s", blog_id, error_code)
        raise


def _classify_generation_error(exc: Exception) -> tuple[str, str, bool]:
    message = str(exc).lower()
    if isinstance(exc, SectionGenerationError):
        return "SECTION_GENERATION_FAILED", "One section could not be generated safely.", True
    if isinstance(exc, ArticleValidationError):
        return "ASSEMBLY_VALIDATION_FAILED", "The generated sections could not be assembled safely.", True
    if "timeout" in message or "timed out" in message:
        return "WRITING_PROVIDER_TIMEOUT", "The writing provider temporarily timed out.", True
    if "400" in message or "bad request" in message:
        return "WRITING_PROVIDER_REJECTED", "The writing provider rejected a section request.", True
    return "WRITING_WORKER_FAILED", "The writing worker could not finish the draft.", True


@celery_app.task(name="quillops.resume_generation", bind=True, acks_late=True)
def resume_blog_task(self, blog_id: str, reviewed_plan: dict) -> None:
    init_db()
    started_at = time.monotonic()

    # Validate before resuming the persisted graph.
    reviewed_plan = Plan.model_validate(reviewed_plan).model_dump()

    try:
        with session_scope() as db:
            blog = db.scalar(select(Blog).where(Blog.id == blog_id))
            if blog is None:
                return
            if blog.status != "queued_for_generation":
                _log_timing("writing_job_duplicate_ignored", blog_id, started_at, status=blog.status)
                return
            blog.status = "writing"
            blog.progress = 55
            blog.stage_message = "Preparing approved sections"
            blog.plan = reviewed_plan
            blog.error_message = None
            blog.error_code = None
            blog.error_retryable = False
            blog.generation_state = build_generation_state(
                reviewed_plan,
                sections=blog.generated_sections or {},
                stage="section_generation",
            )
            topic = blog.topic
            evidence = blog.evidence or []
            existing_sections = blog.generated_sections or {}

        def update_progress(task, section_status: str, message: str, content: str | None = None) -> None:
            with session_scope() as progress_db:
                progress_blog = progress_db.scalar(select(Blog).where(Blog.id == blog_id))
                if progress_blog is None:
                    return
                state = dict(progress_blog.generation_state or build_generation_state(reviewed_plan))
                section_states = [dict(item) for item in state.get("sections", [])]
                if task is not None:
                    for item in section_states:
                        if int(item.get("id")) == task.id:
                            item["status"] = section_status
                            if content:
                                item["generated_words"] = len(content.split())
                            break
                    if content:
                        generated = dict(progress_blog.generated_sections or {})
                        generated[str(task.id)] = content
                        progress_blog.generated_sections = generated
                    state["stage"] = "section_generation"
                    progress_blog.status = "writing"
                else:
                    state["stage"] = section_status
                    progress_blog.status = section_status
                completed = sum(item.get("status") == "completed" for item in section_states)
                total = len(section_states)
                state.update(
                    {
                        "sections": section_states,
                        "completed_sections": completed,
                        "total_sections": total,
                        "message": message,
                    }
                )
                progress_blog.generation_state = state
                progress_blog.stage_message = message
                if section_status == "assembling":
                    progress_blog.progress = 92
                elif section_status == "validating_article":
                    progress_blog.progress = 97
                else:
                    progress_blog.progress = 55 + int((completed / max(1, total)) * 35)
                progress_blog.updated_at = utc_now()
            _log_timing("writing_stage_updated", blog_id, started_at, stage=section_status)

        result = generate_article(
            reviewed_plan=reviewed_plan,
            topic=topic,
            evidence_payload=evidence,
            existing_sections=existing_sections,
            progress_callback=update_progress,
        )

        with session_scope() as db:
            blog = db.scalar(select(Blog).where(Blog.id == blog_id))
            if blog is not None:
                _save_completed_blog(blog, result)
        _log_timing("writing_job_completed", blog_id, started_at, sections=len(reviewed_plan["tasks"]))

    except Exception as exc:
        error_code, safe_message, retryable = _classify_generation_error(exc)
        with session_scope() as db:
            blog = db.scalar(select(Blog).where(Blog.id == blog_id))
            if blog is not None:
                blog.status = "failed"
                blog.progress = 0
                blog.stage_message = safe_message
                blog.error_message = safe_message
                blog.error_code = error_code
                blog.error_retryable = retryable
                blog.last_error_at = utc_now()
                blog.updated_at = utc_now()
        _log_timing("writing_job_failed", blog_id, started_at, error_code=error_code)
        logger.exception("Writing job %s failed with %s", blog_id, error_code)
        raise


@celery_app.task(name="quillops.ai_edit")
def ai_edit_blog_task(blog_id: str, instruction: str) -> None:
    init_db()

    try:
        with session_scope() as db:
            blog = db.scalar(select(Blog).where(Blog.id == blog_id))
            if blog is None:
                return
            current_content = blog.content
            blog.status = "editing"
            blog.error_message = None

        revised_content = edit_blog_content(current_content, instruction)
        validate_article_markdown(revised_content)

        with session_scope() as db:
            blog = db.scalar(select(Blog).where(Blog.id == blog_id))
            if blog is None:
                return
            blog.current_version += 1
            blog.content = revised_content
            blog.status = "completed"
            blog.error_message = None
            blog.error_code = None
            blog.error_retryable = False
            blog.progress = 100
            blog.stage_message = "Article refinement complete"
            blog.updated_at = utc_now()
            blog.versions.append(
                BlogVersion(
                    version_number=blog.current_version,
                    content=revised_content,
                    edit_instruction=instruction,
                )
            )

    except Exception as exc:
        with session_scope() as db:
            blog = db.scalar(select(Blog).where(Blog.id == blog_id))
            if blog is not None:
                blog.status = "completed"
                blog.progress = 100
                blog.error_message = "The AI refinement could not be completed."
                blog.error_code = "AI_EDIT_FAILED"
                blog.error_retryable = True
                blog.stage_message = blog.error_message
                blog.updated_at = utc_now()
        raise
