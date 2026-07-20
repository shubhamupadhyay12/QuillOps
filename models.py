from __future__ import annotations

import uuid

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, JSON, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base, utc_now


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[object] = mapped_column(DateTime(timezone=True), default=utc_now)

    blogs: Mapped[list["Blog"]] = relationship(
        back_populates="owner", cascade="all, delete-orphan"
    )


class Blog(Base):
    __tablename__ = "blogs"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    thread_id: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    topic: Mapped[str] = mapped_column(String(500))
    title: Mapped[str | None] = mapped_column(String(500), nullable=True)
    content: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[str] = mapped_column(String(40), default="queued", index=True)
    plan: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    evidence: Mapped[list | None] = mapped_column(JSON, nullable=True)
    generation_state: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    generated_sections: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    error_code: Mapped[str | None] = mapped_column(String(64), nullable=True)
    error_retryable: Mapped[bool] = mapped_column(Boolean, default=False)
    attempt_number: Mapped[int] = mapped_column(Integer, default=1)
    progress: Mapped[int] = mapped_column(Integer, default=0)
    stage_message: Mapped[str | None] = mapped_column(String(255), nullable=True)
    last_error_at: Mapped[object | None] = mapped_column(DateTime(timezone=True), nullable=True)
    current_version: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[object] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[object] = mapped_column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now
    )

    owner: Mapped[User] = relationship(back_populates="blogs")
    versions: Mapped[list["BlogVersion"]] = relationship(
        back_populates="blog", cascade="all, delete-orphan"
    )


class BlogVersion(Base):
    __tablename__ = "blog_versions"
    __table_args__ = (
        UniqueConstraint("blog_id", "version_number", name="uq_blog_version"),
    )

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    blog_id: Mapped[str] = mapped_column(
        ForeignKey("blogs.id", ondelete="CASCADE"), index=True
    )
    version_number: Mapped[int] = mapped_column(Integer)
    content: Mapped[str] = mapped_column(Text)
    edit_instruction: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[object] = mapped_column(DateTime(timezone=True), default=utc_now)

    blog: Mapped[Blog] = relationship(back_populates="versions")
