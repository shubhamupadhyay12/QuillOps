"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { getConnectorState, type WorkflowVisualState } from "@/lib/workflow-progress";

export interface WorkflowStep {
  label: string;
  description?: string;
}

interface AnimatedWorkflowStepsProps {
  steps: readonly WorkflowStep[];
  variant?: "marketing" | "compact";
  orientation?: "horizontal" | "vertical";
  loop?: boolean;
  showDescriptions?: boolean;
  className?: string;
}

export function AnimatedWorkflowSteps({
  steps,
  variant = "marketing",
  orientation = "horizontal",
  loop = true,
  showDescriptions = true,
  className = "",
}: AnimatedWorkflowStepsProps) {
  const reducedMotion = useReducedMotion() || new URLSearchParams(window.location.search).get("motion") === "reduce";
  const stableIndex = Math.min(1, steps.length - 1);
  const [activeIndex, setActiveIndex] = useState(reducedMotion ? stableIndex : -1);

  useEffect(() => {
    if (reducedMotion || !steps.length) {
      setActiveIndex(stableIndex);
      return;
    }

    let timer: number | undefined;
    const advance = () => {
      setActiveIndex((current) => current >= steps.length ? (loop ? -1 : steps.length) : current + 1);
    };
    const schedule = (delay = 1550) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(advance, delay);
    };
    const handleVisibility = () => {
      window.clearTimeout(timer);
      if (!document.hidden) schedule(500);
    };

    if (!document.hidden) schedule(activeIndex >= steps.length - 1 ? 1000 : activeIndex < 0 ? 450 : 1550);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [activeIndex, loop, reducedMotion, stableIndex, steps.length]);

  return (
    <ol className={`q-animated-workflow is-${variant} is-${orientation} ${className}`.trim()}>
      {steps.map((step, index) => {
        const state: WorkflowVisualState = index < activeIndex ? "complete" : index === activeIndex ? "active" : "pending";
        const nextState: WorkflowVisualState = index + 1 < activeIndex ? "complete" : index + 1 === activeIndex ? "active" : "pending";
        return (
          <li key={`${index}-${step.label}`} className={`is-${state}`} aria-label={`${step.label}: ${state}`}>
            <span className="q-workflow-marker-wrapper" aria-hidden="true">
              <span className="q-workflow-index">
                {state === "complete" ? <Check /> : String(index + 1).padStart(2, "0")}
              </span>
              {index < steps.length - 1 ? <span className={`q-workflow-connector is-${getConnectorState(state, nextState)}`} /> : null}
            </span>
            <span className="q-workflow-copy">
              <strong>{step.label}</strong>
              {showDescriptions && step.description ? <small>{step.description}</small> : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
