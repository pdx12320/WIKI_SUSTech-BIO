/* Directory jumps and scrollspy use the same visible heading and menu space. */
(() => {
  let revision = 0;
  function heading(target) {
    if (!target || target.matches?.('h1,h2,h3,h4,h5,h6')) return target;
    return target.querySelector?.('h1,h2,h3,h4,h5,h6') || target;
  }
  function top(target) {
    const node = heading(target);
    if (!node) return 0;
    const style = getComputedStyle(node);
    return node.getBoundingClientRect().top + (parseFloat(style.paddingTop) || 0)
      + (parseFloat(style.borderTopWidth) || 0);
  }
  function offset() {
    const nav = document.querySelector('.site-nav');
    const header = nav ? (nav.classList.contains('is-scroll-hidden') ? 0 : nav.offsetHeight)
      : (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 112);
    let directory = 0;
    if (globalThis.innerWidth <= 760) {
      const row = document.querySelector('.content-mobile-directory > summary, .mobile-toc > summary, .model-sidebar');
      if (row?.getClientRects().length) directory = row.getBoundingClientRect().height;
    }
    return header + directory + 24;
  }
  function destination(target) {
    if (!target) return 0;
    const maximum = Math.max(0, document.documentElement.scrollHeight - innerHeight);
    return Math.max(0, Math.min(maximum, scrollY + top(target) - offset()));
  }
  function prepare(target) {
    const nav = document.querySelector('.site-nav');
    if (!nav || !target) return;
    revision++;
    nav.setAttribute('data-reading-jump', '');
    // A chapter jump lands in reading mode in either direction. Manual upward
    // scrolling or keyboard focus still reveals the global menu as usual.
    nav.classList.add('is-scroll-hidden');
  }
  function release() {
    revision++;
    document.querySelector('.site-nav')?.removeAttribute('data-reading-jump');
  }
  function settle(target) {
    const current = revision;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (current !== revision) return;
      scrollTo({top: destination(target), behavior: 'instant'});
      // Keep reading mode through late load/history events. The reading
      // controllers release it on the next pointer, touch, wheel or key input.
    }));
  }
  globalThis.ORCAReadingAnchors = {heading, top, offset, destination, prepare, release, settle};
})();
