import { ArrowRight, Check, Eye, Minus } from "lucide-react";
import { MotionConfig, motion, useReducedMotion } from "motion/react";
import { ArchitectureSection } from "@/components/landing/architecture-section";
import { AboutSection } from "@/components/landing/about-section";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { FinalCta } from "@/components/landing/final-cta";
import { HeroProductPreview } from "@/components/landing/hero-product-preview";
import { HumanReviewSection } from "@/components/landing/human-review-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { WorkflowSection } from "@/components/landing/workflow-section";
import { AnimatedShaderHero } from "@/components/ui/animated-shader-hero";
import { MarketingWorkflowDemo } from "@/components/workflow/marketing-workflow-demo";

export function LandingPage() {
  const forceReducedMotion = new URLSearchParams(window.location.search).get("motion") === "reduce";
  const reducedMotion = useReducedMotion() || forceReducedMotion;
  const forceShaderFallback = new URLSearchParams(window.location.search).get("webgl") === "off";
  const heroItem = (delay: number) => ({
    initial: reducedMotion ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.48, delay: reducedMotion ? 0 : delay },
  });

  return (
    <MotionConfig reducedMotion={forceReducedMotion ? "always" : "user"}>
    <div className={`q-landing ${forceReducedMotion ? "is-reduced-motion" : ""}`} id="top">
      <a className="q-skip-link" href="#/section/main-content">Skip to content</a>
      <LandingNavbar />
      <main id="main-content">
        <AnimatedShaderHero forceFallback={forceShaderFallback} forceReducedMotion={forceReducedMotion}>
          <div className="q-hero-shell">
            <div className="q-hero-copy">
              <motion.p className="q-hero-eyebrow" {...heroItem(0.08)}><Eye aria-hidden="true" /> HUMAN-IN-THE-LOOP AI WRITING</motion.p>
              <motion.h1 {...heroItem(0.16)}>Technical writing,<br /><span>orchestrated.</span></motion.h1>
              <motion.p className="q-hero-description" {...heroItem(0.26)}>
                QuillOps researches your topic, designs the outline, waits for your approval, writes every section and preserves every revision—without taking editorial control away from you.
              </motion.p>
              <motion.div className="q-hero-actions" {...heroItem(0.36)}>
                <a className="q-button" href="#/register">Start writing <ArrowRight aria-hidden="true" /></a>
                <a className="q-button q-button-secondary" href="#/section/workflow">Explore the workflow</a>
              </motion.div>
              <motion.p className="q-hero-support" {...heroItem(0.44)}><span aria-hidden="true" />Research. Review. Generate. Refine.<span aria-hidden="true" /></motion.p>
            </div>
            <HeroProductPreview />
          </div>
        </AnimatedShaderHero>

        <section className="q-section q-positioning-section" aria-labelledby="positioning-title">
          <div className="q-shell">
            <div className="q-section-intro">
              <p className="q-eyebrow">NOT ANOTHER ONE-PROMPT WRITER</p>
              <h2 id="positioning-title">Great technical content needs a process.</h2>
              <p>One-shot tools collapse research, structure and judgment into an invisible answer. QuillOps exposes the work so you can shape it before prose is generated.</p>
            </div>
            <div className="q-comparison">
              <article className="q-comparison-card q-comparison-typical">
                <div className="q-comparison-heading"><span>Typical AI writer</span><small>BLACK BOX</small></div>
                <div className="q-simple-flow"><span>Prompt</span><ArrowRight aria-hidden="true" /><span>Generated article</span></div>
                <p><Minus aria-hidden="true" />The reasoning and editorial choices stay hidden.</p>
              </article>
              <article className="q-comparison-card q-comparison-quillops">
                <div className="q-comparison-heading"><span>QuillOps</span><small>VISIBLE WORKFLOW</small></div>
                <MarketingWorkflowDemo />
                <p><Check aria-hidden="true" />Each transition is explicit, inspectable and recoverable.</p>
              </article>
            </div>
          </div>
        </section>

        <WorkflowSection />
        <HumanReviewSection />
        <FeatureGrid />
        <ArchitectureSection />
        <AboutSection />
        <FinalCta />
      </main>
      <LandingFooter />
    </div>
    </MotionConfig>
  );
}
