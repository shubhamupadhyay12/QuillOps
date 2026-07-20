import {
  AlertTriangle, ArrowUp, Bot, Check, ChevronRight, Clipboard, Code2, Download, Eye,
  FileClock, FileText, History, ListTree, Pencil, Printer, RotateCcw, Save, Sparkles, X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/lib/api-client";
import { analyzeArticle, articleWordCount, versionSource } from "@/lib/article-analysis";

declare global {
  interface Window { marked?: { parse: (markdown: string) => string }; DOMPurify?: { sanitize: (html: string) => string } }
}

interface PlanTask { target_words?: number; requires_citations?: boolean }
interface ArticleBlog {
  id: string; topic: string; title?: string | null; content: string; current_version: number;
  updated_at: string; status: string; plan?: { tasks?: PlanTask[] } | null;
}
interface Version { id: string; version_number: number; content: string; edit_instruction?: string | null; created_at: string }
type Mode = "read" | "edit" | "preview";

function renderMarkdown(markdown: string): string {
  if (!markdown) return "<p>This draft has no content yet.</p>";
  if (!window.marked || !window.DOMPurify) return `<pre>${markdown.replace(/[&<>]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[character]!)}</pre>`;
  return window.DOMPurify.sanitize(window.marked.parse(markdown));
}
function download(name: string, content: string, type: string) { const url = URL.createObjectURL(new Blob([content], { type })); const link = document.createElement("a"); link.href = url; link.download = name; link.click(); window.setTimeout(() => URL.revokeObjectURL(url), 0); }
function safeFilename(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "quillops-draft"; }

export function ArticleWorkspace({ initialBlog, onBusy }: { initialBlog: ArticleBlog; onBusy: () => void }) {
  const [blog, setBlog] = useState(initialBlog);
  const [content, setContent] = useState(initialBlog.content || "");
  const [mode, setMode] = useState<Mode>("read");
  const [note, setNote] = useState("");
  const [instruction, setInstruction] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [versions, setVersions] = useState<Version[] | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [compareVersion, setCompareVersion] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const [selection, setSelection] = useState("");
  const [mobileOutlineOpen, setMobileOutlineOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const [refinementStatus, setRefinementStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [refinementError, setRefinementError] = useState("");
  const [lastInstruction, setLastInstruction] = useState("");
  const [lastScope, setLastScope] = useState<"document" | "selection">("document");
  const [originalTextBeforeRefine, setOriginalTextBeforeRefine] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const versionDialogRef = useRef<HTMLDivElement | null>(null);
  const versionCloseRef = useRef<HTMLButtonElement | null>(null);
  const recoveryKey = `quillops_article_recovery_${blog.id}`;
  const dirty = content !== blog.content;
  const html = useMemo(() => renderMarkdown(content), [content]);
  const targetWords = useMemo(() => blog.plan?.tasks?.reduce((total, task) => total + Number(task.target_words || 0), 0) || undefined, [blog.plan?.tasks]);
  const citationsRequired = useMemo(() => blog.plan?.tasks?.some((task) => task.requires_citations) || false, [blog.plan?.tasks]);
  const analysis = useMemo(() => analyzeArticle(content, targetWords, citationsRequired), [citationsRequired, content, targetWords]);
  const outline = useMemo(() => [...content.matchAll(/^(##|###)\s+(.+)$/gm)].map((match, index) => ({ level: match[1].length, text: match[2], id: `section-${index}` })), [content]);
  const title = blog.title || content.match(/^#\s+(.+)$/m)?.[1] || blog.topic.split("\n\nAudience:")[0];

  useEffect(() => { const recovered = localStorage.getItem(recoveryKey); if (recovered && recovered !== initialBlog.content) setMessage("A newer local edit is available. Open Edit mode to recover it."); }, [initialBlog.content, recoveryKey]);
  useEffect(() => { if (mode !== "edit") return; const timer = window.setTimeout(() => localStorage.setItem(recoveryKey, content), 450); return () => window.clearTimeout(timer); }, [content, mode, recoveryKey]);
  useEffect(() => { const warn = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault(); }; window.addEventListener("beforeunload", warn); return () => window.removeEventListener("beforeunload", warn); }, [dirty]);
  useEffect(() => {
    if (mode === "edit") return;
    const article = articleRef.current; if (!article) return;
    const headings = [...article.querySelectorAll<HTMLElement>("h2,h3")];
    headings.forEach((heading, index) => {
      heading.id = `section-${index}`;
      if (!heading.querySelector(".q-heading-link")) { const button = document.createElement("button"); button.type = "button"; button.className = "q-heading-link"; button.setAttribute("aria-label", `Copy link to ${heading.textContent || "section"}`); button.innerHTML = '<i class="fa-solid fa-link" aria-hidden="true"></i>'; button.addEventListener("click", async () => { const route = `#/blog/${blog.id}/section/${heading.id}`; history.replaceState(null, "", route); await navigator.clipboard.writeText(location.href); setMessage("Section link copied."); }); heading.appendChild(button); }
    });
    article.querySelectorAll("pre").forEach((pre) => { if (pre.parentElement?.classList.contains("q-code-wrap")) return; const wrap = document.createElement("div"); wrap.className = "q-code-wrap"; pre.parentNode?.insertBefore(wrap, pre); wrap.appendChild(pre); const button = document.createElement("button"); button.type = "button"; button.className = "q-code-copy"; button.textContent = "Copy code"; button.addEventListener("click", async () => { await navigator.clipboard.writeText(pre.textContent || ""); button.textContent = "Copied"; window.setTimeout(() => { button.textContent = "Copy code"; }, 1600); }); wrap.appendChild(button); });
    const observer = new IntersectionObserver((entries) => { const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]; if (visible) setActiveSection(visible.target.id); }, { rootMargin: "-18% 0px -70%", threshold: 0 });
    headings.forEach((heading) => observer.observe(heading));
    const selectionChange = () => { const selected = window.getSelection(); if (selected?.anchorNode && article.contains(selected.anchorNode)) setSelection(selected.toString().trim().slice(0, 4000)); };
    document.addEventListener("selectionchange", selectionChange);
    const linkedSection = location.hash.split("/section/")[1];
    if (linkedSection) requestAnimationFrame(() => document.getElementById(linkedSection)?.scrollIntoView({ block: "start" }));
    return () => { observer.disconnect(); document.removeEventListener("selectionchange", selectionChange); };
  }, [blog.id, html, mode]);
  useEffect(() => {
    const update = (event?: Event) => {
      const target = event?.target === document 
        ? document.documentElement 
        : event?.target instanceof HTMLElement 
          ? event.target 
          : null;
      const candidates = [
        document.documentElement,
        document.body,
        document.querySelector(".app-shell-main"),
        document.querySelector(".dashboard-main"),
        document.querySelector(".q-article-workspace"),
        document.querySelector(".q-document-panel")
      ];
      const scrollEl = (target && target.scrollTop > 0)
        ? target
        : (candidates.find((el) => el && el.scrollTop > 0) || document.documentElement);
      const scrollTop = scrollEl.scrollTop !== undefined ? scrollEl.scrollTop : window.scrollY;
      const scrollHeight = scrollEl.scrollHeight !== undefined ? scrollEl.scrollHeight : document.documentElement.scrollHeight;
      const clientHeight = scrollEl.clientHeight !== undefined ? scrollEl.clientHeight : window.innerHeight;
      const distance = scrollHeight - clientHeight;
      setReadingProgress(distance > 0 ? Math.min(100, Math.max(0, scrollTop / distance * 100)) : 100);
      setShowBackToTop(scrollTop >= 120);
    };
    update();
    window.addEventListener("scroll", update, { capture: true, passive: true });
    return () => window.removeEventListener("scroll", update, { capture: true });
  }, []);

  const scrollToTop = () => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior = isReduced ? "auto" : "smooth";
    const candidates = [
      document.documentElement,
      document.body,
      document.querySelector(".app-shell-main"),
      document.querySelector(".dashboard-main"),
      document.querySelector(".q-article-workspace"),
      document.querySelector(".q-document-panel")
    ];
    candidates.forEach((el) => {
      if (el) el.scrollTo({ top: 0, behavior });
    });
    window.scrollTo({ top: 0, behavior });
  };
  useEffect(() => {
    const shell = document.querySelector(".app-shell");
    shell?.classList.toggle("is-article-preview", mode === "preview");
    return () => shell?.classList.remove("is-article-preview");
  }, [mode]);
  useEffect(() => {
    if (!versions) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    versionDialogRef.current = document.querySelector<HTMLDivElement>(".q-version-drawer");
    versionCloseRef.current = versionDialogRef.current?.querySelector<HTMLButtonElement>("section > header button") || null;
    versionCloseRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); setVersions(null); return; }
      if (event.key !== "Tab") return;
      const focusable = [...(versionDialogRef.current?.querySelectorAll<HTMLElement>('button:not(.q-version-backdrop):not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])') || [])].filter((element) => !element.hidden && element.getClientRects().length > 0);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [versions]);

  function enterMode(next: Mode) { if (next === "edit") setContent(localStorage.getItem(recoveryKey) || content); setMode(next); }
  function updateEditorSelection() { const editor = editorRef.current; if (!editor) return; setSelection(editor.value.slice(editor.selectionStart, editor.selectionEnd).trim().slice(0, 4000)); }
  async function save() { setBusy(true); setMessage(""); try { const updated = await api.put<ArticleBlog>(`/blogs/${blog.id}`, { content, instruction: note.trim() || "Manual edit" }); setBlog(updated); setContent(updated.content); setMode("read"); setNote(""); localStorage.removeItem(recoveryKey); setVersions(null); setMessage("Draft saved as a new recoverable version."); } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to save this draft."); } finally { setBusy(false); } }
  async function refine(value: string, scope: "document" | "selection" = "document") {
    const request = scope === "selection" 
      ? `${value}. Rewrite only this selected passage and preserve the rest of the document exactly:\n\n${selection}` 
      : value;
    
    setRefinementStatus("loading");
    setRefinementError("");
    setLastInstruction(value);
    setLastScope(scope);
    if (originalTextBeforeRefine === null) {
      setOriginalTextBeforeRefine(content);
    }
    setBusy(true);
    setMessage("");

    try {
      const res = await api.post<{ refined_content: string }>(`/blogs/${blog.id}/refine`, {
        instruction: request,
        content: content
      });
      setContent(res.refined_content);
      setRefinementStatus("success");
      setBusy(false);
      setMessage("✓ Refinement ready");
    } catch (error) {
      setRefinementStatus("error");
      setRefinementError(error instanceof Error ? error.message : "Unable to generate refinement.");
      setBusy(false);
    }
  }

  async function applyRefinement() {
    setBusy(true);
    setMessage("");
    try {
      const updated = await api.put<ArticleBlog>(`/blogs/${blog.id}`, {
        content,
        instruction: `Refinement: ${lastInstruction}`
      });
      setBlog(updated);
      setContent(updated.content);
      setOriginalTextBeforeRefine(null);
      setRefinementStatus("idle");
      setVersions(null);
      setMessage("Draft saved with refinement applied as a new version.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save refinement.");
    } finally {
      setBusy(false);
    }
  }

  function discardRefinement() {
    if (originalTextBeforeRefine !== null) {
      setContent(originalTextBeforeRefine);
    }
    setOriginalTextBeforeRefine(null);
    setRefinementStatus("idle");
    setMessage("Refinement discarded.");
  }

  function retryRefine() {
    refine(lastInstruction, lastScope);
  }

  async function loadVersions() { try { const history = await api.get<Version[]>(`/blogs/${blog.id}/versions`); setVersions(history); setSelectedVersion(history[0] || null); setCompareVersion(false); } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to load version history."); } }
  async function restore(version: Version) {
    setBusy(true);
    try {
      const updated = await api.post<ArticleBlog>(`/blogs/${blog.id}/restore/${version.id}`);
      setBlog(updated);
      setContent(updated.content);
      setVersions(null);
      setSelectedVersion(null);
      setMessage(`Version ${version.version_number} restored as version ${updated.current_version}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to restore this version.");
    } finally {
      setBusy(false);
    }
  }
  async function copy(value: string, label: string) { await navigator.clipboard.writeText(value); setMessage(`${label} copied.`); }
  function navigateToCheck(targetId?: string) { if (!targetId) return; document.getElementById(targetId)?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" }); }

  if (mode === "preview") return <section className="q-publication-preview" aria-labelledby="preview-article-title">
    <div className="q-reading-progress" role="progressbar" aria-label="Article reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(readingProgress)}><span style={{ width: `${readingProgress}%` }} /></div>
    <button className="q-exit-preview" type="button" onClick={() => setMode("read")}><Eye aria-hidden="true" />Exit preview</button>
    <header className="q-publication-header">
      <p>QUILLOPS · READER PREVIEW</p>
      <h1 id="preview-article-title">{title}</h1>
      <span>{analysis.readingMinutes} min read · {analysis.words.toLocaleString()} words</span>
    </header>
    <article ref={articleRef} className="markdown-body q-publication-document" dangerouslySetInnerHTML={{ __html: html }} />
  </section>;

  return <section className="q-article-workspace" aria-labelledby="article-title">
    <div className="q-reading-progress" role="progressbar" aria-label="Article reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(readingProgress)}><span style={{ width: `${readingProgress}%` }} /></div>
    <header className="q-article-header"><div><p>ARTICLE WORKSPACE · VERSION {blog.current_version}</p><h1 id="article-title">{title}</h1><span>{analysis.words.toLocaleString()} words · {analysis.readingMinutes} min read · Saved {new Date(blog.updated_at).toLocaleString()}</span></div><div className="q-mode-switch" aria-label="Article mode">{(["read", "edit", "preview"] as Mode[]).map((item) => <button key={item} type="button" className={mode === item ? "is-active" : ""} aria-pressed={mode === item} onClick={() => enterMode(item)}>{item === "read" ? <FileText /> : item === "edit" ? <Pencil /> : <Eye />}{item}</button>)}</div></header>
    <div className="q-mobile-panel-switches"><button type="button" aria-expanded={mobileOutlineOpen} aria-controls="article-outline-panel" onClick={() => setMobileOutlineOpen((open) => !open)}><ListTree />Outline</button><button type="button" aria-expanded={mobileToolsOpen} aria-controls="article-tools-panel" onClick={() => setMobileToolsOpen((open) => !open)}><Sparkles />Tools</button></div>
    {message ? <div className="q-workspace-message" role="status">{message}<button type="button" onClick={() => setMessage("")} aria-label="Dismiss message"><X /></button></div> : null}
    <div className="q-article-layout">
      <aside id="article-outline-panel" className={`q-outline-panel ${mobileOutlineOpen ? "is-mobile-open" : ""}`}><div><ListTree /><span>ON THIS PAGE</span></div><nav aria-label="Article outline">{outline.length ? outline.map((item) => <button type="button" key={item.id} className={`${item.level === 3 ? "is-child" : ""} ${activeSection === item.id ? "is-active" : ""}`} aria-current={activeSection === item.id ? "location" : undefined} onClick={() => { setMobileOutlineOpen(false); document.getElementById(item.id)?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }); }}>{item.text}</button>) : <span>No section headings yet.</span>}</nav></aside>
      <main className="q-document-panel">
        {mode === "edit" ? <div className="q-editor"><div className="q-editor-meta"><span>{dirty ? "Unsaved changes" : "Saved"}</span><span>{analysis.words.toLocaleString()} words · {analysis.lines} lines</span></div><label htmlFor="article-editor">Markdown draft</label><textarea ref={editorRef} id="article-editor" value={content} onChange={(event) => setContent(event.target.value)} onSelect={updateEditorSelection} spellCheck="true" /><label htmlFor="revision-note">Revision note</label><input id="revision-note" value={note} onChange={(event) => setNote(event.target.value)} placeholder="What changed?" /><div><button type="button" className="btn btn-secondary" onClick={() => { setContent(blog.content); setMode("read"); }}>Cancel</button><button type="button" className="btn btn-primary" disabled={busy || !dirty} onClick={save}><Save />{busy ? "Saving…" : "Save new version"}</button></div></div> : <article ref={articleRef} className="markdown-body q-article-document" dangerouslySetInnerHTML={{ __html: html }} />}
      </main>
      <aside id="article-tools-panel" className={`q-inspector-panel ${mobileToolsOpen ? "is-mobile-open" : ""}`}>
        <section>
          <div className="q-panel-title"><Sparkles /><span>AI COPILOT</span></div>
          <p>Every accepted refinement preserves the current version first.</p>
          <div className="q-quick-actions">
            {["Improve clarity", "Make more concise", "Add technical depth", "Improve examples", "Improve introduction", "Improve conclusion", "Check structure"].map((action) => (
              <button type="button" key={action} disabled={busy} onClick={() => refine(action)}>
                <ChevronRight />{action}
              </button>
            ))}
            <button type="button" disabled={busy || !selection} onClick={() => refine("Rewrite for clarity and technical precision", "selection")}>
              <ChevronRight />Rewrite selection{selection ? ` (${selection.split(/\s+/).length} words)` : ""}
            </button>
          </div>
          <textarea aria-label="Custom AI instruction" value={instruction} onChange={(event) => setInstruction(event.target.value)} placeholder="Rewrite the introduction for backend engineers and add a practical analogy." />
          <button className="btn btn-primary" type="button" style={{ width: "100%" }} disabled={busy || instruction.trim().length < 3} onClick={() => refine(instruction.trim())}>
            <Bot />{busy && refinementStatus === "loading" ? "Generating..." : "Generate refinement"}
          </button>
          
          {refinementStatus === "loading" && (
            <div className="q-copilot-status is-loading" style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "12px", color: "#fbbf24", fontSize: "0.68rem" }}>
              <span className="q-spin" style={{ display: "inline-block" }}>⏳</span>
              <span>AI is rewriting your content...</span>
            </div>
          )}

          {refinementStatus === "success" && (
            <div className="q-copilot-status is-success" style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#4ade80", fontSize: "0.68rem" }}>
                <span>✓ Refinement ready</span>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button className="btn btn-primary" type="button" style={{ flex: 1, minHeight: "36px", fontSize: "0.62rem" }} onClick={applyRefinement} disabled={busy}>Apply to Document</button>
                <button className="btn btn-secondary" type="button" style={{ flex: 1, minHeight: "36px", fontSize: "0.62rem" }} onClick={discardRefinement} disabled={busy}>Discard</button>
              </div>
            </div>
          )}

          {refinementStatus === "error" && (
            <div className="q-copilot-status is-error" style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#f87171", fontSize: "0.68rem" }}>
                <span>⚠ Unable to generate refinement.</span>
              </div>
              <button className="btn btn-secondary" type="button" style={{ alignSelf: "flex-start", minHeight: "30px", fontSize: "0.6rem", padding: "0 10px" }} onClick={retryRefine} disabled={busy}>Retry</button>
            </div>
          )}
        </section>
        <section><div className="q-panel-title"><Check /><span>ARTICLE CHECKS</span></div><div className="q-check-summary"><strong>{analysis.passed} passed</strong><span>{analysis.attention} need attention</span></div><ul className="q-article-checks">{analysis.checks.map((check) => <li key={check.id} className={check.passed ? "is-good" : "is-attention"}>{check.targetId ? <button type="button" onClick={() => navigateToCheck(check.targetId)}>{check.passed ? <Check /> : <AlertTriangle />}<span><strong>{check.label}</strong><small>{check.detail}</small></span></button> : <div>{check.passed ? <Check /> : <AlertTriangle />}<span><strong>{check.label}</strong><small>{check.detail}</small></span></div>}</li>)}</ul></section>
        <section><div className="q-panel-title"><History /><span>VERSIONS</span></div><button type="button" className="q-panel-action" onClick={loadVersions}><FileClock />Open version history</button></section>
        <section><div className="q-panel-title"><Download /><span>EXPORT</span></div><div className="q-export-grid"><button type="button" onClick={() => copy(content, "Markdown")}><Clipboard />Copy Markdown</button><button type="button" onClick={() => download(`${safeFilename(title)}.md`, content, "text/markdown")}><Download />Download Markdown</button><button type="button" onClick={() => copy(articleRef.current?.innerText || content, "Rendered text")}><FileText />Copy rendered text</button><button type="button" onClick={() => download(`${safeFilename(title)}.html`, `<!doctype html><meta charset="utf-8"><title>${title.replace(/[<>]/g, "")}</title><article>${html}</article>`, "text/html")}><Code2 />Export HTML</button><button type="button" onClick={() => window.print()}><Printer />Print</button></div></section>
      </aside>
    </div>
    <button className={`q-back-to-top ${showBackToTop ? "is-visible" : ""}`} type="button" onClick={scrollToTop}><ArrowUp />Back to top</button>
    {versions ? <div className="q-version-drawer" role="dialog" aria-modal="true" aria-labelledby="version-title"><button className="q-version-backdrop" type="button" onClick={() => setVersions(null)} aria-label="Close version history" /><section><header><div><p>NON-DESTRUCTIVE HISTORY</p><h2 id="version-title">Version history</h2></div><button type="button" onClick={() => setVersions(null)} aria-label="Close version history"><X /></button></header><div className="q-version-layout"><ol>{versions.map((version, index) => { const delta = articleWordCount(version.content) - articleWordCount(versions[index + 1]?.content || version.content); return <li key={version.id} className={selectedVersion?.id === version.id ? "is-active" : ""}><div><strong>Version {version.version_number}</strong><span>{versionSource(version.edit_instruction)} · {delta === 0 ? "baseline" : `${delta > 0 ? "+" : ""}${delta} words`}</span><small>{version.edit_instruction || "Original generation"}</small><time dateTime={version.created_at}>{new Date(version.created_at).toLocaleString()}</time></div><div><button type="button" onClick={() => { setSelectedVersion(version); setCompareVersion(false); }}>Open</button><button type="button" onClick={() => { setSelectedVersion(version); setCompareVersion(true); }}>Compare</button><button type="button" onClick={() => restore(version)} disabled={busy}><RotateCcw />Restore</button></div></li>; })}</ol><div><div className="q-version-preview-meta"><strong>{selectedVersion ? `Version ${selectedVersion.version_number}` : "Preview"}</strong>{compareVersion && selectedVersion ? <span>{articleWordCount(selectedVersion.content) - analysis.words >= 0 ? "+" : ""}{articleWordCount(selectedVersion.content) - analysis.words} words versus current</span> : null}</div><article className="markdown-body q-version-preview" dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedVersion?.content || versions[0]?.content || "") }} /></div></div></section></div> : null}
  </section>;
}
