/**
 * IdentArk — User Personalization
 * Single source of truth for how a signed-in user (individual OR company)
 * is rendered across the dashboard: avatar, name, dropdown, and the
 * personalized welcome banner.
 *
 * Also captures `account_type` (individual | company) for analytics
 * segmentation, and fires a lightweight tracking event on identify.
 *
 * Backend `/auth/me` returns: { email, first_name, last_name, org_name, ... }
 * (it does NOT return a `name` field — earlier code read `user.name`, which
 * is why the avatar fell back to "?"). This module derives everything safely
 * from whatever fields are present.
 */
(function () {
  'use strict';

  // Deterministic palette for initials avatars (brand-friendly tones).
  var AVATAR_COLORS = [
    '#C9A24B', // IdentArk gold
    '#4B7BC9',
    '#4BB1A2',
    '#A24BC9',
    '#C9684B',
    '#5BA34B',
    '#C94B7B'
  ];

  function pickColor(seed) {
    var s = String(seed || 'U');
    var hash = 0;
    for (var i = 0; i < s.length; i++) {
      hash = (hash << 5) - hash + s.charCodeAt(i);
      hash |= 0;
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  }

  /**
   * Normalize whatever the API gave us into a single shape.
   * Accepts the /auth/me response, a cached user, or the demo fallback
   * ({ name, email }).
   */
  function derive(user) {
    user = user || {};

    var orgName = (user.org_name || (user.org && user.org.name) || '').trim();
    var first = (user.first_name || '').trim();
    var last = (user.last_name || '').trim();
    var email = (user.email || '').trim();

    // Support the demo fallback / cached `name` field too.
    if (!first && !last && user.name) {
      var parts = String(user.name).trim().split(/\s+/);
      first = parts[0] || '';
      last = parts.slice(1).join(' ') || '';
    }

    // An account is a "company" when an organisation name was provided at
    // signup that isn't just the person's own name.
    var personFull = (first + ' ' + last).trim();
    var isCompany = !!orgName && orgName.toLowerCase() !== personFull.toLowerCase();
    var accountType = isCompany ? 'company' : 'individual';

    // Header / dropdown display name.
    var personName = personFull || (email ? email.split('@')[0] : '') || 'User';
    var displayName = isCompany ? orgName : personName;

    // Initials for the fallback avatar.
    var initials;
    if (isCompany) {
      initials = orgName.charAt(0).toUpperCase();
    } else if (first || last) {
      initials = ((first.charAt(0) || '') + (last.charAt(0) || '')).toUpperCase();
    } else {
      initials = displayName.charAt(0).toUpperCase();
    }
    if (!initials) initials = 'U';

    // Any uploaded logo/photo the backend may supply now or later.
    var photoUrl = user.logo_url || user.avatar_url || user.photo_url ||
      (user.org && (user.org.logo_url || user.org.avatar_url)) || '';

    return {
      accountType: accountType,
      isCompany: isCompany,
      displayName: displayName,
      firstName: first || personName.split(' ')[0],
      orgName: orgName,
      email: email,
      initials: initials,
      photoUrl: photoUrl,
      color: pickColor(displayName || email)
    };
  }

  /** Render the avatar: an uploaded image if present, else colored initials. */
  function renderAvatar(el, info) {
    if (!el) return;
    if (info.photoUrl) {
      el.innerHTML = '<img src="' + info.photoUrl + '" alt="' + info.displayName +
        '" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" ' +
        'onerror="this.parentNode.textContent=this.parentNode.getAttribute(\'data-initials\');">';
      el.setAttribute('data-initials', info.initials);
      el.style.background = info.color;
    } else {
      el.textContent = info.initials;
      el.style.background = info.color;
      el.style.color = '#fff';
    }
  }

  /** Personalize the welcome banner heading + subtitle. */
  function renderWelcome(info) {
    var title = document.getElementById('welcome-title');
    var subtitle = document.getElementById('welcome-subtitle');
    if (title) {
      title.textContent = info.isCompany
        ? 'Welcome, ' + info.orgName
        : info.firstName + ', welcome to IdentArk';
    }
    if (subtitle && info.isCompany) {
      subtitle.textContent =
        'Get your team set up — create your first credential or follow the quickstart guide.';
    }
  }

  /** Lightweight, analytics-agnostic event tracking. */
  function track(event, props) {
    props = props || {};
    try {
      var stored = localStorage.getItem('identark_account_type');
      if (stored && !props.account_type) props.account_type = stored;
      // Plausible is already loaded on the dashboard.
      if (typeof window.plausible === 'function') {
        window.plausible(event, { props: props });
      }
      // PostHog, if/when added, will be picked up automatically.
      if (window.posthog && typeof window.posthog.capture === 'function') {
        window.posthog.capture(event, props);
      }
    } catch (e) { /* never let analytics break the UI */ }
  }

  var _identified = false;

  /**
   * Main entry point. Pass the user object from /auth/me (or cached/demo).
   * Idempotent for tracking — safe to call from multiple loaders.
   */
  function render(user) {
    var info = derive(user);

    renderAvatar(document.getElementById('user-avatar'), info);

    var nameEl = document.getElementById('user-name');
    if (nameEl) nameEl.textContent = info.displayName;

    var ddName = document.getElementById('dropdown-user-name');
    if (ddName) ddName.textContent = info.displayName;

    var ddEmail = document.getElementById('dropdown-user-email');
    if (ddEmail) ddEmail.textContent = info.email || '';

    renderWelcome(info);

    // Persist account_type so every later event can be segmented.
    try { localStorage.setItem('identark_account_type', info.accountType); } catch (e) {}

    if (!_identified) {
      _identified = true;
      track('account_identified', {
        account_type: info.accountType,
        has_org: info.isCompany
      });
      track('dashboard_viewed', { account_type: info.accountType });
    }

    return info;
  }

  window.IdentArkUser = {
    derive: derive,
    render: render,
    track: track
  };
})();
