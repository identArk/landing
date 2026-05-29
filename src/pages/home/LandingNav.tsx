import { Link } from "react-router-dom";

export function LandingNav({ scrolled }: { scrolled: boolean }) {
  return (
    <nav className={scrolled ? "scrolled" : undefined}>
      <Link to="/" className="logo">
        <img src="/assets/logo.jpg" alt="IdentArk" style={{ height: "32px", width: "auto", borderRadius: "4px" }} />
        <span style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 400 }}>IdentArk</span>
      </Link>

      <div className="nav-center">
        <a href="#features">Features</a>
        <a href="#governance">Governance</a>
        <a href="#how-it-works">How it works</a>
        <a href="#pricing">Pricing</a>
        <a href="https://github.com/identark/sdk" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </div>

      <div className="nav-right">
        <Link to="/request-access" className="btn btn-primary">
          Request Early Access
        </Link>
      </div>
    </nav>
  );
}
