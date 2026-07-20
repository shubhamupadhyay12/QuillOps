export interface ReviewTask {
  id: number;
  title: string;
  goal: string;
  bullets: string[];
  target_words: number;
  tags: string[];
  requires_research: boolean;
  requires_citations: boolean;
  requires_code: boolean;
}

export interface ReviewPlan {
  blog_title: string;
  audience: string;
  tone: string;
  blog_kind: "explainer" | "tutorial" | "news_roundup" | "comparison" | "system_design";
  constraints: string[];
  requested_length?: "short" | "standard" | "long-form";
  target_words?: number;
  tasks: ReviewTask[];
}

export interface ReviewFormState extends ReviewPlan {
  requested_length: "short" | "standard" | "long-form";
  target_words: number;
  targetWords: number;
  writingObjective: string;
  preservedConstraints: string[];
}

export interface EvidenceItem {
  title: string;
  url: string;
  snippet?: string | null;
  source?: string | null;
  published_at?: string | null;
}

export interface ReviewBlog {
  id: string;
  updated_at: string;
  plan: ReviewPlan;
  evidence?: EvidenceItem[] | null;
}

export type SaveStatus = "unchanged" | "saving" | "saved" | "error";
