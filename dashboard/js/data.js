/**
 * IdentArk Dashboard Data
 * Fetches real data from API using api.js
 * Falls back to empty states when API is unavailable
 */

const DashboardData = {
  /**
   * Initialize data module
   */
  async init() {
    // API client from api.js is already loaded
    if (typeof API === 'undefined') {
      console.warn('[DashboardData] API client not loaded');
      return;
    }

    // Initialize auth first so tokens are available
    const isAuthenticated = await API.init();
    if (!isAuthenticated) {
      console.warn('[DashboardData] Not authenticated');
      return;
    }

    // Load all dashboard data in parallel with fallbacks
    await Promise.all([
      this._loadUserWithFallback(),
      this._loadStatsWithFallback(),
      this._loadSessionsWithFallback(),
      this._loadCredentialsWithFallback()
    ]);
  },

  /**
   * Load user info with fallback
   */
  async _loadUserWithFallback() {
    try {
      const user = await API.getCurrentUser();
      if (user) {
        this._updateUserUI(user, user.org);
      }
    } catch (error) {
      console.warn('[DashboardData] Failed to load user:', error.message);
      this._updateUserUI({ email: 'User' }, { name: 'Organization' });
    }
  },

  /**
   * Load dashboard stats with fallback
   */
  async _loadStatsWithFallback() {
    try {
      const data = await API.request('/stats');
      this._updateStatsUI(data);
    } catch (error) {
      console.warn('[DashboardData] Failed to load stats:', error.message);
      this._updateStatsUI({
        credentials: 0,
        agents: 0,
        executions: 0,
        success_rate: 0
      });
    }
  },

  /**
   * Load recent sessions with fallback
   */
  async _loadSessionsWithFallback() {
    try {
      const response = await API.request('/sessions?limit=5');
      const sessions = response?.sessions || response?.items || [];

      if (sessions.length > 0) {
        this._updateSessionsUI(sessions);
      } else {
        this._showEmptyState('sessions-empty', 'sessions-table');
      }
    } catch (error) {
      console.warn('[DashboardData] Failed to load sessions:', error.message);
      this._showEmptyState('sessions-empty', 'sessions-table');
    }
  },

  /**
   * Load credentials with fallback
   */
  async _loadCredentialsWithFallback() {
    try {
      const response = await API.request('/credentials');
      const credentials = Array.isArray(response) ? response : (response?.items || []);

      if (credentials.length > 0) {
        this._updateCredentialsUI(credentials);
      } else {
        this._showEmptyState('credentials-empty', 'credentials-table');
      }
    } catch (error) {
      console.warn('[DashboardData] Failed to load credentials:', error.message);
      this._showEmptyState('credentials-empty', 'credentials-table');
    }
  },

  /**
   * Update user UI
   */
  _updateUserUI(user = {}, org = {}) {
    const name = org?.name || user?.org_name || user?.email?.split('@')[0] || 'User';
    const email = user?.email || '';
    const initial = (name || 'U').charAt(0).toUpperCase();

    this._setText('#user-avatar', initial);
    this._setText('#user-name', name);
    this._setText('#dropdown-user-name', name);
    this._setText('#dropdown-user-email', email);
  },

  /**
   * Update stats UI
   */
  _updateStatsUI(data = {}) {
    // Normalize backend field names (backend uses snake_case, frontend expected camelCase-ish)
    const credentials = data.credentials_count ?? data.credentials ?? 0;
    const agents = data.agents_count ?? data.agents ?? 0;
    const executions = data.total_executions ?? data.executions ?? 0;
    const limit = data.execution_limit || 500;

    this._setText('#stat-credentials', credentials);
    this._setText('#stat-agents', agents);
    this._setText('#stat-executions', executions);

    if (executions > 0 && data.success_rate !== undefined) {
      this._setText('#stat-success-rate', `${Math.round(data.success_rate)}%`);
    } else if (data.usage_percent !== undefined) {
      this._setText('#stat-success-rate', `${Math.round(data.usage_percent)}%`);
    }

    // Update usage meter
    const used = data.monthly_executions ?? executions;
    const percent = Math.min((used / limit) * 100, 100);

    this._setText('#usage-count', `${used} / ${limit}`);
    const fill = document.getElementById('usage-fill');
    if (fill) fill.style.width = `${percent}%`;

    // Update nav badge
    if (credentials > 0) {
      const badge = document.getElementById('nav-credentials-count');
      if (badge) {
        badge.textContent = credentials;
        badge.style.display = '';
      }
    }
  },

  /**
   * Update sessions UI
   */
  _updateSessionsUI(sessions = []) {
    const emptyState = document.getElementById('sessions-empty');
    const table = document.getElementById('sessions-table');
    const tbody = document.getElementById('sessions-tbody');

    if (emptyState) emptyState.style.display = 'none';
    if (table) table.style.display = '';

    if (tbody) {
      tbody.innerHTML = sessions.map(s => {
        const agentLabel = s.agent_name || s.agent_id || 'Unknown';
        const providerLabel = s.provider ? ` (${s.provider})` : '';
        const status = s.status || (s.message_count > 0 ? 'active' : 'idle');
        const statusClass = status === 'completed' || status === 'active' ? 'success' : 'warning';
        const statusText = status === 'active' ? 'Active' : (status === 'completed' ? 'Success' : (status || 'Idle'));
        return `
        <tr>
          <td>
            <div class="agent-cell">
              <span class="agent-indicator"></span>
              ${this._escape(agentLabel)}${this._escape(providerLabel)}
            </div>
          </td>
          <td><code>${this._escape(s.model || '—')}</code></td>
          <td><span class="badge badge-${statusClass}">${statusText}</span></td>
          <td class="text-muted">${this._timeAgo(s.created_at || s.started_at)}</td>
        </tr>
      `;
      }).join('');
    }
  },

  /**
   * Update credentials UI
   */
  _updateCredentialsUI(credentials = []) {
    const emptyState = document.getElementById('credentials-empty');
    const table = document.getElementById('credentials-table');
    const tbody = document.getElementById('credentials-tbody');

    if (emptyState) emptyState.style.display = 'none';
    if (table) table.style.display = '';

    if (tbody) {
      tbody.innerHTML = credentials.map(c => `
        <tr>
          <td>
            <div class="credential-cell">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-muted">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
              </svg>
              <code>${this._escape(c.label || c.name)}</code>
            </div>
          </td>
          <td><span class="badge badge-neutral">${this._escape(c.provider || '—')}</span></td>
          <td><code>${this._escape(c.credential_ref || '—')}</code></td>
          <td class="text-muted">${c.rotated_at ? this._timeAgo(c.rotated_at) : (c.last_used ? this._timeAgo(c.last_used) : 'Never')}</td>
          <td><span class="badge badge-${c.is_active !== false ? 'success' : 'warning'}">${c.is_active !== false ? 'Active' : 'Inactive'}</span></td>
        </tr>
      `).join('');
    }
  },

  /**
   * Show empty state by hiding table and showing empty message
   */
  _showEmptyState(emptyStateId, tableId) {
    const emptyState = document.getElementById(emptyStateId);
    const table = document.getElementById(tableId);

    if (emptyState) emptyState.style.display = '';
    if (table) table.style.display = 'none';
  },

  // ────────────────────────────────────────────────────────────────────────────
  // Helpers
  // ────────────────────────────────────────────────────────────────────────────

  _setText(selector, text) {
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
  },

  _escape(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  _timeAgo(date) {
    if (!date) return '—';
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return new Date(date).toLocaleDateString();
  }
};

// Auto-init on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    DashboardData.init();
  });
} else {
  DashboardData.init();
}
