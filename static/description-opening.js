/* Letter springs respond to the pointer, a ripple, and a passing pod of orcas. */
(() => {
  const cover = document.querySelector('[data-description-opening]');
  if (!cover) return;
  const stage = cover.querySelector('.description-opening__stage');
  const title = cover.querySelector('h1');
  const dot = cover.querySelector('[data-description-replay]');
  const letters = [...cover.querySelectorAll('.description-opening__letter')];
  const swimmers = [...cover.querySelectorAll('[data-description-swimmer]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const states = letters.map(() => ({ y: 0, v: 0, r: 0 }));
  const podConfig = [
    { scale: 1, delay: 0, duration: 4700, level: 3, phase: .2, arc: .42 },
    { scale: .7, delay: 480, duration: 4600, level: -22, phase: 1.1, arc: .5 },
    { scale: .82, delay: 970, duration: 4650, level: 19, phase: -.6, arc: .36 }
  ];
  let frame = 0, previous = 0, pointer = null, wave = null, pod = null, centers = [];
  let geometry = {}, dotAnimation;
  function measure() {
    const box = title.getBoundingClientRect(), s = stage.getBoundingClientRect();
    const font = parseFloat(getComputedStyle(title).fontSize);
    centers = letters.map(el => box.left + el.offsetLeft + el.offsetWidth / 2);
    const b = dot.getBoundingClientRect();
    cover.style.setProperty('--ripple-x', `${b.left + b.width / 2 - s.left}px`);
    cover.style.setProperty('--ripple-y', `${b.top + b.height * .83 - s.top}px`);
    geometry = { left: s.left, width: s.width, font, baseline: box.top - s.top + font * .84,
      whaleWidth: Math.max(65, Math.min(145, font * .82)) };
    swimmers.forEach((el, i) => { el.style.width = `${geometry.whaleWidth * podConfig[i].scale}px`; });
  }
  function hidePod() {
    pod = null;
    swimmers.forEach(el => { el.hidden = true; el.style.opacity = '0'; });
  }
  function swim(now) {
    if (!pod) return [];
    const elapsed = now - pod.start;
    const positions = [];
    swimmers.forEach((el, i) => {
      const c = podConfig[i], progress = (elapsed - c.delay) / c.duration;
      if (progress < 0 || progress > 1) { el.hidden = true; return; }
      const width = geometry.whaleWidth * c.scale;
      const travel = geometry.width + width * 2 + 56;
      const x = -width - 28 + progress * travel;
      const frequency = Math.PI * 2.1;
      const phase = progress * frequency + c.phase;
      const arc = Math.min(84, geometry.font * c.arc);
      const offset = c.level * Math.min(1, geometry.font / 120) + Math.sin(phase) * arc;
      const y = geometry.baseline - width * (128 / 174) / 2 + offset;
      // Face along the tangent of the S-curve, including on narrow screens.
      const rotation = Math.atan2(Math.cos(phase) * arc * frequency, travel) * 180 / Math.PI;
      const fade = Math.min(1, progress / .07, (1 - progress) / .07);
      el.hidden = false;
      el.style.opacity = fade.toFixed(3);
      el.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) rotate(${rotation.toFixed(2)}deg)`;
      const proximity = Math.exp(-Math.pow(offset / (geometry.font * .65), 2));
      positions.push({ x: geometry.left + x + width * .65, width, scale: c.scale * proximity });
    });
    if (elapsed > 5650) hidePod();
    return positions;
  }
  function tick(now) {
    frame = 0;
    const dt = Math.min((now - previous) / 16.667 || 1, 2);
    previous = now;
    const { font } = geometry;
    const amplitude = Math.min(44, font * .29);
    const whales = swim(now);
    let moving = false;
    states.forEach((s, i) => {
      const distance = pointer ? (centers[i] - pointer.x) / Math.max(80, font * .95) : 10;
      const influence = pointer ? Math.exp(-distance * distance * 2) : 0;
      let target = -amplitude * influence;
      let rotation = influence * distance * 13;
      whales.forEach(whale => {
        const d = (centers[i] - whale.x) / Math.max(60, whale.width * .95);
        const lift = Math.exp(-d * d * 2.3) * whale.scale;
        target -= amplitude * .78 * lift;
        rotation += d * lift * 6;
      });
      if (wave) {
        const age = (now - wave.start - Math.abs(i - wave.origin) * 62) / 1000;
        if (age >= 0 && age < 1.6) target += -amplitude * 1.15 * Math.sin(age * 10) * Math.exp(-age * 3.3);
      }
      target = Math.max(-amplitude * 1.55, target);
      s.v = (s.v + (target - s.y) * .105 * dt) * Math.pow(.69, dt);
      s.y += s.v * dt;
      s.r += (rotation - s.r) * Math.min(1, .16 * dt);
      if (Math.abs(target - s.y) + Math.abs(s.v) + Math.abs(rotation - s.r) > .035) moving = true;
      letters[i].style.transform = `translateY(${s.y.toFixed(2)}px) rotate(${s.r.toFixed(2)}deg) scale(${(1 + influence * .035).toFixed(3)})`;
      const tint = Math.max(influence * .55, Math.min(1, Math.abs(s.y) / amplitude) * .25);
      letters[i].style.color = `rgb(${Math.round(46 + 116*tint)},${Math.round(48 + 62*tint)},${Math.round(101 + 40*tint)})`;
    });
    if (wave && now - wave.start > 2400) wave = null;
    if (moving || wave || pod) frame = requestAnimationFrame(tick);
    else previous = 0;
  }
  function wake() { if (!frame && !reduced.matches) { previous = performance.now(); frame = requestAnimationFrame(tick); } }
  function rings(delay = 0) {
    cover.style.setProperty('--wave-delay', `${delay}ms`);
    cover.classList.remove('is-rippling');
    void cover.offsetWidth;
    cover.classList.add('is-rippling');
  }
  function ripple(origin = letters.length - 1) {
    if (reduced.matches) return;
    measure(); wave = { start: performance.now(), origin }; rings(); wake();
  }
  function opening() {
    if (reduced.matches) return;
    measure(); pointer = null; wave = null; hidePod();
    dotAnimation?.cancel();
    dotAnimation = dot.animate([
      { transform: 'translateY(-65px)', opacity: 0 },
      { transform: 'translateY(0)', opacity: 1, offset: .58 },
      { transform: 'translateY(-16px)', opacity: 1, offset: .78 },
      { transform: 'translateY(0)', opacity: 1 }
    ], { duration: 760, easing: 'cubic-bezier(.22,.65,.35,1)' });
    rings(440);
    pod = { start: performance.now() + 440 };
    wake();
  }
  function rest() {
    cancelAnimationFrame(frame); frame = 0; previous = 0; pointer = null; wave = null;
    hidePod(); dotAnimation?.cancel(); cover.classList.remove('is-rippling');
    states.forEach((s,i) => { s.y=0; s.v=0; s.r=0; letters[i].style.transform=''; letters[i].style.color=''; });
  }
  title.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch' || reduced.matches) return;
    pointer = { x: e.clientX }; wake();
  });
  title.addEventListener('pointerleave', () => { pointer = null; wake(); });
  title.addEventListener('pointerup', e => {
    if (e.target.closest('button')) return;
    measure();
    const closest = centers.reduce((best, x, i) => Math.abs(x-e.clientX) < Math.abs(centers[best]-e.clientX) ? i : best, 0);
    ripple(closest);
  });
  dot.addEventListener('click', opening);
  const resize = new ResizeObserver(measure); resize.observe(title); measure();
  window.addEventListener('scroll', () => { pointer = null; measure(); wake(); }, { passive: true });
  reduced.addEventListener('change', () => { if (reduced.matches) rest(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) rest(); });
  const visibility = new IntersectionObserver(entries => { if (!entries[0].isIntersecting) rest(); });
  visibility.observe(cover);
  window.addEventListener('pagehide', rest);
  if (!location.hash) {
    const root = document.documentElement;
    const arrive = () => {
      if (root.hasAttribute('data-entry-loading') || root.hasAttribute('data-wh-cover')) return;
      arrival.disconnect(); opening();
    };
    const arrival = new MutationObserver(arrive);
    arrival.observe(root, { attributes: true, attributeFilter: ['data-entry-loading', 'data-wh-cover'] });
    arrive();
    window.addEventListener('pagehide', () => arrival.disconnect(), { once: true });
  }
})();
