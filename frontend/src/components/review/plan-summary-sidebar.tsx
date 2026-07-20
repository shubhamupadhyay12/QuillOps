import { AlertTriangle, CheckCircle2, ChevronDown, Clock3, LoaderCircle, Save, Send } from "lucide-react";
import type { ReviewIssue } from "@/lib/review-validation";
import type { ReviewFormState, SaveStatus } from "@/components/review/types";
import { allocationPercent, allocationState, estimatedReadingMinutes, totalAllocatedWords } from "@/lib/review-metrics";

interface PlanSummarySidebarProps {
  form: ReviewFormState;
  issues: ReviewIssue[];
  saveStatus: SaveStatus;
  approving: boolean;
  approved: boolean;
  approvalError: string;
  overBudgetConfirmed: boolean;
  onConfirmBudget: (value: boolean) => void;
  onIssue: (issue: ReviewIssue) => void;
  onApprove: () => void;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
}

export function PlanSummarySidebar({ form, issues, saveStatus, approving, approved, approvalError, overBudgetConfirmed, onConfirmBudget, onIssue, onApprove, mobileOpen, onMobileOpenChange }: PlanSummarySidebarProps) {
  const allocated = totalAllocatedWords(form.tasks);
  const allocation = allocationState(allocated, form.targetWords);
  const errors = issues.filter((issue) => issue.severity === "error");
  const warning = issues.find((issue) => issue.id === "allocation-warning");
  const counts = { research: form.tasks.filter((task) => task.requires_research).length, citations: form.tasks.filter((task) => task.requires_citations).length, code: form.tasks.filter((task) => task.requires_code).length };
  const ready = errors.length === 0;
  const saveLabel = saveStatus === "saving" ? "Saving locally…" : saveStatus === "saved" ? "Saved locally" : saveStatus === "error" ? "Local save failed" : "No local edits";

  return (
    <aside className={`q-plan-summary ${mobileOpen ? "is-mobile-open" : ""}`} aria-labelledby="plan-summary-title">
      <button className="q-summary-mobile-toggle" type="button" onClick={() => onMobileOpenChange(!mobileOpen)} aria-expanded={mobileOpen}><span>Plan summary</span><strong>{ready ? "Ready" : `${errors.length} issues`}</strong><ChevronDown aria-hidden="true" /></button>
      <div className="q-plan-summary-content">
        <div className="q-review-card-heading"><span>PLAN SUMMARY</span><small className={`is-save-${saveStatus}`}><Save aria-hidden="true" />{saveLabel}</small></div>
        <h2 id="plan-summary-title">Plan summary</h2>
        <div className="q-summary-primary"><strong>{form.tasks.length}</strong><span>sections</span><strong>{allocated.toLocaleString()}</strong><span>allocated words</span><strong>{estimatedReadingMinutes(allocated)}</strong><span>minute read</span></div>
        <div className={`q-allocation is-${allocation}`}>
          <div><span>Word allocation</span><strong>{allocated.toLocaleString()} / {form.targetWords.toLocaleString()}</strong></div>
          <div className="q-allocation-bar" aria-label={`${allocated} of ${form.targetWords} words allocated`}><span style={{ width: `${allocationPercent(allocated, form.targetWords)}%` }} /></div>
          <p>{allocated > form.targetWords ? `${(allocated - form.targetWords).toLocaleString()} words over target` : `${(form.targetWords - allocated).toLocaleString()} words remaining`}</p>
        </div>
        <dl className="q-requirement-summary"><div><dt>Research sections</dt><dd>{counts.research}</dd></div><div><dt>Citation sections</dt><dd>{counts.citations}</dd></div><div><dt>Code examples</dt><dd>{counts.code}</dd></div><div><dt>Estimated reading</dt><dd><Clock3 aria-hidden="true" /> {estimatedReadingMinutes(allocated)} min</dd></div></dl>
        <div className={`q-validation-summary ${ready ? "is-ready" : "has-errors"}`}><div>{ready ? <CheckCircle2 aria-hidden="true" /> : <AlertTriangle aria-hidden="true" />}<span><strong>{ready ? "Ready to approve" : `${errors.length} ${errors.length === 1 ? "item needs" : "items need"} attention`}</strong><small>{ready ? "All required plan fields are complete." : "Open an issue to jump to its field."}</small></span></div>{issues.length ? <ul>{issues.map((issue) => <li key={issue.id}><button type="button" onClick={() => onIssue(issue)} className={`is-${issue.severity}`}>{issue.message}</button></li>)}</ul> : null}</div>
        {warning ? <label className="q-budget-confirm"><input type="checkbox" checked={overBudgetConfirmed} onChange={(event) => onConfirmBudget(event.target.checked)} /><span>I reviewed the allocation and want to continue.</span></label> : null}
        {approvalError ? <p className="q-approval-error" role="alert">{approvalError}</p> : null}
        <button className="q-approve-button" type="button" onClick={onApprove} disabled={approving || approved || Boolean(warning && !overBudgetConfirmed)}>{approved ? <><CheckCircle2 aria-hidden="true" /> Approved — writing started</> : approving ? <><LoaderCircle className="q-spin" aria-hidden="true" /> Approving…</> : errors.length ? <><AlertTriangle aria-hidden="true" /> Review {errors.length} {errors.length === 1 ? "issue" : "issues"}</> : <><Send aria-hidden="true" /> Approve plan and begin writing</>}</button>
        <p className="q-approval-note">Approval resumes the durable workflow from this checkpoint.</p>
      </div>
    </aside>
  );
}
