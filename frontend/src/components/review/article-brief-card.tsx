import { FileText } from "lucide-react";
import type { ReviewFormState } from "@/components/review/types";
import { estimatedReadingMinutes } from "@/lib/review-metrics";

interface ArticleBriefCardProps {
  form: ReviewFormState;
  onChange: (changes: Partial<ReviewFormState>) => void;
  invalidFields: Set<string>;
}

const lengthPresets = [
  ["Quick guide", 1000, "800–1,200 words"],
  ["Standard article", 1800, "1,500–2,200 words"],
  ["Deep dive", 3000, "2,500–3,500 words"],
] as const;

export function ArticleBriefCard({ form, onChange, invalidFields }: ArticleBriefCardProps) {
  return (
    <section className="q-article-brief" aria-labelledby="article-brief-title">
      <div className="q-review-card-heading"><span><FileText aria-hidden="true" /> ARTICLE BRIEF</span><small>{estimatedReadingMinutes(form.targetWords)}-minute target read</small></div>
      <h2 id="article-brief-title">Article configuration</h2>
      <div className="q-brief-grid">
        <label className="is-wide" htmlFor="article-title">Proposed article title<input id="article-title" value={form.blog_title} aria-invalid={invalidFields.has("article-title")} onChange={(event) => onChange({ blog_title: event.target.value })} /></label>
        <label htmlFor="article-audience">Target audience<input id="article-audience" value={form.audience} aria-invalid={invalidFields.has("article-audience")} onChange={(event) => onChange({ audience: event.target.value })} /></label>
        <label htmlFor="article-tone">Tone<input id="article-tone" value={form.tone} aria-invalid={invalidFields.has("article-tone")} onChange={(event) => onChange({ tone: event.target.value })} /></label>
        <label htmlFor="article-kind">Content archetype<select id="article-kind" value={form.blog_kind} onChange={(event) => onChange({ blog_kind: event.target.value as ReviewFormState["blog_kind"] })}><option value="explainer">Explainer</option><option value="tutorial">Tutorial</option><option value="news_roundup">News roundup</option><option value="comparison">Comparison</option><option value="system_design">System design</option></select></label>
        <label htmlFor="article-objective">Optional writing objective<textarea id="article-objective" rows={2} value={form.writingObjective} placeholder="What should the reader be able to do after reading?" onChange={(event) => onChange({ writingObjective: event.target.value })} /></label>
      </div>
      <fieldset className="q-target-length">
        <legend>Total target length</legend>
        <div className="q-length-presets">{lengthPresets.map(([label, value, range]) => <button key={label} type="button" className={form.targetWords === value ? "is-selected" : ""} aria-pressed={form.targetWords === value} onClick={() => onChange({ targetWords: value })}><strong>{label}</strong><span>{range}</span></button>)}</div>
        <label htmlFor="article-target-words">Custom target<input id="article-target-words" type="number" min="600" max="6000" step="100" value={form.targetWords} onChange={(event) => { const value = Number(event.target.value); if (Number.isFinite(value)) onChange({ targetWords: Math.min(6000, Math.max(600, value)) }); }} /><span>words</span></label>
      </fieldset>
    </section>
  );
}

