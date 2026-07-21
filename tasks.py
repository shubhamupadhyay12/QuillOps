from __future__ import annotations

import os

from celery import Celery

from jobs import (
    build_generation_state,
    run_ai_edit_job,
    run_resume_generation_job,
    run_start_generation_job,
)

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

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


@celery_app.task(name="quillops.start_generation", bind=True, acks_late=True)
def generate_blog_task(self, blog_id: str) -> None:
    run_start_generation_job(blog_id)


@celery_app.task(name="quillops.resume_generation", bind=True, acks_late=True)
def resume_blog_task(self, blog_id: str, reviewed_plan: dict) -> None:
    run_resume_generation_job(blog_id, reviewed_plan)


@celery_app.task(name="quillops.ai_edit")
def ai_edit_blog_task(blog_id: str, instruction: str) -> None:
    run_ai_edit_job(blog_id, instruction)
