// Choose the animated opening before any story content is painted. Without
// JavaScript (or with reduced motion), the original readable fallback remains.
(() => {
  const root = document.currentScript.closest('[data-ot]');
  if (!root) return;
  // This parser-blocking entry runs before the cabinet markup can be painted.
  // Match the module's default now, rather than waiting for its imports/WebGL.
  root.classList.toggle('ot-crt-preview', new URLSearchParams(location.search).get('review') !== 'crt-legacy');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  root.classList.remove('ot--static');
  // Failed module imports must restore the readable page, not leave an empty TV.
  window.addEventListener('error', event => {
    if (event.target?.matches?.('script[data-ot-module]')) {
      root.classList.add('ot--static', 'is-ready');
    }
  }, true);
})();
