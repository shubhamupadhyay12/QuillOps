import { ExternalLink, Globe2 } from "lucide-react";
import type { EvidenceItem } from "@/components/review/types";

function domainFor(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return "source"; }
}

export function ResearchContextCard({ evidence }: { evidence: EvidenceItem[] }) {
  return (
    <section className="q-research-context" aria-labelledby="research-context-title">
      <div className="q-review-card-heading"><span><Globe2 aria-hidden="true" /> RESEARCH CONTEXT</span><small>{evidence.length} {evidence.length === 1 ? "source" : "sources"}</small></div>
      <h2 id="research-context-title">Research context</h2>
      {evidence.length ? <div className="q-source-list">{evidence.map((item, index) => <article key={`${item.url}-${index}`}><strong>{item.title}</strong><span>{domainFor(item.url)}</span>{item.snippet ? <p>{item.snippet}</p> : null}<a href={item.url} target="_blank" rel="noopener noreferrer">Open source <ExternalLink aria-hidden="true" /></a></article>)}</div> : <div className="q-research-empty"><Globe2 aria-hidden="true" /><strong>No research sources attached</strong><p>This plan can still be approved. Enable web research for sections that need current evidence or citations.</p></div>}
    </section>
  );
}

