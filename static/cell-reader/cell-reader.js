(() => {
  const root = document.querySelector('[data-cell-reader]');
  if (!root) return;
  const rail = root.querySelector('.cell-reader__rail');
  const body = root.querySelector('.cell-reader__swim-body');
  const value = root.querySelector('[data-cell-reader-value]');
  const handle = root.querySelector('[data-cell-reader-drag]');
  const footer = document.querySelector('footer');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const startSelector = root.getAttribute('data-cell-reader-start');
  function readingStart() {
    const start = startSelector ? document.querySelector(startSelector) : null;
    return start ? Math.max(0, start.getBoundingClientRect().top + scrollY) : 0;
  }
  let previous = null, queued = false, pendingScroll = false;
  let idleTimer, stopRequested = false, drag = null;
  const state = (name, on) => root.classList.toggle(`cell-reader__${name}`, on);
  function metrics() {
    const start = readingStart();
    const extent = Math.max(0, document.documentElement.scrollHeight - innerHeight - start);
    const travel = rail.clientHeight;
    const top = rail.getBoundingClientRect().top;
    const ratio = extent ? Math.max(0, Math.min(1, (scrollY - start) / extent)) : 0;
    return {start, extent, travel, top, ratio};
  }
  function rebaseDrag({top, travel, ratio}) {
    if (drag && (top !== drag.top || travel !== drag.travel)) {
      drag.offset = drag.lastY - top - ratio * travel;
      drag.top = top; drag.travel = travel;
    }
  }
  function endDrag(event) {
    if (!drag || (event?.pointerId !== undefined && event.pointerId !== drag.id)) return;
    const id = drag.id;
    drag = null; state('dragging', false);
    if (handle.hasPointerCapture(id)) handle.releasePointerCapture(id);
  }
  function update() {
    queued = false;
    const scrolling = pendingScroll;
    pendingScroll = false;
    // Unhide before measuring the rail when leaving an authored page opening.
    const readingOrigin = readingStart();
    root.hidden = scrollY < readingOrigin || document.documentElement.scrollHeight <= innerHeight + readingOrigin;
    const measured = metrics();
    const {start, extent, ratio, travel} = measured;
    if (!extent || !travel) endDrag();
    rebaseDrag(measured);
    // Opening photos are outside the reading range on pages with a custom start.
    root.hidden = !extent || scrollY < start;
    if (root.hidden) {
      endDrag(); clearTimeout(idleTimer); state('swimming', false);
    }
    if (extent && travel <= 0) root.hidden = true;
    handle.tabIndex = root.hidden ? -1 : 0;
    handle.setAttribute('aria-disabled', String(root.hidden));
    handle.setAttribute('aria-valuenow', String(Math.round(ratio * 100)));
    handle.setAttribute('aria-valuetext', `${Math.round(ratio * 100)}% of page`);
    root.style.setProperty('--cell-reader-y', `${ratio * rail.clientHeight}px`);
    root.style.setProperty('--cell-reader-progress', String(ratio));
    value.value = `${Math.round(ratio * 100)}%`;
    state('at-end', ratio >= .98);
    state('over-footer', !!footer && footer.getBoundingClientRect().top < innerHeight * .8);
    if (scrolling && !root.hidden && previous !== null && Math.abs(ratio - previous) > .00001) {
      if (!motion.matches && !drag) {
        stopRequested = false;
        state('swimming', true);
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => { stopRequested = true; }, 100);
      }
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
  handle.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0 || drag) return;
    const {extent, travel, top, ratio} = metrics();
    if (!extent || !travel) return;
    event.preventDefault();
    handle.focus({preventScroll:true});
    drag = {id:event.pointerId, offset:event.clientY - top - ratio * travel,
      lastY:event.clientY, top, travel};
    clearTimeout(idleTimer); state('swimming', false); state('dragging', true);
    handle.setPointerCapture(event.pointerId);
  });
  handle.addEventListener('pointermove', event => {
    if (!drag || drag.id !== event.pointerId) return;
    const measured = metrics();
    if (!measured.extent || !measured.travel) return endDrag();
    rebaseDrag(measured);
    drag.lastY = event.clientY;
    const ratio = Math.max(0, Math.min(1, (event.clientY - measured.top - drag.offset) / measured.travel));
    scrollTo({top:measured.start + ratio * measured.extent, behavior:'instant'});
    update();
  });
  for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) handle.addEventListener(name, endDrag);
  addEventListener('blur', () => endDrag());
  handle.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const {start, extent, travel} = metrics();
    if (!extent || !travel) return;
    const destination = {ArrowUp:scrollY-40, ArrowDown:scrollY+40,
      PageUp:scrollY-innerHeight*.9, PageDown:scrollY+innerHeight*.9,
      Home:start, End:start+extent}[event.key];
    if (destination === undefined) return;
    event.preventDefault();
    scrollTo({top:Math.max(start, Math.min(start + extent, destination)), behavior:'instant'});
    schedule();
  });
  addEventListener('scroll', () => schedule(true), {passive:true});
  addEventListener('resize', () => schedule());
  addEventListener('load', () => schedule());
  addEventListener('pageshow', () => schedule());
  addEventListener('pagehide', () => {
    endDrag(); clearTimeout(idleTimer); state('swimming', false);
  });
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(() => schedule());
    observer.observe(document.body);
    observer.observe(rail);
  }
  document.fonts?.ready.then(() => schedule());
  schedule();
})();
