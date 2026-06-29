import { Link } from "react-router-dom";

export function PricingSection() {
  return (
    <section className="section" id="pricing">
      <div className="section-tag">Pricing</div>
      <h2 className="section-title">Start free. Pay when you scale.</h2>
      <p className="section-sub">No markup on LLM costs. You pay your providers directly. We charge for the gateway.</p>

      <div className="pricing-grid">
        <div className="price-card">
          <div className="price-tier">Developer</div>
          <div className="price-amount">
            Free
          </div>
          <div className="price-desc">For local development, demos, and weekend projects.</div>
          <ul className="price-features">
            <li>500 executions / month</li>
            <li>1 developer</li>
            <li>All LLM providers</li>
            <li>7-day audit log</li>
            <li>Community Slack</li>
          </ul>
          <a href="https://pypi.org/project/identark/" target="_blank" rel="noopener noreferrer" className="price-cta btn-secondary">
            pip install identark
          </a>
        </div>

        <div className="price-card">
          <div className="price-tier">Starter</div>
          <div className="price-amount">
            £99<span className="price-period"> /mo</span>
          </div>
          <div className="price-desc">For AI startups landing their first enterprise deal.</div>
          <ul className="price-features">
            <li>5,000 executions / month</li>
            <li>1 organisation</li>
            <li>All LLM providers</li>
            <li>Basic risk scoring</li>
            <li>30-day audit log</li>
            <li>Email support</li>
          </ul>
          <Link to="/signup" className="price-cta btn-secondary">
            Get Started
          </Link>
        </div>

        <div className="price-card featured">
          <span className="price-badge">Most popular</span>
          <div className="price-tier">Business</div>
          <div className="price-amount">
            £499<span className="price-period"> /mo</span>
          </div>
          <div className="price-desc">For teams with compliance deadlines and security questionnaires.</div>
          <ul className="price-features">
            <li>50,000 executions / month</li>
            <li>5 organisations</li>
            <li>HITL approval workflows</li>
            <li>Custom policies with CEL</li>
            <li>Compliance reports</li>
            <li>1-year audit log</li>
            <li>Priority Slack support</li>
          </ul>
          <Link to="/signup" className="price-cta btn-gold">
            Get Started
          </Link>
        </div>

        <div className="price-card">
          <div className="price-tier">Enterprise</div>
          <div className="price-amount" style={{ fontSize: 32 }}>
            Custom
          </div>
          <div className="price-desc">For regulated industries with bespoke compliance requirements.</div>
          <ul className="price-features">
            <li>Unlimited executions</li>
            <li>SSO / SAML / SCIM</li>
            <li>Advanced risk + anomaly</li>
            <li>Break-glass access</li>
            <li>SIEM export</li>
            <li>ISO 27001 &amp; SOC 2 mapping</li>
            <li>On-prem or private cloud</li>
            <li>Dedicated account manager</li>
          </ul>
          <a href="mailto:hello@identark.io" className="price-cta btn-secondary">
            Contact Sales
          </a>
        </div>
      </div>
    </section>
  );
}
