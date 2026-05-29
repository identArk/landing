import type { ReactNode } from "react";

type Tone = "navy" | "success" | "danger" | "brass" | "warning" | "cool";

type Feature = {
  tone: Tone;
  span: 4 | 6 | 8;
  tag?: string;
  title: string;
  body: string;
  icon: ReactNode;
};

const Icon = {
  Vault: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Audit: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  ),
  Cost: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  Stream: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  Test: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Hitl: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Risk: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20V10M18 20V4M6 20v-4" />
    </svg>
  ),
};

const features: Feature[] = [
  {
    tone: "navy",
    span: 8,
    tag: "Core",
    title: "Zero-secret execution",
    body:
      "Every LLM call routes through the gateway. Credentials are fetched from Vault per-request and discarded immediately. Your agent process never holds a secret — not even in memory between calls.",
    icon: Icon.Vault,
  },
  {
    tone: "cool",
    span: 4,
    title: "Immutable audit log",
    body:
      "Every call logged: agent ID, tool, timestamp, cost, latency. Append-only. Your compliance team will finally sign off.",
    icon: Icon.Audit,
  },
  {
    tone: "warning",
    span: 4,
    title: "Cost caps per agent",
    body:
      "Set a hard limit per session or per month. When the cap hits, the gateway raises a typed exception. No runaway bills.",
    icon: Icon.Cost,
  },
  {
    tone: "brass",
    span: 4,
    title: "Streaming via SSE",
    body:
      "Real-time token streaming with no latency penalty. Same secure gateway, same zero-credential model.",
    icon: Icon.Stream,
  },
  {
    tone: "success",
    span: 4,
    title: "MockGateway for testing",
    body:
      "Built-in test gateway lets you unit test every agent behaviour — no real credentials, no network, no cost.",
    icon: Icon.Test,
  },
  {
    tone: "danger",
    span: 4,
    title: "Human-in-the-Loop approvals",
    body:
      "High-risk agent operations pause for human review with MFA-verified decisions. Custom policies define what “high risk” means for your organisation.",
    icon: Icon.Hitl,
  },
  {
    tone: "navy",
    span: 4,
    title: "Real-time risk scoring",
    body:
      "Every tool call analysed across six dimensions. Critical operations flagged automatically. Low-risk operations approved in 23 milliseconds.",
    icon: Icon.Risk,
  },
];

export function FeaturesSection() {
  return (
    <section className="section" id="features">
      <div className="section-tag">Features</div>
      <h2 className="section-title">Built for production agents</h2>
      <p className="section-sub">Everything you need to run secure, auditable AI workloads — from dev to enterprise.</p>

      <div className="bento">
        {features.map((f) => (
          <div key={f.title} className={`bento-card tone-${f.tone} c-${f.span}`}>
            <div className="card-icon">{f.icon}</div>
            {f.tag ? <div className="card-tag">{f.tag}</div> : null}
            <h3>{f.title}</h3>
            <p>{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
