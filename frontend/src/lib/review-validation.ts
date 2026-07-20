import type { ReviewFormState } from "../components/review/types.ts";
import { allocationState, LENGTH_POLICIES, SECTION_WORD_MAX, SECTION_WORD_MIN, totalAllocatedWords } from "./review-metrics.ts";

export interface ReviewIssue {
  id: string;
  message: string;
  fieldId: string;
  sectionId?: number;
  severity: "error" | "warning";
}

export function validateReview(form: ReviewFormState): ReviewIssue[] {
  const issues: ReviewIssue[] = [];
  const required = [
    ["blog_title", "Article title is missing", "article-title"],
    ["audience", "Target audience is missing", "article-audience"],
    ["tone", "Tone guidance is missing", "article-tone"],
  ] as const;

  required.forEach(([key, message, fieldId]) => {
    if (!form[key].trim()) issues.push({ id: key, message, fieldId, severity: "error" });
  });

  const policy = LENGTH_POLICIES[form.requested_length];
  if (form.tasks.length < policy.sectionMin || form.tasks.length > policy.sectionMax) {
    issues.push({ id: "section-count", message: `The ${form.requested_length} outline must contain ${policy.sectionMin} to ${policy.sectionMax} sections`, fieldId: "outline-heading", severity: "error" });
  }

  form.tasks.forEach((task, index) => {
    const number = index + 1;
    if (!task.title.trim()) issues.push({ id: `section-${task.id}-title`, message: `Section ${number} needs a title`, fieldId: `section-${task.id}-title`, sectionId: task.id, severity: "error" });
    if (!task.goal.trim()) issues.push({ id: `section-${task.id}-goal`, message: `Section ${number} has no generation goal`, fieldId: `section-${task.id}-goal`, sectionId: task.id, severity: "error" });
    if (task.bullets.length < 3 || task.bullets.length > 6 || task.bullets.some((bullet) => !bullet.trim())) {
      issues.push({ id: `section-${task.id}-bullets`, message: `Section ${number} needs 3 to 6 complete bullet points`, fieldId: `section-${task.id}-bullet-0`, sectionId: task.id, severity: "error" });
    }
    if (!Number.isFinite(task.target_words) || task.target_words < SECTION_WORD_MIN || task.target_words > SECTION_WORD_MAX) {
      issues.push({ id: `section-${task.id}-words`, message: `Section ${number} needs ${SECTION_WORD_MIN} to ${SECTION_WORD_MAX} words`, fieldId: `section-${task.id}-words`, sectionId: task.id, severity: "error" });
    }
  });

  const allocated = totalAllocatedWords(form.tasks);
  if (allocationState(allocated, form.targetWords) === "warning") {
    issues.push({ id: "allocation-warning", message: `Allocation is ${allocated - form.targetWords} words above the target`, fieldId: "article-target-words", severity: "warning" });
  }
  return issues;
}
