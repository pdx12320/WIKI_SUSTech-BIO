/* ORCA footer: community scrolling and accessible image previews. */
(() => {
  const footer = document.querySelector('.orca-footer');
  if (!footer) return;
  const strip = footer.querySelector('.ofd-community-window');
  const dialog = footer.querySelector('.ofd-dialog');
  const image = dialog.querySelector('img');
  const title = dialog.querySelector('h2');
  const close = dialog.querySelector('button');
  const group = strip.querySelector('[data-ofd-community-group]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const copy = group.cloneNode(true);
  copy.removeAttribute('data-ofd-community-group');
  copy.setAttribute('aria-hidden', 'true');
  copy.querySelectorAll('button').forEach(button => { button.tabIndex = -1; });
  copy.querySelectorAll('img').forEach(img => { img.loading = 'eager'; });
  group.after(copy);
  let trigger;
  let scrollState;
  let visible = false;
  let hovering = false;
  let focused = false;
  let frame = 0;
  let previousTime = 0;
  let loopWidth = 0;
  let position = 0;
  const canAnimate = () => visible && !document.hidden && !reduced.matches &&
    !hovering && !focused && !dialog.open && loopWidth > strip.clientWidth;
  const tick = now => {
    frame = 0;
    if (!canAnimate()) { previousTime = 0; return; }
    if (previousTime) {
      position = (position + Math.min(now - previousTime, 64) * .032) % loopWidth;
      strip.scrollLeft = position;
    }
    previousTime = now;
    frame = requestAnimationFrame(tick);
  };
  const sync = () => {
    copy.hidden = reduced.matches;
    if (canAnimate()) {
      if (!frame) { position = strip.scrollLeft % loopWidth; previousTime = 0; frame = requestAnimationFrame(tick); }
    } else if (frame) {
      cancelAnimationFrame(frame); frame = 0; previousTime = 0;
    }
  };
  const measure = () => { loopWidth = group.getBoundingClientRect().width; sync(); };
  new IntersectionObserver(entries => {
    document.body.classList.toggle('ofd-reading-footer', entries.some(entry => entry.isIntersecting));
  }).observe(footer);
  new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting); sync();
  }).observe(strip);
  if (location.hash === '#orca-footer') {
    window.addEventListener('load', () => footer.scrollIntoView({ block: 'end', behavior: 'instant' }), { once: true });
  }
  strip.addEventListener('mouseenter', () => { hovering = true; sync(); });
  strip.addEventListener('mouseleave', () => { hovering = false; sync(); });
  strip.addEventListener('focusin', () => { focused = true; sync(); });
  strip.addEventListener('focusout', event => { focused = strip.contains(event.relatedTarget); sync(); });
  strip.addEventListener('touchstart', () => { hovering = true; sync(); }, { passive: true });
  strip.addEventListener('touchend', () => { hovering = false; sync(); }, { passive: true });
  strip.addEventListener('touchcancel', () => { hovering = false; sync(); }, { passive: true });
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', measure);
  const observer = new ResizeObserver(measure);
  observer.observe(strip); observer.observe(group);
  group.querySelectorAll('img').forEach(img => img.addEventListener('load', measure));
  footer.addEventListener('click', event => {
    const button = event.target.closest('[data-ofd-qr], [data-footer-image]');
    if (!button || !footer.contains(button)) return;
    trigger = button;
    const source = button.querySelector('img');
    const platform = button.dataset.ofdPlatform;
    image.src = button.dataset.ofdQr || source.currentSrc || source.src;
    image.alt = platform ? `${platform} QR code` : source.alt;
    title.textContent = platform || source.alt;
    dialog.classList.toggle('ofd-dialog--dark', Boolean(button.querySelector('.community-logo-surface--dark')));
    scrollState = { x: scrollX, y: scrollY, style: document.body.getAttribute('style') };
    Object.assign(document.body.style, { position: 'fixed', top: `-${scrollState.y}px`, left: `-${scrollState.x}px`, width: '100%', overflow: 'hidden' });
    dialog.showModal();
    close.focus();
    sync();
  });
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (scrollState) {
      if (scrollState.style === null) document.body.removeAttribute('style');
      else document.body.setAttribute('style', scrollState.style);
      window.scrollTo({ left: scrollState.x, top: scrollState.y, behavior: 'instant' });
      scrollState = null;
    }
    trigger?.focus({ preventScroll: true });
    sync();
  });
  measure();
})();
