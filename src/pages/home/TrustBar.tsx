function CheckIcon() {
  return (
    <svg className="trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const items = [
  "Published on PyPI",
  "Full type coverage",
  "CI passing",
  "SOC 2 Type II ready",
];

export function TrustBar() {
  return (
    <div className="trust-bar">
      <div className="trust-inner">
        <span className="trust-label">Built in London</span>
        <div className="trust-items">
          {items.map((label) => (
            <span key={label} className="trust-item">
              <CheckIcon />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
