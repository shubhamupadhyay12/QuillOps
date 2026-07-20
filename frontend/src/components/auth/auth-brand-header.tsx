import { ArrowLeft } from "lucide-react";
import { QuillOpsLogo } from "@/components/brand/quillops-logo";

export function AuthBrandHeader() {
  return (
    <header className="q-auth-brand-header">
      <div className="q-auth-utility-row">
        <a className="q-auth-back" href="#/"><ArrowLeft aria-hidden="true" /> Back to QuillOps</a>
      </div>
      <QuillOpsLogo className="q-auth-wordmark" />
    </header>
  );
}
