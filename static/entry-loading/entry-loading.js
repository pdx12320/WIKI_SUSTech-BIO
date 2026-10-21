(() => {
  'use strict';
  const root = document.documentElement;
  const layer = document.querySelector('[data-entry-loader]');
  if (!layer || !root.hasAttribute('data-entry-loading')) { layer?.remove(); return; }
  const canvas = layer.querySelector('canvas');
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) { root.removeAttribute('data-entry-loading'); layer.remove(); return; }
  const preview = root.dataset.entryLoading === 'preview';
  const query = new URLSearchParams(location.search);
  const sampleFrame = preview && query.has('loading-frame') ? Number(query.get('loading-frame')) : NaN;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const started = performance.now();
  let width, height, unit, frame, timer, removed = false, leaving = false;
  let pointer = null, lastDraw = started;
  const points = [], letters = 'LOADING';
  // Team-supplied primary visual palette: violet, coral pink and lavender.
  const palette = ['#7375B2', '#7375B2', '#FB95A3', '#C6CCF4'];
  let seed = 481;
  const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  // Keep the original mascot silhouette fixed. Only the letter field rotates.
  const contour = (start, curves) => {
    const vertices = [start]; let previous = start;
    for (const [cx1, cy1, cx2, cy2, x, y] of curves) {
      for (let i = 1; i <= 16; i++) {
        const t = i / 16, q = 1 - t;
        vertices.push([q ** 3 * previous[0] + 3 * q * q * t * cx1 + 3 * q * t * t * cx2 + t ** 3 * x,
          q ** 3 * previous[1] + 3 * q * q * t * cy1 + 3 * q * t * t * cy2 + t ** 3 * y]);
      }
      previous = [x, y];
    }
    return vertices;
  };
  const inside = (x, y, vertices) => {
    let hit = false;
    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
      const a = vertices[i], b = vertices[j];
      if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) hit = !hit;
    }
    return hit;
  };
  const outline = contour([16, 231], [
    [20, 205, 95, 173, 157, 161], [176, 159, 184, 151, 191, 132],
    [213, 101, 222, 112, 226, 158], [250, 143, 284, 129, 321, 111],
    [318, 82, 314, 52, 321, 32], [344, 25, 361, 29, 372, 42],
    [391, 24, 415, 9, 435, 7], [445, 14, 435, 49, 417, 72],
    [401, 91, 387, 99, 367, 105], [354, 147, 321, 196, 278, 254],
    [280, 270, 291, 296, 278, 300], [260, 308, 248, 297, 237, 298],
    [176, 319, 69, 296, 32, 264], [21, 254, 16, 242, 16, 231],
  ]);
  const belly = contour([32, 239], [
    [43, 230, 50, 250, 74, 256], [124, 269, 170, 267, 219, 288],
    [177, 314, 93, 294, 54, 273], [35, 261, 22, 245, 32, 239],
  ]);
  const flank = contour([278, 237], [
    [288, 211, 293, 178, 307, 175], [331, 167, 307, 212, 278, 237],
  ]);
  const eye = contour([100, 214], [
    [111, 201, 139, 197, 145, 213], [149, 232, 115, 235, 100, 214],
  ]);
  const center = { x: 226, y: 163 };
  // A circular field covers the complete logo at every angle. Fixed silhouette
  // and marking masks determine which letters are visible, never a moving body.
  for (let y = -275; y <= 275; y += 7) {
    for (let x = -275; x <= 275; x += 7) {
      if (x * x + y * y > 275 * 275) continue;
      points.push({ x: x + (random() - .5) * 1.2, y: y + (random() - .5) * 1.2,
        letter: letters[Math.floor(random() * letters.length)], size: .9 + random() * .18, color: palette[Math.floor(random() * palette.length)], offsetX: 0, offsetY: 0 });
    }
  }
  const duration = 1000;
  function resize() {
    width = innerWidth; height = innerHeight;
    pointer = null;
    for (const p of points) { p.offsetX = 0; p.offsetY = 0; }
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    unit = Math.min(width * .78 / 429, height * .5 / 312, 1.4);
  }
  const screenX = x => width / 2 + (x - center.x) * unit;
  const screenY = y => height / 2 - 18 + (y - center.y) * unit;
  function hover(event) {
    if (event.pointerType === 'touch' || reduced.matches) return;
    pointer = { x: event.clientX, y: event.clientY };
  }
  function unhover() { pointer = null; }
  function draw(now) {
    if (removed) return;
    if (!root.hasAttribute('data-entry-loading')) { dispose(); return; }
    const dt = Math.max(0, Math.min(50, now - lastDraw));
    lastDraw = now;
    const radius = Math.max(32, Math.min(54, width * .062));
    const ease = 1 - Math.exp(-dt / (pointer ? 65 : 150));
    const elapsed = Number.isFinite(sampleFrame) ? Math.max(0, sampleFrame) : now - started;
    // Positive rotation is clockwise in Canvas screen coordinates. No loop reset.
    const angle = reduced.matches ? 0 : elapsed * .00085;
    const c = Math.cos(angle), s = Math.sin(angle);
    layer.dataset.stage = 'loading';
    ctx.clearRect(0, 0, width, height);
    ctx.save(); ctx.beginPath();
    outline.forEach(([x, y], i) => i ? ctx.lineTo(screenX(x), screenY(y)) : ctx.moveTo(screenX(x), screenY(y)));
    ctx.closePath(); ctx.clip();
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (const p of points) {
      const x = center.x + p.x * c - p.y * s;
      const y = center.y + p.x * s + p.y * c;
      // Reject fully hidden letters before the more detailed marking checks.
      if (x < 10 || x > 450 || y < 0 || y > 325) {
        p.offsetX *= 1 - ease; p.offsetY *= 1 - ease;
        continue;
      }
      const baseX = screenX(x), baseY = screenY(y);
      let targetX = 0, targetY = 0;
      if (pointer) {
        const dx = baseX - pointer.x, dy = baseY - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance < radius * 2) {
          const direction = distance > .01 ? Math.atan2(dy, dx) : Math.atan2(p.y, p.x);
          // Gaussian feathering avoids packing letters into a hard circular rim.
          // A little letter-to-letter variation also breaks up a uniform ring.
          const q = Math.max(.08, distance / (radius * .48));
          const push = radius * .48 * q * Math.exp(.5 * (1 - q * q)) * p.size;
          targetX = Math.cos(direction) * push; targetY = Math.sin(direction) * push;
        }
      }
      // Each glyph yields locally, then eases back onto its rotating orbit.
      p.offsetX += (targetX - p.offsetX) * ease;
      p.offsetY += (targetY - p.offsetY) * ease;
      const pale = inside(x, y, belly) || inside(x, y, flank) || inside(x, y, eye);
      ctx.font = `500 ${Math.max(4.5, 7.1 * unit * p.size).toFixed(1)}px ui-monospace, Menlo, Consolas, monospace`;
      ctx.globalAlpha = pale ? .95 : .94;
      ctx.fillStyle = pale ? '#FFDBDD' : p.color;
      ctx.fillText(p.letter, baseX + p.offsetX, baseY + p.offsetY);
    }
    ctx.restore(); ctx.globalAlpha = 1;
    if (!reduced.matches && !Number.isFinite(sampleFrame)) frame = requestAnimationFrame(draw);
  }
  function dispose() {
    if (removed) return;
    removed = true;
    cancelAnimationFrame(frame); clearTimeout(timer); clearTimeout(window.__orcaEntryWatchdog);
    observer.disconnect();
    removeEventListener('resize', resize); removeEventListener('pagehide', dispose);
    removeEventListener('pageshow', restored); removeEventListener('keydown', key);
    reduced.removeEventListener('change', motionChange);
    document.removeEventListener('DOMContentLoaded', ready);
    layer.removeEventListener('pointermove', hover); layer.removeEventListener('pointerleave', unhover);
    layer.removeEventListener('pointercancel', unhover); removeEventListener('blur', unhover);
    root.removeAttribute('data-entry-loading'); layer.remove();
  }
  function finish() {
    if (removed || leaving) return;
    leaving = true;
    try { sessionStorage.setItem('orca.entry-seen.v1', '1'); } catch { /* Optional storage. */ }
    root.dataset.entryLoading = 'leaving';
    clearTimeout(timer); timer = setTimeout(dispose, reduced.matches ? 0 : 260);
  }
  function ready() {
    if (preview || leaving || removed) return;
    const homeScene = document.querySelector('[data-ot]');
    if (homeScene ? document.querySelector('[data-ot].is-ready') : document.readyState !== 'loading') {
      observer.disconnect(); clearTimeout(timer);
      timer = setTimeout(finish, Math.max(0, duration - (performance.now() - started)));
    }
  }
  function restored(event) { if (event.persisted) dispose(); }
  function key(event) { if (preview && event.key === 'Escape') finish(); }
  function motionChange() { if (reduced.matches) finish(); }
  const observer = new MutationObserver(ready);
  observer.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
  layer.addEventListener('pointermove', hover, { passive: true });
  layer.addEventListener('pointerleave', unhover); layer.addEventListener('pointercancel', unhover);
  addEventListener('blur', unhover);
  layer.addEventListener('wheel', event => event.preventDefault(), { passive: false });
  addEventListener('resize', resize, { passive: true });
  addEventListener('pagehide', dispose); addEventListener('pageshow', restored);
  addEventListener('keydown', key); reduced.addEventListener('change', motionChange);
  if (preview) {
    clearTimeout(window.__orcaEntryWatchdog);
    layer.addEventListener('click', finish);
  } else timer = setTimeout(() => {
    // Keep the original cover until Home has something real to reveal.
    const home = document.querySelector('[data-ot]');
    if (home && !home.classList.contains('is-ready')) {
      home.dataset.homeStartup = 'fallback';
      home.classList.add('ot--static', 'is-ready');
    }
    finish();
  }, document.querySelector('[data-ot]') ? 12000 : 3200);
  document.addEventListener('DOMContentLoaded', ready, { once: true });
  resize(); draw(started); ready();
})();
