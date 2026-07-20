import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { clampWordBudget, SECTION_WORD_MAX, SECTION_WORD_MIN, SECTION_WORD_STEP, WORD_BUDGET_PRESETS } from "@/lib/review-metrics";

interface SectionWordBudgetProps {
  sectionId: number;
  value: number;
  onChange: (value: number) => void;
  invalid?: boolean;
}

export function SectionWordBudget({ sectionId, value, onChange, invalid = false }: SectionWordBudgetProps) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);

  const commit = (candidate: number) => {
    const next = clampWordBudget(candidate);
    setDraft(String(next));
    onChange(next);
  };

  const fill = ((value - SECTION_WORD_MIN) / (SECTION_WORD_MAX - SECTION_WORD_MIN)) * 100;
  const errorId = `section-${sectionId}-words-error`;

  return (
    <fieldset className="q-word-budget" aria-describedby={invalid ? errorId : undefined}>
      <legend>Word budget</legend>
      <div className="q-budget-presets" aria-label="Word budget presets">
        {WORD_BUDGET_PRESETS.map((preset) => (
          <button key={preset.id} type="button" className={value === preset.value ? "is-selected" : ""} onClick={() => commit(preset.value)} aria-pressed={value === preset.value}>
            <span>{preset.label}</span><small>{preset.value}</small>
          </button>
        ))}
      </div>
      <div className="q-budget-stepper">
        <button type="button" onClick={() => commit(value - SECTION_WORD_STEP)} disabled={value <= SECTION_WORD_MIN} aria-label="Decrease word budget"><Minus aria-hidden="true" /></button>
        <label htmlFor={`section-${sectionId}-words`}>
          <span className="q-visually-hidden">Section word budget</span>
          <input
            id={`section-${sectionId}-words`}
            type="number"
            min={SECTION_WORD_MIN}
            max={SECTION_WORD_MAX}
            step={SECTION_WORD_STEP}
            inputMode="numeric"
            value={draft}
            aria-invalid={invalid}
            onChange={(event) => {
              const nextDraft = event.target.value;
              setDraft(nextDraft);
              const parsed = Number(nextDraft);
              if (nextDraft !== "" && Number.isFinite(parsed) && parsed >= SECTION_WORD_MIN && parsed <= SECTION_WORD_MAX) onChange(parsed);
            }}
            onBlur={() => commit(Number(draft))}
          />
          <span>words</span>
        </label>
        <button type="button" onClick={() => commit(value + SECTION_WORD_STEP)} disabled={value >= SECTION_WORD_MAX} aria-label="Increase word budget"><Plus aria-hidden="true" /></button>
      </div>
      <input className="q-budget-range" type="range" min={SECTION_WORD_MIN} max={SECTION_WORD_MAX} step={SECTION_WORD_STEP} value={value} onChange={(event) => commit(Number(event.target.value))} aria-label="Fine-adjust word budget" />
      <div className="q-budget-bar" aria-hidden="true"><span style={{ width: `${Math.max(0, Math.min(100, fill))}%` }} /></div>
      <div className="q-budget-limits"><span>{SECTION_WORD_MIN} minimum</span><strong>{value} words</strong><span>{SECTION_WORD_MAX} maximum</span></div>
      {invalid ? <p className="q-field-error" id={errorId}>Enter between {SECTION_WORD_MIN} and {SECTION_WORD_MAX} words.</p> : null}
    </fieldset>
  );
}

