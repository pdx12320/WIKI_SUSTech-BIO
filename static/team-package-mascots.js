/* Opening hover reveals the figures beside the title; the formal title is static. */
(() => {
  'use strict';
  // A restored history entry can dock before this deferred script starts.
  document.querySelectorAll('.team-package-header [data-team-package-mascots]').forEach(cast => cast.remove());
  const opening = document.querySelector('[data-team-opening]');
  const orbit = opening?.querySelector('[data-team-package-orbit]');
  const heading = opening?.querySelector('[data-team-mascot-heading]');
  const cast = heading?.querySelector('[data-team-package-mascots]');
  if (!orbit || !cast || orbit.dataset.mascotsReady === 'true') return;
  orbit.dataset.mascotsReady = 'true';
  const images = [...cast.querySelectorAll('[data-team-mascot]')];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const listeners = new AbortController();
  const options = { signal: listeners.signal };
  let motions = [];
  let width = 0;
  let height = 0;
  let touchTimer;
  let pointerActive = false;
  let keyboardActive = false;
  let touchActive = false;
  let disposed = false;
  let sizeObserver;
  let dockObserver;

  const eligible = () => !disposed && !opening.hidden && opening.contains(orbit)
    && ['title', 'package'].includes(opening.dataset.phase);
  const cancelMotions = () => {
    motions.forEach(({ animation }) => animation.cancel());
    motions = [];
  };
  const buildMotions = () => {
    const area = heading.getBoundingClientRect();
    width = area.width;
    height = area.height;
    if (!width || !images.every(image => typeof image.animate === 'function')) return;
    images.forEach((image, index) => {
      const slot = image.closest('[data-team-mascot-slot]').getBoundingClientRect();
      const x = slot.left + slot.width / 2 - area.left - width / 2;
      const y = slot.top + slot.height / 2 - area.top - height / 2;
      const winding = Number(image.dataset.winding);
      const limitY = Math.max(0, (height - slot.height) / 2);
      const clampY = value => Math.max(-limitY, Math.min(limitY, value));
      const bend = Math.min(Math.hypot(x, y) * .28, height * .3);
      // Keep the entire flight inside the reserved title row, clear of code below.
      const c1 = { x: x * .28, y: clampY(y * .28 + winding * bend) };
      const c2 = { x: x * .76, y: clampY(y * .76 + winding * bend * .65) };
      const frames = Array.from({ length: 49 }, (_, step) => {
        const t = step / 48;
        const u = 1 - t;
        const px = (3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * x);
        const py = (3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * y);
        const scale = .14 + .86 * Math.sin(t * Math.PI / 2);
        return {
          offset: t,
          opacity: Math.min(1, t * 5),
          transform: `translate(${px - x}px, ${py - y}px) scale(${scale}) rotate(${winding * 12 * (1 - t)}deg)`,
        };
      });
      const timing = { duration: 900, delay: index * 40, fill: 'both', easing: 'cubic-bezier(.25,.5,.25,1)' };
      const add = (element, keyframes) => {
        if (!element?.animate) return;
        const animation = element.animate(keyframes, timing);
        animation.pause();
        animation.currentTime = 0;
        motions.push({ animation, end: timing.duration + timing.delay });
      };
      add(image, frames);
    });
  };
  const reveal = (show, immediate = false) => {
    if (disposed) return;
    show = show && eligible();
    heading.classList.toggle('is-revealed', show);
    if (motion.matches) { cancelMotions(); return; }
    if (!show && !motions.length) return;
    if (!motions.length) buildMotions();
    for (const { animation, end } of motions) {
      const time = Number(animation.currentTime) || 0;
      animation.playbackRate = show ? 1 : -1;
      if (immediate || (!show && time <= 0) || (show && time >= end)) {
        animation.pause();
        animation.currentTime = show ? end : 0;
      } else {
        // Reverse the same timeline from its current point, including mid-flight.
        animation.play();
      }
    }
  };
  const render = immediate => reveal(pointerActive || keyboardActive || touchActive, immediate);
  const reset = (immediate = false) => {
    clearTimeout(touchTimer);
    pointerActive = keyboardActive = touchActive = false;
    reveal(false, immediate);
  };
  const dispose = () => {
    if (disposed) return;
    reset(true);
    disposed = true;
    cancelMotions();
    sizeObserver?.disconnect();
    dockObserver?.disconnect();
    listeners.abort();
    cast?.remove();
  };

  orbit.addEventListener('pointerenter', event => {
    if (event.pointerType === 'touch' || !eligible()) return;
    pointerActive = true;
    render(false);
  }, options);
  orbit.addEventListener('pointerleave', event => {
    if (event.pointerType === 'touch') return;
    pointerActive = false;
    keyboardActive = false;
    render(false);
  }, options);
  orbit.addEventListener('pointerdown', event => {
    keyboardActive = false;
    clearTimeout(touchTimer);
    if (event.pointerType === 'touch' && eligible()) {
      touchActive = true;
      touchTimer = setTimeout(() => reset(), 2000);
    }
    render(false);
  }, options);
  orbit.addEventListener('pointerup', event => {
    if (event.pointerType !== 'touch') return;
    clearTimeout(touchTimer);
    touchTimer = setTimeout(() => reset(), 1200);
  }, options);
  orbit.addEventListener('pointercancel', () => reset(), options);
  orbit.addEventListener('focusin', event => {
    keyboardActive = event.target.matches(':focus-visible');
    render(false);
  }, options);
  orbit.addEventListener('focusout', event => {
    if (!orbit.contains(event.relatedTarget)) { keyboardActive = false; render(false); }
  }, options);
  motion.addEventListener('change', () => { cancelMotions(); render(true); }, options);
  document.addEventListener('visibilitychange', () => { if (document.hidden) reset(true); }, options);
  window.addEventListener('blur', () => reset(true), options);
  window.addEventListener('pagehide', () => reset(true), options);

  if (typeof ResizeObserver !== 'undefined') {
    sizeObserver = new ResizeObserver(() => {
      const area = heading.getBoundingClientRect();
      if (!motions.length || (Math.abs(area.width - width) < .5 && Math.abs(area.height - height) < .5)) return;
      cancelMotions();
      render(true);
    });
    sizeObserver.observe(heading);
  }
  dockObserver = new MutationObserver(() => { if (!opening.contains(orbit)) dispose(); });
  dockObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
})();
