# QuillOps Frontend — Technical Requirements Document

**Audience:** An AI coding agent (or developer) building the frontend against the existing QuillOps backend.
**Stack:** Intentionally framework-agnostic. Pick any framework (React, Vue, Svelte, plain JS, etc.) that satisfies the requirements below.
**Backend status:** Fully implemented and manually verified end-to-end. This document describes what the frontend must do to use it correctly — it does not describe backend work.

---

## 1. Purpose

Build a web client for QuillOps: a service where a user submits a blog topic, an AI plans an outline, the user reviews/edits and approves that outline, the AI writes the full post in the background, and the result is saved permanently, editable, and versioned.

The frontend's job is to make the state machine underneath (see §5) legible and pleasant — most of the complexity here is in handling asynchronous status, not in visual design.

## 2. Backend connection details

- Base URL: configurable via environment variable (e.g., `VITE_API_BASE_URL` or equivalent for the chosen framework), defaulting to `http://localhost:8000` for local development.
- Auth scheme: **Bearer JWT**. No cookies, no sessions — every authenticated request must include:
  ```
  Authorization: Bearer <token>
  ```
- CORS: the backend's `ALLOWED_ORIGINS` env var must include whatever origin the frontend is served from (already defaults to `http://localhost:3000` for local dev — confirm your dev server's port matches, or update the backend `.env`).
- Content type: all requests/responses are `application/json` except none — there is no file upload in this API.

## 3. Authentication requirements

- **Token storage**: store the JWT client-side (e.g., in memory + `sessionStorage`/`localStorage`, or a state management store). There is no backend session — losing the token means the user must log in again. Note the tradeoff: `localStorage` persists across tabs/reloads but is more exposed to XSS; document whichever choice is made.
- **Token expiry**: tokens last 7 days by default (`ACCESS_TOKEN_MINUTES=10080`). The frontend must handle a `401 Unauthorized` response on *any* authenticated call by clearing the stored token and redirecting to login — there is no refresh-token flow to fall back on.
- **No logout endpoint exists** — "logging out" is purely a client-side action (delete the stored token, redirect to login).
- Required screens: **Register** and **Login**, both simple email + password forms. Password must be ≥8 characters (enforced server-side, `422` if violated — surface the validation error to the user).

## 4. Full API contract

### 4.1 `POST /auth/register`
No auth required.
```json
// Request
{ "email": "string", "password": "string (min 8 chars)" }

// Response 201
{ "access_token": "string", "token_type": "bearer" }

// Response 409 — email already registered
{ "detail": "An account already exists." }
```

### 4.2 `POST /auth/login`
No auth required.
```json
// Request
{ "email": "string", "password": "string" }

// Response 200
{ "access_token": "string", "token_type": "bearer" }

// Response 401 — wrong credentials
{ "detail": "Incorrect email or password." }
```

### 4.3 `POST /blogs`
Auth required.
```json
// Request
{ "topic": "string (5-500 chars)" }

// Response 202
{
  "id": "uuid",
  "topic": "string",
  "title": null,
  "content": "",
  "status": "queued",
  "plan": null,
  "evidence": null,
  "error_message": null,
  "current_version": 0,
  "created_at": "ISO 8601",
  "updated_at": "ISO 8601"
}
```
This call returns *immediately* — generation happens in the background. The frontend must transition into a polling view right after this call succeeds.

### 4.4 `GET /blogs`
Auth required. Query param `limit` (default 50, max 100).
```json
// Response 200 — array, sorted by most recently updated first
[
  {
    "id": "uuid",
    "topic": "string",
    "title": "string | null",
    "status": "string",
    "current_version": 0,
    "created_at": "ISO 8601",
    "updated_at": "ISO 8601"
  }
]
```
Note this list variant does **not** include `content`, `plan`, or `evidence` — use `GET /blogs/{id}` for the full object.

### 4.5 `GET /blogs/{blog_id}`
Auth required. Returns the full object shown in §4.3, with current values. This is the endpoint to poll.

### 4.6 `DELETE /blogs/{blog_id}`
Auth required. Response `204 No Content` on success, `404` if not found or not owned by the caller.

### 4.7 `POST /blogs/{blog_id}/approve-plan`
Auth required. Only valid when `status === "waiting_for_review"`; otherwise `409`.
```json
// Request — the full plan object, edited or as-is
{
  "plan": {
    "blog_title": "string",
    "audience": "string",
    "tone": "string",
    "blog_kind": "explainer | tutorial | news_roundup | comparison | system_design",
    "constraints": ["string"],
    "tasks": [
      {
        "id": 1,
        "title": "string",
        "goal": "string",
        "bullets": ["string", "string", "string"],
        "target_words": 300,
        "tags": ["string"],
        "requires_research": false,
        "requires_citations": false,
        "requires_code": false
      }
    ]
  }
}

// Response 202 — the updated Blog object, status now "queued_for_generation"
```
**Important for the plan-editor UI**: `tasks` must have between 5 and 9 entries, each `bullets` array must have 3–6 entries, and `target_words` must be between 120 and 550. If the frontend allows free editing of the plan, validate these bounds client-side before submitting, since the backend will reject an out-of-bounds plan with a `422`.

### 4.8 `PUT /blogs/{blog_id}` (manual edit)
Auth required. Only valid when `status` is `"completed"` or `"failed"`; otherwise `409` — `"Blog is currently busy."`
```json
// Request
{ "content": "string (1-200000 chars)", "instruction": "string | null, optional label for this edit" }

// Response 200 — updated Blog object, status "completed", current_version incremented
```
This is synchronous — no polling needed, the response already reflects the change.

### 4.9 `POST /blogs/{blog_id}/ai-edit`
Auth required. Only valid when `status === "completed"` **and** `content` is non-empty; otherwise `409` — `"A completed blog is required."`
```json
// Request
{ "instruction": "string (3-1000 chars)" }

// Response 202 — status becomes "queued_for_edit"
```
This is asynchronous — resume polling `GET /blogs/{blog_id}` after this call. Status will move `queued_for_edit → editing → completed`.

### 4.10 `GET /blogs/{blog_id}/versions`
Auth required.
```json
// Response 200 — array, newest version first
[
  {
    "id": "uuid",
    "version_number": 2,
    "content": "string",
    "edit_instruction": "string | null",
    "created_at": "ISO 8601"
  }
]
```

### 4.11 `POST /blogs/{blog_id}/restore/{version_id}`
Auth required.
```json
// No request body
// Response 200 — updated Blog object; content replaced, current_version incremented,
// AND a new version row is created (restoring is itself a new, reversible version)
```

## 5. Status state machine the UI must represent

```
queued → planning → waiting_for_review → queued_for_generation → generating → completed
                                                                                    ↕
                                                                    queued_for_edit → editing → completed
(any state) → failed
```

The frontend must render a distinct, clear UI state for **each** of these statuses — do not collapse them into a generic "loading" spinner, since the user needs to know *what* is happening (e.g., "AI is planning your outline" vs. "AI is writing your sections" vs. "waiting on you to approve the plan").

| Status | What the UI should show |
|---|---|
| `queued` | "Your blog is queued, starting shortly." |
| `planning` | "AI is researching and outlining your post." |
| `waiting_for_review` | **Action required.** Show the Plan Review screen (§6.4). Stop auto-polling once here, or reduce frequency — this state can persist indefinitely until the user acts. |
| `queued_for_generation` | "Plan approved, starting to write." |
| `generating` | "AI is writing your sections." (can take 1-several minutes) |
| `completed` | Show the rendered blog (§6.5). |
| `queued_for_edit` | "Your edit instruction is queued." |
| `editing` | "AI is applying your edit." |
| `failed` | Show `error_message` to the user plainly, with an option to retry (e.g., delete and recreate) — there is no "resume from failure" endpoint. |

## 6. Required screens/views

### 6.1 Register / Login
Simple forms. On success, store the token and redirect to the blog list. Surface `409`/`401`/`422` errors inline, not as raw JSON.

### 6.2 Blog list (dashboard)
Calls `GET /blogs`. Show each blog's `topic` (or `title` once set), `status` (as a readable badge, not the raw string), and `updated_at`. Include a "New blog" action leading to §6.3, and a delete action per row (`DELETE /blogs/{id}`, with a confirmation prompt since it's irreversible — versions are deleted along with the blog).

### 6.3 Create blog
A single text input for `topic` (5–500 chars, validate client-side to match backend), submits to `POST /blogs`, then immediately navigates to the blog detail view (§6.4) in its polling state.

### 6.4 Blog detail / status view
This is the core screen — it must handle every status in §5. Concretely:

- **Polling**: while `status` is one of `queued`, `planning`, `queued_for_generation`, `generating`, `queued_for_edit`, `editing`, poll `GET /blogs/{id}` on an interval (recommend 3–5 seconds; do not poll faster than every 2 seconds). Stop polling once `status` is `completed`, `failed`, or `waiting_for_review` (the latter needs user action, not more polling — though a light poll, e.g., every 15s, is reasonable in case the state changes from another session).
- **Plan review sub-view** (when `waiting_for_review`): render `plan.tasks` as an editable list — each task's `title`, `goal`, `bullets` (array of strings, addable/removable within the 3–6 bound), and `target_words` (bounded 120–550) should be editable fields, not raw JSON. Also allow editing `plan.blog_title`, `plan.audience`, `plan.tone`, and `plan.constraints`. Provide an "Approve" action that sends the full (possibly edited) plan object to `POST /blogs/{id}/approve-plan`. Client-side validate the bounds in §4.7 before submitting to avoid a round-trip `422`.
- **Failed sub-view**: show `error_message` verbatim in a readable format, with a clear explanation that this blog cannot be resumed and the user should create a new one.

### 6.5 Completed blog view
Render `content` as rendered Markdown (not raw text) — use a standard, well-maintained Markdown renderer with **sanitization enabled**, since this content originates from an LLM and should not be trusted implicitly for raw HTML injection. Provide:
- A manual edit action (opens an editable text/Markdown area, submits via `PUT /blogs/{id}`).
- An AI edit action (opens a single-line instruction input, submits via `POST /blogs/{id}/ai-edit`, then transitions back into the polling view for `queued_for_edit`/`editing`).
- A "Version history" action leading to §6.6.

### 6.6 Version history
Calls `GET /blogs/{id}/versions`. List each version with `version_number`, `edit_instruction` (or "Original AI generation" fallback if null), and `created_at`. Each entry should allow:
- Viewing that version's `content` (read-only).
- Restoring it (`POST /blogs/{id}/restore/{version_id}`), with a confirmation prompt since it changes the live content (though non-destructively — it creates yet another version).

## 7. Data contracts (for typed frontends)

```typescript
type BlogStatus =
  | "queued" | "planning" | "waiting_for_review"
  | "queued_for_generation" | "generating" | "completed"
  | "queued_for_edit" | "editing" | "failed";

interface Task {
  id: number;
  title: string;
  goal: string;
  bullets: string[]; // 3-6 items
  target_words: number; // 120-550
  tags: string[];
  requires_research: boolean;
  requires_citations: boolean;
  requires_code: boolean;
}

interface Plan {
  blog_title: string;
  audience: string;
  tone: string;
  blog_kind: "explainer" | "tutorial" | "news_roundup" | "comparison" | "system_design";
  constraints: string[];
  tasks: Task[]; // 5-9 items
}

interface EvidenceItem {
  title: string;
  url: string;
  published_at: string | null;
  snippet: string | null;
  source: string | null;
}

interface Blog {
  id: string;
  topic: string;
  title: string | null;
  content: string;
  status: BlogStatus;
  plan: Plan | null;
  evidence: EvidenceItem[] | null;
  error_message: string | null;
  current_version: number;
  created_at: string;
  updated_at: string;
}

interface BlogListItem {
  id: string;
  topic: string;
  title: string | null;
  status: BlogStatus;
  current_version: number;
  created_at: string;
  updated_at: string;
}

interface BlogVersion {
  id: string;
  version_number: number;
  content: string;
  edit_instruction: string | null;
  created_at: string;
}

interface TokenResponse {
  access_token: string;
  token_type: "bearer";
}
```

## 8. Error handling requirements

The frontend must not display raw JSON error bodies to the user. Every error response follows FastAPI's shape — either:
```json
{ "detail": "string message" }
```
or, for validation errors (`422`):
```json
{ "detail": [{ "loc": [...], "msg": "string", "type": "string" }] }
```
Map known status codes to friendly messages:
- `401` → session expired, redirect to login.
- `404` → resource not found (or not owned by this user — the backend deliberately returns 404 rather than 403 for ownership mismatches, do not imply otherwise in the UI).
- `409` → the specific `detail` message describes a state conflict (e.g., trying to edit a blog mid-generation) — show it as-is, it's already human-readable.
- `422` → surface field-level validation messages near the relevant form fields where possible.
- `5xx` → generic "something went wrong, try again" message.

## 9. Non-functional requirements

- **Responsive**: must work on both desktop and mobile viewport widths — this is a content-heavy app (long-form Markdown), so typography and reading width matter more than dense dashboards.
- **Loading states**: every async action (including polling transitions) needs a visible, non-jarring loading indicator — avoid layout shift when status changes.
- **Accessibility**: forms need labeled inputs, status changes should be announced to screen readers (e.g., `aria-live` region for status updates during polling), sufficient color contrast on status badges.
- **No local business logic duplication of AI behavior**: the frontend should not attempt to simulate or predict AI output — it only reflects backend state.
- **Environment-based config**: API base URL must be configurable at build/deploy time, not hardcoded.

## 10. Explicitly out of scope for the frontend (do not build)

- Any direct calls to NVIDIA or Tavily — the frontend never talks to AI providers directly, only to the QuillOps backend.
- Token refresh logic — no refresh endpoint exists; expired tokens simply require re-login.
- Offline support / local caching of blog content beyond normal browser behavior.
- Real-time collaboration or multi-cursor editing.
- Publishing/export integrations (PDF, CMS, social) — content is Markdown text only, in-app.

## 11. Open questions for whoever builds this (flag to the user, don't guess)

- Preferred visual/branding direction (colors, typography, logo) — none specified yet.
- Whether polling frequency of 3-5s is acceptable, or whether a future WebSocket/SSE upgrade is expected soon (would change how the status-watching logic is structured, e.g., via an abstraction that could later swap polling for a subscription).
- Whether `localStorage` vs. in-memory-only token storage is the intended security tradeoff for this deployment.
