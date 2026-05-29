export function CodeSwapSection() {
  return (
    <section className="section code-swap" id="code-swap">
      <div className="code-swap-head">
        <div>
          <div className="section-tag">The two-line swap</div>
          <h2 className="section-title">From a hot agent to a governed agent in 30 seconds.</h2>
          <p className="section-sub">
            Same OpenAI / Anthropic call surface. The gateway transparently fetches credentials,
            scores the call, and routes it to the right LLM. Your agent logic stays identical.
          </p>
        </div>
      </div>

      <div className="code-swap-grid">
        <div className="code-card before">
          <div className="code-card-head">
            <span className="code-dot red" />
            <span className="code-card-title">Before — secrets live in your agent</span>
          </div>
          <pre>
{`from openai import OpenAI

# API key sits in env, memory, and every traceback
client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

reply = client.responses.create(
    model="gpt-4o",
    input="Summarise this PR diff",
)`}
          </pre>
        </div>

        <div className="code-card after">
          <div className="code-card-head">
            <span className="code-dot green" />
            <span className="code-card-title">After — credentials never enter the agent</span>
            <span className="code-card-pill">2 lines changed</span>
          </div>
          <pre>
{`from identark import ControlPlaneGateway

# session token only, no API key in process
client = ControlPlaneGateway(agent_id="pr-reviewer")

reply = client.responses.create(
    model="gpt-4o",
    input="Summarise this PR diff",
)
# → risk-scored, audit-logged, HITL-gated if critical`}
          </pre>
        </div>
      </div>

      <div className="code-swap-foot">
        <div className="code-foot-item">
          <span className="code-foot-num">&lt; 1.5ms</span>
          <span className="code-foot-label">SDK overhead per call</span>
        </div>
        <div className="code-foot-item">
          <span className="code-foot-num">0</span>
          <span className="code-foot-label">credentials in agent memory</span>
        </div>
        <div className="code-foot-item">
          <span className="code-foot-num">23ms</span>
          <span className="code-foot-label">low-risk auto-approval</span>
        </div>
      </div>
    </section>
  );
}
