import type { ReactNode } from "react";

const faqs: { q: string; a: ReactNode }[] = [
  {
    q: "Why not just use environment variables?",
    a: "Env vars are accessible to your agent's entire process. A prompt injection attack, a confused agent, or a malicious tool call can read and exfiltrate them. IdentArk ensures your agent only holds a session token — the actual credentials never enter the agent process.",
  },
  {
    q: "Does this add latency to my LLM calls?",
    a: "Our benchmark shows under 1.5ms of SDK overhead per call — less than 0.001% of typical LLM response time (300–800ms). The vault fetch happens in parallel with request setup and is not on the critical path.",
  },
  {
    q: "How does this compare to LangSmith / Langfuse?",
    a: "LangSmith and Langfuse are observability tools — they record what your agent did. IdentArk is a control plane — it decides what your agent is allowed to do, in real time, before the call lands. The two are complementary: you can stream IdentArk's audit log into either platform for dashboards.",
  },
  {
    q: "What data leaves my infrastructure?",
    a: "Audit metadata only: timestamps, token counts, cost, agent IDs, tool names, and risk scores. Prompt content, response content, and raw arguments stay in your own environment. The gateway is the only IdentArk-hosted component, and it can be self-hosted on the Business tier and above.",
  },
  {
    q: "Which LLM providers do you support?",
    a: "OpenAI, Anthropic, Mistral, AWS Bedrock, Azure OpenAI, and Google Gemini. Adding a new provider takes minutes — register the API key in the vault and start making calls.",
  },
  {
    q: "Is there a self-hosted option?",
    a: "Yes. Business tier supports private cloud deployment in your AWS, GCP, or Azure account. Enterprise tier supports fully air-gapped on-prem installs. The control plane, vault, and audit log all run inside your perimeter.",
  },
  {
    q: "What's your SOC 2 / ISO status?",
    a: "ISO 27001 controls are implemented and undergoing audit. SOC 2 Type II is in observation period. Full mapping documentation and the auditor's bridge letter are available under NDA — email hello@identark.io.",
  },
  {
    q: "Do you store my prompts or responses?",
    a: "No. Audit logs record metadata only: timestamps, token counts, costs, agent IDs. Prompt and response content is never stored.",
  },
  {
    q: "What happens if an agent tries to delete production data?",
    a: "The operation is intercepted by the gateway. The risk scoring engine calculates a critical score (typically 90–100). The Destructive Guard policy triggers. The operation enters the Human-in-the-Loop approval queue. Your security team receives a real-time alert. They review the full context and either approve with MFA or reject. The database is never touched without explicit human authorisation.",
  },
  {
    q: "Do you support EU AI Act compliance?",
    a: "Yes. Article 14 of the EU AI Act requires human oversight for high-risk AI systems. IdentArk's Human-in-the-Loop approval system directly satisfies this requirement. Every critical operation requires human review with MFA verification. We also map to Articles 9, 13, 15, and 17. Full mapping documentation is available for auditors.",
  },
  {
    q: "Can I define custom approval rules?",
    a: "Yes. Policies support risk thresholds, tool name patterns, time-based schedules, and custom conditions via CEL expressions. You can create policies like 'All delete operations on production databases require approval from the CISO during non-business hours.'",
  },
];

export function FaqSection() {
  return (
    <section className="section">
      <div className="section-tag">FAQ</div>
      <h2 className="section-title">Common questions</h2>

      <div className="faq-list">
        {faqs.map((item, i) => (
          <details key={item.q} className="faq-item" {...(i === 0 ? { open: true } : {})}>
            <summary>
              <span>{item.q}</span>
              <span className="faq-chev" aria-hidden>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
