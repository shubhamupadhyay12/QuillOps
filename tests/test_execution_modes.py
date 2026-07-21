import os
import sys
import tempfile
import unittest
import uuid
from types import SimpleNamespace
from unittest.mock import MagicMock, patch

# Configure test environment variables before imports
TEST_DB = os.path.join(tempfile.gettempdir(), f"quillops-exec-mode-test-{uuid.uuid4()}.db")
os.environ["DATABASE_URL"] = f"sqlite:///{TEST_DB.replace(os.sep, '/')}"
os.environ["EXECUTION_MODE"] = "inprocess"
os.environ["INPROCESS_MAX_WORKERS"] = "2"
os.environ["NVIDIA_API_KEY"] = "test-key"
os.environ["JWT_SECRET"] = "test-secret-with-enough-entropy-for-local-tests"

from fastapi.testclient import TestClient
from database import init_db, session_scope
from main import app
from models import Blog, User
from auth import hash_password, create_access_token
from dispatcher import shutdown_dispatcher


class TestExecutionModes(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        init_db()
        cls.client = TestClient(app)

    def setUp(self):
        os.environ["EXECUTION_MODE"] = "inprocess"
        with session_scope() as db:
            self.user = User(
                email=f"test-{uuid.uuid4()}@example.com",
                password_hash=hash_password("password123"),
            )
            db.add(self.user)
            db.commit()
            db.refresh(self.user)
            self.user_id = self.user.id
            self.auth_headers = {"Authorization": f"Bearer {create_access_token(self.user_id)}"}

    def tearDown(self):
        shutdown_dispatcher(wait=True)

    def _mock_plan(self):
        return {
            "blog_title": "Test Blog Title",
            "audience": "Backend engineers",
            "tone": "Technical",
            "blog_kind": "comparison",
            "constraints": [],
            "target_word_count": 3200,
            "tasks": [
                {
                    "id": index,
                    "title": f"Section {index}",
                    "goal": "Explain the engineering tradeoff.",
                    "bullets": ["Context", "Mechanism", "Operational guidance"],
                    "target_words": 400,
                    "requires_research": False,
                    "requires_citations": False,
                    "requires_code": False,
                }
                for index in range(1, 9)
            ],
        }

    def test_1_create_blog_returns_fast_and_reaches_waiting_for_review(self):
        """1 & 2: Creating blog returns HTTP 202 quickly and background job updates status to waiting_for_review"""
        plan = self._mock_plan()
        mock_result = {
            "__interrupt__": [SimpleNamespace(value={"plan": plan})],
            "plan": plan,
        }

        with patch("jobs.start_generation", return_value=mock_result):
            resp = self.client.post(
                "/blogs",
                json={"topic": f"Topic-{uuid.uuid4()}"},
                headers=self.auth_headers,
            )
            self.assertEqual(resp.status_code, 202)
            data = resp.json()
            self.assertEqual(data["status"], "queued")
            blog_id = data["id"]

            shutdown_dispatcher(wait=True)

            with session_scope() as db:
                blog = db.scalar(select_blog(blog_id))
                self.assertIsNotNone(blog)
                self.assertEqual(blog.status, "waiting_for_review")
                self.assertEqual(blog.progress, 100)
                self.assertIsNotNone(blog.plan)

    def test_3_and_4_approve_plan_and_complete_generation(self):
        """3 & 4: Approving plan resumes generation in background and reaches completed state"""
        blog_id = str(uuid.uuid4())
        plan = self._mock_plan()
        with session_scope() as db:
            blog = Blog(
                id=blog_id,
                user_id=self.user_id,
                thread_id=str(uuid.uuid4()),
                topic="Approve Test Topic",
                status="waiting_for_review",
                progress=100,
                plan=plan,
            )
            db.add(blog)

        mock_article_result = {
            "final": "# Test Blog Title\n\nThis is full generated content.",
            "plan": plan,
            "evidence": [],
            "sections": {str(i): f"Section content {i}" for i in range(1, 9)},
        }

        with patch("jobs.generate_article", return_value=mock_article_result):
            resp = self.client.post(
                f"/blogs/{blog_id}/approve-plan",
                json={"plan": plan},
                headers=self.auth_headers,
            )
            self.assertEqual(resp.status_code, 202)
            data = resp.json()
            self.assertEqual(data["status"], "queued_for_generation")

            shutdown_dispatcher(wait=True)

            with session_scope() as db:
                blog = db.scalar(select_blog(blog_id))
                self.assertEqual(blog.status, "completed")
                self.assertEqual(blog.progress, 100)
                self.assertIn("Test Blog Title", blog.content)

    def test_5_retry_planning(self):
        """5: Retry planning works in in-process mode"""
        blog_id = str(uuid.uuid4())
        with session_scope() as db:
            blog = Blog(
                id=blog_id,
                user_id=self.user_id,
                thread_id=str(uuid.uuid4()),
                topic="Retry Planning Topic",
                status="failed",
                error_message="Simulated error",
                error_code="PROVIDER_ERROR",
                error_retryable=True,
                attempt_number=1,
            )
            db.add(blog)

        plan = self._mock_plan()
        mock_result = {
            "__interrupt__": [SimpleNamespace(value={"plan": plan})],
            "plan": plan,
        }

        with patch("jobs.start_generation", return_value=mock_result):
            resp = self.client.post(
                f"/blogs/{blog_id}/retry-planning",
                headers=self.auth_headers,
            )
            self.assertEqual(resp.status_code, 202)
            self.assertEqual(resp.json()["status"], "queued")

            shutdown_dispatcher(wait=True)

            with session_scope() as db:
                blog = db.scalar(select_blog(blog_id))
                self.assertEqual(blog.status, "waiting_for_review")

    def test_6_retry_generation(self):
        """6: Retry writing/generation works in in-process mode"""
        blog_id = str(uuid.uuid4())
        plan = self._mock_plan()
        with session_scope() as db:
            blog = Blog(
                id=blog_id,
                user_id=self.user_id,
                thread_id=str(uuid.uuid4()),
                topic="Retry Writing Topic",
                status="failed",
                error_message="Writing failed",
                error_code="SECTION_GENERATION_FAILED",
                error_retryable=True,
                plan=plan,
            )
            db.add(blog)

        mock_article_result = {
            "final": "# Test Title\n\nRetried draft content.",
            "plan": plan,
            "evidence": [],
            "sections": {str(i): f"Section content {i}" for i in range(1, 9)},
        }

        with patch("jobs.generate_article", return_value=mock_article_result):
            resp = self.client.post(
                f"/blogs/{blog_id}/retry-writing",
                headers=self.auth_headers,
            )
            self.assertEqual(resp.status_code, 202)
            self.assertEqual(resp.json()["status"], "queued_for_generation")

            shutdown_dispatcher(wait=True)

            with session_scope() as db:
                blog = db.scalar(select_blog(blog_id))
                self.assertEqual(blog.status, "completed")

    def test_7_ai_edit(self):
        """7: AI edit works in in-process mode"""
        blog_id = str(uuid.uuid4())
        with session_scope() as db:
            blog = Blog(
                id=blog_id,
                user_id=self.user_id,
                thread_id=str(uuid.uuid4()),
                topic="AI Edit Topic",
                status="completed",
                content="# Original Title\n\nOriginal content.",
                current_version=1,
            )
            db.add(blog)

        revised = "# Revised Title\n\nRevised content with edit."
        with patch("jobs.edit_blog_content", return_value=revised), \
             patch("jobs.validate_article_markdown", return_value=None):
            resp = self.client.post(
                f"/blogs/{blog_id}/ai-edit",
                json={"instruction": "Improve clarity"},
                headers=self.auth_headers,
            )
            self.assertEqual(resp.status_code, 202)
            self.assertEqual(resp.json()["status"], "queued_for_edit")

            shutdown_dispatcher(wait=True)

            with session_scope() as db:
                blog = db.scalar(select_blog(blog_id))
                self.assertEqual(blog.status, "completed")
                self.assertEqual(blog.content, revised)
                self.assertEqual(blog.current_version, 2)

    def test_8_no_redis_connection_in_inprocess_mode(self):
        """8: Verify tasks.py and celery are not imported by main.py in inprocess mode"""
        import main
        import dispatcher
        self.assertEqual(dispatcher.EXECUTION_MODE, "inprocess")
        self.assertNotIn("tasks", main.__dict__)
        self.assertNotIn("celery_app", main.__dict__)

    def test_9_celery_mode_dispatches_via_delay(self):
        """9: Verify EXECUTION_MODE=celery dispatches via .delay()"""
        os.environ["EXECUTION_MODE"] = "celery"
        mock_task = MagicMock()

        with patch("tasks.generate_blog_task.delay", mock_task):
            resp = self.client.post(
                "/blogs",
                json={"topic": f"Celery Topic-{uuid.uuid4()}"},
                headers=self.auth_headers,
            )
            self.assertEqual(resp.status_code, 202)
            mock_task.assert_called_once()
        os.environ["EXECUTION_MODE"] = "inprocess"

    def test_10_and_11_error_handling_and_independent_db_session(self):
        """10 & 11: Background job creates own db session and updates blog to failed state on error"""
        blog_id = str(uuid.uuid4())
        with session_scope() as db:
            blog = Blog(
                id=blog_id,
                user_id=self.user_id,
                thread_id=str(uuid.uuid4()),
                topic="Error Handling Topic",
                status="queued",
            )
            db.add(blog)

        with patch("jobs.start_generation", side_effect=RuntimeError("Simulated LLM Failure")):
            from jobs import run_start_generation_job
            try:
                run_start_generation_job(blog_id)
            except Exception:
                pass

            with session_scope() as db:
                blog = db.scalar(select_blog(blog_id))
                self.assertEqual(blog.status, "failed")
                self.assertIsNotNone(blog.error_code)

    def test_12_duplicate_dispatch_ignored(self):
        """12: Duplicate job execution is ignored if status is not queued"""
        blog_id = str(uuid.uuid4())
        with session_scope() as db:
            blog = Blog(
                id=blog_id,
                user_id=self.user_id,
                thread_id=str(uuid.uuid4()),
                topic="Duplicate Test Topic",
                status="routing",  # Already running
            )
            db.add(blog)

        with patch("jobs.start_generation") as mock_start:
            from jobs import run_start_generation_job
            run_start_generation_job(blog_id)
            mock_start.assert_not_called()


def select_blog(blog_id: str):
    from sqlalchemy import select
    return select(Blog).where(Blog.id == blog_id)


if __name__ == "__main__":
    unittest.main()
