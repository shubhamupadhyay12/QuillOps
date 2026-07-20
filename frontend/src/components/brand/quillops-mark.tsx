import { useId } from "react";
import { quillOpsConnectionPath, quillOpsNibPath } from "@/components/brand/quillops-mark-geometry";

export interface QuillOpsMarkProps {
  size?: number;
  className?: string;
  title?: string;
  decorative?: boolean;
}

export function QuillOpsMark({ size = 28, className = "", title = "QuillOps", decorative = true }: QuillOpsMarkProps) {
  const titleId = useId();
  return (
    <svg
      className={`q-brand-mark ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={decorative ? "true" : undefined}
      aria-labelledby={decorative ? undefined : titleId}
      role={decorative ? undefined : "img"}
    >
      {decorative ? null : <title id={titleId}>{title}</title>}
      <path d={quillOpsNibPath} stroke="currentColor" strokeWidth="2.15" strokeLinecap="round" strokeLinejoin="round" />
      <path d={quillOpsConnectionPath} stroke="currentColor" strokeWidth="2.15" strokeLinecap="round" />
      <circle className="q-brand-node" cx="15.1" cy="17.2" r="2.35" fill="currentColor" />
    </svg>
  );
}
