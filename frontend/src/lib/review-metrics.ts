import type { ReviewTask } from "../components/review/types.ts";

export const READING_WORDS_PER_MINUTE = 220;
export const SECTION_WORD_MIN = 120;
export const SECTION_WORD_MAX = 550;
export const SECTION_WORD_STEP = 10;

export const LENGTH_POLICIES = {
  short: { sectionMin: 4, sectionMax: 6, targetWords: 1000 },
  standard: { sectionMin: 6, sectionMax: 9, targetWords: 1900 },
  "long-form": { sectionMin: 8, sectionMax: 12, targetWords: 3200 },
} as const;

export const WORD_BUDGET_PRESETS = [
  { id: "brief", label: "Brief", value: 200 },
  { id: "standard", label: "Standard", value: 400 },
  { id: "detailed", label: "Detailed", value: SECTION_WORD_MAX },
] as const;

export function clampWordBudget(value: number): number {
  if (!Number.isFinite(value)) return SECTION_WORD_MIN;
  return Math.min(SECTION_WORD_MAX, Math.max(SECTION_WORD_MIN, Math.round(value)));
}

export function totalAllocatedWords(tasks: Pick<ReviewTask, "target_words">[]): number {
  return tasks.reduce((total, task) => total + (Number.isFinite(task.target_words) ? task.target_words : 0), 0);
}

export function estimatedReadingMinutes(totalWords: number): number {
  return Math.max(1, Math.ceil(Math.max(0, totalWords) / READING_WORDS_PER_MINUTE));
}

export type AllocationState = "normal" | "warning" | "under";

export function allocationState(allocated: number, target: number): AllocationState {
  if (target <= 0) return "normal";
  if (allocated > target * 1.1) return "warning";
  if (allocated < target * 0.75) return "under";
  return "normal";
}

export function allocationPercent(allocated: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min(100, Math.max(0, (allocated / target) * 100));
}
