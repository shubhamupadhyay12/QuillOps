from __future__ import annotations

import logging
import os
from concurrent.futures import ThreadPoolExecutor

logger = logging.getLogger(__name__)

EXECUTION_MODE = os.getenv("EXECUTION_MODE", "inprocess").lower()
INPROCESS_MAX_WORKERS = int(os.getenv("INPROCESS_MAX_WORKERS", "2"))

_executor: ThreadPoolExecutor | None = None


def get_executor() -> ThreadPoolExecutor:
    global _executor
    if _executor is None:
        _executor = ThreadPoolExecutor(
            max_workers=INPROCESS_MAX_WORKERS,
            thread_name_prefix="quillops-inprocess",
        )
    return _executor


def _safe_run(func, *args, **kwargs) -> None:
    try:
        func(*args, **kwargs)
    except Exception as exc:
        logger.exception("In-process background job %s failed: %s", func.__name__, exc)


def dispatch_start_generation(blog_id: str) -> None:
    mode = os.getenv("EXECUTION_MODE", EXECUTION_MODE).lower()
    if mode == "celery":
        from tasks import generate_blog_task
        generate_blog_task.delay(blog_id)
    else:
        from jobs import run_start_generation_job
        get_executor().submit(_safe_run, run_start_generation_job, blog_id)


def dispatch_resume_generation(blog_id: str, reviewed_plan: dict) -> None:
    mode = os.getenv("EXECUTION_MODE", EXECUTION_MODE).lower()
    if mode == "celery":
        from tasks import resume_blog_task
        resume_blog_task.delay(blog_id, reviewed_plan)
    else:
        from jobs import run_resume_generation_job
        get_executor().submit(_safe_run, run_resume_generation_job, blog_id, reviewed_plan)


def dispatch_ai_edit(blog_id: str, instruction: str) -> None:
    mode = os.getenv("EXECUTION_MODE", EXECUTION_MODE).lower()
    if mode == "celery":
        from tasks import ai_edit_blog_task
        ai_edit_blog_task.delay(blog_id, instruction)
    else:
        from jobs import run_ai_edit_job
        get_executor().submit(_safe_run, run_ai_edit_job, blog_id, instruction)


def shutdown_dispatcher(wait: bool = True) -> None:
    global _executor
    if _executor is not None:
        _executor.shutdown(wait=wait)
        _executor = None
