import { ArrowRight } from "lucide-react";

export function FinalCta() {
  return (
    <section className="q-final-cta" aria-labelledby="final-cta-title">
      <div className="q-final-glow" aria-hidden="true" />
      <div className="q-shell q-final-cta-inner">
        <p className="q-eyebrow">YOUR NEXT DRAFT, WITH YOU IN THE LOOP</p>
        <h2 id="final-cta-title">Turn your next idea into a technical draft you control.</h2>
        <div className="q-hero-actions">
          <a className="q-button" href="#/register">Create your first blog <ArrowRight aria-hidden="true" /></a>
          <a className="q-button q-button-secondary" href="#/login">Log in</a>
        </div>
      </div>
    </section>
  );
}
