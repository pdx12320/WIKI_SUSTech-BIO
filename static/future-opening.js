(() => {
  const opening = document.querySelector('[data-future-opening]');
  if (!opening) return;
  const replay = opening.querySelector('[data-future-replay]');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  const smooth = t => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
  const mix = (a, b, t) => a + (b - a) * t;
  function finish() {
    cancelAnimationFrame(frame);
    opening.classList.remove('is-looking');
    replay.disabled = false;
  }
  function play() {
    finish();
    if (motion.matches || document.hidden) return;
    const title = opening.querySelector('h1').getBoundingClientRect();
    const w = innerWidth, h = innerHeight;
    const y = title.top + title.height * .52;
    const startX = title.left + title.width * .07;
    const endX = title.right - title.width * .09;
    const radius = Math.min(82, title.height * .4);
    const maxRadius = Math.hypot(w, h);
    const started = performance.now();
    replay.disabled = true;
    function tick(now) {
      const t = (now - started) / 1000;
      const scan = smooth((t - .2) / 2.5);
      const expand = smooth((t - 1.85) / 1.9);
      const appear = smooth((t - 2.65) / 1.15);
      // A continuous wandering sweep: two brief reversals, then settle into the reveal.
      const wander = Math.sin(scan * Math.PI * 4) * Math.sin(scan * Math.PI);
      const x = mix(startX, endX, scan) + title.width * .2 * wander * (1 - expand);
      const cy = y + Math.sin(scan * Math.PI * 3) * Math.sin(scan * Math.PI)
        * title.height * .38 * (1 - expand);
      opening.style.setProperty('--lens-x', x + 'px');
      opening.style.setProperty('--lens-y', cy + 'px');
      opening.style.setProperty('--lens-r', mix(radius, maxRadius, expand) + 'px');
      opening.style.setProperty('--ring-opacity', 1 - expand);
      opening.style.setProperty('--mascot-offset', (1 - appear) * 18 + 'px');
      opening.style.setProperty('--mascot-opacity', appear);
      opening.classList.add('is-looking');
      if (t < 4.15) frame = requestAnimationFrame(tick); else finish();
    }
    frame = requestAnimationFrame(tick);
  }
  replay.addEventListener('click', () => { window.scrollTo({top:0, behavior:'instant'}); play(); });
  motion.addEventListener('change', finish);
  document.addEventListener('visibilitychange', () => { if (document.hidden) finish(); });
  addEventListener('pagehide', finish);
  addEventListener('resize', finish);
  addEventListener('wheel', finish, {passive:true});
  addEventListener('touchmove', finish, {passive:true});
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    document.body.classList.toggle('future-opening-in-view', entries[0].intersectionRatio > .2);
    if (!entries[0].isIntersecting) finish();
  }, {threshold:[0,.2]}).observe(opening);
  if (!location.hash) {
    const root = document.documentElement;
    const ready = new MutationObserver(arrive);
    function arrive() {
      if (root.hasAttribute('data-entry-loading') || root.hasAttribute('data-wh-cover')) return;
      ready.disconnect();
      play();
    }
    ready.observe(root, {attributes:true, attributeFilter:['data-entry-loading','data-wh-cover']});
    arrive();
    addEventListener('pagehide', () => ready.disconnect(), {once:true});
  }
})();
