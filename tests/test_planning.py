from __future__ import annotations

import os
import json
import tempfile
import unittest
import uuid
from datetime import datetime, timezone
from types import SimpleNamespace
from unittest.mock import patch

TEST_DB = os.path.join(tempfile.gettempdir(), f"quillops-test-{uuid.uuid4()}.db")
os.environ["DATABASE_URL"] = f"sqlite:///{TEST_DB.replace(os.sep, '/')}"
os.environ["NVIDIA_API_KEY"] = "test-key"
os.environ["JWT_SECRET"] = "test-secret-with-enough-entropy-for-local-tests"
os.environ["REDIS_URL"] = "redis://localhost:6379/15"

from fastapi.testclient import TestClient
from langchain_core.messages import AIMessage, HumanMessage

from backend import (
    LENGTH_POLICIES,
    Plan,
    PlannerOutputError,
    RouterDecision,
    Task,
    invoke_structured,
    length_policy_for_topic,
    normalize_plan_word_budgets,
    validate_plan_policy,
)
from database import SessionLocal, init_db
from main import app
from models import Blog, User
from schemas import BlogResponse
from tasks import generate_blog_task


class FakeModel:
    def __init__(self, responses: list[str]):
        self.responses = iter(responses)
        self.calls: list[tuple] = []

    def invoke(self, messages):
        self.calls.append(tuple(messages))
        return AIMessage(content=next(self.responses))


class StructuredPlanningTests(unittest.TestCase):
    @staticmethod
    def plan_payload(section_count: int, words: int) -> dict:
        return {
            "blog_title": "Reliable agent architecture",
            "audience": "Backend engineers",
            "tone": "Technical",
            "blog_kind": "comparison",
            "constraints": [],
            "tasks": [
                {
                    "id": index,
                    "title": f"Section {index}",
                    "goal": "Explain the engineering tradeoff.",
                    "bullets": ["Context", "Mechanism", "Operational guidance"],
                    "target_words": words,
                }
                for index in range(1, section_count + 1)
            ],
        }

    def test_plain_json_is_validated_without_guided_json(self):
        model = FakeModel(['{"needs_research":false,"mode":"closed_book","queries":[]}'])
        result = invoke_structured(model, [HumanMessage(content="Evergreen topic")], RouterDecision)
        self.assertIsInstance(result, RouterDecision)
        serialized = " ".join(str(message.content) for message in model.calls[0])
        self.assertNotIn("guided_json", serialized)

    def test_malformed_json_gets_one_controlled_repair(self):
        model = FakeModel([
            "not json",
            '{"needs_research":true,"mode":"hybrid","queries":["official docs"]}',
        ])
        result = invoke_structured(model, [HumanMessage(content="Current topic")], RouterDecision)
        self.assertTrue(result.needs_research)
        self.assertEqual(len(model.calls), 2)

    def test_repeated_malformed_json_raises_typed_error(self):
        model = FakeModel(["broken", "still broken"])
        with self.assertRaises(PlannerOutputError) as caught:
            invoke_structured(model, [HumanMessage(content="Topic")], RouterDecision)
        self.assertEqual(caught.exception.code, "PLANNER_PARSE_ERROR")

    def test_truncated_json_raises_typed_error(self):
        model = FakeModel(['{"blog_title":"Incomplete",', '{"blog_title":"Still incomplete",'])
        with self.assertRaises(PlannerOutputError) as caught:
            invoke_structured(model, [HumanMessage(content="Topic")], Plan)
        self.assertEqual(caught.exception.code, "OUTPUT_TRUNCATED")

    def test_length_policies_accept_valid_short_standard_and_long_plans(self):
        cases = (("short", 4, 250), ("standard", 6, 320), ("long-form", 8, 400))
        for key, sections, words in cases:
            with self.subTest(key=key):
                plan = Plan.model_validate(self.plan_payload(sections, words))
                validated = validate_plan_policy(plan, LENGTH_POLICIES[key])
                self.assertEqual(validated.requested_length, key)
                self.assertEqual(validated.target_words, LENGTH_POLICIES[key].target_words)

    def test_length_policy_is_read_from_structured_brief(self):
        policy = length_policy_for_topic("LangChain vs LangGraph\n\nAudience: AI engineers. Tone: Technical. Target length: Long-form.")
        self.assertEqual(policy.key, "long-form")

    def test_provider_word_budgets_are_balanced_within_supported_limits(self):
        payload = self.plan_payload(10, 350)
        payload["tasks"][-1]["target_words"] = 100
        normalized = normalize_plan_word_budgets(payload, LENGTH_POLICIES["long-form"])
        budgets = [task["target_words"] for task in normalized["tasks"]]
        self.assertEqual(sum(budgets), 3200)
        self.assertTrue(all(120 <= value <= 550 for value in budgets))

    def test_two_complete_provider_bullets_get_one_deterministic_planning_point(self):
        payload = self.plan_payload(8, 400)
        payload["tasks"][3]["bullets"] = ["Architecture", "Failure boundaries"]
        normalized = normalize_plan_word_budgets(payload, LENGTH_POLICIES["long-form"])
        self.assertEqual(len(normalized["tasks"][3]["bullets"]), 3)
        Plan.model_validate(normalized)

    def test_duplicate_provider_titles_are_made_specific_before_validation(self):
        payload = self.plan_payload(8, 400)
        payload["tasks"][4]["title"] = payload["tasks"][3]["title"]
        normalized = normalize_plan_word_budgets(payload, LENGTH_POLICIES["long-form"])
        titles = [task["title"].casefold() for task in normalized["tasks"]]
        self.assertEqual(len(titles), len(set(titles)))
        Plan.model_validate(normalized)

    def test_invalid_bullet_bounds_missing_goal_word_count_and_duplicate_titles(self):
        mutations = []
        too_few = self.plan_payload(6, 320); too_few["tasks"][0]["bullets"] = ["A", "B"]; mutations.append(too_few)
        too_many = self.plan_payload(6, 320); too_many["tasks"][0]["bullets"] = ["A", "B", "C", "D", "E", "F", "G"]; mutations.append(too_many)
        missing_goal = self.plan_payload(6, 320); missing_goal["tasks"][0]["goal"] = ""; mutations.append(missing_goal)
        invalid_words = self.plan_payload(6, 320); invalid_words["tasks"][0]["target_words"] = 900; mutations.append(invalid_words)
        duplicate = self.plan_payload(6, 320); duplicate["tasks"][1]["title"] = duplicate["tasks"][0]["title"]; mutations.append(duplicate)
        for payload in mutations:
            with self.subTest(payload=payload["tasks"][0]):
                with self.assertRaises(Exception):
                    Plan.model_validate(payload)

    def test_policy_repair_uses_errors_schema_and_invalid_json_then_succeeds(self):
        invalid = self.plan_payload(5, 200)
        valid = self.plan_payload(8, 400)
        model = FakeModel([json.dumps(invalid), json.dumps(valid)])
        result = invoke_structured(
            model,
            [HumanMessage(content="Long-form")],
            Plan,
            post_validate=lambda plan: validate_plan_policy(plan, LENGTH_POLICIES["long-form"]),
        )
        self.assertEqual(len(result.tasks), 8)
        repair_text = " ".join(str(message.content) for message in model.calls[1])
        self.assertIn("Validation errors", repair_text)
        self.assertIn("Expected JSON Schema", repair_text)
        self.assertIn("Invalid JSON", repair_text)

    def test_terminal_policy_validation_failure_is_typed(self):
        invalid = json.dumps(self.plan_payload(5, 200))
        model = FakeModel([invalid, invalid])
        with self.assertRaises(PlannerOutputError) as caught:
            invoke_structured(
                model,
                [HumanMessage(content="Long-form")],
                Plan,
                post_validate=lambda plan: validate_plan_policy(plan, LENGTH_POLICIES["long-form"]),
            )
        self.assertEqual(caught.exception.code, "PLANNER_VALIDATION_ERROR")

    def test_legacy_traceback_is_sanitized(self):
        self.assertEqual(
            BlogResponse.sanitize_legacy_error('Traceback File "/app/tasks.py" guided_json'),
            "The background worker could not finish the planning step.",
        )


class PlanningApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        init_db()
        cls.client = TestClient(app)
        email = f"planning-{uuid.uuid4()}@example.com"
        response = cls.client.post("/auth/register", json={"email": email, "password": "Planning-Test-2026!"})
        cls.headers = {"Authorization": f"Bearer {response.json()['access_token']}"}

    @patch("main.generate_blog_task.delay")
    def test_duplicate_active_submission_returns_existing_job(self, delay):
        payload = {"topic": f"Idempotency topic {uuid.uuid4()}"}
        first = self.client.post("/blogs", headers=self.headers, json=payload)
        second = self.client.post("/blogs", headers=self.headers, json=payload)
        self.assertEqual(first.status_code, 202)
        self.assertEqual(first.json()["id"], second.json()["id"])
        self.assertEqual(delay.call_count, 1)

    @patch("main.resume_blog_task.delay")
    @patch("main.generate_blog_task.delay")
    def test_failed_writing_retry_reuses_saved_plan_and_sections(self, _planning_delay, writing_delay):
        created = self.client.post(
            "/blogs", headers=self.headers, json={"topic": f"Writing retry {uuid.uuid4()}"}
        ).json()
        valid_plan = Plan(
            blog_title="Retryable article",
            audience="Engineers",
            tone="Technical",
            tasks=[
                Task(id=index, title=f"Section {index}", goal="Explain the mechanism.", bullets=["A", "B", "C"], target_words=200)
                for index in range(1, 6)
            ],
        ).model_dump()
        with SessionLocal() as db:
            blog = db.get(Blog, created["id"])
            blog.status = "failed"
            blog.error_code = "SECTION_GENERATION_FAILED"
            blog.error_retryable = True
            blog.plan = valid_plan
            blog.generated_sections = {"1": "persisted section"}
            db.commit()
        response = self.client.post(f"/blogs/{created['id']}/retry-writing", headers=self.headers)
        self.assertEqual(response.status_code, 202)
        self.assertEqual(response.json()["status"], "queued_for_generation")
        self.assertEqual(writing_delay.call_count, 1)

    @patch("main.ai_edit_blog_task.delay")
    @patch("main.generate_blog_task.delay")
    def test_ai_edit_is_queued_without_overwriting_completed_content(self, _planning_delay, edit_delay):
        created = self.client.post(
            "/blogs", headers=self.headers, json={"topic": f"AI edit {uuid.uuid4()}"}
        ).json()
        original = "# Stable draft\n\n## Context\n\n" + "reliable content " * 60
        with SessionLocal() as db:
            blog = db.get(Blog, created["id"])
            blog.status = "completed"
            blog.content = original
            db.commit()
        response = self.client.post(
            f"/blogs/{created['id']}/ai-edit",
            headers=self.headers,
            json={"instruction": "Tighten the introduction"},
        )
        self.assertEqual(response.status_code, 202)
        self.assertEqual(response.json()["status"], "queued_for_edit")
        with SessionLocal() as db:
            self.assertEqual(db.get(Blog, created["id"]).content, original)
        self.assertEqual(edit_delay.call_count, 1)

    @patch("main.generate_blog_task.delay")
    def test_manual_edit_and_restore_are_non_destructive(self, _planning_delay):
        created = self.client.post(
            "/blogs", headers=self.headers, json={"topic": f"Versions {uuid.uuid4()}"}
        ).json()
        with SessionLocal() as db:
            blog = db.get(Blog, created["id"])
            blog.status = "completed"
            blog.content = "# Original\n\n## Context\n\n" + "original content " * 60
            db.commit()
        revised = "# Revised\n\n## Context\n\n" + "revised content " * 60
        saved = self.client.put(
            f"/blogs/{created['id']}", headers=self.headers,
            json={"content": revised, "instruction": "Manual clarity pass"},
        )
        self.assertEqual(saved.status_code, 200)
        versions = self.client.get(f"/blogs/{created['id']}/versions", headers=self.headers).json()
        self.assertEqual(versions[0]["edit_instruction"], "Manual clarity pass")
        restored = self.client.post(
            f"/blogs/{created['id']}/restore/{versions[0]['id']}", headers=self.headers
        )
        self.assertEqual(restored.status_code, 200)
        self.assertEqual(restored.json()["current_version"], 2)

    @patch("main.generate_blog_task.delay")
    def test_retry_reuses_failed_job_without_duplicate_record(self, delay):
        created = self.client.post(
            "/blogs", headers=self.headers, json={"topic": f"Retry topic {uuid.uuid4()}"}
        ).json()
        with SessionLocal() as db:
            blog = db.get(Blog, created["id"])
            blog.status = "failed"
            blog.error_message = "Safe failure"
            blog.error_code = "PROVIDER_UNAVAILABLE"
            blog.error_retryable = True
            db.commit()
        retried = self.client.post(f"/blogs/{created['id']}/retry-planning", headers=self.headers)
        self.assertEqual(retried.status_code, 202)
        self.assertEqual(retried.json()["id"], created["id"])
        self.assertEqual(retried.json()["attempt_number"], 2)
        self.assertEqual(retried.json()["status"], "queued")

    @patch("main.generate_blog_task.delay")
    def test_duplicate_plan_approval_is_rejected_without_second_task(self, generate_delay):
        created = self.client.post(
            "/blogs", headers=self.headers, json={"topic": f"Approval topic {uuid.uuid4()}"}
        ).json()
        plan = {
            "blog_title": "Approval test",
            "audience": "Developers",
            "tone": "Technical",
            "blog_kind": "explainer",
            "constraints": [],
            "tasks": [
                {"id": index, "title": f"Section {index}", "goal": "Explain the concept clearly.", "bullets": ["One", "Two", "Three"], "target_words": 250}
                for index in range(1, 6)
            ],
        }
        with SessionLocal() as db:
            blog = db.get(Blog, created["id"])
            blog.status = "waiting_for_review"
            blog.plan = plan
            db.commit()
        with patch("main.resume_blog_task.delay") as resume_delay:
            first = self.client.post(f"/blogs/{created['id']}/approve-plan", headers=self.headers, json={"plan": plan})
            second = self.client.post(f"/blogs/{created['id']}/approve-plan", headers=self.headers, json={"plan": plan})
        self.assertEqual(first.status_code, 202)
        self.assertEqual(second.status_code, 409)
        self.assertEqual(resume_delay.call_count, 1)

    @patch("tasks.start_generation")
    def test_successful_planning_reaches_review_checkpoint(self, start_generation):
        with SessionLocal() as db:
            user = db.query(User).first()
            blog = Blog(user_id=user.id, thread_id=str(uuid.uuid4()), topic="Checkpoint test", status="queued")
            db.add(blog)
            db.commit()
            blog_id = blog.id
        plan = {
            "blog_title": "Checkpoint test",
            "audience": "Developers",
            "tone": "Technical",
            "blog_kind": "explainer",
            "constraints": [],
            "tasks": [
                {"id": index, "title": f"Section {index}", "goal": "Explain the concept clearly.", "bullets": ["One", "Two", "Three"], "target_words": 250}
                for index in range(1, 6)
            ],
        }
        start_generation.return_value = {"__interrupt__": [SimpleNamespace(value={"plan": plan})]}
        generate_blog_task.run(blog_id)
        with SessionLocal() as db:
            saved = db.get(Blog, blog_id)
            self.assertEqual(saved.status, "waiting_for_review")
            self.assertEqual(saved.progress, 100)
            self.assertEqual(saved.plan["blog_title"], "Checkpoint test")


if __name__ == "__main__":
    unittest.main()
