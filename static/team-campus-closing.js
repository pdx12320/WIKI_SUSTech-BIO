/* Smooth scroll scrubbing; no-script and reduced motion stay complete. */
(() => {
  'use strict';
  const section = document.querySelector('[data-team-campus-closing]');
  if (!section || section.dataset.campusReady === 'true') return;
  const panel = section.querySelector('.team-campus-closing__panel');
  if (!panel) return;
  section.dataset.campusReady = 'true';
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let dirty = true;
  let current = null;
  let target = 1;
  let previousTime = null;
  let immediate = false;
  let nearby = false;
  let lastTransform = '';
  const measure = () => {
    dirty = false;
    const height = document.documentElement.clientHeight || window.innerHeight;
    target = 1;
    immediate = motion.matches || section.contains(document.activeElement);
    nearby = false;
    if (height && !immediate) {
      const bounds = panel.getBoundingClientRect();
      const top = bounds.top;
      // Prepare the compositor before the panel enters the viewport.
      nearby = top < height + 160 && bounds.bottom > -160;
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
      target = end === start ? 1 : Math.min(1, Math.max(0, (start - top) / (start - end)));
    }
  };
  const update = (time) => {
    frame = 0;
    if (dirty) measure();
    if (current === null || immediate || !nearby) current = target;
    else {
      // Time-based damping keeps wheel steps smooth at both 60 and 120 Hz.
      const elapsed = previousTime === null ? 1000 / 60 : Math.min(64, time - previousTime);
      current += (target - current) * (1 - Math.exp(-elapsed / 70));
      if (Math.abs(target - current) < .0001) current = target;
    }
    const moving = current !== target;
    const transform = `translate3d(${((current - 1) * 102).toFixed(4)}%, 0, 0)`;
    if (transform !== lastTransform) {
      // A local transform avoids invalidating inherited styles on every child.
      panel.style.transform = transform;
      lastTransform = transform;
    }
    section.classList.toggle('is-scroll-ready', !immediate && nearby && (moving || target < 1));
    previousTime = moving ? time : null;
    if (moving) frame = requestAnimationFrame(update);
  };
  const schedule = () => {
    dirty = true;
    if (!frame) frame = requestAnimationFrame(update);
  };
  update(0);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('pageshow', schedule);
  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(frame);
    frame = 0;
    previousTime = null;
  });
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
