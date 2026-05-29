import { Link } from "react-router-dom";

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export function CtaSection() {
  return (
    <section className="cta-section">
      <div className="cta-box">
        <h2>
          Zero secrets.
          <br />
          Full governance.
          <br />
          Immutable audit trail.
        </h2>
        <p>Deploy AI agents with the confidence that every critical operation is risk-scored, human-approved, and cryptographically logged.</p>
        <div className="cta-actions">
          <Link to="/request-access" className="btn btn-gold btn-lg">
            Request Early Access
            <ArrowRight />
          </Link>
          <a href="https://github.com/identark/identark" target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-lg" style={{ color: "rgba(255,255,255,0.8)", borderColor: "rgba(255,255,255,0.2)" }}>
            View on GitHub
          </a>
        </div>
        <div className="install-cmd">
          <span className="cmd-prompt">$</span>
          pip install identark
        </div>
      </div>
    </section>
  );
}
