import { AlertTriangle, Check } from "lucide-react";
import { getConnectorState, type WorkflowVisualState } from "@/lib/workflow-progress";

const stages = ["Route", "Research", "Plan", "Review", "Write", "Assemble", "Refine"] as const;

function statesFor(stage: string, failed = false): WorkflowVisualState[] {
  const activeIndex = stage === "assembling" || stage === "validating_article" ? 5 : stage === "editing" || stage === "queued_for_edit" ? 6 : stage === "completed" ? 6 : 4;
  return stages.map((_, index) => {
    if (failed && index === activeIndex) return "failed";
    if (stage === "completed") return "complete";
    return index < activeIndex ? "complete" : index === activeIndex ? "active" : "pending";
  });
}

export function RealWorkflowProgress({ stage, failed = false }: { stage: string; failed?: boolean }) {
  const states = statesFor(stage, failed);
  return (
    <ol className="q-real-workflow-progress" aria-label="Real workflow progress">
      {stages.map((label, index) => {
        const state = states[index];
        return <li key={label} className={`is-${state}`} aria-label={`${label}: ${state}`}>
          <div className="q-real-marker-wrap"><span className="q-real-marker" aria-hidden="true">{state === "complete" ? <Check /> : state === "failed" ? <AlertTriangle /> : String(index + 1).padStart(2, "0")}</span>{index < stages.length - 1 ? <span className={`q-real-connector is-${getConnectorState(state, states[index + 1])}`} /> : null}</div>
          <span><strong>{label}</strong><small>{state}</small></span>
        </li>;
      })}
    </ol>
  );
}

