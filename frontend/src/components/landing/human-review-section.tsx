import { Check, GripVertical, PencilLine, RotateCcw } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { DemoApprovalButton, type DemoApprovalState } from "@/components/landing/demo-approval-button";

const reviewItems = [
  ["01", "The reliability problem", "Set the stakes and define durable execution."],
  ["02", "Checkpointing state", "Explain state persistence and recovery boundaries."],
  ["03", "Approval before side effects", "Place the human checkpoint before generation."],
] as const;

export function HumanReviewSection() {
  const reducedMotion = useReducedMotion();
  const [approvalState, setApprovalState] = useState<DemoApprovalState>("idle");
  return (
    <section className="q-section q-control-section" id="product" aria-labelledby="control-title">
      <div className="q-shell q-control-grid">
        <div className="q-control-copy">
          <p className="q-eyebrow">A DURABLE HUMAN CHECKPOINT</p>
          <h2 id="control-title">AI moves fast.<br />You keep control.</h2>
          <p className="q-lede">QuillOps stops after planning—not after it has already made every editorial decision.</p>
          <ul className="q-control-points">
            <li><Check aria-hidden="true" /><span><strong>Generation pauses before writing.</strong> Review the exact structure first.</span></li>
            <li><PencilLine aria-hidden="true" /><span><strong>Edit the outline directly.</strong> Reorder sections and sharpen intent.</span></li>
            <li><RotateCcw aria-hidden="true" /><span><strong>Resume from the checkpoint.</strong> The workflow continues without starting over.</span></li>
          </ul>
        </div>
        <motion.div
          className={`q-review-card is-${approvalState}`}
          initial={reducedMotion ? false : { opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
        >
          <div className="q-review-card-top">
            <div><span className="q-kicker">PLAN REVIEW</span><h3>Reliable agents in production</h3></div>
            <span className={`q-status-pill is-${approvalState}`}><span aria-hidden="true" />{approvalState === "idle" || approvalState === "approving" ? "Action required" : approvalState === "approved" ? "Approved" : "Writing"}</span>
          </div>
          <div className="q-review-meta"><span>Audience · Platform engineers</span><span>Tone · Technical</span></div>
          <div className="q-review-items">
            {reviewItems.map(([number, title, description]) => (
              <div className="q-review-item" key={number}>
                <GripVertical aria-hidden="true" /><span>{number}</span><div><h4>{title}</h4><p>{description}</p></div><PencilLine aria-label={`Edit ${title}`} />
              </div>
            ))}
          </div>
          <div className="q-review-bottom">
            <p><span aria-hidden="true" />Checkpoint saved <span>just now</span></p>
            <DemoApprovalButton onStateChange={setApprovalState} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
