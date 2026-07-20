import { AnimatedWorkflowSteps } from "@/components/workflow/animated-workflow-steps";

const steps = [
  { label: "Route", description: "Understands the request and chooses the right workflow." },
  { label: "Research", description: "Collects supporting evidence when the topic requires it." },
  { label: "Plan", description: "Creates a structured outline for the intended reader." },
  { label: "Review", description: "You edit, reorder and approve the plan." },
  { label: "Write", description: "Specialized workers produce sections in parallel." },
  { label: "Assemble", description: "Normalizes every section into one consistent document." },
  { label: "Refine", description: "Keeps manual edits, AI edits and recoverable versions." },
] as const;

export function WorkflowSection() {
  return (
    <section className="q-section q-workflow-section" id="workflow" aria-labelledby="workflow-title">
      <div className="q-shell">
        <div className="q-section-intro">
          <p className="q-eyebrow">THE QUILL PIPELINE / 01—07</p>
          <h2 id="workflow-title">From idea to publication-ready draft.</h2>
          <p>Every stage is visible. One deliberate checkpoint keeps the author in charge.</p>
        </div>
        <AnimatedWorkflowSteps steps={steps} />
      </div>
    </section>
  );
}
