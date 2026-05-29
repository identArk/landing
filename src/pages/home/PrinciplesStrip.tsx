export function PrinciplesStrip() {
  return (
    <section className="principles-strip" aria-label="Product principles">
      <div className="principles-inner">
        <div className="principle">
          <span className="principle-num">01</span>
          <span className="principle-title">Zero secrets</span>
          <span className="principle-body">Credentials never enter your agent process.</span>
        </div>
        <div className="principle">
          <span className="principle-num">02</span>
          <span className="principle-title">Full governance</span>
          <span className="principle-body">Every call risk-scored. Critical actions paused for human approval.</span>
        </div>
        <div className="principle">
          <span className="principle-num">03</span>
          <span className="principle-title">Immutable audit trail</span>
          <span className="principle-body">Cryptographic hash chain. Admissible as evidence.</span>
        </div>
      </div>
    </section>
  );
}
