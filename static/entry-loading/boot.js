// Choose the cover before first paint; navigation starts immediately underneath it.
(() => {
  'use strict';
  const root = document.documentElement;
  const home = new URL(document.currentScript?.dataset.home || '/', location.href);
  window.__orcaEntry = { home: home.href };
  const canonical = url => new URL(url, location.href).pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
  const intentKey = 'orca.entry-route.v1';
  const theme = value => {
    const url = new URL(value, location.href), route = canonical(url);
    if (route === canonical(home)) return 'dark';
    const prefix = home.pathname.replace(/\/$/, '') + '/';
    if (!url.pathname.startsWith(prefix)) return null;
    const relative = route.slice(prefix === '/' ? 1 : prefix.length);
    return /^[a-z0-9-]+$/i.test(relative) && !/^(next|404)(-|$)/i.test(relative) ? 'light' : null;
  };
  document.addEventListener('click', event => {
    const link = event.target?.closest?.('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
        link.hasAttribute('download') || (link.target && link.target !== '_self') || link.rel?.split(/\s+/).includes('external')) return;
    let url; try { url = new URL(link.getAttribute('href'), location.href); } catch { return; }
    if (url.origin !== location.origin || !['http:', 'https:'].includes(url.protocol) || url.username || url.password ||
        canonical(url) === canonical(location.href)) return;
    const from = theme(location.href), to = theme(url);
    if (!from || !to || from === to || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    try { sessionStorage.setItem(intentKey, JSON.stringify({ to: canonical(url), at: Date.now() })); } catch { /* Native navigation remains usable. */ }
    event.preventDefault(); location.assign(url.href);
  }, true);
  let routeIntent = false;
  try {
    const intent = JSON.parse(sessionStorage.getItem(intentKey) || 'null');
    sessionStorage.removeItem(intentKey);
    routeIntent = intent?.to === canonical(location.href) && Date.now() >= intent.at && Date.now() - intent.at < 15000;
  } catch { /* A private session can still show the first-entry surface. */ }
  const preview = new URLSearchParams(location.search).get('loading') === 'preview';
  const isHome = canonical(location.href) === canonical(home);
  const navigationType = performance.getEntriesByType('navigation')[0]?.type;
  if (!preview && navigationType === 'back_forward') return;
  try {
    if (!preview && !isHome && navigationType !== 'reload' && !routeIntent && sessionStorage.getItem('orca.entry-seen.v1')) return;
  } catch { /* Optional storage. */ }
  root.dataset.entryLoading = preview ? 'preview' : 'active';
  window.__orcaEntryWatchdog = setTimeout(() => {
    const scene = document.querySelector('[data-ot]');
    if (scene && !scene.classList.contains('is-ready')) {
      scene.dataset.homeStartup = 'fallback';
      scene.classList.add('ot--static', 'is-ready');
    }
    root.removeAttribute('data-entry-loading');
  }, isHome ? 35000 : 12000);
})();
