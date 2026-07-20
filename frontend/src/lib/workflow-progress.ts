export type WorkflowVisualState = "complete" | "active" | "pending" | "failed";
export type ConnectorVisualState = "completed" | "to-active" | "pending" | "failed";

export function getConnectorState(current: WorkflowVisualState, next: WorkflowVisualState): ConnectorVisualState {
  if (current === "failed" || next === "failed") return "failed";
  if (current === "complete" && next === "complete") return "completed";
  if (current === "complete" && next === "active") return "to-active";
  return "pending";
}

