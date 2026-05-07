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

function VaultDoor() {
  const vaultRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!vaultRef.current) return;
    const svg = vaultRef.current;
    const outerRing = svg.querySelector(".vault-outer");
    const innerRing = svg.querySelector(".vault-inner");
    const bolts = svg.querySelectorAll(".vault-bolt");
    const door = svg.querySelector(".vault-door");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: svg,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1.5,
      },
    });

    tl.to(outerRing, { rotation: 15, transformOrigin: "50% 50%", duration: 1 }, 0)
      .to(innerRing, { rotation: -25, transformOrigin: "50% 50%", duration: 1 }, 0)
      .to(bolts, { opacity: 0, scale: 0.5, transformOrigin: "50% 50%", stagger: 0.05, duration: 0.6 }, 0.2)
      .to(door, { scale: 0.85, opacity: 0.3, transformOrigin: "50% 50%", duration: 0.8 }, 0.4);

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <svg
      ref={vaultRef}
      viewBox="0 0 400 400"
      className="vault-svg"
      style={{ width: "100%", maxWidth: 480, height: "auto" }}
    >
      {/* Outer ring */}
      <circle className="vault-outer" cx="200" cy="200" r="190" fill="none" stroke="#C9A96E" strokeWidth="1.5" opacity="0.4" />
      <circle className="vault-outer" cx="200" cy="200" r="185" fill="none" stroke="#C9A96E" strokeWidth="0.5" opacity="0.2" />

      {/* Bolts */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 200 + 175 * Math.cos(rad);
        const y = 200 + 175 * Math.sin(rad);
        return (
          <rect
            key={i}
            className="vault-bolt"
            x={x - 6}
            y={y - 3}
            width="12"
            height="6"
            rx="1"
            fill="#C9A96E"
            opacity="0.5"
            transform={`rotate(${angle} ${x} ${y})`}
          />
        );
      })}

      {/* Inner ring */}
      <circle className="vault-inner" cx="200" cy="200" r="160" fill="none" stroke="#C9A96E" strokeWidth="1" opacity="0.3" />
      <circle className="vault-inner" cx="200" cy="200" r="155" fill="none" stroke="#C9A96E" strokeWidth="0.5" opacity="0.15" />

      {/* Door */}
      <circle className="vault-door" cx="200" cy="200" r="140" fill="none" stroke="#0A1628" strokeWidth="2" opacity="0.6" />
      <circle className="vault-door" cx="200" cy="200" r="100" fill="none" stroke="#C9A96E" strokeWidth="0.5" opacity="0.2" />

      {/* Handle */}
      <g className="vault-door">
        <circle cx="200" cy="200" r="24" fill="none" stroke="#C9A96E" strokeWidth="1.5" opacity="0.5" />
        <circle cx="200" cy="200" r="8" fill="#C9A96E" opacity="0.3" />
        <line x1="200" y1="176" x2="200" y2="152" stroke="#C9A96E" strokeWidth="2" opacity="0.4" strokeLinecap="round" />
      </g>

      {/* Decorative ticks */}
      {Array.from({ length: 60 }).map((_, i) => {
        const angle = (i * 6 * Math.PI) / 180;
        const inner = 142;
        const outer = i % 5 === 0 ? 152 : 148;
        const x1 = 200 + inner * Math.cos(angle);
        const y1 = 200 + inner * Math.sin(angle);
        const x2 = 200 + outer * Math.cos(angle);
        const y2 = 200 + outer * Math.sin(angle);
        return (
          <line
            key={`tick-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#C9A96E"
            strokeWidth={i % 5 === 0 ? 0.8 : 0.4}
            opacity={i % 5 === 0 ? 0.3 : 0.15}
          />
        );
      })}
    </svg>
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
        delay: 0.3,
      }
    );
  }, []);

  const headline = "Governance infrastructure for autonomous AI agents";
  const words = headline.split(" ");

  return (
    <section ref={sectionRef} className="hero" style={{ paddingTop: 140 }}>
      <div className="hero-eyebrow">
        <span className="eyebrow-line" />
        ISO 27001 Ready · UK/EU Hosted
        <span className="eyebrow-line" />
      </div>

      <div ref={textRef} className="display-xl" style={{ maxWidth: 900, marginBottom: 28 }}>
        {words.map((word, wi) => (
          <span key={wi} style={{ display: "inline-block", marginRight: "0.3em" }}>
            {word === "AI" || word === "agents" ? (
              <em className="hero-char" style={{ color: "var(--brass)", fontStyle: "italic" }}>
                {word}
              </em>
            ) : (
              <span className="hero-char">{word}</span>
            )}
          </span>
        ))}
      </div>

      <p className="hero-sub" style={{ maxWidth: 560 }}>
        Every operation risk-scored. Critical actions paused for human approval. 
        Every decision cryptographically logged. Deploy autonomous agents with the oversight 
        your compliance team requires.
      </p>

      <div className="hero-actions">
        <Link to="/request-access" className="btn btn-primary btn-lg">
          Request Early Access
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

      <div style={{ marginTop: 80, width: "100%", display: "flex", justifyContent: "center" }}>
        <VaultDoor />
      </div>
    </section>
  );
}
