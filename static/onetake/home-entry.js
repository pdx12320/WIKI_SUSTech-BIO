// Choose the animated opening before any story content is painted. Without
// JavaScript (or with reduced motion), the illustrated static entrance remains.
(() => {
  const root = document.currentScript.closest('[data-ot]');
  if (!root) return;
  // This parser-blocking entry runs before the cabinet markup can be painted.
  // Match the module's default now, rather than waiting for its imports/WebGL.
  root.classList.toggle('ot-crt-preview', new URLSearchParams(location.search).get('review') !== 'crt-legacy');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  root.classList.remove('ot--static');
  const fallback = () => {
    if (root.classList.contains('is-ready')) return;
    root.dataset.homeStartup = 'fallback';
    root.classList.add('ot--static', 'is-ready');
    root.querySelectorAll('[data-ot-reveal]').forEach(el => el.removeAttribute('aria-hidden'));
    clearTimeout(watchdog);
  };
  // A stalled download must not leave the visitor waiting indefinitely.
  const watchdog = setTimeout(fallback, 30000);
  root.addEventListener('ot:startup-ready', () => clearTimeout(watchdog), { once: true });
  // Failed module imports must restore the readable page, not leave an empty TV.
  window.addEventListener('error', event => {
    if (event.target?.matches?.('script[data-ot-module]')) {
      fallback();
    }
  }, true);
})();
