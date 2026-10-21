// Reveal the supplied finished artwork; the moving pencil follows the same mask path.
const NS = 'http://www.w3.org/2000/svg';
const W = 1685;
const H = 1082;
const DURATION = 26000;
const SETTLE = 180;

function svgNode(tag, attributes = {}) {
  const element = document.createElementNS(NS, tag);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
  return element;
}

export function drawingPlan() {
  const strokes = [];
  const line = (name, d, width) => strokes.push({name, d, width});
  // Each box includes a complete illustration and all of its caption lines.
  // Diagonal passes are clipped to that box; the whole box is committed before moving on.
  const shade = (name, x, y, w, h, width = 25) => {
    const step = width * .65 * Math.SQRT2;
    let d = '';
    let row = 0;
    for (let diagonal = 0; diagonal <= w + h + step; diagonal += step) {
      const sum = x + y + Math.min(diagonal, w + h);
      const left = Math.max(x, sum - (y + h));
      const right = Math.min(x + w, sum - y);
      if (right <= left) continue;
      const a = [left, sum - left];
      const b = [right, sum - right];
      const from = row % 2 ? b : a;
      const to = row % 2 ? a : b;
      d += `${row ? ' L' : 'M'}${from[0]},${from[1]} L${to[0]},${to[1]}`;
      row++;
    }
    strokes.push({name, d, width, region: {x, y, width: w, height: h}});
  };
  shade('ORCA', 85, 130, 365, 120, 35);
  shade('Human Practices Overview', 85, 226, 403, 139, 31);
  line('Title underline', 'M135 392 Q244 352 354 349', 20);
  shade('Whale', 70, 444, 450, 265, 28);
  line('Lived experience wave, upper left', 'M599 340 Q506 394 486 514', 16);
  line('Lived experience wave, lower left', 'M488 646 Q514 751 633 788', 16);
  line('Lived experience wave, right', 'M776 330 Q1004 557 768 795', 18);
  shade('Lived experience', 590, 246, 192, 86, 26);
  shade('Older adults and carers, illustration and caption', 556, 416, 284, 298, 25);
  shade('Specialist input', 838, 130, 195, 77, 26);
  shade('Clinicians and researchers, illustration and caption', 858, 224, 324, 218, 25);
  shade('Ethics dialogue, illustration and caption', 930, 468, 198, 217, 25);
  shade('Repair workers, illustration and caption', 850, 698, 252, 248, 25);
  line('Specialist input wave', 'M1054 202 Q1385 440 1096 871', 44);
  shade('Shared learning', 1182, 70, 187, 103, 28);
  shade('Teachers and students, illustration and caption', 1216, 168, 276, 227, 25);
  shade('Children, illustration and caption', 1277, 395, 245, 174, 25);
  shade('Public participants, illustration and caption', 1270, 574, 254, 205, 25);
  shade('iGEM and wider community, illustration and caption', 1180, 788, 344, 225, 25);
  line('Shared learning wave', 'M1393 136 Q1755 365 1521 854', 22);
  return strokes;
}

export async function initHandDraw(figure) {
  const link = figure?.querySelector(':scope > a');
  const original = link?.querySelector('img');
  if (!original || figure.dataset.handDraw) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches) return;
  await original.decode().catch(() => {});
  if (!original.complete || !original.naturalWidth || motion.matches) return;

  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = new URL('./hand-draw.css', import.meta.url).href;
  const ready = new Promise(resolve => {
    stylesheet.addEventListener('load', resolve, {once: true});
    stylesheet.addEventListener('error', () => resolve(false), {once: true});
  });
  document.head.append(stylesheet);
  if (await ready === false) return;

  const canvas = svgNode('svg', {viewBox: `0 0 ${W} ${H}`, 'aria-hidden': 'true', class: 'hp-hand-draw-canvas'});
  const defs = svgNode('defs');
  const mask = svgNode('mask', {id: 'hp-hand-draw-mask', maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: W, height: H, 'mask-type': 'luminance'});
  mask.append(svgNode('rect', {width: W, height: H, fill: 'black'}));
  const strokes = drawingPlan().map((item, index) => {
    const path = svgNode('path', {d: item.d, fill: 'none', stroke: 'white', 'stroke-width': item.width, 'stroke-linecap': 'round', 'stroke-linejoin': 'round'});
    const finished = item.region
      ? svgNode('rect', {...item.region, fill: 'white', opacity: 0})
      : svgNode('path', {d: item.d, fill: 'none', stroke: 'white', 'stroke-width': Math.max(36, item.width + 12), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0});
    finished.setAttribute('data-part', item.name);
    if (item.region) {
      const clip = svgNode('clipPath', {id: `hp-draw-region-${index}`});
      clip.append(svgNode('rect', item.region));
      defs.append(clip);
      path.setAttribute('clip-path', `url(#hp-draw-region-${index})`);
    }
    mask.append(path, finished);
    return {path, finished, name: item.name};
  });
  const completeMask = svgNode('rect', {width: W, height: H, fill: 'white', opacity: 0});
  mask.append(completeMask);
  defs.append(mask);
  canvas.append(defs, svgNode('rect', {width: W, height: H, fill: 'white'}));
  canvas.append(svgNode('image', {href: original.currentSrc || original.src, width: W, height: H, mask: 'url(#hp-hand-draw-mask)'}));
  const pencil = svgNode('g', {class: 'hp-hand-draw-pencil'});
  const shaft = svgNode('g', {transform: 'rotate(33)'});
  shaft.append(
    svgNode('path', {d: 'M0 0 L-8 -22 L8 -22 Z', fill: '#e8cfa4', stroke: '#2e267c', 'stroke-width': 1.4}),
    svgNode('path', {d: 'M0 0 L-2.5 -7 L2.5 -7 Z', fill: '#171536'}),
    svgNode('rect', {x: -8, y: -131, width: 16, height: 110, rx: 2, fill: '#f58f9c', stroke: '#2e267c', 'stroke-width': 1.4}),
    svgNode('path', {d: 'M-3 -130 V-23 M3 -130 V-23', fill: 'none', stroke: '#fff', 'stroke-width': 1.8, opacity: .8}),
    svgNode('rect', {x: -8, y: -143, width: 16, height: 13, rx: 3, fill: '#9d9cf4', stroke: '#2e267c', 'stroke-width': 1.4}),
    svgNode('rect', {x: -8, y: -134, width: 16, height: 5, fill: '#d9d7e5'})
  );
  pencil.append(shaft);
  canvas.append(pencil);
  link.classList.add('hp-hand-draw-frame');
  link.append(canvas);
  original.classList.add('hp-hand-draw-source');
  figure.dataset.handDraw = 'idle';

  let cursor = 0;
  for (const item of strokes) {
    item.length = item.path.getTotalLength();
    item.path.style.strokeDasharray = `${item.length} ${item.length}`;
    item.path.style.strokeDashoffset = item.length;
    item.weight = item.length + 260;
    cursor += item.weight;
  }
  let start = 0;
  const drawingTime = DURATION - 750;
  const movingTime = drawingTime - strokes.length * SETTLE;
  for (const item of strokes) {
    item.start = start;
    item.drawDuration = movingTime * item.weight / cursor;
    item.duration = item.drawDuration + SETTLE;
    start += item.duration;
  }
  const controls = document.createElement('div');
  controls.className = 'hp-hand-draw-controls';
  controls.setAttribute('role', 'group');
  controls.setAttribute('aria-label', 'Overview drawing playback');
  const button = label => {
    const element = document.createElement('button');
    element.type = 'button';
    element.textContent = label;
    controls.append(element);
    return element;
  };
  const pause = button('Pause');
  const skip = button('Show full figure');
  const replay = button('Replay drawing');
  figure.insertBefore(controls, figure.querySelector('figcaption'));

  let elapsed = 0;
  let last = 0;
  let frame = 0;
  let visible = false;
  let started = false;
  let userPaused = false;
  function render() {
    const done = elapsed >= DURATION;
    let active = strokes[0];
    for (const item of strokes) {
      const part = Math.max(0, Math.min(1, (elapsed - item.start) / item.drawDuration));
      item.path.style.strokeDashoffset = item.length * (1 - part);
      item.finished.setAttribute('opacity', part >= 1 ? 1 : 0);
      if (elapsed >= item.start) active = item;
    }
    const part = Math.max(0, Math.min(1, (elapsed - active.start) / active.drawDuration));
    const point = active.path.getPointAtLength(active.length * part);
    pencil.setAttribute('transform', `translate(${point.x} ${point.y})`);
    completeMask.setAttribute('opacity', Math.max(0, Math.min(1, (elapsed - drawingTime) / 750)));
    figure.dataset.handDraw = done ? 'complete' : userPaused ? 'paused' : started ? 'drawing' : 'idle';
    figure.dataset.drawProgress = (elapsed / DURATION).toFixed(3);
    figure.dataset.drawPart = active.name;
    pause.hidden = skip.hidden = done;
    replay.hidden = !done;
    pause.textContent = userPaused ? 'Resume' : 'Pause';
    pause.setAttribute('aria-label', userPaused ? 'Resume drawing' : 'Pause drawing');
  }
  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
  }
  function tick(now) {
    frame = 0;
    if (!visible || userPaused || document.hidden) { last = 0; return; }
    elapsed = Math.min(DURATION, elapsed + (last ? Math.min(80, now - last) : 0));
    last = now;
    render();
    if (elapsed < DURATION) frame = requestAnimationFrame(tick);
  }
  function run() {
    // Refresh visibility after a resize or an explicit replay/resume.
    const bounds = link.getBoundingClientRect();
    visible = bounds.bottom > 0 && bounds.top < innerHeight && bounds.right > 0 && bounds.left < innerWidth;
    if (!frame && visible && !userPaused && elapsed < DURATION && !document.hidden) {
      started = true;
      last = 0;
      frame = requestAnimationFrame(tick);
    }
  }
  pause.addEventListener('click', () => {
    userPaused = !userPaused;
    stop();
    render();
    if (!userPaused) run();
  });
  skip.addEventListener('click', () => {
    stop();
    elapsed = DURATION;
    render();
    replay.focus({preventScroll: true});
  });
  replay.addEventListener('click', () => {
    if (motion.matches) return;
    stop();
    elapsed = 0;
    userPaused = false;
    render();
    link.scrollIntoView({block: 'center', behavior: 'smooth'});
    pause.focus({preventScroll: true});
    run();
  });
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) run(); else stop();
  }, {threshold: .15});
  observer.observe(link);
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : run());
  motion.addEventListener('change', () => {
    if (motion.matches) {
      stop();
      elapsed = DURATION;
      render();
      controls.hidden = true;
    }
  });
  render();
}
