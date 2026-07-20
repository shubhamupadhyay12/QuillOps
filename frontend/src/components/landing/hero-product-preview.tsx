import { Check, Circle, GripVertical } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { DemoApprovalButton } from "@/components/landing/demo-approval-button";

const pipeline = [
  ["Routing", "done"], ["Research", "done"], ["Planning", "done"],
  ["Review", "current"], ["Writing", "pending"], ["Final assembly", "pending"],
] as const;

export function HeroProductPreview() {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className="q-product-preview"
      initial={reducedMotion ? false : { opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: reducedMotion ? 0 : 0.65 }}
      aria-label="Example QuillOps plan review workspace"
    >
      <div className="q-preview-topbar">
        <div>
          <span className="q-kicker">BLOG</span>
          <h2>Building Reliable LangGraph Agents</h2>
        </div>
        <span className="q-status-pill"><span aria-hidden="true" />Waiting for review</span>
      </div>
      <div className="q-preview-grid">
        <div className="q-preview-pipeline">
          <p className="q-preview-label">PIPELINE</p>
          <ol>
            {pipeline.map(([label, state]) => (
              <li key={label} className={`is-${state}`}>
                {state === "done" ? <Check aria-label="Complete" /> : <Circle aria-label={state === "current" ? "Current step" : "Not started"} />}
                <span>{label}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="q-outline-preview">
          <div className="q-outline-heading">
            <div><p className="q-preview-label">OUTLINE PREVIEW</p><p>4 sections · ~1,800 words</p></div>
            <span>Editable</span>
          </div>
          <ol>
            {["Why reliability matters", "Durable execution", "Human approval checkpoints", "Failure recovery patterns"].map((item, index) => (
              <li key={item}><GripVertical aria-hidden="true" /><span className="q-outline-number">0{index + 1}</span><span>{item}</span></li>
            ))}
          </ol>
          <div className="q-preview-footer">
            <p><span aria-hidden="true" />Generation is paused at a durable checkpoint.</p>
            <DemoApprovalButton compact label="Approve plan" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
