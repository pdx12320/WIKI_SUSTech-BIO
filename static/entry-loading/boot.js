// Install Home intent handling and choose the cover before the first paint.
(() => {
  'use strict';
  const root = document.documentElement;
  const home = new URL(document.currentScript?.dataset.home || window.__orcaWhiteHole?.home || '/', location.href);
  const canonical = url => new URL(url, location.href).pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
  const intentKey = 'orca.entry-home.v1';
  // Capture Home clicks before the white-hole controller's bubbling handler.
  // Other routes retain their existing transition behavior.
  document.addEventListener('click', event => {
    const link = event.target?.closest?.('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
        link.hasAttribute('download') || (link.target && link.target !== '_self') || link.rel?.split(/\s+/).includes('external')) return;
    let url; try { url = new URL(link.getAttribute('href'), location.href); } catch { return; }
    if (url.origin !== location.origin || !['http:', 'https:'].includes(url.protocol) || url.username || url.password ||
        url.hash || canonical(url) !== canonical(home)) return;
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
  if (root.hasAttribute('data-wh-cover')) return;
  if (!preview && (matchMedia('(prefers-reduced-motion: reduce)').matches ||
      performance.getEntriesByType('navigation')[0]?.type === 'back_forward')) return;
  try {
    if (!preview && !homeIntent && sessionStorage.getItem('orca.entry-seen.v1')) return;
  } catch { /* A private session can still show the loading surface. */ }
  root.dataset.entryLoading = preview ? 'preview' : 'active';
  window.__orcaEntryWatchdog = setTimeout(() => root.removeAttribute('data-entry-loading'), 4500);
})();
