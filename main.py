from __future__ import annotations

import os
import uuid

from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from auth import (
    create_access_token,
    get_current_user,
    get_db,
    hash_password,
    verify_password,
)
from backend import ArticleValidationError, Plan, validate_article_markdown
from database import init_db, normalize_database_urls, utc_now
from models import Blog, BlogVersion, User
from schemas import (
    AIEditRequest,
    BlogListItem,
    BlogResponse,
    CreateBlogRequest,
    LoginRequest,
    ManualEditRequest,
    PlanApprovalRequest,
    RegisterRequest,
    RefineRequest,
    TokenResponse,
    VersionResponse,
)
from dispatcher import (
    dispatch_ai_edit,
    dispatch_resume_generation,
    dispatch_start_generation,
)
from jobs import build_generation_state

app = FastAPI(
    title="QuillOps API",
    version="1.0.0",
    description="Persistent, human-reviewable technical blog generation API.",
)

ACTIVE_PLANNING_STATUSES = {
    "queued",
    "routing",
    "researching",
    "synthesizing_research",
    "planning_outline",
    "validating_outline",
    "saving_checkpoint",
}

allowed_origins_raw = os.getenv("CORS_ALLOWED_ORIGINS") or os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:4173,http://127.0.0.1:4173",
)
allowed_origins = [
    origin.strip()
    for origin in allowed_origins_raw.split(",")
    if origin.strip()
]

if any(
    origin.startswith("http://localhost") or origin.startswith("http://127.0.0.1")
    for origin in allowed_origins
):
    allowed_origins = sorted(
        set(
            allowed_origins
            + [
                "http://localhost:3000",
                "http://localhost:4173",
                "http://127.0.0.1:3000",
                "http://127.0.0.1:4173",
            ]
        )
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://quillops-.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.on_event("startup")
def startup() -> None:
    # Validate critical environment variables in production
    raw_db_url = os.getenv("DATABASE_URL")
    sqlalchemy_url, psycopg_url = normalize_database_urls(raw_db_url)
    
    is_production = (
        os.getenv("ENV") == "production" or
        os.getenv("NODE_ENV") == "production" or
        bool(raw_db_url and (raw_db_url.startswith("postgresql") or raw_db_url.startswith("postgres")))
    )
    
    if is_production:
        if not raw_db_url or sqlalchemy_url.startswith("sqlite"):
            raise RuntimeError("CRITICAL ERROR: DATABASE_URL must be a PostgreSQL connection URL in production.")
        jwt_secret = os.getenv("JWT_SECRET")
        if not jwt_secret or jwt_secret == "change-this-in-production":
            raise RuntimeError("CRITICAL ERROR: JWT_SECRET environment variable is missing or insecure in production.")
        if not os.getenv("NVIDIA_API_KEY"):
            raise RuntimeError("CRITICAL ERROR: NVIDIA_API_KEY is missing in production.")
        if not os.getenv("TAVILY_API_KEY"):
            raise RuntimeError("CRITICAL ERROR: TAVILY_API_KEY is missing in production.")
            
    init_db()


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


# -----------------------------------------------------------------------------
# Authentication
# -----------------------------------------------------------------------------


@app.post("/auth/register", response_model=TokenResponse, status_code=201)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> TokenResponse:
    existing = db.scalar(select(User).where(User.email == payload.email.lower()))
    if existing:
        raise HTTPException(status_code=409, detail="An account already exists.")

    user = User(
        email=payload.email.lower(),
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return TokenResponse(access_token=create_access_token(user.id))


@app.post("/auth/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    user = db.scalar(select(User).where(User.email == payload.email.lower()))
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password.")
    return TokenResponse(access_token=create_access_token(user.id))


# -----------------------------------------------------------------------------
# Blog library
# -----------------------------------------------------------------------------


def get_owned_blog(blog_id: str, user: User, db: Session) -> Blog:
    blog = db.scalar(
        select(Blog).where(Blog.id == blog_id, Blog.user_id == user.id)
    )
    if blog is None:
        raise HTTPException(status_code=404, detail="Blog not found.")
    return blog


@app.post("/blogs", response_model=BlogResponse, status_code=status.HTTP_202_ACCEPTED)
def create_blog(
    payload: CreateBlogRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> Blog:
    normalized_topic = payload.topic.strip()
    existing_active = db.scalar(
        select(Blog).where(
            Blog.user_id == user.id,
            Blog.topic == normalized_topic,
            Blog.status.in_(ACTIVE_PLANNING_STATUSES),
        )
    )
    if existing_active is not None:
        return existing_active

    blog = Blog(
        user_id=user.id,
        thread_id=str(uuid.uuid4()),
        topic=normalized_topic,
        status="queued",
        progress=0,
        stage_message="Waiting for a planning worker",
    )
    db.add(blog)
    db.commit()
    db.refresh(blog)

    dispatch_start_generation(blog.id)
    return blog


@app.post("/blogs/{blog_id}/retry-planning", response_model=BlogResponse, status_code=202)
def retry_planning(
    blog_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> Blog:
    blog = get_owned_blog(blog_id, user, db)
    if blog.status in ACTIVE_PLANNING_STATUSES:
        return blog
    if blog.status != "failed":
        raise HTTPException(status_code=409, detail="Only failed planning jobs can be retried.")
    if not blog.error_retryable:
        raise HTTPException(
            status_code=409,
            detail="This planning request could not be completed because of a configuration problem.",
        )
    if blog.attempt_number >= 3:
        raise HTTPException(
            status_code=429,
            detail="This planning job has reached its retry limit. Edit the topic and start a new draft.",
        )

    blog.thread_id = str(uuid.uuid4())
    blog.status = "queued"
    blog.progress = 0
    blog.stage_message = "Retrying planning…"
    blog.error_message = None
    blog.error_code = None
    blog.error_retryable = False
    blog.attempt_number += 1
    blog.updated_at = utc_now()
    db.commit()
    db.refresh(blog)
    dispatch_start_generation(blog.id)
    return blog


@app.get("/blogs", response_model=list[BlogListItem])
def list_blogs(
    limit: int = Query(default=50, ge=1, le=100),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> list[Blog]:
    return list(
        db.scalars(
            select(Blog)
            .where(Blog.user_id == user.id)
            .order_by(desc(Blog.updated_at))
            .limit(limit)
        ).all()
    )


@app.get("/blogs/{blog_id}", response_model=BlogResponse)
def read_blog(
    blog_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> Blog:
    return get_owned_blog(blog_id, user, db)


@app.delete("/blogs/{blog_id}", status_code=204)
def delete_blog(
    blog_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> None:
    blog = get_owned_blog(blog_id, user, db)
    db.delete(blog)
    db.commit()


# -----------------------------------------------------------------------------
# Plan review and generation resume
# -----------------------------------------------------------------------------


@app.post("/blogs/{blog_id}/approve-plan", response_model=BlogResponse, status_code=202)
def approve_plan(
    blog_id: str,
    payload: PlanApprovalRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> Blog:
    blog = get_owned_blog(blog_id, user, db)
    if blog.status != "waiting_for_review":
        raise HTTPException(
            status_code=409,
            detail="This blog is not waiting for plan review.",
        )

    validated_plan = Plan.model_validate(payload.plan).model_dump()
    blog.plan = validated_plan
    blog.status = "queued_for_generation"
    blog.progress = 50
    blog.stage_message = "Waiting for the writing worker"
    blog.error_message = None
    blog.error_code = None
    blog.error_retryable = False
    blog.generated_sections = {}
    blog.generation_state = build_generation_state(validated_plan)
    blog.updated_at = utc_now()
    db.commit()
    db.refresh(blog)

    dispatch_resume_generation(blog.id, validated_plan)
    return blog


@app.post("/blogs/{blog_id}/retry-writing", response_model=BlogResponse, status_code=202)
def retry_writing(
    blog_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> Blog:
    blog = get_owned_blog(blog_id, user, db)
    retryable_codes = {
        "SECTION_GENERATION_FAILED",
        "ASSEMBLY_VALIDATION_FAILED",
        "WRITING_PROVIDER_TIMEOUT",
        "WRITING_PROVIDER_REJECTED",
        "WRITING_WORKER_FAILED",
    }
    if blog.status in {"queued_for_generation", "writing", "assembling", "validating_article"}:
        return blog
    if blog.status != "failed" or blog.error_code not in retryable_codes or not blog.plan:
        raise HTTPException(status_code=409, detail="This writing job cannot be retried.")
    blog.status = "queued_for_generation"
    blog.progress = 50
    blog.stage_message = "Retrying unfinished sections"
    blog.error_message = None
    blog.error_code = None
    blog.error_retryable = False
    blog.generation_state = build_generation_state(
        blog.plan,
        sections=blog.generated_sections or {},
        stage="queued",
    )
    blog.updated_at = utc_now()
    db.commit()
    db.refresh(blog)
    dispatch_resume_generation(blog.id, blog.plan)
    return blog


@app.post("/blogs/{blog_id}/return-to-review", response_model=BlogResponse)
def return_to_review(
    blog_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> Blog:
    blog = get_owned_blog(blog_id, user, db)
    if blog.status != "failed" or not blog.plan:
        raise HTTPException(status_code=409, detail="Only a failed writing job can return to review.")
    blog.status = "waiting_for_review"
    blog.progress = 100
    blog.stage_message = "Your approved plan is ready to review"
    blog.error_message = None
    blog.error_code = None
    blog.error_retryable = False
    blog.updated_at = utc_now()
    db.commit()
    db.refresh(blog)
    return blog


# -----------------------------------------------------------------------------
# Manual and AI editing
# -----------------------------------------------------------------------------


@app.put("/blogs/{blog_id}", response_model=BlogResponse)
def manually_edit_blog(
    blog_id: str,
    payload: ManualEditRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> Blog:
    blog = get_owned_blog(blog_id, user, db)
    if blog.status not in {"completed", "failed"}:
        raise HTTPException(status_code=409, detail="Blog is currently busy.")

    try:
        validate_article_markdown(payload.content)
    except ArticleValidationError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    blog.current_version += 1
    blog.content = payload.content
    blog.status = "completed"
    blog.error_message = None
    blog.updated_at = utc_now()
    blog.versions.append(
        BlogVersion(
            version_number=blog.current_version,
            content=payload.content,
            edit_instruction=payload.instruction or "Manual edit",
        )
    )
    db.commit()
    db.refresh(blog)
    return blog


@app.post("/blogs/{blog_id}/ai-edit", response_model=BlogResponse, status_code=202)
def ai_edit_blog(
    blog_id: str,
    payload: AIEditRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> Blog:
    blog = get_owned_blog(blog_id, user, db)
    if blog.status != "completed" or not blog.content:
        raise HTTPException(status_code=409, detail="A completed blog is required.")

    blog.status = "queued_for_edit"
    blog.progress = 65
    blog.stage_message = "Waiting for the refinement worker"
    blog.error_message = None
    blog.error_code = None
    blog.error_retryable = False
    blog.updated_at = utc_now()
    db.commit()
    db.refresh(blog)

    dispatch_ai_edit(blog.id, payload.instruction)
    return blog


@app.post("/blogs/{blog_id}/refine")
def refine_blog(
    blog_id: str,
    payload: RefineRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    blog = get_owned_blog(blog_id, user, db)
    if blog.status != "completed":
        raise HTTPException(status_code=409, detail="A completed blog is required.")

    from backend import edit_blog_content
    try:
        refined_content = edit_blog_content(payload.content, payload.instruction)
        return {"refined_content": refined_content}
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to generate refinement: {str(exc)}"
        )


# -----------------------------------------------------------------------------
# Version history
# -----------------------------------------------------------------------------


@app.get("/blogs/{blog_id}/versions", response_model=list[VersionResponse])
def list_versions(
    blog_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> list[BlogVersion]:
    blog = get_owned_blog(blog_id, user, db)
    return list(
        db.scalars(
            select(BlogVersion)
            .where(BlogVersion.blog_id == blog.id)
            .order_by(desc(BlogVersion.version_number))
        ).all()
    )


@app.post("/blogs/{blog_id}/restore/{version_id}", response_model=BlogResponse)
def restore_version(
    blog_id: str,
    version_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> Blog:
    blog = get_owned_blog(blog_id, user, db)
    version = db.scalar(
        select(BlogVersion).where(
            BlogVersion.id == version_id,
            BlogVersion.blog_id == blog.id,
        )
    )
    if version is None:
        raise HTTPException(status_code=404, detail="Version not found.")

    blog.current_version += 1
    blog.content = version.content
    blog.status = "completed"
    blog.error_message = None
    blog.error_code = None
    blog.error_retryable = False
    blog.progress = 100
    blog.stage_message = "Version restored"
    blog.updated_at = utc_now()
    blog.versions.append(
        BlogVersion(
            version_number=blog.current_version,
            content=version.content,
            edit_instruction=f"Restored version {version.version_number}",
        )
    )
    db.commit()
    db.refresh(blog)
    return blog


# -----------------------------------------------------------------------------
# Frontend SPA Static Mount
# -----------------------------------------------------------------------------
from fastapi.staticfiles import StaticFiles

app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
