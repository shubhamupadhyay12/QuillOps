# QuillOps — Product Requirements Document

**Status:** Backend verified working end-to-end (manual testing via `/docs`). Frontend not yet built.
**Last updated:** 2026-07-19

---

## 1. Overview

QuillOps is a persistent, human-in-the-loop technical blog generation platform. A user submits a topic, an AI pipeline plans an outline, the user reviews and approves that outline, the AI writes the full post section-by-section in the background, and the result is saved permanently against the user's account — editable, versioned, and retrievable at any time in the future.

The defining product idea is **the human stays in the loop without being blocked**: planning and writing happen asynchronously in the background, but nothing gets written into "final" content without the user seeing and approving the outline first.

## 2. Goals

- Let a user turn a one-line topic into a full technical blog post with minimal manual writing.
- Give the user real editorial control: they approve the outline before generation, and can manually or AI-edit the result afterward.
- Persist everything permanently per-user, so a user can close the app and return days or weeks later to find their blogs, still editable.
- Keep a full version history so no edit is ever destructive.
- Keep the system self-hostable and inexpensive to run for a single developer (SQLite/Postgres + Redis, no managed AI infra required beyond API keys).

## 3. Non-goals (for this version)

- Multi-user collaboration on a single blog (no shared editing, no comments, no roles/permissions beyond owner).
- Publishing/distribution (no CMS integration, no direct publish-to-Medium/Substack/etc.).
- Real-time collaborative editing.
- Team/organization accounts — this is single-user-owns-blog only.
- SEO tooling, analytics, or content scheduling.

## 4. Target user

An individual developer, technical writer, or dev-rel professional who wants an AI-assisted draft of a technical blog post, wants to control the outline before the AI commits to writing it, and wants their work saved reliably so they can iterate over multiple sessions.

## 5. System architecture

### 5.1 Components

| Component | Technology | Responsibility |
|---|---|---|
| API server | FastAPI (`main.py`) | REST endpoints, auth enforcement, request validation, kicks off background jobs |
| Auth | PyJWT + pwdlib/argon2 (`auth.py`) | Password hashing, JWT issuance and verification |
| Database | PostgreSQL (SQLite for local dev) via SQLAlchemy (`database.py`, `models.py`) | Durable storage of users, blogs, blog versions |
| Task queue | Celery + Redis (`tasks.py`) | Runs AI generation/editing as background jobs so API requests return immediately |
| AI pipeline | LangGraph + NVIDIA-hosted LLM + Tavily search (`backend.py`) | Plans outline, optionally researches, writes sections in parallel, supports plan-review interrupt and AI-driven post-hoc editing |
| Durable pipeline state | LangGraph checkpointer (Postgres or SQLite) | Persists the AI graph's execution state so a paused "waiting for review" pipeline survives process restarts and resumes correctly |
| Deployment | Docker Compose (`docker-compose.yml`, `Dockerfile`) | Runs `postgres`, `redis`, `api`, and `worker` as four containers |

### 5.2 Request flow (blog creation)

1. Client calls `POST /blogs` with a topic and a valid JWT.
2. `main.py` creates a `Blog` row (`status="queued"`), commits it, and enqueues `generate_blog_task` via Celery — this call returns immediately (`202 Accepted`).
3. The Celery worker process picks up the task, sets `status="planning"`, and invokes the LangGraph pipeline (`start_generation` in `backend.py`).
4. The pipeline: routes (decide if research is needed) → optionally researches via Tavily → plans an outline via the LLM (`Plan` schema) → hits an `interrupt()` and pauses, durably checkpointed.
5. The worker detects the interrupt, saves the `plan` to the `Blog` row, sets `status="waiting_for_review"`.
6. Client polls `GET /blogs/{id}` until it sees `waiting_for_review`, then shows the plan for editing.
7. Client calls `POST /blogs/{id}/approve-plan` with the (possibly edited) plan. This sets `status="queued_for_generation"` and enqueues `resume_blog_task`.
8. The worker resumes the paused LangGraph execution from its checkpoint (not from scratch), fans out one worker call per outline task (parallel section writing), reduces them into a final Markdown document, and saves it — `status="completed"`, with a `BlogVersion` row created for "Original AI generation".
9. Client polls until `completed`, then reads `content`.

### 5.3 Edit flow

- **Manual edit** (`PUT /blogs/{id}`): synchronous, directly overwrites `content`, bumps `current_version`, appends a `BlogVersion`.
- **AI edit** (`POST /blogs/{id}/ai-edit`): asynchronous — sets `status="queued_for_edit"`, worker runs `edit_blog_content` (a single LLM call with an editing instruction), sets `status="editing"` then back to `"completed"` with a new version appended.
- **Restore** (`POST /blogs/{id}/restore/{version_id}`): copies a prior version's content back into the live `Blog.content`, itself creating **another** new version (so restoring is also non-destructive and reversible).

### 5.4 Data model

**User**
- `id` (UUID), `email` (unique), `password_hash`, `created_at`
- owns many `Blog`s (cascade delete)

**Blog**
- `id` (UUID), `user_id` (FK), `thread_id` (unique — maps to the LangGraph checkpoint thread)
- `topic`, `title`, `content` (Markdown), `status`
- `plan` (JSON), `evidence` (JSON), `error_message`
- `current_version` (int), `created_at`, `updated_at`
- owns many `BlogVersion`s (cascade delete)

**BlogVersion**
- `id` (UUID), `blog_id` (FK), `version_number` (unique per blog)
- `content`, `edit_instruction`, `created_at`

### 5.5 Status state machine

```
queued → planning → waiting_for_review → queued_for_generation → generating → completed
                                                                                    ↕
                                                                    queued_for_edit → editing → completed
any state → failed (on unhandled exception; error_message populated)
```

### 5.6 API surface (implemented)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/health` | No | Liveness check |
| POST | `/auth/register` | No | Create account, returns JWT |
| POST | `/auth/login` | No | Authenticate, returns JWT |
| POST | `/blogs` | Yes | Create a blog, starts async generation |
| GET | `/blogs` | Yes | List current user's blogs (paginated by `limit`, max 100) |
| GET | `/blogs/{blog_id}` | Yes | Read one blog (ownership-checked) |
| DELETE | `/blogs/{blog_id}` | Yes | Delete a blog and its versions |
| POST | `/blogs/{blog_id}/approve-plan` | Yes | Submit (edited) plan, resumes generation |
| PUT | `/blogs/{blog_id}` | Yes | Manual content edit, only when `completed`/`failed` |
| POST | `/blogs/{blog_id}/ai-edit` | Yes | AI-driven edit, only when `completed` |
| GET | `/blogs/{blog_id}/versions` | Yes | List version history, newest first |
| POST | `/blogs/{blog_id}/restore/{version_id}` | Yes | Roll back to a prior version |

All authenticated endpoints scope data by `user_id` — a user can never read, edit, or delete another user's blog (`get_owned_blog` enforces this with a 404 on mismatch, not a 403, to avoid leaking existence).

## 6. What is implemented (verified by hand, end to end)

The following was manually tested through the FastAPI `/docs` UI on 2026-07-19 and confirmed working:

- [x] User registration and duplicate-email rejection (`409`)
- [x] Login and JWT issuance
- [x] Bearer-token authorization on protected routes
- [x] Blog creation returning `202` and `status: queued` immediately
- [x] Background planning via Celery worker calling the LangGraph pipeline and an NVIDIA-hosted LLM
- [x] Plan-review interrupt — pipeline correctly pauses at `waiting_for_review` with a full structured `Plan` (title, audience, tone, tasks with bullets, constraints)
- [x] Plan approval resuming the durable, checkpointed pipeline (not restarting from scratch)
- [x] Parallel section generation and reduction into a final Markdown document
- [x] Persistent storage — blog and plan survive across requests/sessions, tied to the user's account
- [x] Manual edit (`PUT`) creating a new version
- [x] AI edit (`POST /ai-edit`) as an asynchronous job with its own status transitions
- [x] Version history listing
- [x] Restore-from-version, itself creating a new (non-destructive) version
- [x] Docker Compose bringing up all four services together (`postgres`, `redis`, `api`, `worker`)

Two infrastructure files were missing from the original handoff and have since been created:
- [x] `Dockerfile` (confirmed working)
- [x] `.env.example` and `.dockerignore`

One code fix was required and applied during testing:
- [x] `auth.py` — swapped `OAuth2PasswordBearer` for `HTTPBearer` so the FastAPI `/docs` Authorize dialog accepts a raw pasted token instead of expecting a form-based OAuth2 password-grant login (the original scheme declaration didn't match how `/auth/login` actually behaves).

One environment fix was required and applied during testing:
- [x] `DATABASE_URL` needed the `+psycopg` driver qualifier (`postgresql+psycopg://...`) because `requirements.txt` installs `psycopg` v3, not the legacy `psycopg2` that SQLAlchemy defaults to for a bare `postgresql://` URL.

Not yet exercised in testing but present in code and believed functional:
- [ ] `DELETE /blogs/{blog_id}`
- [ ] Blog listing (`GET /blogs`) with more than one blog
- [ ] The `open_book`/`hybrid` research path through Tavily on a topic that triggers it (the tested topic used `closed_book` or a light research path — worth confirming Tavily search itself returns results, since `TAVILY_API_KEY` was only recently added)
- [ ] Failure-path behavior — what a user actually sees when `status` becomes `"failed"` (never triggered during testing)

## 7. What is NOT implemented (gaps to close before real deployment)

### 7.1 No frontend
This is the single largest gap. Everything above was validated through FastAPI's auto-generated `/docs` page, which is not a product UI. See the companion document, `Frontend_Technical_Requirements.md`, for what needs to be built.

### 7.2 Auth & account gaps
- No password reset / forgot-password flow.
- No email verification on registration.
- No refresh tokens — access tokens are long-lived (7 days by default via `ACCESS_TOKEN_MINUTES`) with no revocation mechanism; a leaked token is valid until it naturally expires.
- No logout/token-blacklist endpoint (stateless JWT — logout is client-side-only, deleting the stored token).
- No rate limiting on `/auth/login` or `/auth/register` (brute-force / spam risk).
- No account deletion endpoint for the user themselves (cascade delete exists at the DB/model level, but there's no `DELETE /users/me`).

### 7.3 Operational / reliability gaps
- No database migrations tool (Alembic). Schema changes currently rely on `Base.metadata.create_all`, which only creates missing tables — it does not alter existing ones. Any future column change needs a manual migration story.
- No automated tests (unit, integration, or end-to-end). Everything verified in this cycle was manual, click-through testing.
- No structured logging or error monitoring (e.g., Sentry) — failures currently just populate `error_message` on the `Blog` row, with no alerting.
- No retry/backoff policy on Celery tasks if a step fails transiently (e.g., a rate-limited LLM call fails the whole job rather than retrying that one step).
- No idempotency protection if a Celery task is redelivered (e.g., after a worker crash mid-task) — could theoretically double-run a generation.
- No health checks beyond a static `/health` endpoint (no DB/Redis connectivity check inside it).
- No CI/CD pipeline for build/test/deploy.

### 7.4 Security / production-readiness gaps
- `JWT_SECRET` and DB credentials currently live in a local `.env` — fine for development, but needs a real secrets manager (e.g., cloud provider secret store) before public deployment.
- `ALLOWED_ORIGINS` (CORS) defaults to `localhost:3000` — must be locked to the real frontend domain in production.
- No HTTPS termination configured (expected to sit behind a reverse proxy / load balancer in production, e.g., Caddy, nginx, or a managed platform's TLS).
- No per-user or per-IP rate limiting on any endpoint, including the expensive AI-generation ones — a user (or bot) could spam `POST /blogs` and drive up NVIDIA/Tavily API costs with no ceiling.
- No input sanitization/limits on generated Markdown before it's rendered client-side (relevant once a frontend renders `content` as HTML — XSS risk if rendered unsafely).
- No cost/usage tracking per user (no way to see or cap how much a given account is costing in LLM/search API calls).

### 7.5 Product feature gaps
- No real-time status updates — the client is expected to poll `GET /blogs/{id}` repeatedly. No WebSocket/SSE push notification when a job finishes.
- No diff view between versions (version history returns full content per version, not a diff).
- No way to preview/compare the plan against the previous plan if a user edits it before approving.
- No tagging, folders, search, or filtering across a user's blog list — `GET /blogs` returns a flat, recency-sorted list.
- No export options (PDF, DOCX, direct publish) — content is Markdown text only.
- No collaborative or shareable links — a blog is only ever visible to its owner via authenticated API calls.
- No image generation or embedding in generated content.
- No support for switching or comparing different LLM models per blog.

## 8. Non-functional requirements (target state, not yet enforced)

| Area | Current state | Target |
|---|---|---|
| Availability | Single-instance Docker Compose, no redundancy | Acceptable for solo/small deployment; needs multi-instance + managed Postgres for real scale |
| Data durability | Postgres with a Docker volume | Add automated backups before storing anything users can't afford to lose |
| Security | JWT + argon2 hashing, ownership checks on every blog route | Add rate limiting, secrets management, HTTPS before any public exposure |
| Cost control | None | Add per-user usage caps / cost tracking before opening to multiple users |
| Observability | `error_message` field only | Add structured logs + error monitoring before production traffic |

## 9. Suggested phased roadmap

**Phase 1 — Make it usable (near-term)**
- Build the frontend (see companion document).
- Add basic rate limiting on auth and blog-creation endpoints.
- Add a real health check (DB + Redis connectivity).

**Phase 2 — Make it safe to expose publicly**
- Secrets management, HTTPS, locked-down CORS.
- Password reset + email verification.
- Automated tests for the core lifecycle (create → plan → approve → generate → edit → restore).

**Phase 3 — Make it pleasant to use at scale**
- Replace polling with WebSocket/SSE push.
- Add usage/cost tracking per user.
- Add search/tagging across a user's blog library.
- Add Alembic migrations and CI/CD.

## 10. Open risks

- **Cost exposure**: nothing currently stops a user from generating an unbounded number of blogs, each triggering multiple LLM calls. This is the top risk before any public launch.
- **Long-lived tokens with no revocation**: a stolen JWT is valid for up to 7 days by default with no way to invalidate it early.
- **No migration tooling**: any schema change to `models.py` after real user data exists will require a manual, carefully-written migration rather than relying on `create_all`.
- **Untested failure path**: the `failed` status and `error_message` field have never actually been triggered in testing, so the real user-facing experience of a failure is unverified.
