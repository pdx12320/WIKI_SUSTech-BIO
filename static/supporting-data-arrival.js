/* Preserve this cross-page evidence destination while Contribution settles. */
(() => {
  const target = document.getElementById('supporting-data');
  if (!target) return;
  const article = target.closest('.markdown-content');
  let active = false;
  let frame;
  const observer = new ResizeObserver(schedule);

  function align() {
    frame = null;
    if (!active || location.hash !== '#supporting-data') return;
    // Ignore smooth scrolling for the initial landing, including late font and
    // module reflows. Use the same visible-menu offset as directory clicks.
    globalThis.ORCAReadingAnchors.prepare(target);
    scrollTo({top: globalThis.ORCAReadingAnchors.destination(target), behavior: 'instant'});
    globalThis.ORCAReadingAnchors.settle(target);
  }
  function schedule() {
    if (active && !frame) frame = requestAnimationFrame(align);
  }
  function stop() {
    active = false;
    observer.disconnect();
    if (frame) cancelAnimationFrame(frame);
    frame = null;
  }
  function arrive() {
    stop();
    if (location.hash !== '#supporting-data') return;
    active = true;
    observer.observe(article || target);
    schedule();
    document.fonts?.ready.then(schedule);
  }
  // The reader takes over as soon as they interact; never pull them back.
  for (const event of ['wheel', 'touchstart', 'pointerdown', 'keydown']) {
    addEventListener(event, stop, { passive: true });
  }
  addEventListener('hashchange', arrive);
  addEventListener('load', schedule, { once: true });
  arrive();
})();
