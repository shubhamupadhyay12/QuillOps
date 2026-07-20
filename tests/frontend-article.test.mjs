import test from "node:test";
import assert from "node:assert/strict";
import { analyzeArticle, articleWordCount, versionSource } from "../frontend/src/lib/article-analysis.ts";

test("article checks are deterministic and expose actionable failures", () => {
  const markdown = "# Draft\n\n## Repeated\n\nShort.\n\n## Repeated\n\n[empty]()\n\n```ts\nconst open = true";
  const analysis = analyzeArticle(markdown, 1200);
  assert.equal(analysis.words, articleWordCount(markdown));
  assert.ok(analysis.attention >= 4);
  assert.equal(analysis.checks.find((check) => check.id === "duplicates")?.passed, false);
  assert.equal(analysis.checks.find((check) => check.id === "fences")?.passed, false);
  assert.equal(analysis.checks.find((check) => check.id === "links")?.passed, false);
});

test("version sources use stored edit instructions rather than invented metadata", () => {
  assert.equal(versionSource(null), "Initial generation");
  assert.equal(versionSource("Manual edit"), "Manual edit");
  assert.equal(versionSource("Restored version 2"), "Restored version");
  assert.equal(versionSource("Improve clarity"), "AI refinement");
});
