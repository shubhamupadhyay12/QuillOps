import { Bot, GitBranch, History, Layers3, LockKeyhole, PanelsTopLeft } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const features = [
  [PanelsTopLeft, "Persistent workspace", "Close the app and return days later without losing your work."],
  [GitBranch, "Durable AI pipeline", "Paused workflows survive process restarts and resume correctly."],
  [Layers3, "Parallel section writing", "Sections can be generated independently and assembled consistently."],
  [Bot, "AI-assisted editing", "Give focused instructions without regenerating the entire article."],
  [History, "Version history", "Every meaningful edit creates a recoverable revision."],
  [LockKeyhole, "Private by default", "Each user can access only their own blogs."],
] as const;

export function FeatureGrid() {
  const reducedMotion = useReducedMotion();
  return (
    <section className="q-section q-features-section" id="features" aria-labelledby="features-title">
      <div className="q-shell">
        <div className="q-section-intro q-section-intro-left">
          <p className="q-eyebrow">BUILT FOR WORK THAT CONTINUES</p>
          <h2 id="features-title">A workspace with memory.</h2>
          <p>Not a disposable chat. A durable environment for long-form technical work.</p>
        </div>
        <div className="q-feature-grid">
          {features.map(([Icon, title, description], index) => (
            <motion.article
              key={title}
              className="q-feature-card"
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35, delay: reducedMotion ? 0 : (index % 3) * 0.06 }}
            >
              <span className="q-feature-icon"><Icon aria-hidden="true" /></span>
              <h3>{title}</h3><p>{description}</p>
              <span className="q-card-index">0{index + 1}</span>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
