from __future__ import annotations

import os
from contextlib import contextmanager
from datetime import datetime, timezone

from dotenv import load_dotenv
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import DeclarativeBase, sessionmaker

load_dotenv()

def normalize_database_urls(raw_url: str | None) -> tuple[str, str]:
    """
    Normalizes a DATABASE_URL into a tuple of:
    (sqlalchemy_url, psycopg_url)

    - postgresql://...         -> (postgresql+psycopg://..., postgresql://...)
    - postgres://...           -> (postgresql+psycopg://..., postgresql://...)
    - postgresql+psycopg://... -> (postgresql+psycopg://..., postgresql://...)
    - sqlite://...             -> (sqlite://..., sqlite://...)
    - None or empty            -> ("sqlite:///./quillops.db", "sqlite:///./quillops.db")
    """
    if not raw_url:
        return "sqlite:///./quillops.db", "sqlite:///./quillops.db"

    if raw_url.startswith("postgresql+psycopg://"):
        sqlalchemy_url = raw_url
        psycopg_url = "postgresql://" + raw_url[len("postgresql+psycopg://"):]
        return sqlalchemy_url, psycopg_url
    elif raw_url.startswith("postgresql://"):
        sqlalchemy_url = "postgresql+psycopg://" + raw_url[len("postgresql://"):]
        psycopg_url = raw_url
        return sqlalchemy_url, psycopg_url
    elif raw_url.startswith("postgres://"):
        sqlalchemy_url = "postgresql+psycopg://" + raw_url[len("postgres://"):]
        psycopg_url = "postgresql://" + raw_url[len("postgres://"):]
        return sqlalchemy_url, psycopg_url
    else:
        return raw_url, raw_url


RAW_DATABASE_URL = os.getenv("DATABASE_URL")
DATABASE_URL, PSYCOPG_DATABASE_URL = normalize_database_urls(RAW_DATABASE_URL)

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    connect_args=connect_args,
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def init_db() -> None:
    # Import models before create_all so SQLAlchemy knows every table.
    import models  # noqa: F401

    Base.metadata.create_all(bind=engine)
    _add_missing_blog_columns()


def _add_missing_blog_columns() -> None:
    """Small in-place migration for deployments created before planning telemetry."""
    existing = {column["name"] for column in inspect(engine).get_columns("blogs")}
    columns = {
        "error_code": "VARCHAR(64)",
        "error_retryable": "BOOLEAN NOT NULL DEFAULT FALSE",
        "attempt_number": "INTEGER NOT NULL DEFAULT 1",
        "progress": "INTEGER NOT NULL DEFAULT 0",
        "stage_message": "VARCHAR(255)",
        "last_error_at": "TIMESTAMP WITH TIME ZONE",
        "generation_state": "JSON",
        "generated_sections": "JSON",
    }
    with engine.begin() as connection:
        for name, sql_type in columns.items():
            if name not in existing:
                connection.execute(text(f"ALTER TABLE blogs ADD COLUMN {name} {sql_type}"))


@contextmanager
def session_scope():
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
