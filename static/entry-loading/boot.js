// Reuse the Home cover on ordinary pages; authored openings keep their own entry.
(() => {
  'use strict';
  const root = document.documentElement;
  const home = new URL(document.currentScript?.dataset.home || window.__orcaWhiteHole?.home || '/', location.href);
  const canonical = url => new URL(url, location.href).pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
  const intentKey = 'orca.entry-home.v1';
  const prefix = canonical(home).replace(/\/$/, '') + '/';
  // These templates own their arrival (data-team/design/wh-own-opening).
  const ownOpenings = new Set(['team', 'design-communication', 'human-practices', 'engineering', 'results']);
  const pageName = value => {
    const path = canonical(value);
    return path.startsWith(prefix) ? path.slice(prefix.length) : '';
  };
  const ordinaryPage = value => {
    const name = pageName(value);
    return /^[a-z0-9-]+$/i.test(name) && !/^(next|404)(-|$)/.test(name) && !ownOpenings.has(name);
  };
  // Home departures retain their authored tunnel. Only navigation between
  // content pages uses the whale; the incoming tunnel shield avoids doubling up.
  document.addEventListener('click', event => {
    const link = event.target?.closest?.('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
        link.hasAttribute('download') || link.closest?.('[data-wh-exclude]') ||
        (link.target && link.target !== '_self') || link.rel?.split(/\s+/).includes('external')) return;
    let url; try { url = new URL(link.getAttribute('href'), location.href); } catch { return; }
    if (canonical(location.href) === canonical(home) && canonical(url) !== canonical(home)) return;
    if (url.origin !== location.origin || !['http:', 'https:'].includes(url.protocol) || url.username || url.password ||
        (canonical(url) !== canonical(home) && !ordinaryPage(url)) ||
        (url.hash && (canonical(url) === canonical(location.href) || canonical(url) === canonical(home)))) return;
    try { sessionStorage.setItem(intentKey, JSON.stringify({ to: canonical(url), at: Date.now() })); } catch { /* Optional storage. */ }
    event.preventDefault(); location.assign(url.href);
  }, true);
  let homeIntent = false;
  try {
    const intent = JSON.parse(sessionStorage.getItem(intentKey) || 'null');
    sessionStorage.removeItem(intentKey);
    homeIntent = intent?.to === canonical(home) && canonical(location.href) === canonical(home) &&
      Date.now() >= intent.at && Date.now() - intent.at < 15000;
  } catch { /* Native navigation works with blocked storage. */ }
  const preview = new URLSearchParams(location.search).get('loading') === 'preview';
  if (!preview && ownOpenings.has(pageName(location.href))) return;
  if (root.hasAttribute('data-wh-cover')) return;
  if (!preview && (matchMedia('(prefers-reduced-motion: reduce)').matches ||
      performance.getEntriesByType('navigation')[0]?.type === 'back_forward')) return;
  try {
    if (!preview && !homeIntent && !ordinaryPage(location.href) && sessionStorage.getItem('orca.entry-seen.v1')) return;
  } catch { /* A private session can still show the loading surface. */ }
  root.dataset.entryLoading = preview ? 'preview' : 'active';
  window.__orcaEntryWatchdog = setTimeout(() => root.removeAttribute('data-entry-loading'), 4500);
})();
