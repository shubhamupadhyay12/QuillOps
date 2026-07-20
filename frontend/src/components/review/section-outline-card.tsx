import { AlertCircle, CheckCircle2, ChevronDown, Ellipsis, GripVertical, Trash2 } from "lucide-react";
import type { ReviewIssue } from "@/lib/review-validation";
import type { ReviewTask } from "@/components/review/types";
import { BulletPointEditor } from "@/components/review/bullet-point-editor";
import { SectionRequirements } from "@/components/review/section-requirements";
import { SectionWordBudget } from "@/components/review/section-word-budget";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

interface SectionOutlineCardProps {
  task: ReviewTask;
  index: number;
  count: number;
  minimumCount: number;
  expanded: boolean;
  issues: ReviewIssue[];
  onToggle: () => void;
  onChange: (task: ReviewTask) => void;
  onMove: (offset: number) => void;
  onDelete: () => void;
}

export function SectionOutlineCard({ task, index, count, minimumCount, expanded, issues, onToggle, onChange, onMove, onDelete }: SectionOutlineCardProps) {
  const invalid = issues.some((issue) => issue.severity === "error");
  const panelId = `section-${task.id}-panel`;
  const change = (changes: Partial<ReviewTask>) => onChange({ ...task, ...changes });
  const requirements = [task.requires_research && "Research", task.requires_citations && "Citations", task.requires_code && "Code"].filter(Boolean);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updateMenuPosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const menuHeight = 152;
    const menuWidth = 145;
    
    const spaceBelow = window.innerHeight - rect.bottom;
    const openBelow = spaceBelow >= menuHeight || rect.top < menuHeight;
    
    const top = openBelow ? rect.bottom + 4 : rect.top - menuHeight - 4;
    let left = rect.left + rect.width / 2 - menuWidth / 2;
    left = Math.max(8, Math.min(window.innerWidth - menuWidth - 8, left));
    
    setMenuPos({ top, left });
  }, []);

  const handleMenuToggle = () => {
    if (menuOpen) {
      setMenuOpen(false);
    } else {
      updateMenuPosition();
      setMenuOpen(true);
    }
  };

  const reorder = (offset: number) => {
    onMove(offset);
    setMenuOpen(false);
  };

  useEffect(() => {
    if (!menuOpen) return;
    
    const handleOutsideInteraction = (event: MouseEvent | TouchEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent && event.key === "Escape") {
        setMenuOpen(false);
        triggerRef.current?.focus();
        return;
      }
      
      if (event instanceof MouseEvent || event instanceof TouchEvent) {
        if (
          menuRef.current && !menuRef.current.contains(event.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(event.target as Node)
        ) {
          setMenuOpen(false);
        }
      }
    };
    
    const handleScrollResize = () => {
      setMenuOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideInteraction);
    document.addEventListener("touchstart", handleOutsideInteraction);
    document.addEventListener("keydown", handleOutsideInteraction);
    window.addEventListener("scroll", handleScrollResize, { capture: true, passive: true });
    window.addEventListener("resize", handleScrollResize);
    
    return () => {
      document.removeEventListener("mousedown", handleOutsideInteraction);
      document.removeEventListener("touchstart", handleOutsideInteraction);
      document.removeEventListener("keydown", handleOutsideInteraction);
      window.removeEventListener("scroll", handleScrollResize, { capture: true });
      window.removeEventListener("resize", handleScrollResize);
    };
  }, [menuOpen, updateMenuPosition]);

  return (
    <article id={`section-card-${task.id}`} className={`q-section-card ${expanded ? "is-expanded" : ""} ${invalid ? "has-error" : ""}`} data-review-section={task.id}>
      <header className="q-section-card-header">
        <span className="q-drag-handle" aria-hidden="true"><GripVertical /></span>
        <button className="q-section-toggle" type="button" onClick={onToggle} aria-expanded={expanded} aria-controls={panelId}>
          <span className="q-section-index">SECTION {String(index + 1).padStart(2, "0")}</span>
          <strong id={`section-${task.id}-heading`} tabIndex={-1}>{task.title || "Untitled section"}</strong>
          <span className="q-section-compact-meta"><b>{task.target_words} words</b>{requirements.length ? requirements.join(" · ") : "No special requirements"}</span>
        </button>
        <div className="q-section-status" aria-label={invalid ? "Section needs attention" : "Section is valid"}>{invalid ? <AlertCircle aria-hidden="true" /> : <CheckCircle2 aria-hidden="true" />}</div>
        <button className="q-section-delete" type="button" disabled={count <= minimumCount} onClick={onDelete} aria-label={`Delete section ${index + 1}: ${task.title}`}><Trash2 aria-hidden="true" /></button>
        <button className="q-section-chevron" type="button" onClick={onToggle} aria-label={`${expanded ? "Collapse" : "Expand"} section “${task.title || `Section ${index + 1}`}”`} aria-expanded={expanded} aria-controls={panelId}><ChevronDown aria-hidden="true" /></button>
        <button
          ref={triggerRef}
          className="q-section-reorder-trigger q-section-overflow"
          type="button"
          aria-label={`Reorder options for section ${index + 1}: ${task.title}`}
          onClick={handleMenuToggle}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
        >
          <Ellipsis aria-hidden="true" />
        </button>

        {menuOpen && createPortal(
          <div
            ref={menuRef}
            className="q-section-reorder-menu"
            role="menu"
            aria-label={`Reorder section ${index + 1}`}
            style={{
              position: "fixed",
              top: `${menuPos.top}px`,
              left: `${menuPos.left}px`,
              zIndex: 9999
            }}
          >
            <button role="menuitem" type="button" disabled={index === 0} onClick={() => reorder(-1)}>Move up</button>
            <button role="menuitem" type="button" disabled={index === count - 1} onClick={() => reorder(1)}>Move down</button>
            <button role="menuitem" type="button" disabled={index === 0} onClick={() => reorder(-index)}>Move to top</button>
            <button role="menuitem" type="button" disabled={index === count - 1} onClick={() => reorder(count - index - 1)}>Move to bottom</button>
          </div>,
          document.body
        )}
      </header>
      <div id={panelId} className="q-section-card-panel" hidden={!expanded}>
        <div className="q-section-fields">
          <label htmlFor={`section-${task.id}-title`}>Section title<input id={`section-${task.id}-title`} value={task.title} aria-invalid={issues.some((issue) => issue.id.endsWith("-title"))} onChange={(event) => change({ title: event.target.value })} /></label>
          <label htmlFor={`section-${task.id}-goal`}>Generation focus<textarea id={`section-${task.id}-goal`} rows={3} value={task.goal} aria-invalid={issues.some((issue) => issue.id.endsWith("-goal"))} onChange={(event) => change({ goal: event.target.value })} /></label>
        </div>
        <SectionWordBudget sectionId={task.id} value={task.target_words} invalid={issues.some((issue) => issue.id.endsWith("-words"))} onChange={(target_words) => change({ target_words })} />
        <BulletPointEditor sectionId={task.id} bullets={task.bullets} invalid={issues.some((issue) => issue.id.endsWith("-bullets"))} onChange={(bullets) => change({ bullets })} />
        <SectionRequirements task={task} onChange={change} />
      </div>
    </article>
  );
}
