import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

interface BulletPointEditorProps {
  sectionId: number;
  bullets: string[];
  onChange: (bullets: string[]) => void;
  invalid?: boolean;
}

function resizeTextarea(element: HTMLTextAreaElement) {
  element.style.height = "auto";
  element.style.height = `${element.scrollHeight}px`;
}

export function BulletPointEditor({ sectionId, bullets, onChange, invalid = false }: BulletPointEditorProps) {
  const update = (index: number, value: string) => onChange(bullets.map((bullet, bulletIndex) => bulletIndex === index ? value : bullet));
  const move = (index: number, offset: number) => {
    const next = [...bullets];
    [next[index], next[index + offset]] = [next[index + offset], next[index]];
    onChange(next);
    requestAnimationFrame(() => document.getElementById(`section-${sectionId}-bullet-${index + offset}`)?.focus());
  };
  const remove = (index: number) => {
    if (bullets.length <= 3) return;
    onChange(bullets.filter((_, bulletIndex) => bulletIndex !== index));
    requestAnimationFrame(() => document.getElementById(`section-${sectionId}-bullet-${Math.max(0, index - 1)}`)?.focus());
  };
  const add = () => {
    if (bullets.length >= 6) return;
    const nextIndex = bullets.length;
    onChange([...bullets, ""]);
    requestAnimationFrame(() => document.getElementById(`section-${sectionId}-bullet-${nextIndex}`)?.focus());
  };

  return (
    <fieldset className="q-bullet-editor">
      <div className="q-fieldset-heading"><legend>Outline points</legend><span>{bullets.length} of 6</span></div>
      <div className="q-bullet-list">
        {bullets.map((bullet, index) => (
          <div className="q-bullet-row" key={`${sectionId}-${index}`}>
            <span className="q-bullet-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <textarea
              id={`section-${sectionId}-bullet-${index}`}
              rows={1}
              value={bullet}
              aria-label={`Section bullet point ${index + 1}`}
              aria-invalid={invalid && !bullet.trim()}
              onInput={(event) => resizeTextarea(event.currentTarget)}
              onFocus={(event) => resizeTextarea(event.currentTarget)}
              onChange={(event) => update(index, event.target.value)}
            />
            <div className="q-bullet-actions">
              <button type="button" disabled={index === 0} onClick={() => move(index, -1)} aria-label={`Move bullet ${index + 1} up`}><ArrowUp aria-hidden="true" /></button>
              <button type="button" disabled={index === bullets.length - 1} onClick={() => move(index, 1)} aria-label={`Move bullet ${index + 1} down`}><ArrowDown aria-hidden="true" /></button>
              <button type="button" className="is-danger" disabled={bullets.length <= 3} onClick={() => remove(index)} aria-label={`Remove bullet ${index + 1}`}><Trash2 aria-hidden="true" /></button>
            </div>
          </div>
        ))}
      </div>
      <button className="q-add-bullet" type="button" onClick={add} disabled={bullets.length >= 6}><Plus aria-hidden="true" /> Add bullet point</button>
      {invalid ? <p className="q-field-error">Each section needs 3 to 6 complete bullet points.</p> : null}
    </fieldset>
  );
}

