<div align="center">

# ⚡ QuillOps

### *Human-in-the-Loop Technical Publishing Platform Powered by LangGraph & FastAPI*

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Frontend-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Render Backend](https://img.shields.io/badge/Render-FastAPI_API-46E3B7?style=for-the-badge&logo=render)](https://render.com)
[![Supabase DB](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![LangGraph Engine](https://img.shields.io/badge/LangGraph-State_Engine-FF6F61?style=for-the-badge&logo=python)](https://langchain.com)
[![NVIDIA NIM](https://img.shields.io/badge/NVIDIA_NIM-LLM_Inference-76B900?style=for-the-badge&logo=nvidia)](https://build.nvidia.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<br />

[About](#about-quillops) • [Architecture](#system-architecture) • [Why LangGraph?](#why-langgraph) • [Human-in-the-Loop Workflow](#human-in-the-loop-workflow) • [Design Principles](#design-principles) • [Local Development](#local-development) • [Deployment](#production-deployment)

</div>

---

## 📌 Project Snapshot

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite | Single-page application deployed on Vercel Edge CDN |
| **Backend API** | FastAPI (Python 3.12) | Asynchronous REST API service containerized on Render |
| **Workflow Engine** | LangGraph | State machine with human review interrupts and state persistence |
| **Database** | Supabase PostgreSQL | Managed relational storage for users, state, and version history |
| **Execution Engine** | In-Process ThreadPool | Non-blocking background task dispatcher (`EXECUTION_MODE=inprocess`) |
| **Authentication** | JWT + Argon2 | Stateless user authorization and secure password hashing |
| **AI Models** | NVIDIA NIM API | High-performance LLM inference (`langchain-nvidia-ai-endpoints`) |
| **Web Research** | Tavily Search API | Live domain research and context retrieval |
| **Status** | Production Deployed | 100% free Stage 1 cloud architecture active |

---

<a id="about-quillops"></a>
## 💡 About QuillOps

### What is QuillOps?
**QuillOps** is an open-source technical writing platform designed to compile long-form articles (2,800–3,500 words) through a structured, multi-stage pipeline. Instead of generating complete documents in a single unmonitored LLM prompt, QuillOps decomposes content creation into discrete phases: **autonomous web research**, **deterministic outline planning**, **human outline review**, **section-by-section writing**, and **targeted AI refinement**.

### Why Does It Exist?
Generic single-prompt AI generators fail when applied to technical writing:
* **Structural Drift:** LLMs lose coherence and violate target word counts over long context windows.
* **Lack of Human Oversight:** Writers cannot review or steer the outline before AI generates thousands of words.
* **Monolithic Edits:** Making small adjustments requires regenerating the entire article from scratch.
* **Outdated Facts:** Standard LLM completions hallucinate outdated syntax and missing API parameters.

### Who Is It For?
QuillOps is built for **technical writers**, **developer advocates**, **engineering teams**, and **technical bloggers** who require full editorial control over AI-assisted content creation.

---

## 📺 Live Demo

🌐 **Live Application:** https://quill-ops.vercel.app

---

## ✨ Key Features

* 🔍 **Autonomous Technical Research:** Collects documentation, benchmarks, and code snippets via Tavily Search API.
* 📐 **Structured Word Budgeting:** Computes target word allocations across 8–12 dedicated sections for technical depth.
* ⏸️ **Human-in-the-Loop Interruption:** Halts execution at state checkpoints via LangGraph state persistence for complete outline editing and approval.
* ✍️ **Section-by-Section Generation:** Writes articles iteratively to prevent context window degradation and token limit bottlenecks.
* 🪄 **Granular AI Refinement:** Applies natural language instructions (*"Make section 2 more concise"*, *"Add Python code snippets"*) directly to generated content.
* 📚 **Immutable Version Control:** Every edit or restoration creates an immutable version checkpoint (`BlogVersion`) for point-in-time recovery.
* 🔒 **JWT Authentication:** Secure user registration, authentication, and stateless token authorization with Argon2 password hashing.
* 🚀 **Decoupled Architecture:** 100% free production deployment using Vercel (Frontend), Render (FastAPI Docker Backend), and Supabase (PostgreSQL Database).

---

<a id="why-langgraph"></a>
## ⚙️ Why LangGraph?

Traditional LLM chains (e.g., standard LangChain sequences or custom scripts) operate as linear, stateless functions. They execute from start to finish without pausing, making human intervention impossible during execution.

QuillOps selected **LangGraph** because it models workflow execution as a **durable state machine**:

```mermaid
graph LR
    A[State Initialized] --> B[Research Node]
    B --> C[Plan Generator Node]
    C --> D[checkpoint_saver]
    D --> E{Interrupt: Human Review}
    E -- User Approves Plan --> F[Writer Node]
    E -- User Modifies Plan --> C
    F --> G[Completed State]
```

1. **Durable Execution:** State is checkpointed into PostgreSQL at key graph nodes. If the server restarts, execution resumes cleanly.
2. **Interrupt & Resume:** LangGraph natively supports `interrupt()`, halting graph execution when the outline is synthesized and waiting for human input.
3. **State Persistence:** The user can close their browser, log in hours later, inspect the outline, edit word targets, and trigger plan approval without losing graph state.

---

<a id="design-principles"></a>
## 📐 Design Principles

QuillOps adheres to five core software engineering principles:

1. **Human Has Final Control:** AI proposes outlines and drafts, but the human editor holds veto and edit power at every stage.
2. **State is Durable:** Long-running LLM compilation states are persisted in PostgreSQL to protect against process crashes.
3. **Long-Running Operations Are Asynchronous:** API endpoints return `HTTP 202 Accepted` immediately, delegating tasks to process-wide background execution threads (`ThreadPoolExecutor`).
4. **AI Generation Should Be Reviewable:** Outlines, research topics, and drafts are presented in transparent, structured formats before publishing.
5. **Version History is Immutable:** Content modifications append new version records rather than mutating existing text in place.

---

<a id="system-architecture"></a>
## 🏗️ System Architecture

QuillOps decouples presentation, API orchestration, workflow execution, and relational storage.

### Production Topology

```mermaid
graph LR
    subgraph Client Layer
        U[User Browser]
    end

    subgraph CDN Layer
        V[Vercel SPA<br/>React + Vite]
    end

    subgraph Backend Engine - Render
        F[FastAPI Server]
        D[Execution Dispatcher]
        W[ThreadPool Worker]
    end

    subgraph Workflow Engine
        LG[LangGraph StateGraph]
    end

    subgraph Persistence - Supabase
        DB[(PostgreSQL Database)]
    end

    subgraph External APIs
        NV[NVIDIA NIM LLM]
        TV[Tavily Search]
    end

    U -->|HTTPS| V
    V -->|REST API| F
    F --> D
    D -->|Async Submit| W
    W --> LG
    LG -->|Checkpoints| DB
    LG -->|LLM Prompts| NV
    LG -->|Web Queries| TV
    W -->|Save Blogs & Versions| DB
    V -->|Poll GET /blogs/id| F
```

---

## 🧩 Component Architecture

```mermaid
graph TD
    subgraph Frontend Components React
        AUTH[Auth Page / Sign In]
        DASH[Dashboard Overview]
        PLAN[Planning Visualizer]
        REV[Review Workspace]
        WRITE[Writing Mission Control]
        HIST[Version History Drawer]
    end

    subgraph Backend Services FastAPI
        ROUTER[API Routers]
        MIDDLEWARE[JWT Auth Middleware]
        DISPATCHER[Task Dispatcher]
        JOBS[Job Operations Engine]
    end

    subgraph Core Graph LangGraph
        NODE_RES[Research Node]
        NODE_PLAN[Planner Node]
        NODE_GATE[Human Interrupt Gate]
        NODE_WRITE[Section Writer Node]
        NODE_EDIT[AI Refiner Node]
    end

    subgraph Storage & External Services
        POSTGRES[(Supabase Postgres)]
        LLM[NVIDIA NIM API]
        SEARCH[Tavily Search API]
    end

    AUTH --> MIDDLEWARE
    DASH --> ROUTER
    REV --> ROUTER
    WRITE --> ROUTER
    HIST --> ROUTER

    ROUTER --> MIDDLEWARE
    MIDDLEWARE --> DISPATCHER
    DISPATCHER --> JOBS
    JOBS --> NODE_RES
    JOBS --> NODE_PLAN
    JOBS --> NODE_GATE
    JOBS --> NODE_WRITE
    JOBS --> NODE_EDIT

    NODE_RES --> SEARCH
    NODE_PLAN --> LLM
    NODE_WRITE --> LLM
    NODE_EDIT --> LLM

    JOBS --> POSTGRES
    NODE_GATE --> POSTGRES
```

---

<a id="human-in-the-loop-workflow"></a>
## 🔄 Human-in-the-Loop Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Editor as Human Editor
    participant FE as Vercel React Frontend
    participant API as Render FastAPI API
    participant DISP as Dispatcher
    participant LG as LangGraph Engine
    participant DB as Supabase Postgres

    Editor->>FE: Enter Blog Topic
    FE->>API: POST /blogs { topic }
    API-->>FE: HTTP 202 Accepted (status: queued)
    API->>DISP: dispatch(run_start_generation_job)
    DISP->>LG: Execute Research & Planning Node
    LG->>DB: Save Interrupt Checkpoint
    DISP->>DB: Update Blog (status: waiting_for_review, plan JSON)

    loop Polling Status
        FE->>API: GET /blogs/{id}
        API-->>FE: Return Blog (status: waiting_for_review, plan)
    end

    FE->>Editor: Render Interactive Outline Review Workspace
    Editor->>FE: Modify Word Budgets / Reorder & Click Approve
    FE->>API: POST /blogs/{id}/approve-plan { plan }
    API-->>FE: HTTP 202 Accepted (status: queued_for_generation)
    API->>DISP: dispatch(run_resume_generation_job)
    DISP->>LG: Resume Section Writing Flow
    LG->>LG: Generate Sections 1..N
    LG->>DB: Save Completed Article & Create Version 1
    DISP->>DB: Update Status: completed
```

---

## 🧠 Software Engineering Challenges Solved

Building QuillOps involved solving critical full-stack engineering problems:

1. **Decoupling HTTP Requests from Long-Running Workflows:** LLM compilation runs for 30–60 seconds. Blocking HTTP requests causes gateway timeouts on cloud providers (e.g. Render HTTP 504). QuillOps implements a non-blocking `ThreadPoolExecutor` dispatcher that returns `HTTP 202 Accepted` immediately, allowing client frontend polling.
2. **Database Driver Compatibility:** Render environment URLs utilize standard `postgresql://` parameters while SQLAlchemy psycopg v3 expects `postgresql+psycopg://`. QuillOps implements a unified normalization helper (`database.py`) ensuring both SQLAlchemy and raw `psycopg` checkpointers connect cleanly.
3. **Preventing Double Execution:** Frontend polling can inadvertently trigger duplicate background runs. The dispatcher tracks active jobs in a thread-safe registry to prevent duplicate executions.
4. **Vercel & Render Frontend-Backend Separation:** Eliminates monolithic static file mounting, running Vercel for SPA edge delivery and Render solely as a containerized FastAPI service.

---

## 📁 Folder Structure

```
QuillOps/
├── main.py                     # FastAPI application routes & REST endpoints
├── jobs.py                     # Background execution jobs (Research, Plan, Write, Edit)
├── dispatcher.py               # Dual-mode execution dispatcher (inprocess ThreadPool / celery)
├── backend.py                  # LangGraph agent pipelines, prompts & checkpointer setup
├── database.py                 # SQLAlchemy engine, sessions & URL normalization
├── models.py                   # Relational ORM models (User, Blog, BlogVersion)
├── schemas.py                  # Pydantic request/response validation schemas
├── auth.py                     # JWT token handling & Argon2 password hashing
├── tasks.py                    # Celery task wrappers (retained for Stage 2 Redis scale-out)
├── Dockerfile                  # Container build specification for FastAPI backend
├── vercel.json                 # Vercel deployment & SPA routing rewrites configuration
├── vite.config.ts              # Vite production bundler configuration (root: frontend)
├── frontend/                   # React Single Page Application
│   ├── index.html              # HTML entry point
│   ├── styles.css              # Main stylesheet
│   ├── js/                     # Client-side hash router & view renderers
│   └── src/                    # React TSX components (Review, Auth, Article, Workflow)
└── tests/                      # Automated Test Suite (Python unittest + Node test)
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | Component UI framework and fast production bundling |
| **Styling** | Vanilla CSS, Tailwind CSS | Dark-mode design system, glassmorphism, micro-animations |
| **Hosting (FE)** | Vercel | Global CDN deployment for static SPA assets |
| **Backend API** | FastAPI (Python 3.12) | Asynchronous REST API framework with OpenAPI schema support |
| **Workflow Engine** | LangGraph, LangChain Core | State machine orchestration, checkpointing, and interrupts |
| **LLM Provider** | NVIDIA NIM API | High-performance LLM inference (`langchain-nvidia-ai-endpoints`) |
| **Web Search** | Tavily Search API | Live domain research and technical documentation retrieval |
| **Database** | Supabase PostgreSQL, SQLAlchemy 2.0 | Managed relational storage for users, blogs, and version trees |
| **PostgreSQL Driver**| Psycopg 3 (`psycopg[binary]`) | Python DB-API driver supporting sync and async database operations |
| **Dispatcher** | In-Process ThreadPool / Celery | Asynchronous background execution engine |
| **Hosting (BE)** | Render (Docker Service) | Containerized FastAPI web service hosting |

---

## 🔑 Environment Variables

### Backend Configuration (`Render` / `.env`)

| Variable | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `EXECUTION_MODE` | **Yes** | Background task mode (`inprocess` or `celery`) | `inprocess` |
| `INPROCESS_MAX_WORKERS` | No | Max background execution threads | `2` |
| `DATABASE_URL` | **Yes** | Supabase PostgreSQL connection URI | `postgresql://postgres:[pass]@db.[ref].supabase.co:5432/postgres?sslmode=require` |
| `JWT_SECRET` | **Yes** | Secret key for JWT token signing | `your_production_secret_key` |
| `NVIDIA_API_KEY` | **Yes** | API key for NVIDIA NIM LLM endpoints | `nvapi-...` |
| `TAVILY_API_KEY` | **Yes** | API key for Tavily AI Web Search | `tvly-...` |
| `CORS_ALLOWED_ORIGINS` | **Yes** | Allowed CORS frontend origins | `https://quillops.vercel.app` |

### Frontend Configuration (`Vercel` / `.env`)

| Variable | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `VITE_API_BASE_URL` | **Yes** | Public HTTP base URL of the Render backend | `https://quillops-api.onrender.com` |

---

## 📡 API Overview

| Method | Route | Description | Auth | Response |
| :---: | :--- | :--- | :---: | :---: |
| `GET` | `/` | Service identification endpoint | No | `200 OK` |
| `GET` | `/health` | Uptime health check | No | `200 OK` |
| `POST` | `/auth/register` | Register new user account | No | `200 OK` |
| `POST` | `/auth/login` | Authenticate user credentials | No | `200 OK` |
| `GET` | `/auth/me` | Fetch user profile | **Yes** | `200 OK` |
| `POST` | `/blogs` | Create blog & trigger research/planning | **Yes** | `202 Accepted` |
| `GET` | `/blogs` | List user blogs | **Yes** | `200 OK` |
| `GET` | `/blogs/{id}` | Fetch blog detail & current progress | **Yes** | `200 OK` |
| `POST` | `/blogs/{id}/approve-plan` | Approve outline & start article writing | **Yes** | `202 Accepted` |
| `POST` | `/blogs/{id}/retry-planning` | Re-run outline planning step | **Yes** | `202 Accepted` |
| `POST` | `/blogs/{id}/retry-writing` | Re-run section writing step | **Yes** | `202 Accepted` |
| `POST` | `/blogs/{id}/ai-edit` | Submit AI content refinement instruction | **Yes** | `202 Accepted` |
| `GET` | `/blogs/{id}/versions` | Fetch immutable version history | **Yes** | `200 OK` |
| `POST` | `/blogs/{id}/restore/{v_id}` | Restore historic version as current draft | **Yes** | `200 OK` |

---

<a id="local-development"></a>
## 💻 Local Development

### 1. Environment Setup
```bash
git clone https://github.com/shubhamupadhyay12/QuillOps.git
cd QuillOps
cp .env.example .env
```

### 2. Backend Setup
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### 3. Frontend Setup
```bash
npm install
npm run dev
```
Open `http://localhost:4173` in your browser.

---

<a id="production-deployment"></a>
## 🚢 Production Deployment

```mermaid
graph LR
    subgraph Vercel CDN
        FE[React SPA]
    end
    subgraph Render Web Service
        BE[FastAPI Docker Container]
    end
    subgraph Supabase Cloud
        DB[(PostgreSQL)]
    end

    FE -->|VITE_API_BASE_URL| BE
    BE -->|DATABASE_URL| DB
```

### Why Decouple Frontend & Backend?
1. **Independent Deployment Lifecycle:** Updating UI components on Vercel takes seconds without restarting the backend engine.
2. **Global Edge Performance:** Static React assets are cached across Vercel Edge CDNs, while FastAPI runs in a dedicated container near the database.
3. **Resource Isolation:** High CPU/memory LLM operations on Render cannot block static asset delivery.

### Deployment Steps
1. **Supabase:** Provision a free PostgreSQL database and copy the connection string.
2. **Render:** Deploy a Web Service linked to the repository Dockerfile. Add environment variables (`DATABASE_URL`, `NVIDIA_API_KEY`, `TAVILY_API_KEY`, `JWT_SECRET`, `EXECUTION_MODE=inprocess`).
3. **Vercel:** Import the repository, set output directory to `frontend/dist`, and configure `VITE_API_BASE_URL` to your Render API URL.

---

## 🧪 Testing & Validation

```bash
# Run backend Python tests
set DATABASE_URL=sqlite:///./test.db
set EXECUTION_MODE=inprocess
python -m unittest discover tests -p "test_*.py"

# Run frontend Node tests
node --test tests/*.test.mjs

# Run frontend linting
npm run lint

# Build production assets and test SPA routing
npm run build
python tests/test_spa_routing.py
```

---

## 🔮 Future Roadmap

```mermaid
graph LR
    subgraph Current Stage 1
        S1[In-Process ThreadPool<br/>Supabase PostgreSQL<br/>FastAPI + React]
    end
    subgraph Next Stage 2
        S2[Redis Queue<br/>Celery Workers<br/>Response Caching<br/>Prometheus Observability]
    end
    subgraph Future Stage 3
        S3[Kubernetes Autoscaling<br/>Multi-Agent Research<br/>RAG Knowledge Base<br/>Team Workspace RBAC]
    end

    S1 --> S2 --> S3
```

* **Current (Stage 1):** Production deployment on Render + Vercel + Supabase, Human-in-the-loop plan reviews, and immutable version control.
* **Next (Stage 2):** Redis task queues, dedicated Celery worker pool (`EXECUTION_MODE=celery`), prompt caching, and Prometheus/OpenTelemetry metrics.
* **Future (Stage 3):** Multi-agent deep research graph, local vector database RAG integration, team collaboration, and automated social distribution scheduling.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for details.

---

## 👨‍💻 Author

**Shubham Upadhyay**
* GitHub: [@shubhamupadhyay12](https://github.com/shubhamupadhyay12)
* LinkedIn: [Shubham Upadhyay](https://www.linkedin.com/in/shubhamupadhyay25/)

---

<div align="center">
  <sub>Built using LangGraph, FastAPI, React, NVIDIA NIM, and Supabase.</sub>
</div>
