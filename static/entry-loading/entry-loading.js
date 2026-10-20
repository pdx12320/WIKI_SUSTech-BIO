// Shared main-thread fallback and OffscreenCanvas worker renderer.
function createORCALetterRenderer(canvas, makeCanvas, sampleFrame) {
  'use strict';
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) throw new Error('Canvas 2D unavailable');
  const started = performance.now();
  let width, height, unit, pointer = null, lastDraw = started;
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
  // Rasterize static markings once; frame rendering does constant-time lookup.
  const maskWidth = 452, maskHeight = 328;
  const markings = new Uint8Array(maskWidth * maskHeight);
  for (const polygon of [belly, flank, eye]) {
    for (let y = 0; y < maskHeight; y++) {
      const scan = y + .5, intersections = [];
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const a = polygon[j], b = polygon[i];
        if ((a[1] > scan) !== (b[1] > scan)) intersections.push(a[0] + (scan - a[1]) * (b[0] - a[0]) / (b[1] - a[1]));
      }
      intersections.sort((a, b) => a - b);
      for (let i = 0; i + 1 < intersections.length; i += 2) {
        const left = Math.max(0, Math.ceil(intersections[i] - .5));
        const right = Math.min(maskWidth, Math.ceil(intersections[i + 1] - .5));
        markings.fill(1, y * maskWidth + left, y * maskWidth + right);
      }
    }
  }
  // Cache letter rasterization. Resizing rebuilds one small atlas; animation
  // only copies sprites instead of shaping thousands of separate text runs.
  const inks = ['#7375B2', '#FB95A3', '#C6CCF4', '#FFDBDD'];
  let atlas = null, cell = 0, atlasFont = 0;
  function buildAtlas(dpr) {
    atlas ||= makeCanvas();
    const paint = atlas.getContext?.('2d');
    if (!paint) { atlas = null; return; }
    atlasFont = Math.max(8, Math.ceil(7.1 * unit * dpr * 1.1));
    cell = Math.ceil(atlasFont * 2.4);
    atlas.width = cell * letters.length; atlas.height = cell * inks.length;
    paint.font = `500 ${atlasFont}px ui-monospace, Menlo, Consolas, monospace`;
    paint.textAlign = 'center'; paint.textBaseline = 'middle';
    inks.forEach((ink, row) => {
      paint.fillStyle = ink; paint.globalAlpha = row === 3 ? .95 : .94;
      Array.from(letters).forEach((letter, col) => paint.fillText(letter, (col + .5) * cell, (row + .5) * cell));
    });
  }
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
  for (const p of points) {
    p.letterIndex = letters.indexOf(p.letter); p.inkIndex = inks.indexOf(p.color);
  }
  function resize(newWidth, newHeight, dpr) {
    width = newWidth; height = newHeight;
    pointer = null;
    for (const p of points) { p.offsetX = 0; p.offsetY = 0; }
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    unit = Math.min(width * .78 / 429, height * .5 / 312, 1.4);
    buildAtlas(dpr);
  }
  const screenX = x => width / 2 + (x - center.x) * unit;
  const screenY = y => height / 2 - 18 + (y - center.y) * unit;
  function hover(event) {
    if (event.pointerType === 'touch') return;
    pointer = { x: event.clientX, y: event.clientY };
  }
  function unhover() { pointer = null; }
  function draw(now) {
    const dt = Math.max(0, Math.min(50, now - lastDraw));
    lastDraw = now;
    const radius = Math.max(32, Math.min(54, width * .062));
    const ease = 1 - Math.exp(-dt / (pointer ? 65 : 150));
    const elapsed = Number.isFinite(sampleFrame) ? Math.max(0, sampleFrame) : now - started;
    // Positive rotation is clockwise in Canvas screen coordinates. No loop reset.
    const angle = elapsed * .00085;
    const c = Math.cos(angle), s = Math.sin(angle);
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
      const pale = markings[Math.floor(y) * maskWidth + Math.floor(x)] === 1;
      const fontSize = Math.max(4.5, 7.1 * unit * p.size);
      const sx = baseX + p.offsetX, sy = baseY + p.offsetY;
      if (atlas) {
        const size = cell * fontSize / atlasFont;
        ctx.drawImage(atlas, p.letterIndex * cell, (pale ? 3 : p.inkIndex) * cell, cell, cell,
          sx - size / 2, sy - size / 2, size, size);
      } else {
        ctx.font = `500 ${fontSize.toFixed(1)}px ui-monospace, Menlo, Consolas, monospace`;
        ctx.globalAlpha = pale ? .95 : .94; ctx.fillStyle = pale ? '#FFDBDD' : p.color;
        ctx.fillText(p.letter, sx, sy);
      }
    }
    ctx.restore(); ctx.globalAlpha = 1;
  }
  return { draw, resize, hover, unhover, dispose() { if (atlas) { atlas.width = 1; atlas.height = 1; atlas = null; } } };
}

// Worker execution uses the same source and has no DOM/Home initialization.
if (typeof document === 'undefined') {
  let renderer, frame, active = false;
  const raf = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : fn => setTimeout(() => fn(performance.now()), 16);
  const caf = typeof cancelAnimationFrame === 'function' ? cancelAnimationFrame : clearTimeout;
  let samples = [], gaps = [], last = 0, reportAt = 0, debug = false;
  const tick = now => {
    if (!active) return;
    const begin = performance.now(); renderer.draw(now);
    if (debug) {
      samples.push(performance.now() - begin); if (last) gaps.push(now - last); last = now;
      if (now - reportAt > 1000) {
        postMessage({ type: 'stats', samples, gaps, backend: 'worker' });
        samples = []; gaps = []; reportAt = now;
      }
    }
    frame = raf(tick);
  };
  self.onmessage = ({ data }) => {
    try {
      if (data.type === 'init') {
        renderer = createORCALetterRenderer(data.canvas, () => new OffscreenCanvas(1, 1), data.sampleFrame);
        renderer.resize(data.width, data.height, data.dpr); debug = data.debug;
        active = true; postMessage({ type: 'ready' }); frame = raf(tick);
      } else if (data.type === 'resize') renderer?.resize(data.width, data.height, data.dpr);
      else if (data.type === 'pointer') renderer?.hover(data);
      else if (data.type === 'leave') renderer?.unhover();
      else if (data.type === 'stop') { active = false; caf(frame); renderer?.dispose(); }
    } catch (error) { postMessage({ type: 'error', message: String(error) }); }
  };
} else (() => {
  'use strict';
  const root = document.documentElement;
  const layer = document.querySelector('[data-entry-loader]');
  if (!layer || !root.hasAttribute('data-entry-loading')) { layer?.remove(); return; }
  let canvas = layer.querySelector('canvas');
  const preview = root.dataset.entryLoading === 'preview';
  const query = new URLSearchParams(location.search);
  const sampleFrame = preview && query.has('loading-frame') ? Number(query.get('loading-frame')) : NaN;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const started = performance.now(), scriptURL = document.currentScript?.src;
  const debug = preview && query.get('loading-debug') === '1';
  let worker, renderer, frame, timer, workerWatchdog, removed = false, leaving = false;
  let report, lastFrame = started, reportAt = started;
  const samples = [], gaps = [];
  if (debug) {
    report = document.createElement('output'); report.setAttribute('data-entry-performance', '');
    report.style.cssText = 'position:absolute;bottom:20px;left:20px;max-width:90vw;color:#303d72;font:12px/1.5 monospace;white-space:pre-wrap';
    layer.append(report);
  }
  function statistics(data) {
    if (!report) return;
    const avg = values => values.reduce((sum, x) => sum + x, 0) / Math.max(1, values.length);
    const p95 = values => [...values].sort((a, b) => a - b)[Math.floor((values.length - 1) * .95)] || 0;
    report.textContent = `${data.backend}: ${(1000 / avg(data.gaps)).toFixed(1)} fps · ${data.samples.length} frames\nDraw avg ${avg(data.samples).toFixed(2)} ms / p95 ${p95(data.samples).toFixed(2)} ms · frame p95 ${p95(data.gaps).toFixed(1)} ms`;
  }
  const size = () => ({ width: innerWidth, height: innerHeight, dpr: Math.min(devicePixelRatio || 1, 1.5) });
  function resize() {
    const bounds = size();
    if (worker) worker.postMessage({ type: 'resize', ...bounds });
    else renderer?.resize(bounds.width, bounds.height, bounds.dpr);
  }
  function hover(event) {
    if (event.pointerType === 'touch' || reduced.matches) return;
    const data = { type: 'pointer', clientX: event.clientX, clientY: event.clientY, pointerType: event.pointerType };
    if (worker) worker.postMessage(data); else renderer?.hover(data);
  }
  function unhover() { if (worker) worker.postMessage({ type: 'leave' }); else renderer?.unhover(); }
  function draw(now) {
    if (removed) return;
    if (!root.hasAttribute('data-entry-loading')) { dispose(); return; }
    const begin = debug ? performance.now() : 0;
    renderer.draw(now);
    if (debug) {
      samples.push(performance.now() - begin); if (now > lastFrame) gaps.push(now - lastFrame); lastFrame = now;
      if (samples.length > 240) samples.shift(); if (gaps.length > 240) gaps.shift();
      if (now - reportAt > 1000) { statistics({ samples, gaps, backend: 'main' }); reportAt = now; }
    }
    if (!reduced.matches && !Number.isFinite(sampleFrame)) frame = requestAnimationFrame(draw);
  }
  function fallback(replace = false) {
    if (removed) return;
    clearTimeout(workerWatchdog); worker?.terminate(); worker = null;
    if (replace) { const fresh = canvas.cloneNode(); canvas.replaceWith(fresh); canvas = fresh; }
    try {
      renderer = createORCALetterRenderer(canvas, () => document.createElement('canvas'), reduced.matches ? 0 : sampleFrame);
      resize(); layer.dataset.renderer = 'main'; draw(performance.now());
    } catch { dispose(); }
  }
  function dispose() {
    if (removed) return;
    removed = true; cancelAnimationFrame(frame); clearTimeout(timer); clearTimeout(workerWatchdog); clearTimeout(window.__orcaEntryWatchdog);
    worker?.terminate(); renderer?.dispose(); observer.disconnect();
    removeEventListener('resize', resize); removeEventListener('pagehide', dispose); removeEventListener('pageshow', restored);
    removeEventListener('keydown', key); removeEventListener('blur', unhover); reduced.removeEventListener('change', motionChange);
    document.removeEventListener('DOMContentLoaded', ready);
    layer.removeEventListener('pointermove', hover); layer.removeEventListener('pointerleave', unhover); layer.removeEventListener('pointercancel', unhover);
    root.removeAttribute('data-entry-loading'); layer.remove();
  }
  function finish() {
    if (removed || leaving) return;
    leaving = true;
    try { sessionStorage.setItem('orca.entry-seen.v1', '1'); } catch { /* Optional storage. */ }
    root.dataset.entryLoading = 'leaving'; clearTimeout(timer); timer = setTimeout(dispose, reduced.matches ? 0 : 260);
  }
  function ready() {
    if (preview || leaving || removed) return;
    const homeScene = document.querySelector('[data-ot]');
    if (homeScene ? document.querySelector('[data-ot].is-ready') : document.readyState !== 'loading') {
      observer.disconnect(); clearTimeout(timer); timer = setTimeout(finish, Math.max(0, 1000 - (performance.now() - started)));
    }
  }
  function restored(event) { if (event.persisted) dispose(); }
  function key(event) { if (preview && event.key === 'Escape') finish(); }
  function motionChange() { if (reduced.matches) finish(); }
  const observer = new MutationObserver(ready);
  observer.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
  layer.addEventListener('pointermove', hover, { passive: true }); layer.addEventListener('pointerleave', unhover); layer.addEventListener('pointercancel', unhover);
  layer.addEventListener('wheel', event => event.preventDefault(), { passive: false });
  addEventListener('blur', unhover); addEventListener('resize', resize); addEventListener('pagehide', dispose); addEventListener('pageshow', restored);
  addEventListener('keydown', key); reduced.addEventListener('change', motionChange);
  if (preview) { clearTimeout(window.__orcaEntryWatchdog); layer.addEventListener('click', finish); }
  else timer = setTimeout(finish, 3200);
  document.addEventListener('DOMContentLoaded', ready, { once: true }); layer.dataset.stage = 'loading';
  if (!reduced.matches && !Number.isFinite(sampleFrame) && scriptURL && typeof Worker === 'function' && canvas.transferControlToOffscreen) {
    try {
      worker = new Worker(scriptURL);
      const currentWorker = worker;
      worker.onerror = () => { if (worker === currentWorker) fallback(true); };
      worker.onmessage = ({ data }) => {
        if (removed || worker !== currentWorker) return;
        if (data.type === 'ready') clearTimeout(workerWatchdog);
        else if (data.type === 'error') fallback(true);
        else if (data.type === 'stats') statistics(data);
      };
      const offscreen = canvas.transferControlToOffscreen();
      worker.postMessage({ type: 'init', canvas: offscreen, sampleFrame, debug, ...size() }, [offscreen]);
      layer.dataset.renderer = 'worker'; workerWatchdog = setTimeout(() => fallback(true), 1000);
    } catch { fallback(true); }
  } else fallback();
  ready();
})();
