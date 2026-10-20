/* The opening stays in document flow and can be replayed from its square full stop. */
(() => {
  'use strict';
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const navigation = performance.getEntriesByType('navigation')[0];
  const animate = !reduced.matches && !location.hash && navigation?.type !== 'back_forward';
  let observer, watchdog, endTimer, replayFrame;
  function settle() {
    root.removeAttribute('data-results-arrival');
    clearTimeout(watchdog);
    clearTimeout(endTimer);
    cancelAnimationFrame(replayFrame);
    observer?.disconnect();
  }
  function play() {
    if (reduced.matches || document.hidden) { settle(); return; }
    clearTimeout(watchdog);
    root.dataset.resultsArrival = 'playing';
    endTimer = setTimeout(settle, 4900);
  }
  if (animate) {
    root.dataset.resultsArrival = 'pending';
    watchdog = setTimeout(settle, 6500);
  }
  async function initialize() {
    const opening = document.querySelector('.results-opening');
    if (!opening) { settle(); return; }
    const orbit = document.querySelector('[data-reading-orbit]');
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        const atCover = entries[0].isIntersecting;
        document.body.classList.toggle('results-at-cover', atCover);
        if (orbit) orbit.inert = atCover;
        if (!atCover) settle();
      }, {threshold: 0}).observe(opening);
    }
    document.querySelector('.results-opening__read')?.addEventListener('click', () => {
      document.getElementById('results-summary')?.focus({preventScroll: true});
    });
    document.querySelector('.results-opening__period')?.addEventListener('click', () => {
      if (reduced.matches || root.dataset.resultsArrival === 'playing') return;
      settle();
      root.dataset.resultsArrival = 'pending';
      replayFrame = requestAnimationFrame(() => { replayFrame = requestAnimationFrame(play); });
    });
    if (!animate) return;
    const mascot = opening.querySelector('.results-opening__pusher img');
    await Promise.race([
      Promise.allSettled([
        document.fonts.load('700 168px "ORCA Rajdhani"'),
        mascot?.decode(),
      ]),
      new Promise(resolve => setTimeout(resolve, 1000)),
    ]);
    const ready = () => {
      if (root.dataset.resultsArrival !== 'pending') return;
      if (root.hasAttribute('data-wh-cover') || root.hasAttribute('data-entry-loading')) return;
      observer?.disconnect();
      if (scrollY > 80) { settle(); return; }
      play();
    };
    observer = new MutationObserver(ready);
    observer.observe(root, {attributes: true, attributeFilter: ['data-wh-cover', 'data-entry-loading']});
    ready();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, {once: true});
  else void initialize();
  reduced.addEventListener('change', event => { if (event.matches) settle(); });
  addEventListener('pageshow', event => { if (event.persisted) settle(); });
  addEventListener('pagehide', settle);
  document.addEventListener('visibilitychange', () => { if (document.hidden) settle(); });
})();
