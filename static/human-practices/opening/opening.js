(() => {
  'use strict';
  const opening = document.querySelector('[data-hp-opening]');
  if (!opening) return;
  const photo = opening.querySelector('img');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let run = 0;
  opening.addEventListener('animationend', event => {
    if (event.target.classList.contains('hp-opening__bottom')) {
      // Drop animation-created stacking contexts so the final line can cross
      // back in front of the cup, while the first two lines stay behind it.
      opening.dataset.state = 'settled';
    }
  });
  async function enter() {
    const token = ++run;
    opening.dataset.state = 'ready';
    // The image and its SVG foreground share this resource. Slow or failed media
    // never blocks reading or leaves a full-page overlay trapping the visitor.
    await Promise.race([photo.decode().catch(() => {}), new Promise(resolve => setTimeout(resolve, 1600))]);
    if (token !== run || motion.matches || location.hash) return;
    requestAnimationFrame(() => {
      if (token === run) opening.dataset.state = 'playing';
    });
  }
  enter();
  document.querySelector('[data-hp-opening-replay]')?.addEventListener('click', enter);
  addEventListener('pageshow', event => { if (event.persisted) enter(); });
  motion.addEventListener('change', () => {
    ++run;
    opening.dataset.state = 'ready';
  });
})();
