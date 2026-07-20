import { Check, Clock3, Code2, FileCheck2, Globe2, LoaderCircle, Quote, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { RealWorkflowProgress } from "@/components/workflow/real-workflow-progress";

interface GenerationSection {
  id: number;
  title: string;
  status: "queued" | "generating" | "validating" | "completed" | "retrying" | "failed";
  target_words: number;
  generated_words?: number | null;
  requires_research?: boolean;
  requires_citations?: boolean;
  requires_code?: boolean;
}

interface WritingBlog {
  id: string;
  title?: string | null;
  topic: string;
  status: string;
  progress: number;
  stage_message?: string | null;
  updated_at: string;
  plan?: { blog_title?: string; tasks?: GenerationSection[] } | null;
  generation_state?: { stage?: string; completed_sections?: number; total_sections?: number; message?: string; sections?: GenerationSection[] } | null;
}

function elapsedLabel(seconds: number) { return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`; }

export function WritingMissionControl({ blog }: { blog: WritingBlog }) {
  const [elapsed, setElapsed] = useState(() => Math.max(0, Math.floor((Date.now() - new Date(blog.updated_at).getTime()) / 1000)));
  useEffect(() => { const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000); return () => window.clearInterval(timer); }, []);
  const editing = blog.status === "queued_for_edit" || blog.status === "editing";
  const stage = editing ? "editing" : blog.generation_state?.stage ?? blog.status;
  const sections = useMemo(() => blog.generation_state?.sections ?? (blog.plan?.tasks ?? []).map((task) => ({ ...task, status: "queued" as const })), [blog.generation_state?.sections, blog.plan?.tasks]);
  const completed = blog.generation_state?.completed_sections ?? sections.filter((section) => section.status === "completed").length;
  const total = blog.generation_state?.total_sections ?? sections.length;
  const message = blog.generation_state?.message || blog.stage_message || (editing ? "Applying the requested refinement" : "Preparing approved sections");
  const activity = sections.filter((section) => section.status !== "queued").slice(-5).reverse();
  const assembling = stage === "assembling" || stage === "validating_article";

  return (
    <section className="q-writing-mission" aria-labelledby="writing-mission-title">
      <header className="q-writing-mission-header"><div><p>WRITING MISSION CONTROL</p><h1 id="writing-mission-title">{editing ? "Refining your article" : "Writing your article"}</h1><span>{editing ? "QuillOps is applying your editorial instruction while preserving the current version." : "QuillOps is generating sections from the plan you approved and assembling them into one consistent draft."}</span></div><div className="q-writing-live"><strong><LoaderCircle className="q-spin" aria-hidden="true" />{editing ? "Refinement active" : stage.replaceAll("_", " ")}</strong><small><Clock3 aria-hidden="true" />{elapsedLabel(elapsed)}</small></div></header>
      <RealWorkflowProgress stage={stage} />
      <div className={`q-writing-overview ${assembling ? "is-assembling" : ""}`}>
        {assembling ? <div className="q-assembly-stack" aria-hidden="true"><span /><span /><span /><i /></div> : <div className="q-writing-energy" aria-hidden="true"><span /><span /><span /></div>}
        <div><p>LIVE WORKFLOW STATE</p><h2>{message}</h2><span>{editing ? "The existing article remains safe until the new version is complete." : `${completed} of ${total || "—"} sections completed`}</span></div>
        <div className="q-writing-progress" role="progressbar" aria-label={`${completed} of ${total} sections complete. ${message}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={blog.progress}><span style={{ width: `${Math.max(0, Math.min(100, blog.progress || 0))}%` }} /></div>
      </div>
      {!editing ? <div className="q-writing-grid-wrap"><div className="q-writing-section-heading"><div><p>PARALLEL SECTION WORKERS</p><h2>Approved outline in production</h2></div><span>{completed}/{total} complete</span></div><div className="q-writing-worker-grid">{sections.map((section, index) => <article key={section.id} className={`is-${section.status}`}><div><span>SECTION {String(index + 1).padStart(2, "0")}</span><strong>{section.status}</strong></div><h3>{section.title}</h3><p>{section.generated_words ? `${section.generated_words} generated` : `${section.target_words} target`} words</p><div className="q-worker-requirements">{section.requires_research ? <span><Globe2 aria-hidden="true" />Research</span> : null}{section.requires_citations ? <span><Quote aria-hidden="true" />Citations</span> : null}{section.requires_code ? <span><Code2 aria-hidden="true" />Code</span> : null}</div><div className="q-worker-state" aria-label={`Status: ${section.status}`}>{section.status === "completed" ? <Check aria-hidden="true" /> : section.status === "failed" ? <ShieldCheck aria-hidden="true" /> : <LoaderCircle className={section.status === "generating" ? "q-spin" : ""} aria-hidden="true" />}</div></article>)}</div></div> : null}
      <aside className="q-writing-activity" aria-labelledby="writing-activity-title"><div><p>SAFE ACTIVITY FEED</p><h2 id="writing-activity-title">What QuillOps is doing</h2></div><ol>{editing ? <li><LoaderCircle className="q-spin" aria-hidden="true" /><span>Applying your focused editorial instruction</span></li> : activity.length ? activity.map((section) => <li key={section.id}>{section.status === "completed" ? <FileCheck2 aria-hidden="true" /> : <LoaderCircle className="q-spin" aria-hidden="true" />}<span>{section.status === "completed" ? `Completed “${section.title}”` : `${section.status} “${section.title}”`}</span></li>) : <li><LoaderCircle className="q-spin" aria-hidden="true" /><span>Preparing section context</span></li>}</ol><p>The job continues safely if you leave this page. Return at any time to see the persisted state.</p></aside>
    </section>
  );
}
