import { Check, Code2, Globe2, Quote } from "lucide-react";
import type { ReviewTask } from "@/components/review/types";

interface SectionRequirementsProps {
  task: ReviewTask;
  onChange: (changes: Partial<ReviewTask>) => void;
}

const requirements = [
  ["requires_research", "Web research", Globe2, "Use current external evidence"],
  ["requires_citations", "Citations", Quote, "Include source attribution"],
  ["requires_code", "Code block", Code2, "Include a practical code example"],
] as const;

export function SectionRequirements({ task, onChange }: SectionRequirementsProps) {
  return (
    <fieldset className="q-requirements">
      <legend>Generation requirements</legend>
      <div className="q-requirement-grid">
        {requirements.map(([field, label, Icon, description]) => {
          const selected = task[field];
          return (
            <label className={selected ? "is-selected" : ""} key={field}>
              <input type="checkbox" checked={selected} onChange={(event) => onChange({ [field]: event.target.checked })} />
              <Icon aria-hidden="true" /><span><strong>{label}</strong><small>{description}</small></span>{selected ? <Check className="q-requirement-check" aria-hidden="true" /> : null}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

