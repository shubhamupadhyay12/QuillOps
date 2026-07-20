"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { QuillOpsLogo } from "@/components/brand/quillops-logo";

const sectionLinks = [
  ["Product", "#/section/product"],
  ["Workflow", "#/section/workflow"],
  ["Features", "#/section/features"],
  ["Architecture", "#/section/architecture"],
  ["About", "#/section/about"],
] as const;

export function LandingNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <header className={`q-public-nav ${scrolled ? "is-scrolled" : ""}`}>
      <nav className="q-nav-inner" aria-label="Main navigation">
        <QuillOpsLogo />
        <div className="q-nav-links">
          {sectionLinks.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
          <a href="https://github.com/shubhamupadhyay12/QuillOps" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
        <div className="q-nav-actions">
          <a className="q-login-link" href="#/login">Log in</a>
          <a className="q-button q-button-small" href="#/register">Start writing</a>
          <button
            className="q-menu-trigger"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </nav>
      <div id="mobile-navigation" className={`q-mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
        {sectionLinks.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
        <a href="https://github.com/shubhamupadhyay12/QuillOps" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="#/login" onClick={() => setOpen(false)}>Log in</a>
      </div>
    </header>
  );
}
