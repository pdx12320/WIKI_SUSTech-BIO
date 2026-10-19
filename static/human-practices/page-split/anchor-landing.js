// Keep a migrated deep link in place while existing PDFs and images expand.
(() => {
  if (!location.hash) return;
  let target;
  try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); }
  catch { return; }
  const article = document.querySelector('.hp-manuscript');
  if (!target || !article?.contains(target)) return;
  let pending = 0;
  let active = true;
  const options = {capture: true, passive: true};
  const events = ['wheel', 'touchstart', 'pointerdown', 'keydown'];
  function stop() {
    active = false;
    cancelAnimationFrame(pending);
    observer.disconnect();
    article.removeEventListener('load', schedule, true);
    events.forEach(name => removeEventListener(name, stop, options));
  }
  function align() {
    pending = 0;
    if (!active) return;
    const nav = document.querySelector('[aria-label="Primary navigation"]');
    const offset = Math.max(0, nav?.getBoundingClientRect().bottom ?? 0) + 24;
    const delta = target.getBoundingClientRect().top - offset;
    if (Math.abs(delta) > 2) scrollTo({top: scrollY + delta, behavior: 'instant'});
  }
  function schedule() { if (active && !pending) pending = requestAnimationFrame(align); }
  const observer = new ResizeObserver(schedule);
  observer.observe(article);
  article.addEventListener('load', schedule, true);
  events.forEach(name => addEventListener(name, stop, options));
  setTimeout(stop, 8000);
  schedule();
})();
