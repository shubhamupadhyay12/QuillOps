import { ArrowRight, Check, Eye, EyeOff, Github, LoaderCircle, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState, type FormEvent } from "react";
import { AnimatedShaderHero } from "@/components/ui/animated-shader-hero";
import { AnimatedWorkflowSteps } from "@/components/workflow/animated-workflow-steps";
import { AuthBrandHeader } from "@/components/auth/auth-brand-header";
import { api, auth, type TokenResponse } from "@/lib/api-client";

export type AuthMode = "login" | "register";

interface AuthPageProps { mode: AuthMode }

const workflow = [
  { label: "Research the topic" },
  { label: "Review the plan" },
  { label: "Write in parallel" },
  { label: "Preserve every revision" },
] as const;

export function AuthPage({ mode }: AuthPageProps) {
  const isLogin = mode === "login";
  const reducedMotion = useReducedMotion();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setNotice("");
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Enter your password.");
      return;
    }
    if (!isLogin && password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const result = await api.post<TokenResponse>(isLogin ? "/auth/login" : "/auth/register", { email: normalizedEmail, password });
      if (!result.access_token) throw new Error("The API did not return an access token.");
      auth.setSession(result.access_token, normalizedEmail, remember);
      setNotice(isLogin ? "Signed in. Opening your workspace…" : "Account created. Opening your workspace…");
      window.setTimeout(() => { window.location.hash = "#/dashboard"; }, reducedMotion ? 0 : 350);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Authentication failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="q-landing q-auth-page">
      <a className="q-skip-link" href="#auth-form">Skip to authentication form</a>
      <AnimatedShaderHero className="q-auth-shader" variant="ambient">
        <main className="q-auth-shell">
          <motion.section
            className="q-auth-card"
            aria-labelledby="auth-title"
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .4 }}
          >
            <AuthBrandHeader />
            <div className="q-auth-heading">
              <p className="q-eyebrow">{isLogin ? "WELCOME BACK" : "CREATE YOUR WORKSPACE"}</p>
              <h1 id="auth-title">{isLogin ? "Continue your workspace." : "Start with an idea."}</h1>
              <p>{isLogin ? "Sign in to resume your drafts, workflow checkpoints and revision history." : "Create an account for a persistent, human-controlled writing workflow."}</p>
            </div>

            <div className="q-auth-toast-stack" aria-live="polite" aria-atomic="true">
              {error && <div className="q-auth-toast is-error" role="alert">{error}</div>}
              {notice && <div className="q-auth-toast is-success" role="status"><Check aria-hidden="true" />{notice}</div>}
            </div>

            <form id="auth-form" className="q-auth-form" onSubmit={submit} noValidate>
              <label htmlFor="auth-email">Email address</label>
              <div className="q-auth-input-wrap"><Mail aria-hidden="true" /><input id="auth-email" type="email" inputMode="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" aria-invalid={Boolean(error && !/^\S+@\S+\.\S+$/.test(email))} disabled={loading} /></div>
              <div className="q-auth-label-row"><label htmlFor="auth-password">Password</label></div>
              <div className="q-auth-input-wrap"><LockKeyhole aria-hidden="true" /><input id="auth-password" type={showPassword ? "text" : "password"} autoComplete={isLogin ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={isLogin ? "Your password" : "At least 8 characters"} disabled={loading} /><button type="button" className="q-password-toggle" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}</button></div>
              <label className="q-remember-control"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /><span aria-hidden="true"><Check /></span><span>{isLogin ? "Remember me on this device" : "Keep me signed in on this device"}</span></label>
              <button className="q-button q-auth-submit" type="submit" disabled={loading}>{loading ? <><LoaderCircle className="q-spin" aria-hidden="true" />{isLogin ? "Signing in…" : "Creating account…"}</> : <>{isLogin ? "Continue" : "Create account"}<ArrowRight aria-hidden="true" /></>}</button>
            </form>

            <div className="q-auth-divider"><span>or continue with</span></div>
            <div className="q-social-placeholders" aria-label="Social login options coming soon">
              <button type="button" disabled aria-label="Google sign in coming soon"><span className="q-google-mark" aria-hidden="true">G</span>Google <small>Coming soon</small></button>
              <button type="button" disabled aria-label="GitHub sign in coming soon"><Github aria-hidden="true" />GitHub <small>Coming soon</small></button>
            </div>
            <p className="q-auth-switch">{isLogin ? "New to QuillOps?" : "Already have an account?"} <a href={isLogin ? "#/register" : "#/login"}>{isLogin ? "Create an account" : "Sign in"}</a></p>
          </motion.section>

          <motion.aside className="q-auth-workflow" initial={reducedMotion ? false : { opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .45, delay: reducedMotion ? 0 : .12 }} aria-label="QuillOps workflow overview">
            <div className="q-auth-workflow-header"><span><ShieldCheck aria-hidden="true" />HUMAN CHECKPOINT ACTIVE</span><small>WORKFLOW 01</small></div>
            <h2>Writing that waits<br />for your judgment.</h2>
            <p>QuillOps keeps the process visible and pauses before generation so structure stays an editorial decision.</p>
            <AnimatedWorkflowSteps steps={workflow} variant="compact" orientation="vertical" showDescriptions={false} />
            <div className="q-auth-workflow-foot"><span aria-hidden="true" />Persistent state · Durable checkpoints</div>
          </motion.aside>
        </main>
      </AnimatedShaderHero>
    </div>
  );
}
