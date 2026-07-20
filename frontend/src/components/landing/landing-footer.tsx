import { Linkedin } from "lucide-react";
import { QuillOpsLogo } from "@/components/brand/quillops-logo";
import { socialLinks } from "@/config/social-links";

const year = new Date().getFullYear();

export function LandingFooter() {
  return (
    <footer className="q-footer">
      <div className="q-shell q-footer-grid">
        <div><QuillOpsLogo /><p>The operating system for technical writing.</p></div>
        <nav aria-label="Footer navigation">
          <a href="#/section/product">Product</a><a href="#/section/workflow">Workflow</a><a href="#/section/architecture">Architecture</a><a href="#/section/about">About</a>
          <a href="#/login">Login</a><a href="#/register">Register</a>
          <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">GitHub</a>
        </nav>
      </div>
      <div className="q-shell q-footer-bottom">
        <span>© {year} QuillOps</span>
        <span className="q-footer-credit">Built by <strong>Shubham Upadhyay</strong><a className="q-footer-linkedin" href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Connect with Shubham Upadhyay on LinkedIn"><Linkedin aria-hidden="true" /></a></span>
      </div>
    </footer>
  );
}
