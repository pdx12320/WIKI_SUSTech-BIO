(() => {
  const root = document.querySelector('[data-cell-reader]');
  if (!root) return;
  const rail = root.querySelector('.cell-reader__rail');
  const body = root.querySelector('.cell-reader__swim-body');
  const value = root.querySelector('[data-cell-reader-value]');
  const tip = root.querySelector('.cell-reader__tip');
  const message = root.querySelector('[data-cell-reader-message]');
  const footer = document.querySelector('footer');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const seen = new Set();
  const startSelector = root.getAttribute('data-cell-reader-start');
  function readingStart() {
    const start = startSelector ? document.querySelector(startSelector) : null;
    return start ? Math.max(0, start.getBoundingClientRect().top + scrollY) : 0;
  }
  const reminders = [
    'One third of the way. Blink gently and look away from the screen for a moment.',
    'Two thirds of the way. Relax your eyes and shoulders before reading on.',
  ];
  let previous = null, queued = false, pendingScroll = false;
  let eyeTimer, tipTimer, idleTimer, stopRequested = false;
  const state = (name, on) => root.classList.toggle(`cell-reader__${name}`, on);
  function dismiss() {
    clearTimeout(eyeTimer);
    clearTimeout(tipTimer);
    state('resting', false);
    tip.hidden = true;
  }
  function remind(index) {
    dismiss();
    message.textContent = reminders[index];
    tip.hidden = false;
    state('resting', true);
    eyeTimer = setTimeout(() => state('resting', false), 400);
    tipTimer = setTimeout(dismiss, 6500);
  }
  function update() {
    queued = false;
    const scrolling = pendingScroll;
    pendingScroll = false;
    const start = readingStart();
    const extent = Math.max(0, document.documentElement.scrollHeight - innerHeight - start);
    const ratio = extent ? Math.max(0, Math.min(1, (scrollY - start) / extent)) : 0;
    // Opening photos are outside the reading range on pages with a custom start.
    root.hidden = !extent || scrollY < start;
    if (root.hidden) {
      dismiss(); clearTimeout(idleTimer); state('swimming', false);
    }
    if (extent && rail.clientHeight <= 0) root.hidden = true;
    root.style.setProperty('--cell-reader-y', `${ratio * rail.clientHeight}px`);
    root.style.setProperty('--cell-reader-progress', String(ratio));
    value.value = `${Math.round(ratio * 100)}%`;
    state('at-end', ratio >= .98);
    state('over-footer', !!footer && footer.getBoundingClientRect().top < innerHeight * .8);
    if (scrolling && !root.hidden && previous !== null && Math.abs(ratio - previous) > .00001) {
      if (!motion.matches) {
        stopRequested = false;
        state('swimming', true);
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => { stopRequested = true; }, 100);
      }
      let latest = -1;
      [1 / 3, 2 / 3].forEach((threshold, index) => {
        if (previous < threshold && ratio >= threshold && !seen.has(index)) {
          seen.add(index);
          latest = index;
        }
      });
      if (latest >= 0) remind(latest);
    }
    previous = ratio;
  }
  function schedule(scrolling = false) {
    pendingScroll ||= scrolling;
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  }
  body.addEventListener('animationiteration', event => {
    if (event.target === body && stopRequested) state('swimming', false);
  });
  motion.addEventListener('change', () => {
    if (motion.matches) { clearTimeout(idleTimer); state('swimming', false); }
  });
  root.querySelector('[data-cell-reader-dismiss]').addEventListener('click', dismiss);
  root.querySelector('[data-cell-reader-top]').addEventListener('click', () => {
    dismiss();
    scrollTo({top:readingStart(), behavior:motion.matches ? 'instant' : 'smooth'});
  });
  addEventListener('scroll', () => schedule(true), {passive:true});
  addEventListener('resize', () => schedule());
  addEventListener('load', () => schedule());
  addEventListener('pageshow', () => schedule());
  addEventListener('pagehide', () => {
    dismiss(); clearTimeout(idleTimer); state('swimming', false);
  });
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(() => schedule());
    observer.observe(document.body);
    observer.observe(rail);
  }
  document.fonts?.ready.then(() => schedule());
  schedule();
})();
