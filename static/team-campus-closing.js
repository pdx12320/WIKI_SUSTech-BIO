/* Scrub the panel directly with scroll position; no-script stays complete. */
(() => {
  'use strict';
  const section = document.querySelector('[data-team-campus-closing]');
  if (!section || section.dataset.campusReady === 'true') return;
  const panel = section.querySelector('.team-campus-closing__panel');
  if (!panel) return;
  section.dataset.campusReady = 'true';
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  const update = () => {
    frame = 0;
    const height = document.documentElement.clientHeight || window.innerHeight;
    let progress = 1;
    if (height && !motion.matches && !section.contains(document.activeElement)) {
      const bounds = panel.getBoundingClientRect();
      const top = bounds.top;
      const start = height * .98;
      // Complete when the visible panel's vertical center reaches the screen center.
      let end = (height - bounds.height) / 2;
      // Keep the finish reachable on tall screens or with a short footer.
      // The opening's fixed body temporarily has no document scroll range.
      if (!document.documentElement.classList.contains('team-opening-scroll-locked')) {
        const scrollRoot = document.scrollingElement || document.documentElement;
        const scrollTop = window.scrollY || scrollRoot.scrollTop || 0;
        const maxScroll = Math.max(0, scrollRoot.scrollHeight - height);
        if (maxScroll > 0) {
          const lowestTop = top - Math.max(0, maxScroll - scrollTop);
          end = Math.min(start - 1, Math.max(end, lowestTop + Math.min(32, height * .05)));
        } else {
          end = start;
        }
      }
      progress = end === start ? 1 : Math.min(1, Math.max(0, (start - top) / (start - end)));
    }
    section.style.setProperty('--campus-progress', progress.toFixed(4));
    section.classList.toggle('is-scroll-ready', !motion.matches && progress > 0 && progress < 1);
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  update();
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('pageshow', schedule);
  window.addEventListener('pagehide', () => { cancelAnimationFrame(frame); frame = 0; });
  motion.addEventListener?.('change', schedule);
  section.addEventListener('focusin', schedule);
  section.addEventListener('focusout', schedule);
  // Recalculate after unpacking, filtering members or loading layout assets.
  if (typeof ResizeObserver !== 'undefined') {
    const layout = new ResizeObserver(schedule);
    layout.observe(document.body);
    layout.observe(section);
  }
  if (typeof MutationObserver !== 'undefined') {
    const opening = new MutationObserver(schedule);
    opening.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }
})();
