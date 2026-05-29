export function GovernanceSection() {
  return (
    <section className="section" id="governance">
      <div className="section-tag">Governance</div>
      <h2 className="section-title">Your agents want to act. You decide if they should.</h2>
      <p className="section-sub">
        Autonomous AI agents are powerful. Left ungoverned, they are dangerous. IdentArk intercepts
        every operation before it reaches production, risk-scores it across six dimensions, and
        determines whether a human needs to approve it.
      </p>

      {/* Approval Flow Diagram */}
      <div className="gov-flow">
        <div className="gov-flow-track">
          <div className="gov-node">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
            </svg>
            <span>Agent Request</span>
          </div>

          <div className="gov-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>

          <div className="gov-node gateway">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>Gateway</span>
          </div>

          <div className="gov-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>

          <div className="gov-node score">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20V10M18 20V4M6 20v-4" />
            </svg>
            <span>Risk Score</span>
          </div>

          <div className="gov-arrow gated">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>

          <div className="gov-node hitl">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>HITL Gate</span>
          </div>

          <div className="gov-arrow auto">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>

          <div className="gov-node execute">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Execute</span>
          </div>
        </div>

        <div className="gov-flow-branches">
          <div className="gov-branch auto">
            <div className="gov-branch-line" />
            <span>Low risk → Auto-approved in 23ms</span>
          </div>
          <div className="gov-branch manual">
            <div className="gov-branch-line" />
            <span>Critical risk → Paused for human approval</span>
          </div>
        </div>
      </div>

      {/* Three Proof Points */}
      <div className="gov-proofs">
        <div className="gov-proof">
          <div className="gov-proof-num">01</div>
          <h3>Six-factor risk scoring</h3>
          <p>
            Every tool call is analysed across operation type, resource sensitivity, agent history,
            time context, cost impact, and anomaly detection. A delete on production customer data
            scores 94 out of 100. A select on an analytics table scores 15. The system knows the
            difference.
          </p>
        </div>

        <div className="gov-proof">
          <div className="gov-proof-num">02</div>
          <h3>Human-in-the-loop approvals</h3>
          <p>
            When risk exceeds your threshold, the operation pauses. Your security team receives a
            real-time alert with full context — tool name, arguments, risk breakdown, and similar
            past decisions. They approve or reject with MFA verification. The agent waits.
          </p>
        </div>

        <div className="gov-proof">
          <div className="gov-proof-num">03</div>
          <h3>Cryptographic audit chain</h3>
          <p>
            Every decision is logged with a cryptographic hash chain. Tamper-evident. Admissible as
            evidence. Export to CSV for your SOC 2 auditor in one click. The previous record hash
            is embedded in the next — break the chain, detect the tamper.
          </p>
        </div>
      </div>

      {/* Risk Score Visual */}
      <div className="gov-risk-demo">
        <div className="gov-risk-card low">
          <div className="gov-risk-badge">
            <span className="gov-risk-value">15</span>
            <span className="gov-risk-label">Low</span>
          </div>
          <div className="gov-risk-detail">
            <code>SELECT * FROM analytics WHERE quarter = 'Q1'</code>
            <span className="gov-risk-result">Auto-approved in 23ms</span>
          </div>
        </div>

        <div className="gov-risk-divider">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>

        <div className="gov-risk-card critical">
          <div className="gov-risk-badge">
            <span className="gov-risk-value">94</span>
            <span className="gov-risk-label">Critical</span>
          </div>
          <div className="gov-risk-detail">
            <code>DELETE FROM customers WHERE env = 'production'</code>
            <span className="gov-risk-result">Blocked — awaiting human approval</span>
          </div>
        </div>
      </div>
    </section>
  );
}
