import { ArrowLeft, Check, Circle, Info, Plus, RotateCcw, Save } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api, auth } from "@/lib/api-client";
import { ArticleBriefCard } from "@/components/review/article-brief-card";
import { ApprovalBar } from "@/components/review/approval-bar";
import { OutlineNavigator } from "@/components/review/outline-navigator";
import { PlanSummarySidebar } from "@/components/review/plan-summary-sidebar";
import { ResearchContextCard } from "@/components/review/research-context-card";
import { SectionOutlineCard } from "@/components/review/section-outline-card";
import type { ReviewBlog, ReviewFormState, ReviewTask, SaveStatus } from "@/components/review/types";
import { mapPlanResponseToReviewForm, mapReviewFormToApprovalPayload } from "@/lib/review-payload";
import { clearReviewDraft, readReviewDraft, reviewDraftKey, writeReviewDraft } from "@/lib/review-recovery";
import { validateReview, type ReviewIssue } from "@/lib/review-validation";
import { LENGTH_POLICIES } from "@/lib/review-metrics";

interface ReviewWorkspaceProps {
  blog: ReviewBlog;
  onApproved: () => void;
}

const EXPLANATION_KEY = "quillops:review-explanation-dismissed";

export function ReviewWorkspace({ blog, onApproved }: ReviewWorkspaceProps) {
  const backendForm = useMemo(() => mapPlanResponseToReviewForm(blog.plan), [blog.plan]);
  const draftKey = useMemo(() => reviewDraftKey(auth.getUserEmail(), blog.id, blog.updated_at), [blog.id, blog.updated_at]);
  const recovered = useMemo(() => readReviewDraft(draftKey, blog.updated_at), [blog.updated_at, draftKey]);
  const [form, setForm] = useState<ReviewFormState>(() => recovered?.form ?? backendForm);
  const [expanded, setExpanded] = useState<Set<number>>(() => new Set([form.tasks[0]?.id].filter((id): id is number => typeof id === "number")));
  const [activeId, setActiveId] = useState(form.tasks[0]?.id ?? 0);
  const [dirty, setDirty] = useState(Boolean(recovered));
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(recovered ? "saved" : "unchanged");
  const [approvalError, setApprovalError] = useState("");
  const [approving, setApproving] = useState(false);
  const [approvalComplete, setApprovalComplete] = useState(false);
  const [overBudgetConfirmed, setOverBudgetConfirmed] = useState(false);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);
  const [announcement, setAnnouncement] = useState(recovered ? "A newer local draft was restored." : "");
  const [explanationVisible, setExplanationVisible] = useState(() => localStorage.getItem(EXPLANATION_KEY) !== "1");
  const submittingRef = useRef(false);
  const approvalNavigationRef = useRef<number | null>(null);
  const isProgrammaticScrollRef = useRef(false);
  const targetSectionIdRef = useRef<number | null>(null);
  const scrollUnlockTimerRef = useRef<number | null>(null);
  const issues = useMemo(() => validateReview(form), [form]);
  const errorCount = issues.filter((issue) => issue.severity === "error").length;
  const warningNeedsConfirmation = issues.some((issue) => issue.id === "allocation-warning") && !overBudgetConfirmed;
  const invalidFields = useMemo(() => new Set(issues.map((issue) => issue.fieldId)), [issues]);
  const lengthPolicy = LENGTH_POLICIES[form.requested_length];

  const changeForm = useCallback((update: Partial<ReviewFormState> | ((current: ReviewFormState) => ReviewFormState)) => {
    setForm((current) => typeof update === "function" ? update(current) : { ...current, ...update });
    setDirty(true);
    setSaveStatus("saving");
    setApprovalError("");
    setOverBudgetConfirmed(false);
  }, []);

  useEffect(() => {
    if (!dirty || approving) return;
    setSaveStatus("saving");
    const timer = window.setTimeout(() => {
      try { writeReviewDraft(draftKey, blog.updated_at, form); setSaveStatus("saved"); setAnnouncement("Saved locally"); }
      catch { setSaveStatus("error"); setAnnouncement("Local recovery could not be saved"); }
    }, 650);
    return () => window.clearTimeout(timer);
  }, [approving, blog.updated_at, dirty, draftKey, form]);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => () => { if (approvalNavigationRef.current) window.clearTimeout(approvalNavigationRef.current); }, []);

  useEffect(() => {
    const handleScroll = (event?: Event) => {
      if (isProgrammaticScrollRef.current) {
        const targetId = targetSectionIdRef.current;
        if (targetId) {
          const target = document.getElementById(`section-card-${targetId}`);
          if (target) {
            const rect = target.getBoundingClientRect();
            const activationLine = window.innerHeight * 0.28;
            if (Math.abs(rect.top - activationLine) < 30) {
              isProgrammaticScrollRef.current = false;
              targetSectionIdRef.current = null;
              if (scrollUnlockTimerRef.current) {
                window.clearTimeout(scrollUnlockTimerRef.current);
                scrollUnlockTimerRef.current = null;
              }
            }
          }
        }
        return;
      }

      const eventTarget = event?.target === document 
        ? document.documentElement 
        : event?.target instanceof HTMLElement 
          ? event.target 
          : null;

      const candidates = [
        document.documentElement,
        document.body,
        document.querySelector(".app-shell-main"),
        document.querySelector(".dashboard-main")
      ];

      const scrollEl = (eventTarget && eventTarget.scrollTop > 0)
        ? eventTarget
        : (candidates.find((el) => el && el.scrollTop > 0) || document.documentElement);

      const scrollTop = scrollEl.scrollTop !== undefined ? scrollEl.scrollTop : window.scrollY;
      const scrollHeight = scrollEl.scrollHeight !== undefined ? scrollEl.scrollHeight : document.documentElement.scrollHeight;
      const clientHeight = scrollEl.clientHeight !== undefined ? scrollEl.clientHeight : window.innerHeight;

      // Handle bottom of page boundary
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;
      if (isAtBottom && form.tasks.length > 0) {
        const lastId = form.tasks[form.tasks.length - 1].id;
        if (lastId && lastId !== activeId) {
          setActiveId(lastId);
          return;
        }
      }

      // Calculate closest section to activation line (28% of viewport)
      const activationLine = clientHeight * 0.28;
      const elements = document.querySelectorAll("[data-review-section]");
      let closestId = activeId;
      let minDistance = Infinity;

      elements.forEach((el) => {
        const id = Number(el.getAttribute("data-review-section"));
        if (!id) return;
        const rect = el.getBoundingClientRect();
        const distance = Math.abs(rect.top - activationLine);
        if (distance < minDistance) {
          minDistance = distance;
          closestId = id;
        }
      });

      if (closestId && closestId !== activeId) {
        setActiveId(closestId);
      }
    };

    window.addEventListener("scroll", handleScroll, { capture: true, passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll, { capture: true });
      if (scrollUnlockTimerRef.current) window.clearTimeout(scrollUnlockTimerRef.current);
    };
  }, [activeId, form.tasks]);

  const updateTask = (id: number, task: ReviewTask) => changeForm((current) => ({ ...current, tasks: current.tasks.map((item) => item.id === id ? task : item) }));
  const moveTask = (id: number, offset: number) => changeForm((current) => {
    const index = current.tasks.findIndex((task) => task.id === id);
    const nextIndex = index + offset;
    if (index < 0 || nextIndex < 0 || nextIndex >= current.tasks.length) return current;
    const tasks = [...current.tasks];
    [tasks[index], tasks[nextIndex]] = [tasks[nextIndex], tasks[index]];
    return { ...current, tasks };
  });
  const deleteTask = (id: number) => {
    const task = form.tasks.find((item) => item.id === id);
    if (!task || form.tasks.length <= lengthPolicy.sectionMin) return;
    if (!window.confirm(`Delete section “${task.title || "Untitled section"}”? This removes its outline details from the plan.`)) return;
    changeForm((current) => ({ ...current, tasks: current.tasks.filter((item) => item.id !== id) }));
  };
  const addTask = () => changeForm((current) => {
    if (current.tasks.length >= lengthPolicy.sectionMax) return current;
    const id = Math.max(0, ...current.tasks.map((task) => task.id)) + 1;
    setExpanded((open) => new Set(open).add(id));
    return { ...current, tasks: [...current.tasks, { id, title: "New section", goal: "", bullets: ["", "", ""], target_words: 300, tags: [], requires_research: false, requires_citations: false, requires_code: false }] };
  });

  const navigateTo = useCallback((id: number, fieldId?: string) => {
    setExpanded((open) => new Set(open).add(id));
    setActiveId(id);

    isProgrammaticScrollRef.current = true;
    targetSectionIdRef.current = id;
    if (scrollUnlockTimerRef.current) {
      window.clearTimeout(scrollUnlockTimerRef.current);
    }
    scrollUnlockTimerRef.current = window.setTimeout(() => {
      isProgrammaticScrollRef.current = false;
      targetSectionIdRef.current = null;
    }, 1500);

    requestAnimationFrame(() => {
      const target = document.getElementById(`section-card-${id}`);
      if (target) {
        const stickyHeaderOffset = 140; // sticky header height
        const spacingOffset = 16;
        
        const candidates = [
          document.querySelector(".app-shell-main"),
          document.querySelector(".dashboard-main"),
          document.documentElement,
          document.body
        ];
        const scrollEl = candidates.find((el) => el && el.scrollTop > 0) || document.documentElement;
        
        const scrollTop = scrollEl.scrollTop !== undefined ? scrollEl.scrollTop : window.scrollY;
        const rect = target.getBoundingClientRect();
        const targetTop = rect.top + scrollTop - stickyHeaderOffset - spacingOffset;
        
        scrollEl.scrollTo({
          top: targetTop,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
        });
        
        const focusTarget = document.getElementById(fieldId ?? `section-${id}-heading`);
        focusTarget?.focus({ preventScroll: true });
        focusTarget?.classList.add("q-review-highlight");
        window.setTimeout(() => focusTarget?.classList.remove("q-review-highlight"), 1200);
      }
    });
  }, []);

  const openIssue = (issue: ReviewIssue) => {
    setAnnouncement(issue.message);
    if (issue.sectionId) navigateTo(issue.sectionId, issue.fieldId);
    else {
      const target = document.getElementById(issue.fieldId);
      target?.scrollIntoView({ behavior: "smooth", block: "center" }); target?.focus();
    }
  };

  const approve = async () => {
    if (submittingRef.current) return;
    const currentIssues = validateReview(form);
    const firstError = currentIssues.find((issue) => issue.severity === "error");
    if (firstError) { setAnnouncement(`${currentIssues.filter((issue) => issue.severity === "error").length} validation issues found`); openIssue(firstError); return; }
    if (currentIssues.some((issue) => issue.id === "allocation-warning") && !overBudgetConfirmed) { setAnnouncement("Confirm the word allocation before approving"); setMobileSummaryOpen(true); return; }
    submittingRef.current = true;
    setApproving(true);
    setApprovalError("");
    setAnnouncement("Approval started");
    try {
      await api.post(`/blogs/${blog.id}/approve-plan`, { plan: mapReviewFormToApprovalPayload(form) });
      clearReviewDraft(draftKey);
      setDirty(false);
      setApproving(false);
      setApprovalComplete(true);
      setAnnouncement("Approved — writing started");
      approvalNavigationRef.current = window.setTimeout(onApproved, 650);
    } catch (caught) {
      setApprovalError(caught instanceof Error ? caught.message : "The plan could not be approved. Your edits are still saved locally.");
      setAnnouncement("Approval failed. Your edits are still available.");
      setApproving(false);
      submittingRef.current = false;
    }
  };

  const discardRecovery = () => { clearReviewDraft(draftKey); setForm(backendForm); setDirty(false); setSaveStatus("unchanged"); setAnnouncement("Local draft discarded"); };

  return (
    <div className="q-review-workspace">
      <div className="q-review-ambient" aria-hidden="true" />
      <header className="q-review-header">
        <a href="#/dashboard"><ArrowLeft aria-hidden="true" /> Back to Workspace</a>
        <div className="q-review-title-row"><div><p>HUMAN REVIEW CHECKPOINT</p><h1>Review and shape your outline</h1><span>QuillOps has paused before writing. Refine the structure, section goals and generation requirements, then approve the plan when it is ready.</span></div><div className="q-review-status"><strong><Circle aria-hidden="true" /> Waiting for your approval</strong><small><Save aria-hidden="true" />{saveStatus === "saving" ? "Saving locally…" : saveStatus === "saved" ? "Saved locally" : "No local changes"}</small></div></div>
        <ol className="q-review-workflow-strip" aria-label="Workflow status"><li className="is-complete"><Check aria-hidden="true" /><span>Research<small>Complete</small></span></li><li className="is-complete"><Check aria-hidden="true" /><span>Planning<small>Complete</small></span></li><li className="is-active"><span>03</span><span>Human review<small>Active</small></span></li><li><span>04</span><span>Writing<small>Pending</small></span></li></ol>
        {recovered ? <div className="q-recovery-notice" role="status"><RotateCcw aria-hidden="true" /><span><strong>Local draft restored</strong>Your newer edits were recovered from this browser.</span><button type="button" onClick={discardRecovery}>Discard recovery</button></div> : null}
      </header>

      {explanationVisible ? <aside className="q-review-explanation"><Info aria-hidden="true" /><div><strong>Why QuillOps pauses here</strong><p>Review structure before prose is generated, adjust section depth, choose where evidence is required and approve a durable checkpoint without restarting the workflow.</p></div><button type="button" onClick={() => { localStorage.setItem(EXPLANATION_KEY, "1"); setExplanationVisible(false); }}>Dismiss</button></aside> : null}

      <div className="q-review-layout">
        <main className="q-review-main">
          <ArticleBriefCard form={form} invalidFields={invalidFields} onChange={changeForm} />
          <div className="q-review-editor-grid">
            <OutlineNavigator tasks={form.tasks} issues={issues} activeId={activeId} onNavigate={navigateTo} />
            <section className="q-outline-editor" aria-labelledby="outline-heading"><div className="q-outline-heading"><div><p>SECTION OUTLINE</p><h2 id="outline-heading" tabIndex={-1}>Shape the reading journey</h2></div><span>{lengthPolicy.sectionMin}–{lengthPolicy.sectionMax} sections · 3–6 points each</span></div>
              <div className="q-section-list">{form.tasks.map((task, index) => <SectionOutlineCard key={task.id} task={task} index={index} count={form.tasks.length} minimumCount={lengthPolicy.sectionMin} expanded={expanded.has(task.id)} issues={issues.filter((issue) => issue.sectionId === task.id)} onToggle={() => setExpanded((open) => { const next = new Set(open); if (next.has(task.id)) next.delete(task.id); else next.add(task.id); return next; })} onChange={(next) => updateTask(task.id, next)} onMove={(offset) => moveTask(task.id, offset)} onDelete={() => deleteTask(task.id)} />)}</div>
              <button className="q-add-section" type="button" disabled={form.tasks.length >= lengthPolicy.sectionMax} onClick={addTask}><Plus aria-hidden="true" /> Add section</button>
            </section>
          </div>
        </main>
        <div className="q-review-sidebar-stack">
          <PlanSummarySidebar form={form} issues={issues} saveStatus={saveStatus} approving={approving} approved={approvalComplete} approvalError={approvalError} overBudgetConfirmed={overBudgetConfirmed} onConfirmBudget={setOverBudgetConfirmed} onIssue={openIssue} onApprove={approve} mobileOpen={mobileSummaryOpen} onMobileOpenChange={setMobileSummaryOpen} />
          <ResearchContextCard evidence={blog.evidence ?? []} />
        </div>
      </div>
      <ApprovalBar errorCount={errorCount} approving={approving} approved={approvalComplete} disabled={warningNeedsConfirmation} onApprove={approve} onOpenSummary={() => { setMobileSummaryOpen(true); document.getElementById("plan-summary-title")?.scrollIntoView({ block: "center" }); }} />
      <div className="q-visually-hidden" aria-live="polite" aria-atomic="true">{announcement}</div>
    </div>
  );
}
