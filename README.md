# QuillOps deployment backend

This project adds:

- FastAPI endpoints
- JWT user accounts
- PostgreSQL blog history
- version history and restore
- durable LangGraph checkpoints
- plan review before section generation
- AI and manual editing
- Celery + Redis background generation

## 1. Configure

```bash
cp .env.example .env
```

Fill in `NVIDIA_API_KEY`, `TAVILY_API_KEY`, and replace `JWT_SECRET`.

## 2. Start with Docker

```bash
docker compose up --build
```

API documentation:

```text
http://localhost:8000/docs
```

## 3. Main workflow

1. `POST /auth/register`
2. Copy the returned bearer token.
3. `POST /blogs` with a topic.
4. Poll `GET /blogs/{blog_id}`.
5. When status is `waiting_for_review`, show `plan` in the frontend.
6. Send the edited plan to `POST /blogs/{blog_id}/approve-plan`.
7. Poll until status is `completed` or `failed`.

## Status values

- `queued`
- `planning`
- `waiting_for_review`
- `queued_for_generation`
- `generating`
- `completed`
- `queued_for_edit`
- `editing`
- `failed`

## Local development without Docker

Use SQLite only for local testing:

```env
DATABASE_URL=sqlite:///./quillops.db
REDIS_URL=redis://localhost:6379/0
```

You still need Redis and two terminals:

```bash
uvicorn main:app --reload
```

```bash
celery -A tasks.celery_app worker --loglevel=INFO --concurrency=1
```

For public deployment, use PostgreSQL rather than local SQLite.
