import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const marketingSteps = ["Research", "Plan", "Review", "Parallel writing", "Revision history"] as const;

export function MarketingWorkflowDemo() {
  const reducedMotion = useReducedMotion() || new URLSearchParams(window.location.search).get("motion") === "reduce";
  const [phase, setPhase] = useState(reducedMotion ? 2 : -1);
  const [visible, setVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .2 });
    observer.observe(root);
    return () => observer.disconnect();
  }, [reducedMotion]);

  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => {
    if (reducedMotion) { setPhase(2); return; }
    if (!visible || !pageVisible) return;
    const delay = phase === -1 ? 320 : phase >= marketingSteps.length ? 1500 : 1450;
    const nextPhase = phase >= marketingSteps.length ? -1 : phase + 1;
    const timer = window.setTimeout(() => setPhase(nextPhase), delay);
    return () => window.clearTimeout(timer);
  }, [pageVisible, phase, reducedMotion, visible]);

  return (
    <div ref={rootRef} className="q-marketing-workflow" aria-label="QuillOps visible workflow demonstration">
      {marketingSteps.map((step, index) => {
        const state = index < phase ? "complete" : index === phase ? "active" : "pending";
        const connectorState = index < phase ? "complete" : index === phase ? "filling" : "pending";
        return (
          <div key={step} className={`is-${state}`} aria-label={`${step}: ${state}`}>
            <span className="q-marketing-marker" aria-hidden="true">{state === "complete" ? <Check /> : String(index + 1).padStart(2, "0")}</span>
            {index < marketingSteps.length - 1 ? <span className={`q-marketing-connector is-${connectorState}`} aria-hidden="true"><i /></span> : null}
            <small>0{index + 1}</small>
            <strong>{step}</strong>
          </div>
        );
      })}
      <span className="q-visually-hidden">{phase >= marketingSteps.length ? "Workflow complete" : phase >= 0 ? `${marketingSteps[phase]} active` : "Workflow ready"}</span>
    </div>
  );
}
