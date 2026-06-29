import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function HeroArchPreview() {
  return (
    <div className="hero-arch" aria-hidden>
      <div className="hero-arch-row">
        <div className="hero-arch-node">
          <span className="hero-arch-dot" /> Your Agent
        </div>
        <div className="hero-arch-line" />
        <div className="hero-arch-node accent">
          <span className="hero-arch-dot accent" /> IdentArk Gateway
        </div>
        <div className="hero-arch-line" />
        <div className="hero-arch-node">
          <span className="hero-arch-dot" /> LLM Provider
        </div>
      </div>
      <div className="hero-arch-meta">
        <span>session token only</span>
        <span>·</span>
        <span>no secrets in agent</span>
        <span>·</span>
        <span>every call risk-scored</span>
      </div>
    </div>
  );
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const chars = textRef.current.querySelectorAll(".hero-char");
    gsap.fromTo(
      chars,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.03,
        ease: "power3.out",
        delay: 0.2,
      }
    );
  }, []);

  const headline = "Governance infrastructure for autonomous AI agents";
  const words = headline.split(" ");

  return (
    <section ref={sectionRef} className="hero">
      <div className="hero-eyebrow">
        <span className="eyebrow-line" />
        ISO 27001 Ready · UK/EU Hosted
        <span className="eyebrow-line" />
      </div>

      <div ref={textRef} className="display-xl hero-headline">
        {words.map((word, wi) => (
          <span key={wi} className="hero-char" style={{ display: "inline-block", marginRight: "0.3em" }}>
            {word}
          </span>
        ))}
      </div>

      <p className="hero-sub">
        Every operation risk-scored. Critical actions paused for human approval. Every decision cryptographically logged.
      </p>

      <div className="hero-actions">
        <Link to="/signup" className="btn btn-primary btn-lg">
          Get Started Free
          <ArrowRight />
        </Link>
        <a
          href="https://github.com/identark/sdk"
          target="_blank"
          rel="noopener noreferrer"
          className="github-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          View on GitHub
        </a>
      </div>

      <HeroArchPreview />
    </section>
  );
}
