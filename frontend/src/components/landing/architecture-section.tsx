import { ArrowDown, CheckCircle2, Cpu, Database, Server, Workflow } from "lucide-react";

const graphNodes = ["Router", "Research", "Planner", "Human Review", "Writer", "Reducer"];

export function ArchitectureSection() {
  return (
    <section className="q-section q-architecture-section" id="architecture" aria-labelledby="architecture-title">
      <div className="q-shell q-architecture-grid">
        <div className="q-architecture-copy">
          <p className="q-eyebrow">VISIBLE BY DESIGN</p>
          <h2 id="architecture-title">A real workflow,<br />not a hidden prompt.</h2>
          <p>QuillOps makes the orchestration legible—from HTTP request to durable state. Each system does one job, and the review boundary stays explicit.</p>
          <div className="q-architecture-note"><CheckCircle2 aria-hidden="true" /><span><strong>Durable by construction.</strong><br />Application data and workflow checkpoints survive beyond a single process.</span></div>
        </div>
        <div className="q-architecture-map" aria-label="QuillOps system architecture">
          <div className="q-arch-node"><Server aria-hidden="true" /><span><strong>FastAPI</strong><small>API + authentication</small></span></div>
          <ArrowDown className="q-arch-arrow" aria-hidden="true" />
          <div className="q-arch-node"><Cpu aria-hidden="true" /><span><strong>In-Process Dispatcher</strong><small>ThreadPoolExecutor background execution</small></span></div>
          <ArrowDown className="q-arch-arrow" aria-hidden="true" />
          <div className="q-langgraph-box">
            <div className="q-langgraph-title"><Workflow aria-hidden="true" /><span><strong>LangGraph</strong><small>Stateful orchestration</small></span></div>
            <div className="q-graph-nodes">
              {graphNodes.map((node, index) => <span key={node} className={node === "Human Review" ? "is-human" : ""}>{String(index + 1).padStart(2, "0")} · {node}</span>)}
            </div>
          </div>
          <ArrowDown className="q-arch-arrow" aria-hidden="true" />
          <div className="q-arch-node"><Database aria-hidden="true" /><span><strong>Supabase PostgreSQL</strong><small>Content, versions, users, and workflow checkpoints</small></span></div>
        </div>
      </div>
    </section>
  );
}
