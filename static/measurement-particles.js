/* Wide capture, RGB result closure, title opening, then a sparse radial breath. */
(() => {
  'use strict';
  const hero = document.querySelector('.measurement-particles');
  if (!hero) return;
  const canvas = hero.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const heading = hero.querySelector('h1');
  const letters = [...heading.querySelectorAll('.measurement-particles__letter')];
  const caption = hero.querySelector('p');
  const replay = hero.querySelector('button');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const palette = ['183,124,143', '118,158,144', '123,141,183'];
  const duration = 10000;
  let width = 0, height = 0, centerY = 0, finalWidth = 0, finalHeight = 0, titleWidth = 0;
  let points = [], frame = 0, startTime = -Infinity, lastDraw = 0;
  let visible = true, started = false, seed = 26;
  const random = () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 4294967296; };
  const clamp = n => Math.max(0, Math.min(1, n));
  const ease = n => { const x = clamp(n); return x * x * (3 - 2 * x); };
  const mix = (a, b, t) => a + (b - a) * t;
  const rgba = (color, alpha) => `rgba(${color},${alpha})`;
  function resize() {
    const bounds = hero.getBoundingClientRect();
    width = bounds.width; height = bounds.height;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const titleBounds = heading.getBoundingClientRect();
    titleWidth = titleBounds.width;
    centerY = height * (width < 761 ? .43 : .44);
    finalWidth = Math.min(width - 54, Math.max(titleBounds.width + (width < 761 ? 45 : 100), width * .76));
    finalHeight = titleBounds.height + (width < 761 ? 18 : 24);
    const count = Math.min(700, Math.max(150, Math.round(width * height / 1500)));
    const cols = Math.ceil(Math.sqrt(count * width / height));
    const rows = Math.ceil(count / cols);
    seed = 26;
    points = Array.from({length: count}, (_, i) => ({
      x: ((i % cols + .12 + random() * .76) / cols) * width,
      y: ((Math.floor(i / cols) + .1 + random() * .8) / rows) * height,
      r: .9 + random() * 1.8,
      opacity: .3 + random() * .35,
      color: palette[i % 3],
      channel: i % 3,
      phase: random() * Math.PI * 2,
      speed: .3 + random() * .4,
      stay: random() < .19,
      edgeInset: 25 + random() * 48,
      overshoot: 80 + random() * 140,
      bend: (random() - .5) * 36,
      hit: -Infinity, fixed: null,
    }));
    draw(performance.now());
    schedule();
  }
  function reset() {
    startTime = reduced.matches ? -Infinity : performance.now();
    started = true;
    for (const point of points) { point.hit = -Infinity; point.fixed = null; }
    draw(performance.now());
    schedule();
  }
  function bracket(x, y, w, h, alpha, markerAlpha = 1) {
    const arm = Math.min(width < 761 ? 10 : 17, h * .25, w * .14);
    ctx.strokeStyle = `rgba(92,96,143,${alpha})`;
    ctx.lineWidth = 1.35; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x - w / 2 + arm, y - h / 2);
    ctx.lineTo(x - w / 2, y - h / 2); ctx.lineTo(x - w / 2, y + h / 2);
    ctx.lineTo(x - w / 2 + arm, y + h / 2);
    ctx.moveTo(x + w / 2 - arm, y - h / 2);
    ctx.lineTo(x + w / 2, y - h / 2); ctx.lineTo(x + w / 2, y + h / 2);
    ctx.lineTo(x + w / 2 - arm, y + h / 2); ctx.stroke();
    ctx.fillStyle = `rgba(196,132,156,${alpha * markerAlpha})`;
    for (const end of [-1, 1]) { ctx.beginPath(); ctx.arc(x + end * w / 2, y, 2, 0, Math.PI * 2); ctx.fill(); }
  }
  function draw(now) {
    if (!width || !height) return;
    ctx.clearRect(0, 0, width, height);
    const t = reduced.matches || !started ? duration : now - startTime;
    const capture = ease((t - 120) / 1200);
    const closure = ease((t - 3050) / 750);
    // Finish the vertical gesture before beginning the slower horizontal one.
    const rise = ease((t - 4140) / 820);
    const release = ease((t - 5000) / 2100);
    const compact = closure * (1 - release);
    const captionReveal = ease((t - 9100) / 750);
    const sampleWidth = Math.min(640, width * (width < 761 ? .70 : .52));
    const sampleHeight = Math.min(width < 761 ? 250 : 285, height * .44);
    const left = width / 2 - sampleWidth / 2, right = width / 2 + sampleWidth / 2;
    const scan = clamp((t - 1450) / 1550);
    const scanX = mix(left, right, scan);
    const ambientTime = reduced.matches ? 0 : now / 1000;
    const phase = t < 1450 ? 'sampling' : t < 3050 ? 'scanning' : t < 3800 ? 'closing' : t < 4140 ? 'holding' : t < 5000 ? 'rising' : t < 6050 ? 'opening' : t < 7900 ? 'lettering' : t < duration ? 'dispersing' : 'settled';
    if (hero.dataset.phase !== phase) hero.dataset.phase = phase;
    letters.forEach((letter, i) => {
      const reveal = ease((t - 6050 - i * 110) / 600);
      if (letter._reveal === reveal) return;
      letter.style.opacity = reveal;
      letter.style.transform = `translateY(${(1 - reveal) * 5}px)`;
      letter._reveal = reveal;
    });
    caption.style.opacity = captionReveal;
    for (const p of points) {
      const floatX = Math.sin(ambientTime * p.speed * .25 + p.phase) * 13;
      const floatY = Math.cos(ambientTime * p.speed * .22 + p.phase) * 10;
      const dx = p.x - width / 2, dy = p.y - centerY;
      const distance = Math.hypot(dx, dy);
      const ux = distance > .1 ? dx / distance : Math.cos(p.phase);
      const uy = distance > .1 ? dy / distance : Math.sin(p.phase);
      // A broad inward current makes capture visible across the whole field.
      const influence = .07 + .19 * Math.max(0, 1 - distance / (width * .65));
      let x = p.x - dx * influence * capture + floatX;
      let y = p.y - dy * influence * capture + floatY;
      const inside = x > left + 7 && x < right - 7 && Math.abs(y - centerY) < sampleHeight / 2 - 10;
      if (t > 1320 && t < 3050 && inside && !p.fixed) p.fixed = {x, y};
      if (p.fixed) { x = p.fixed.x; y = p.fixed.y; }
      const selected = !!p.fixed;
      // Sampled points end at the RGB result; they never re-form behind the title.
      if (selected && closure === 1) continue;
      if (selected && t >= 1450 && t < 3050 && x <= scanX && !Number.isFinite(p.hit)) p.hit = now;
      // Sampled points gather by color into three quiet, legible result dots.
      if (selected) {
        x = mix(x, width / 2 + (p.channel - 1) * 18, closure);
        y = mix(y, centerY, closure);
      }
      // The title initiates a center-outward breath. Most targets lie beyond
      // the canvas, so particles leave by motion rather than fading in place.
      const radialDelay = Math.min(250, distance / Math.hypot(width, height) * 460);
      const breath = ease((t - 7900 - radialDelay) / 1600);
      const toVertical = (width / 2) / Math.max(Math.abs(ux), .0001);
      const toHorizontal = (uy < 0 ? centerY : height - centerY) / Math.max(Math.abs(uy), .0001);
      const boundary = Math.min(toVertical, toHorizontal);
      const destination = p.stay ? Math.max(0, boundary - p.edgeInset) : boundary + p.overshoot;
      const endX = width / 2 + ux * destination + (p.stay ? floatX * .5 : 0);
      const endY = centerY + uy * destination + (p.stay ? floatY * .5 : 0);
      const curl = Math.sin(breath * Math.PI) * p.bend;
      x = mix(x, endX, breath) - uy * curl;
      y = mix(y, endY, breath) + ux * curl;
      if (x < -8 || x > width + 8 || y < -8 || y > height + 8) continue;
      let alpha = p.opacity * (1 - capture * (1 - release) * (selected ? -.25 : .42));
      const hitAge = now - p.hit;
      const marked = Number.isFinite(p.hit) ? 1 - release : 0;
      alpha = Math.min(.92, alpha + marked * .22);
      alpha *= selected ? 1 - ease((closure - .68) / .32) : 1 - compact * .45;
      alpha *= mix(1, p.stay ? .8 : 1, breath);
      const radius = p.r + marked * .35;
      ctx.fillStyle = rgba(p.color, alpha);
      ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
      if (hitAge >= 0 && hitAge < 650 && release < 1) {
        const pulse = hitAge / 650;
        ctx.strokeStyle = rgba(p.color, (1 - pulse) * .68);
        ctx.lineWidth = .8;
        ctx.beginPath(); ctx.arc(x, y, p.r + 3 + pulse * 5, 0, Math.PI * 2); ctx.stroke();
      }
    }
    if (t >= 1450 && t < 3000) {
      const scanAlpha = Math.sin(Math.PI * scan) * .48;
      const top = centerY - sampleHeight / 2, bottom = centerY + sampleHeight / 2;
      const wash = ctx.createLinearGradient(scanX - 15, 0, scanX + 5, 0);
      wash.addColorStop(0, 'rgba(151,160,186,0)');
      wash.addColorStop(.8, `rgba(151,160,186,${scanAlpha * .12})`);
      wash.addColorStop(1, 'rgba(151,160,186,0)');
      ctx.fillStyle = wash; ctx.fillRect(scanX - 15, top, 20, sampleHeight);
      const line = ctx.createLinearGradient(0, top, 0, bottom);
      line.addColorStop(0, 'rgba(126,137,174,0)');
      line.addColorStop(.18, `rgba(126,137,174,${scanAlpha})`);
      line.addColorStop(.82, `rgba(126,137,174,${scanAlpha})`);
      line.addColorStop(1, 'rgba(126,137,174,0)');
      ctx.strokeStyle = line; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(scanX, top); ctx.lineTo(scanX, bottom); ctx.stroke();
    }
    const dotAlpha = ease((closure - .65) / .35) * (1 - ease((t - 5050) / 950));
    if (dotAlpha > 0) {
      const pulse = t >= 3800 && t <= 4140 ? Math.sin((t - 3800) / 340 * Math.PI) : 0;
      palette.forEach((color, i) => {
        ctx.fillStyle = rgba(color, dotAlpha * (.82 + pulse * .16));
        ctx.beginPath();
        ctx.arc(width / 2 + (i - 1) * (18 + release * 28), centerY, 3.3 + pulse * .4, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    const bw = mix(mix(mix(width + 48, sampleWidth, capture), 90, closure), finalWidth, release);
    const captureHeight = mix(Math.min(height * .86, centerY * 1.8), sampleHeight, capture);
    const bh = mix(mix(captureHeight, 32, closure), finalHeight, rise);
    // Keep the first letters inside the opening brackets without moving the word.
    heading.style.clipPath = `inset(-10px ${Math.max(0, (titleWidth - bw + 24) / 2)}px -10px)`;
    bracket(width / 2, centerY, bw, bh, ease(t / 500) * .76, 1 - compact);
  }
  function tick(now) {
    frame = 0;
    if (!visible || document.hidden || reduced.matches) return;
    // Use every display frame during the entrance; throttle only ambient drift.
    if (now - startTime < duration || now - lastDraw > 30) { draw(now); lastDraw = now; }
    schedule();
  }
  function schedule() { if (!frame && visible && !document.hidden && !reduced.matches) frame = requestAnimationFrame(tick); }
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    document.body.classList.toggle('measurement-particles-in-view', visible);
    if (!visible) { cancelAnimationFrame(frame); frame = 0; }
    else { draw(performance.now()); schedule(); }
  }, {threshold: 0});
  observer.observe(hero);
  new ResizeObserver(resize).observe(hero);
  document.fonts.ready.then(resize);
  replay.addEventListener('click', reset);
  reduced.addEventListener('change', () => { cancelAnimationFrame(frame); frame = 0; reset(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
    else { draw(performance.now()); schedule(); }
  });
  const start = () => {
    const covered = () => document.documentElement.hasAttribute('data-entry-loading') || document.documentElement.hasAttribute('data-wh-cover');
    if (!covered()) { reset(); return; }
    const arrival = new MutationObserver(() => { if (!covered()) { arrival.disconnect(); reset(); } });
    arrival.observe(document.documentElement, {attributes:true, attributeFilter:['data-entry-loading','data-wh-cover']});
  };
  resize();
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, {once:true});
})();
