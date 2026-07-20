from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class CreateBlogRequest(BaseModel):
    topic: str = Field(min_length=5, max_length=500)


class ManualEditRequest(BaseModel):
    content: str = Field(min_length=1, max_length=200_000)
    instruction: str | None = Field(default="Manual edit", max_length=500)


class AIEditRequest(BaseModel):
    instruction: str = Field(min_length=3, max_length=1000)


class RefineRequest(BaseModel):
    content: str = Field(min_length=1, max_length=200_000)
    instruction: str = Field(min_length=3, max_length=1000)



class PlanApprovalRequest(BaseModel):
    plan: dict[str, Any]


class BlogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    topic: str
    title: str | None
    content: str
    status: str
    plan: dict | None
    evidence: list | None
    generation_state: dict | None
    error_message: str | None
    error_code: str | None
    error_retryable: bool
    attempt_number: int
    progress: int
    stage_message: str | None
    current_version: int
    created_at: datetime
    updated_at: datetime

    @field_validator("error_message")
    @classmethod
    def sanitize_legacy_error(cls, value: str | None) -> str | None:
        if not value:
            return value
        unsafe_markers = ("Traceback", "File \"/", "guided_json", "NVIDIA_API_KEY", "psycopg", "celery/")
        if len(value) > 500 or any(marker.lower() in value.lower() for marker in unsafe_markers):
            return "The background worker could not finish the planning step."
        return value


class BlogListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    topic: str
    title: str | None
    status: str
    progress: int
    stage_message: str | None
    error_code: str | None
    error_retryable: bool
    attempt_number: int
    current_version: int
    created_at: datetime
    updated_at: datetime


class VersionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    version_number: int
    content: str
    edit_instruction: str | None
    created_at: datetime
