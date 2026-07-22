import { Braces, Cpu, GitBranch } from "lucide-react";

const stack = [
  "React + Vite",
  "FastAPI",
  "In-Process Dispatcher",
  "LangGraph",
  "Supabase PostgreSQL",
  "NVIDIA NIM + Tavily",
];

export function AboutSection() {
  return (
    <section className="q-section q-about-section" id="about" aria-labelledby="about-title">
      <div className="q-shell q-about-grid">
        <div className="q-section-intro q-section-intro-left">
          <p className="q-eyebrow">ABOUT QUILLOPS</p>
          <h2 id="about-title">Built for transparent AI collaboration.</h2>
          <p>QuillOps is a human-in-the-loop technical writing system designed and developed by Shubham Upadhyay. It makes research, planning, approval, generation and revision visible instead of hiding the entire process behind one prompt.</p>
        </div>
        <div className="q-about-system" aria-label="QuillOps technology stack">
          <div className="q-about-system-head"><Cpu aria-hidden="true" /><span><small>SYSTEM PROFILE</small><strong>Durable by design</strong></span></div>
          <div className="q-about-stack">{stack.map((item, index) => <span key={item}><small>{String(index + 1).padStart(2, "0")}</small>{item}</span>)}</div>
          <div className="q-about-system-foot"><Braces aria-hidden="true" />Inspectable stages <GitBranch aria-hidden="true" />Recoverable revisions</div>
        </div>
      </div>
    </section>
  );
}
