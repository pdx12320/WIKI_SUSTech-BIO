/* A pink baton brings scattered glyphs into line, one spring at a time. */
(() => {
  const cover = document.querySelector('[data-contribution-opening]');
  if (!cover) return;
  const stage = cover.querySelector('.contribution-opening__stage');
  const title = cover.querySelector('h1');
  const letters = [...cover.querySelectorAll('.contribution-opening__letter')];
  const button = cover.querySelector('button');
  const period = button.querySelector('span');
  const baton = cover.querySelector('.contribution-opening__baton');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const states = letters.map(() => ({ y: 0, v: 0, glow: 0, tilt: 0, aligned: true }));
  const scatterY = [.12, -.10, .17, -.07, .13, -.16, .08, -.12, .16, -.08, .11, -.13];
  const scatterTilt = [-9, 7, -8, 10, -6, 9, -10, 6, -7, 8, -6, 9];
  // Nunito at weight 850: glyph bounds relative to the 1.18em line box.
  const crowns = [.203, .417, .417, .275, .416, .181, .205, .419, .275, .181, .417, .417];
  let points = [], font = 100, radius = 7, frame = 0, previous = 0;
  let relay = null, pulses = [], hoverIndex = -1, lastHover = 0;
  const durations = [440, ...Array(11).fill(265), 440];
  const totalDuration = durations.reduce((sum, duration) => sum + duration, 0);

  function measure() {
    const box = title.getBoundingClientRect(), s = stage.getBoundingClientRect();
    font = parseFloat(getComputedStyle(title).fontSize);
    radius = period.offsetWidth / 2;
    const contacts = letters.map((el, i) => ({
      x: box.left - s.left + el.offsetLeft + el.offsetWidth * .5,
      y: box.top - s.top + font * crowns[i] - radius,
      index: i
    }));
    const dot = period.getBoundingClientRect();
    const end = { x: dot.left - s.left + dot.width / 2, y: dot.top - s.top + dot.height / 2 };
    points = [{ x: contacts[0].x - font * .85, y: contacts[0].y + font * .35 }, ...contacts, end];
    cover.style.setProperty('--relay-end-x', `${end.x}px`);
    cover.style.setProperty('--relay-end-y', `${end.y}px`);
  }
  function impact(index, strength = 1, lift = false) {
    if (!states[index]) return;
    const s = states[index];
    s.v += Math.min(28, font * .16) * strength * (lift ? -1 : 1);
    s.glow = Math.max(s.glow, strength);
    s.tilt = (index % 2 ? 1 : -1) * 5 * strength;
    if (!lift && states[index + 1]?.aligned) states[index + 1].v += font * .025 * strength;
  }
  function align(index) {
    const s = states[index];
    s.aligned = true;
    // Lift first, then let the spring settle at the shared baseline.
    s.v = -Math.min(26, font * .19);
    s.glow = 1;
  }
  function contact(point) {
    const s = states[point.index];
    if (!s) return point;
    const angle = s.tilt * Math.PI / 180;
    const pivot = font * 1.18 * .85;
    const arm = (font * crowns[point.index] - pivot) * (1 - squash(s));
    return {
      x: point.x - Math.sin(angle) * arm,
      y: point.y + s.y + Math.cos(angle) * arm - (font * crowns[point.index] - pivot)
    };
  }
  function squash(s) {
    return s.aligned ? Math.min(.18, Math.max(0, s.y) / font * .8) : 0;
  }
  function paint(s, i) {
    const compression = squash(s);
    letters[i].style.transform = `translateY(${s.y.toFixed(2)}px) rotate(${s.tilt.toFixed(2)}deg) scale(${(1 + compression * .32).toFixed(3)},${(1 - compression).toFixed(3)})`;
    const glow = Math.min(1, s.glow);
    letters[i].style.color = `rgb(${Math.round(46 + 150 * glow)},${Math.round(48 + 84 * glow)},${Math.round(101 + 55 * glow)})`;
  }
  function finish() {
    relay = null; baton.hidden = true;
    cover.classList.remove('is-relaying');
    cover.classList.remove('is-landed');
    void cover.offsetWidth;
    cover.classList.add('is-landed');
  }
  function moveBaton(now) {
    if (!relay) return;
    const elapsed = now - relay.start;
    if (elapsed < 0) return;
    let phase = elapsed, segment = 0;
    while (segment < durations.length && phase >= durations[segment]) {
      phase -= durations[segment++];
    }
    while (relay.landed < Math.min(segment - 1, letters.length - 1)) {
      align(++relay.landed);
    }
    if (elapsed >= totalDuration) { finish(); return; }
    const t = phase / durations[segment];
    const from = contact(points[segment]), to = contact(points[segment + 1]);
    const height = Math.max(22, font * (segment === 0 ? .6 : .36 + (segment % 3) * .065));
    const x = from.x + (to.x - from.x) * t;
    const y = from.y + (to.y - from.y) * t - 4 * height * t * (1 - t);
    const stretch = 1 + Math.abs(1 - 2 * t) * .16;
    baton.hidden = false;
    baton.style.transform = `translate3d(${x - radius}px,${y - radius}px,0) scale(${1 / stretch},${stretch})`;
  }
  function tick(now) {
    frame = 0;
    const dt = Math.min((now - previous) / 16.667 || 1, 2);
    previous = now;
    moveBaton(now);
    pulses = pulses.filter(p => {
      if (now < p.at) return true;
      impact(p.index, p.strength, p.lift); return false;
    });
    let moving = false;
    states.forEach((s, i) => {
      if (!s.aligned) { paint(s, i); return; }
      s.v = (s.v - s.y * .17 * dt) * Math.pow(.78, dt);
      s.y += s.v * dt;
      s.glow *= Math.pow(.947, dt);
      s.tilt *= Math.pow(.88, dt);
      if (Math.abs(s.y) + Math.abs(s.v) + s.glow + Math.abs(s.tilt) > .025) moving = true;
      else { s.y = 0; s.v = 0; s.glow = 0; s.tilt = 0; }
      paint(s, i);
    });
    if (moving || relay || pulses.length) frame = requestAnimationFrame(tick);
    else previous = 0;
  }
  function wake() {
    if (!frame && !reduced.matches) { previous = performance.now(); frame = requestAnimationFrame(tick); }
  }
  function rest() {
    cancelAnimationFrame(frame); frame = 0; previous = 0; relay = null; pulses = [];
    hoverIndex = -1; baton.hidden = true;
    cover.classList.remove('is-relaying', 'is-landed');
    states.forEach((s, i) => {
      s.y = s.v = s.glow = s.tilt = 0;
      s.aligned = true;
      letters[i].style.transform = ''; letters[i].style.color = '';
    });
  }
  function opening() {
    if (reduced.matches) return;
    rest(); measure();
    states.forEach((s, i) => {
      s.y = scatterY[i] * font;
      s.tilt = scatterTilt[i];
      s.aligned = false;
      paint(s, i);
    });
    cover.classList.add('is-relaying');
    relay = { start: performance.now() + 700, landed: -1 };
    wake();
  }
  function localRelay(index) {
    if (reduced.matches || relay) return;
    pulses = [];
    [1, .65, .38].forEach((strength, step) => {
      const next = index + step;
      if (next < letters.length) pulses.push({ at: performance.now() + step * 95, index: next, strength, lift: step === 0 });
    });
    wake();
  }
  title.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch' || relay || reduced.matches || e.target.closest('button')) return;
    const index = letters.indexOf(e.target.closest('.contribution-opening__letter'));
    if (index < 0 || index === hoverIndex || performance.now() - lastHover < 70) return;
    hoverIndex = index; lastHover = performance.now(); localRelay(index);
  });
  title.addEventListener('pointerleave', () => { hoverIndex = -1; });
  title.addEventListener('pointerup', e => {
    if (e.target.closest('button')) return;
    const index = letters.indexOf(e.target.closest('.contribution-opening__letter'));
    if (index >= 0) localRelay(index);
  });
  button.addEventListener('click', opening);
  new ResizeObserver(() => { rest(); measure(); }).observe(title);
  reduced.addEventListener('change', () => { if (reduced.matches) rest(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) rest(); });
  new IntersectionObserver(entries => { if (!entries[0].isIntersecting) rest(); }).observe(cover);
  window.addEventListener('pagehide', rest);
  measure();
  if (!location.hash) {
    const root = document.documentElement;
    const arrive = () => {
      if (root.hasAttribute('data-entry-loading') || root.hasAttribute('data-wh-cover')) return;
      arrival.disconnect();
      document.fonts.ready.then(() => {
        const box = cover.getBoundingClientRect();
        if (!document.hidden && box.bottom > 0 && box.top < innerHeight) {
          requestAnimationFrame(() => requestAnimationFrame(opening));
        }
      });
    };
    const arrival = new MutationObserver(arrive);
    arrival.observe(root, { attributes: true, attributeFilter: ['data-entry-loading', 'data-wh-cover'] });
    arrive();
    window.addEventListener('pagehide', () => arrival.disconnect(), { once: true });
  }
})();
