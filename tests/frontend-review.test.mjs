import test from "node:test";
import assert from "node:assert/strict";
import { allocationState, clampWordBudget, estimatedReadingMinutes, totalAllocatedWords, WORD_BUDGET_PRESETS } from "../frontend/src/lib/review-metrics.ts";
import { mapPlanResponseToReviewForm, mapReviewFormToApprovalPayload } from "../frontend/src/lib/review-payload.ts";
import { validateReview } from "../frontend/src/lib/review-validation.ts";
import { clearReviewDraft, readReviewDraft, reviewDraftKey, writeReviewDraft } from "../frontend/src/lib/review-recovery.ts";

const plan = {
  blog_title: "Reliable agents",
  audience: "Platform engineers",
  tone: "Technical",
  blog_kind: "explainer",
  constraints: ["Teach durable execution"],
  tasks: Array.from({ length: 5 }, (_, index) => ({
    id: index + 1,
    title: `Section ${index + 1}`,
    goal: "Explain the concept clearly.",
    bullets: ["First point", "Second point", "Third point"],
    target_words: 400,
    tags: [],
    requires_research: index === 0,
    requires_citations: false,
    requires_code: index === 1,
  })),
};

test("word totals, reading time and thresholds are editorially stable", () => {
  assert.equal(totalAllocatedWords(plan.tasks), 2000);
  assert.equal(estimatedReadingMinutes(2200), 10);
  assert.equal(allocationState(2000, 2000), "normal");
  assert.equal(allocationState(2250, 2000), "warning");
  assert.equal(allocationState(1000, 2000), "under");
});

test("word presets and numeric budgets respect backend limits", () => {
  assert.deepEqual(WORD_BUDGET_PRESETS.map(({ value }) => value), [200, 400, 550]);
  assert.equal(clampWordBudget(Number.NaN), 120);
  assert.equal(clampWordBudget(80), 120);
  assert.equal(clampWordBudget(700), 550);
});

test("plan mappers preserve API fields, order and remove UI-only state", () => {
  const form = mapPlanResponseToReviewForm(plan);
  form.targetWords = 2800;
  form.tasks.reverse();
  const payload = mapReviewFormToApprovalPayload(form);
  assert.equal(payload.tasks[0].id, 5);
  assert.equal(payload.constraints[0], "Teach durable execution");
  assert.equal("targetWords" in payload, false);
  assert.equal("writingObjective" in payload, false);
  assert.deepEqual(Object.keys(payload.tasks[0]).sort(), ["bullets", "goal", "id", "requires_citations", "requires_code", "requires_research", "tags", "target_words", "title"].sort());
});

test("validation returns stable clickable field IDs and enforces bullet bounds", () => {
  const form = mapPlanResponseToReviewForm(plan);
  form.tasks[2].goal = "";
  form.tasks[3].bullets = ["One", "Two"];
  const issues = validateReview(form);
  assert.ok(issues.some((issue) => issue.fieldId === "section-3-goal" && issue.sectionId === 3));
  assert.ok(issues.some((issue) => issue.fieldId === "section-4-bullet-0" && issue.sectionId === 4));
  form.tasks[3].bullets = ["1", "2", "3", "4", "5", "6"];
  assert.equal(validateReview(form).some((issue) => issue.id === "section-4-bullets"), false);
});

test("newer local recovery restores and can be cleared", () => {
  const memory = new Map();
  globalThis.localStorage = { getItem: (key) => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value), removeItem: (key) => memory.delete(key) };
  const backendUpdatedAt = "2025-01-01T00:00:00.000Z";
  const key = reviewDraftKey("writer@example.com", "blog-1", backendUpdatedAt);
  const form = mapPlanResponseToReviewForm(plan);
  writeReviewDraft(key, backendUpdatedAt, form);
  assert.equal(readReviewDraft(key, backendUpdatedAt)?.form.blog_title, "Reliable agents");
  clearReviewDraft(key);
  assert.equal(readReviewDraft(key, backendUpdatedAt), null);
});
