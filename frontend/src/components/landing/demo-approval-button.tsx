import { Check, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";

export type DemoApprovalState = "idle" | "approving" | "approved" | "writing";

interface DemoApprovalButtonProps {
  compact?: boolean;
  label?: string;
  onStateChange?: (state: DemoApprovalState) => void;
}

export function DemoApprovalButton({ compact = false, label = "Approve and continue", onStateChange }: DemoApprovalButtonProps) {
  const [state, setState] = useState<DemoApprovalState>("idle");

  useEffect(() => {
    onStateChange?.(state);
    if (state === "idle") return;
    const next: Record<Exclude<DemoApprovalState, "idle">, { state: DemoApprovalState; delay: number }> = {
      approving: { state: "approved", delay: 650 },
      approved: { state: "writing", delay: 850 },
      writing: { state: "idle", delay: 1600 },
    };
    const timer = window.setTimeout(() => setState(next[state].state), next[state].delay);
    return () => window.clearTimeout(timer);
  }, [onStateChange, state]);

  const text = state === "approving" ? "Approving…" : state === "approved" ? "Approved ✓" : state === "writing" ? "Writing started" : label;

  return (
    <button
      className={`q-button q-demo-approval ${compact ? "q-button-small" : ""} is-${state}`}
      type="button"
      onClick={() => setState("approving")}
      disabled={state !== "idle"}
      aria-live="polite"
    >
      {state === "approving" ? <LoaderCircle className="q-spin" aria-hidden="true" /> : <Check aria-hidden="true" />}
      {text}
    </button>
  );
}
