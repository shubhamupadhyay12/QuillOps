import { createRoot, type Root } from "react-dom/client";
import type { ReactNode } from "react";
import { AuthPage, type AuthMode } from "@/components/auth/auth-page";
import { LandingPage } from "@/landing-page";
import { PlanningEnergyField } from "@/components/ui/planning-energy-field";
import { ReviewWorkspace } from "@/components/review/review-workspace";
import type { ReviewBlog } from "@/components/review/types";
import { WritingMissionControl } from "@/components/workflow/writing-mission-control";
import { ArticleWorkspace } from "@/components/article/article-workspace";
export { api, auth } from "@/lib/api-client";
export { quillOpsMarkMarkup } from "@/components/brand/quillops-mark-geometry";
export { linkedInUrl } from "@/config/social-links";
import { quillOpsFaviconMarkup } from "@/components/brand/quillops-mark-geometry";
import { inject } from "@vercel/analytics";
import "@/landing.css";
import "@/focused-ui-fixes.css";

// Initialize Vercel Web Analytics
inject();

let currentRoot: Root | null = null;
let planningRoot: Root | null = null;
let planningContainer: HTMLElement | null = null;
let reviewRoot: Root | null = null;
let workflowRoot: Root | null = null;

const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]') ?? document.createElement("link");
favicon.rel = "icon";
favicon.type = "image/svg+xml";
favicon.href = `data:image/svg+xml,${encodeURIComponent(quillOpsFaviconMarkup())}`;
if (!favicon.isConnected) document.head.append(favicon);

function mount(container: HTMLElement, content: ReactNode) {
  currentRoot?.unmount();
  currentRoot = createRoot(container);
  currentRoot.render(content);
}

export function renderLanding(container: HTMLElement) {
  mount(container, <LandingPage />);
}

export function renderAuth(container: HTMLElement, mode: AuthMode) {
  mount(container, <AuthPage key={mode} mode={mode} />);
}

export function unmountReactView() {
  currentRoot?.unmount();
  currentRoot = null;
  unmountPlanningVisual();
  unmountReviewWorkspace();
  unmountWorkflowWorkspace();
}

export function renderReviewWorkspace(container: HTMLElement, blog: ReviewBlog, onApproved: () => void) {
  reviewRoot?.unmount();
  reviewRoot = createRoot(container);
  reviewRoot.render(<ReviewWorkspace blog={blog} onApproved={onApproved} />);
}

export function unmountReviewWorkspace() {
  reviewRoot?.unmount();
  reviewRoot = null;
}

function renderWorkflowRoot(container: HTMLElement, content: ReactNode) {
  workflowRoot?.unmount();
  workflowRoot = createRoot(container);
  workflowRoot.render(content);
}

export function renderWritingMissionControl(container: HTMLElement, blog: Parameters<typeof WritingMissionControl>[0]["blog"]) {
  renderWorkflowRoot(container, <WritingMissionControl blog={blog} />);
}

export function renderArticleWorkspace(container: HTMLElement, blog: Parameters<typeof ArticleWorkspace>[0]["initialBlog"], onBusy: () => void) {
  renderWorkflowRoot(container, <ArticleWorkspace initialBlog={blog} onBusy={onBusy} />);
}

export function unmountWorkflowWorkspace() {
  workflowRoot?.unmount();
  workflowRoot = null;
}

export function renderPlanningVisual(container: HTMLElement, stage: string) {
  if (planningContainer !== container) {
    planningRoot?.unmount();
    planningRoot = createRoot(container);
    planningContainer = container;
  }
  planningRoot?.render(<PlanningEnergyField stage={stage} />);
}

export function unmountPlanningVisual() {
  planningRoot?.unmount();
  planningRoot = null;
  planningContainer = null;
}
