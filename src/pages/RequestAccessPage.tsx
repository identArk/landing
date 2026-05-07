import "@/styles/request-access.css";
import { FormEvent, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Plausible } from "@/components/Plausible";
import { LogoMark } from "@/components/LogoMark";

const API_BASE = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:8000"
  : "https://api.identark.io");

const PROVIDERS = ["OpenAI", "Anthropic", "Google Gemini", "Mistral", "AWS Bedrock", "Other"] as const;

export function RequestAccessPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [providerState, setProviderState] = useState<Record<string, boolean>>(
    () => Object.fromEntries(PROVIDERS.map((p) => [p, false])) as Record<string, boolean>,
  );

  function toggleProvider(p: string, checked: boolean) {
    setProviderState((s) => ({ ...s, [p]: checked }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const picked = Object.entries(providerState).filter(([, v]) => v).map(([k]) => k);
    if (picked.length === 0) {
      setError("Please select at least one LLM provider.");
      return;
    }
    setLoading(true);
    setError("");
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch(`${API_BASE}/v1/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          company: formData.get("company"),
          building: formData.get("building"),
          providers: picked.join(", "),
          current_solution: formData.get("current_solution") || null,
        }),
      });
      const result = await res.json();
      let errMsg = "Submission failed";
      if (Array.isArray(result.detail)) {
        errMsg = result.detail.map((d: any) => d.msg).join(", ");
      } else if (result.detail?.message) {
        errMsg = result.detail.message;
      } else if (result.message) {
        errMsg = result.message;
      }
      if (!res.ok) throw new Error(errMsg);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Request Early Access — IdentArk</title>
        <meta
          name="description"
          content="Join IdentArk's private beta. Tell us about your project and get early access to the credential layer for AI agents."
        />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <Plausible />

      <div className="access-app">
        <header>
          <Link to="/" className="logo">
            <div className="logo-mark">
              <LogoMark />
            </div>
            IdentArk
          </Link>
          <Link to="/" className="header-link">
            ← Back to home
          </Link>
        </header>

        <main>
          <div className="form-container">
            <div className="form-header">
              <h1>Request Early Access</h1>
              <p>
                Get early access to IdentArk. Tell us about your project and we&apos;ll be in touch within 24 hours.
              </p>
            </div>

            <div className="form-card">
              <div className={`success-message ${success ? "show" : ""}`}>
                <div className="success-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h2>Thank you!</h2>
                <p>We&apos;ve received your request and will review it shortly. Expect to hear from us within 24 hours at the email you provided.</p>
                <Link to="/">Back to homepage</Link>
              </div>

              {!success ? (
                <form onSubmit={onSubmit}>

                  <div className={`error-message ${error ? "is-visible" : ""}`}>
                    <p>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      <span className="error-text">{error || "Something went wrong. Please try again."}</span>
                    </p>
                  </div>

                  <div className="form-group">
                    <label htmlFor="name">
                      Full Name <span className="required">*</span>
                    </label>
                    <input type="text" id="name" name="name" placeholder="Jane Doe" required autoComplete="name" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      Work Email <span className="required">*</span>
                    </label>
                    <input type="email" id="email" name="email" placeholder="jane@company.com" required autoComplete="email" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="company">
                      Company / Project Name <span className="required">*</span>
                    </label>
                    <input type="text" id="company" name="company" placeholder="Acme Inc." required autoComplete="organization" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="building">
                      What are you building? <span className="required">*</span>
                    </label>
                    <textarea id="building" name="building" placeholder="Tell us about your AI agent or application..." required />
                  </div>

                  <div className="checkbox-group">
                    <label>
                      Which LLM providers do you use? <span className="required">*</span>
                    </label>
                    <div className="checkbox-options">
                      {PROVIDERS.map((p) => (
                        <label key={p} className={`checkbox-option ${providerState[p] ? "checked" : ""}`}>
                          <input
                            type="checkbox"
                            name="providers"
                            value={p}
                            checked={providerState[p]}
                            onChange={(e) => toggleProvider(p, e.target.checked)}
                          />
                          <span>{p}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="current-solution">
                      How are you currently managing API keys? <span style={{ color: "var(--fg-3)", fontWeight: 400 }}>(optional)</span>
                    </label>
                    <textarea id="current-solution" name="current_solution" placeholder="Environment variables, secrets manager, etc." />
                  </div>

                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "Submitting…" : "Request Access"}
                  </button>
                </form>
              ) : null}
            </div>
          </div>
        </main>

        <footer>
          <span>© 2026 IdentArk</span>
          <div className="footer-links">
            <a href="https://github.com/identark/sdk" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://github.com/identark/sdk#readme" target="_blank" rel="noopener noreferrer">
              Docs
            </a>
            <a href="mailto:hello@identark.io">Contact</a>
          </div>
        </footer>
      </div>
    </>
  );
}
