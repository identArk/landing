/**
 * IdentArk Dashboard — Token Velocity Widget
 * ==========================================
 * Production-standard module for the Token Velocity dashboard widget.
 * Fetches from GET /stats/tokens and renders token consumption analytics.
 *
 * Patterns followed:
 *   - API calls via APIClient (api-client.js)
 *   - Graceful empty-state fallbacks on all errors
 *   - DOM existence checks before writes
 *   - Number formatting utilities (_formatTokens, _formatPct)
 */

const TokenVelocityManager = {
  isAuthenticated: false,
  refreshInterval: null,

  async init() {
    try {
      this.isAuthenticated = await API.init();
    } catch (e) {
      this.isAuthenticated = false;
    }

    if (this.isAuthenticated) {
      await this.refresh();
    } else {
      this._showEmptyState();
    }

    this._bindEvents();
  },

  async refresh() {
    const range = this._getActiveRange();
    try {
      const data = await API.getTokenVelocity(range);
      if (!data) {
        this._showEmptyState();
        return;
      }
      this._renderAll(data);
    } catch (e) {
      console.warn('[TokenVelocity] Failed to load:', e.message);
      this._showEmptyState();
    }
  },

  // ── Rendering ─────────────────────────────────────────────────────────────

  _renderAll(data) {
    this._renderStats(data);
    this._renderInsightAlert(data);
    this._renderChart(data);
    this._renderAgentBars(data);
    this._renderTrend(data);
    this._renderRecommendations(data);
  },

  _renderStats(data) {
    // Tokens Consumed
    const totalTokensEl = document.getElementById('tv-total-tokens');
    if (totalTokensEl) {
      totalTokensEl.textContent = this._formatTokens(data.total_input_tokens + data.total_output_tokens);
    }

    const tokensChangeEl = document.getElementById('tv-tokens-change');
    if (tokensChangeEl) {
      tokensChangeEl.className = 'stat-change stat-change-up';
      const changeText = document.getElementById('tv-tokens-change-text');
      if (changeText) changeText.textContent = `${data.velocity_score >= 50 ? '+' : ''}${data.velocity_score - 50}% vs last period`;
    }

    // Velocity Score
    const scoreEl = document.getElementById('tv-velocity-score');
    if (scoreEl) {
      scoreEl.textContent = data.velocity_score;
      scoreEl.className = 'stat-value stat-value-accent';
    }

    const badgeEl = document.getElementById('tv-velocity-badge');
    if (badgeEl) {
      const statusMap = {
        on_track: { cls: 'badge badge-success', text: 'On Track' },
        caution: { cls: 'badge badge-warning', text: 'Caution' },
        low: { cls: 'badge badge-danger', text: 'Low Adoption' }
      };
      const s = statusMap[data.velocity_status] || statusMap.on_track;
      badgeEl.className = s.cls;
      badgeEl.textContent = s.text;
    }

    const iconEl = document.getElementById('tv-velocity-icon');
    if (iconEl) {
      const colorMap = { on_track: 'var(--accent)', caution: 'var(--warning)', low: 'var(--danger)' };
      iconEl.style.color = colorMap[data.velocity_status] || 'var(--accent)';
    }

    // Budget Remaining
    const budgetEl = document.getElementById('tv-budget-remaining');
    if (budgetEl) budgetEl.textContent = this._formatTokens(data.budget_remaining);

    const fillEl = document.getElementById('tv-budget-fill');
    if (fillEl) {
      const pct = Math.round(data.budget_percent);
      fillEl.style.width = pct + '%';
      fillEl.className = 'tv-mini-progress-fill' + (pct > 90 ? ' tv-danger' : pct > 70 ? ' tv-warning' : '');
    }

    const budgetTextEl = document.getElementById('tv-budget-text');
    if (budgetTextEl) budgetTextEl.textContent = `${Math.round(data.budget_percent)}% used`;

    // Top Agent
    const topAgentEl = document.getElementById('tv-top-agent');
    if (topAgentEl) topAgentEl.textContent = data.top_agent ? data.top_agent.agent_name : '-';

    const topAgentShareEl = document.getElementById('tv-top-agent-share');
    if (topAgentShareEl) {
      topAgentShareEl.className = 'stat-change stat-change-up';
      const shareText = document.getElementById('tv-top-agent-text');
      if (shareText) shareText.textContent = data.top_agent ? `${data.top_agent.share_percent}% of total` : '-';
    }
  },

  _renderInsightAlert(data) {
    const card = document.getElementById('tv-insight-card');
    if (!card) return;

    const alerts = data.recommendations?.filter(r => r.type === 'warning') || [];
    if (alerts.length > 0 && data.velocity_status === 'low') {
      card.style.display = 'block';
      const teamEl = document.getElementById('tv-insight-team');
      if (teamEl) teamEl.textContent = alerts[0].title.replace(/ has low utilisation.*/, '');
    } else {
      card.style.display = 'none';
    }
  },

  _renderChart(data) {
    const svg = document.getElementById('token-chart-svg');
    if (!svg || !data.time_series || data.time_series.length === 0) return;

    const series = data.time_series;
    const maxTokens = Math.max(...series.map(d => d.input_tokens + d.output_tokens), 1);
    const width = 600;
    const height = 200;
    const padding = { top: 20, right: 20, bottom: 30, left: 50 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const xStep = chartW / (series.length - 1 || 1);

    const pointsPrompt = series.map((d, i) => {
      const x = padding.left + i * xStep;
      const y = padding.top + chartH - (d.input_tokens / maxTokens * chartH);
      return `${x},${y}`;
    });

    const pointsCompletion = series.map((d, i) => {
      const x = padding.left + i * xStep;
      const total = d.input_tokens + d.output_tokens;
      const y = padding.top + chartH - (total / maxTokens * chartH);
      return `${x},${y}`;
    });

    const yLabels = [maxTokens, maxTokens * 0.75, maxTokens * 0.5, maxTokens * 0.25, 0].map(v => this._formatTokens(v));

    svg.innerHTML = `
      <g class="grid-lines">
        ${[0, 0.25, 0.5, 0.75, 1].map(p => {
          const y = padding.top + chartH * (1 - p);
          return `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="var(--border-subtle)" stroke-dasharray="${p === 0 ? '' : '4'}"/>`;
        }).join('')}
      </g>
      <g fill="var(--fg-4)" font-size="11" font-family="Geist, sans-serif">
        ${yLabels.map((label, i) => `<text x="${padding.left - 8}" y="${padding.top + chartH * (1 - i / 4) + 4}" text-anchor="end">${label}</text>`).join('')}
      </g>
      <g fill="var(--fg-4)" font-size="11" font-family="Geist, sans-serif">
        ${series.map((d, i) => `<text x="${padding.left + i * xStep}" y="${height - 4}" text-anchor="middle">${d.week}</text>`).join('')}
      </g>
      <path d="M${pointsPrompt.join(' L')}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round"/>
      <path d="M${pointsCompletion.join(' L')}" fill="none" stroke="var(--fg-3)" stroke-width="2" stroke-linecap="round" stroke-dasharray="4"/>
      <g>
        ${series.map((d, i) => {
          const x = padding.left + i * xStep;
          const y = padding.top + chartH - (d.input_tokens / maxTokens * chartH);
          return `<circle cx="${x}" cy="${y}" r="4" fill="var(--accent)"/>`;
        }).join('')}
      </g>
      <line x1="${padding.left}" y1="${padding.top}" x2="${width - padding.right}" y2="${padding.top}" stroke="var(--accent)" stroke-width="1" stroke-dasharray="6,4" opacity="0.4"/>
      <text x="${width - padding.right + 4}" y="${padding.top + 4}" fill="var(--accent)" font-size="10" font-family="Geist, sans-serif">Budget cap</text>
    `;
  },

  _renderAgentBars(data) {
    const container = document.getElementById('tv-token-bars');
    if (!container || !data.agents) return;

    const maxTokens = Math.max(...data.agents.map(a => a.input_tokens + a.output_tokens), 1);

    container.innerHTML = data.agents.map((agent, idx) => {
      const total = agent.input_tokens + agent.output_tokens;
      const pct = (total / maxTokens * 100);
      const isTop3 = idx < 3;
      return `
        <div class="tv-token-bar-row">
          <span class="tv-token-bar-label">${this._escapeHtml(agent.agent_name)}</span>
          <div class="tv-token-bar-track">
            <div class="tv-token-bar-fill ${isTop3 ? '' : 'tv-muted'}" style="width: ${pct}%"></div>
          </div>
          <span class="tv-token-bar-value">${this._formatTokens(total)}</span>
        </div>
      `;
    }).join('');
  },

  _renderTrend(data) {
    const container = document.getElementById('velocity-trend');
    if (!container || !data.time_series) return;

    container.innerHTML = data.time_series.map((point, idx) => {
      const isCurrent = idx === data.time_series.length - 1;
      return `
        <div class="tv-trend-item ${isCurrent ? 'tv-trend-current' : ''}">
          <span class="tv-trend-week">${this._escapeHtml(point.week)}</span>
          <div class="tv-trend-bar-track">
            <div class="tv-trend-bar-fill" style="width: ${point.velocity_score}%"></div>
          </div>
          <span class="tv-trend-score ${isCurrent ? 'tv-trend-score-current' : ''}">${point.velocity_score}</span>
        </div>
      `;
    }).join('');
  },

  _renderRecommendations(data) {
    const container = document.getElementById('recommendation-list');
    if (!container || !data.recommendations) return;

    const iconMap = {
      success: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
      warning: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
      info: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
    };

    container.innerHTML = data.recommendations.map(rec => `
      <div class="tv-recommendation-item">
        <div class="tv-rec-icon tv-rec-${rec.type}">
          ${iconMap[rec.type] || iconMap.info}
        </div>
        <div class="tv-rec-content">
          <strong>${this._escapeHtml(rec.title)}</strong>
          <p class="text-muted text-sm">${this._escapeHtml(rec.detail)}</p>
        </div>
      </div>
    `).join('');
  },

  // ── Utilities ─────────────────────────────────────────────────────────────

  _formatTokens(num) {
    if (!num || num < 0) num = 0;
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(0) + 'K';
    return num.toString();
  },

  _formatPct(num) {
    if (!num) return '0%';
    return Math.round(num) + '%';
  },

  _escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  _getActiveRange() {
    const activeBtn = document.querySelector('.date-range-btn.active');
    return activeBtn?.dataset.range || '30d';
  },

  _bindEvents() {
    // Date range picker buttons
    document.querySelectorAll('.date-range-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.date-range-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.refresh();
      });
    });
  },

  _showEmptyState() {
    const els = [
      'tv-total-tokens', 'tv-velocity-score', 'tv-budget-remaining', 'tv-top-agent'
    ];
    els.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '-';
    });
    const insight = document.getElementById('tv-insight-card');
    if (insight) insight.style.display = 'none';
  }
};

// Initialize on page load if analytics page
if (document.getElementById('tv-total-tokens')) {
  document.addEventListener('DOMContentLoaded', () => {
    TokenVelocityManager.init();
  });
}
