import type { ReviewFormState } from "../components/review/types.ts";

export interface StoredReviewDraft {
  savedAt: number;
  backendUpdatedAt: string;
  form: ReviewFormState;
}

export function reviewDraftKey(user: string, blogId: string, backendUpdatedAt: string): string {
  return `quillops:review-draft:${encodeURIComponent(user)}:${blogId}:${encodeURIComponent(backendUpdatedAt)}`;
}

export function readReviewDraft(key: string, backendUpdatedAt: string): StoredReviewDraft | null {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) ?? "null") as StoredReviewDraft | null;
    if (!parsed || parsed.backendUpdatedAt !== backendUpdatedAt || parsed.savedAt <= Date.parse(backendUpdatedAt)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeReviewDraft(key: string, backendUpdatedAt: string, form: ReviewFormState): void {
  localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), backendUpdatedAt, form } satisfies StoredReviewDraft));
}

export function clearReviewDraft(key: string): void {
  localStorage.removeItem(key);
}
