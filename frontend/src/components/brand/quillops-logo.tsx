import { QuillOpsMark } from "@/components/brand/quillops-mark";

interface QuillOpsLogoProps {
  variant?: "full" | "compact" | "mark-only";
  size?: number;
  className?: string;
  href?: string;
}

export function QuillOpsLogo({ variant = "full", size, className = "", href = "/" }: QuillOpsLogoProps) {
  const markSize = size ?? (variant === "compact" ? 24 : variant === "mark-only" ? 28 : 30);
  return (
    <a className={`q-wordmark q-logo-${variant} ${className}`.trim()} href={href} aria-label="Go to QuillOps homepage">
      <span className="q-wordmark-mark" aria-hidden="true"><QuillOpsMark size={markSize} /></span>
      {variant === "mark-only" ? null : <span className="q-wordmark-text">QuillOps</span>}
    </a>
  );
}
