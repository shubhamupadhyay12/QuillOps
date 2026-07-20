from __future__ import annotations

import os
import unittest
from unittest.mock import patch

os.environ.setdefault("NVIDIA_API_KEY", "test-key")

from backend import (
    ArticleValidationError,
    Plan,
    SectionGenerationError,
    Task,
    assemble_article,
    generate_article,
    generate_section_with_retry,
    validate_section_markdown,
)


def task(section_id: int, *, code: bool = False) -> Task:
    return Task(
        id=section_id,
        title=f"Section {section_id}",
        goal="Teach one precise part of the workflow.",
        bullets=["Context", "Mechanism", "Practical guidance"],
        target_words=250,
        requires_code=code,
    )


def plan() -> Plan:
    return Plan(
        blog_title="Reliable Workflows",
        audience="Backend engineers",
        tone="Precise",
        tasks=[task(index) for index in range(1, 6)],
    )


def section_text(section_id: int) -> str:
    body = " ".join(["reliable technical workflow detail"] * 12)
    return f"## Section {section_id}\n\n{body}."


class GenerationValidationTests(unittest.TestCase):
    def test_planner_word_count_must_fit_supported_bounds(self):
        self.assertEqual(task(1).model_copy(update={"target_words": 250}).target_words, 250)
        with self.assertRaises(Exception):
            Task.model_validate({**task(1).model_dump(), "target_words": 900})

    def test_section_rejects_empty_unbalanced_and_prompt_leaks(self):
        with self.assertRaises(SectionGenerationError):
            validate_section_markdown(task(1), "too short")
        with self.assertRaises(SectionGenerationError):
            validate_section_markdown(task(1), "## Section 1\n\n" + "word " * 30 + "```")
        with self.assertRaises(SectionGenerationError):
            validate_section_markdown(task(1), "## Section 1\n\nSystem message: " + "word " * 30)

    @patch("backend._invoke_section")
    def test_only_a_failed_section_is_retried(self, invoke):
        invoke.side_effect = [SectionGenerationError(3, "bad"), section_text(3)]
        payload = {"task": task(3).model_dump(), "topic": "topic", "mode": "approved_plan", "plan": plan().model_dump(), "evidence": []}
        self.assertEqual(generate_section_with_retry(payload), section_text(3))
        self.assertEqual(invoke.call_count, 2)

    def test_assembly_uses_approved_order_and_requires_every_section(self):
        current_plan = plan()
        sections = {index: section_text(index) for index in reversed(range(1, 6))}
        article = assemble_article(current_plan, sections)
        positions = [article.index(f"## Section {index}") for index in range(1, 6)]
        self.assertEqual(positions, sorted(positions))
        with self.assertRaises(ArticleValidationError):
            assemble_article(current_plan, {index: section_text(index) for index in range(1, 5)})

    @patch("backend.generate_section_with_retry")
    def test_generation_reuses_persisted_sections(self, generate):
        generate.side_effect = lambda payload: section_text(payload["task"]["id"])
        result = generate_article(
            plan().model_dump(),
            "topic",
            existing_sections={"1": section_text(1), "2": section_text(2)},
        )
        self.assertEqual(generate.call_count, 3)
        self.assertEqual(set(result["sections"]), {1, 2, 3, 4, 5})


if __name__ == "__main__":
    unittest.main()
