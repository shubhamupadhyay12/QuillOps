export interface ArticleCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
  targetId?: string;
}

export interface ArticleAnalysis {
  checks: ArticleCheck[];
  passed: number;
  attention: number;
  words: number;
  lines: number;
  readingMinutes: number;
}

export function articleWordCount(markdown: string): number {
  return markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
}

export function analyzeArticle(markdown: string, targetWords?: number, citationsRequired = false): ArticleAnalysis {
  const headings = [...markdown.matchAll(/^(#{1,6})\s+(.+)$/gm)].map((match, index) => ({ level: match[1].length, title: match[2].trim(), id: `section-${Math.max(0, index - 1)}` }));
  const primary = headings.filter((heading) => heading.level === 2);
  const duplicate = primary.find((heading, index) => primary.findIndex((candidate) => candidate.title.toLocaleLowerCase() === heading.title.toLocaleLowerCase()) !== index);
  const hierarchyIssue = headings.find((heading, index) => index > 0 && heading.level - headings[index - 1].level > 1);
  const sectionBodies = markdown.split(/^##\s+/m).slice(1).map((section, index) => ({ id: `section-${index}`, words: articleWordCount(section.replace(/^.+\n/, "")) }));
  const emptySection = sectionBodies.find((section) => section.words === 0);
  const shortSection = sectionBodies.find((section) => section.words > 0 && section.words < 40);
  const emptyLink = /\[[^\]]*\]\(\s*\)/.test(markdown);
  const count = articleWordCount(markdown);
  const checks: ArticleCheck[] = [
    { id: "title", label: "Document title", passed: headings.filter((heading) => heading.level === 1).length === 1, detail: "Use exactly one H1 title." },
    { id: "hierarchy", label: "Heading hierarchy", passed: !hierarchyIssue, detail: hierarchyIssue ? `Heading “${hierarchyIssue.title}” skips a level.` : "Heading levels progress in order.", targetId: hierarchyIssue?.id },
    { id: "empty-sections", label: "No empty sections", passed: !emptySection, detail: emptySection ? "A section has no body content." : "Every section contains content.", targetId: emptySection?.id },
    { id: "short-sections", label: "Section depth", passed: !shortSection, detail: shortSection ? `A section has only ${shortSection.words} words.` : "Sections have useful depth.", targetId: shortSection?.id },
    { id: "duplicates", label: "Unique section headings", passed: !duplicate, detail: duplicate ? `Duplicate heading: “${duplicate.title}”.` : "Primary headings are unique.", targetId: duplicate?.id },
    { id: "fences", label: "Balanced code fences", passed: (markdown.match(/```/g)?.length ?? 0) % 2 === 0, detail: "Every fenced code block must close." },
    { id: "links", label: "Links have destinations", passed: !emptyLink, detail: emptyLink ? "At least one Markdown link is empty." : "Markdown links include destinations." },
    { id: "citations", label: "Required citations", passed: !citationsRequired || /https?:\/\//.test(markdown), detail: citationsRequired ? "The approved plan requires at least one source URL." : "The approved plan does not require citations." },
    { id: "length", label: "Document length", passed: count >= 300, detail: `${count.toLocaleString()} total words.` },
  ];
  if (targetWords) checks.push({ id: "target", label: "Target allocation", passed: Math.abs(count - targetWords) <= Math.max(150, targetWords * .25), detail: `${count.toLocaleString()} of ${targetWords.toLocaleString()} planned words.` });
  return { checks, passed: checks.filter((check) => check.passed).length, attention: checks.filter((check) => !check.passed).length, words: count, lines: markdown ? markdown.split(/\r?\n/).length : 0, readingMinutes: Math.max(1, Math.ceil(count / 220)) };
}

export function versionSource(instruction?: string | null): string {
  const value = (instruction || "").toLocaleLowerCase();
  if (!value) return "Initial generation";
  if (value.startsWith("restored version")) return "Restored version";
  if (value === "manual edit" || value.includes("manual")) return "Manual edit";
  return "AI refinement";
}
