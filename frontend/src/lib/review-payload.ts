import type { ReviewFormState, ReviewPlan, ReviewTask } from "../components/review/types.ts";
import { clampWordBudget, LENGTH_POLICIES } from "./review-metrics.ts";

function normalizeTask(task: ReviewTask, index: number): ReviewTask {
  return {
    id: Number.isInteger(task.id) ? task.id : index + 1,
    title: task.title.trim(),
    goal: task.goal.trim(),
    bullets: task.bullets.map((bullet) => bullet.trim()),
    target_words: clampWordBudget(Number(task.target_words)),
    tags: Array.isArray(task.tags) ? task.tags.map(String) : [],
    requires_research: Boolean(task.requires_research),
    requires_citations: Boolean(task.requires_citations),
    requires_code: Boolean(task.requires_code),
  };
}

export function mapPlanResponseToReviewForm(plan: ReviewPlan): ReviewFormState {
  const tasks = plan.tasks.map(normalizeTask);
  const requestedLength = plan.requested_length ?? "standard";
  const targetWords = plan.target_words ?? LENGTH_POLICIES[requestedLength].targetWords;
  return {
    blog_title: plan.blog_title ?? "",
    audience: plan.audience ?? "",
    tone: plan.tone ?? "",
    blog_kind: plan.blog_kind ?? "explainer",
    constraints: [...(plan.constraints ?? [])],
    requested_length: requestedLength,
    target_words: targetWords,
    tasks,
    targetWords,
    writingObjective: plan.constraints?.[0] ?? "",
    preservedConstraints: plan.constraints?.slice(1) ?? [],
  };
}

export function mapReviewFormToApprovalPayload(form: ReviewFormState): ReviewPlan {
  const objective = form.writingObjective.trim();
  return {
    blog_title: form.blog_title.trim(),
    audience: form.audience.trim(),
    tone: form.tone.trim(),
    blog_kind: form.blog_kind,
    constraints: objective ? [objective, ...form.preservedConstraints] : [...form.preservedConstraints],
    requested_length: form.requested_length,
    target_words: form.target_words,
    tasks: form.tasks.map(normalizeTask),
  };
}
