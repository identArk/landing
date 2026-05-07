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
    q: "Which LLM providers do you support?",
    a: "We support OpenAI, Anthropic, Mistral, AWS Bedrock, Azure OpenAI, and Google Gemini. Adding a new provider takes minutes — just register your API key in the vault and start making calls.",
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

      <div className="faq-grid">
        {faqs.map((item) => (
          <div key={item.q} className="faq-item">
            <h3>{item.q}</h3>
            <p>{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
