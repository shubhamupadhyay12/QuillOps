import { AlertCircle, CheckCircle2, Circle } from "lucide-react";
import type { ReviewIssue } from "@/lib/review-validation";
import type { ReviewTask } from "@/components/review/types";

interface OutlineNavigatorProps {
  tasks: ReviewTask[];
  issues: ReviewIssue[];
  activeId: number;
  onNavigate: (id: number) => void;
}

export function OutlineNavigator({ tasks, issues, activeId, onNavigate }: OutlineNavigatorProps) {
  const status = (id: number) => {
    const sectionIssues = issues.filter((issue) => issue.sectionId === id);
    return sectionIssues.some((issue) => issue.severity === "error") ? "invalid" : sectionIssues.length ? "warning" : "valid";
  };

  return (
    <nav className="q-outline-navigator" aria-label="Outline sections">
      <div className="q-outline-navigator-title"><span>OUTLINE NAVIGATOR</span><small>{tasks.length} sections</small></div>
      <ol>
        {tasks.map((task, index) => {
          const state = status(task.id);
          return <li key={task.id}><button type="button" className={activeId === task.id ? "is-active" : ""} onClick={() => onNavigate(task.id)} aria-current={activeId === task.id ? "location" : undefined}><span>{String(index + 1).padStart(2, "0")}</span><strong>{task.title || "Untitled section"}</strong><small>{task.target_words}</small>{state === "invalid" ? <AlertCircle aria-label="Invalid" /> : state === "warning" ? <Circle aria-label="Warning" /> : <CheckCircle2 aria-label="Valid" />}</button></li>;
        })}
      </ol>
      <label className="q-outline-mobile-select">Jump to section<select value={activeId} onChange={(event) => onNavigate(Number(event.target.value))}>{tasks.map((task, index) => <option key={task.id} value={task.id}>{String(index + 1).padStart(2, "0")} — {task.title} · {task.target_words} words</option>)}</select></label>
    </nav>
  );
}

