import { AlertCircle, Check, LoaderCircle, Send } from "lucide-react";

interface ApprovalBarProps {
  errorCount: number;
  disabled: boolean;
  approving: boolean;
  approved: boolean;
  onApprove: () => void;
  onOpenSummary: () => void;
}

export function ApprovalBar({ errorCount, disabled, approving, approved, onApprove, onOpenSummary }: ApprovalBarProps) {
  return (
    <div className="q-mobile-approval-bar">
      <button type="button" className="q-mobile-summary-button" onClick={onOpenSummary}>{errorCount ? <><AlertCircle aria-hidden="true" />{errorCount} issues</> : "View summary"}</button>
      <button type="button" className="q-approve-button" disabled={disabled || approving || approved} onClick={onApprove}>
        {approved ? <><Check aria-hidden="true" />Approved — writing started</> : approving ? <><LoaderCircle className="q-spin" aria-hidden="true" />Approving…</> : <><Send aria-hidden="true" />Approve plan and begin writing</>}
      </button>
    </div>
  );
}
