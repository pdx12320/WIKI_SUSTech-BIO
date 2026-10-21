import { initHandDraw } from './hand-draw.mjs';

// HP-only placement and navigation. Shared templates/navigation stay untouched.
const source = document.querySelector('[data-content-source="docs/human-practices/human-practices.md"]');
if (source) {
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = new URL('./overview-page.css', import.meta.url).href;
  const cssReady = new Promise(resolve => {
    css.addEventListener('load', resolve, {once: true});
    css.addEventListener('error', resolve, {once: true});
  });
  document.head.append(css);
  document.body.classList.add('hp-overview-page');
  const hero = source.querySelector('#hp-figure-1');
  const header = document.querySelector('#main-content > .content-overview');
  if (hero && header) {
    hero.classList.add('hp-overview-hero');
    header.after(hero);
    const drawingReady = initHandDraw(hero).catch(() => {
      hero.querySelector('.hp-hand-draw-source')?.classList.remove('hp-hand-draw-source');
      hero.querySelector('.hp-hand-draw-canvas')?.remove();
      hero.querySelector('.hp-hand-draw-controls')?.remove();
      delete hero.dataset.handDraw;
    });
    const overviewTarget = document.getElementById(location.hash.slice(1));
    if (overviewTarget && hero.contains(overviewTarget)) {
      Promise.all([cssReady, drawingReady]).then(() => {
        const restore = () => requestAnimationFrame(() => overviewTarget.scrollIntoView({block: "start"}));
        restore();
        // Fonts may settle later; do not pull a visitor back after they start reading.
        const input = new AbortController();
        let untouched = true;
        for (const type of ['wheel', 'touchstart', 'pointerdown', 'keydown']) {
          addEventListener(type, () => { untouched = false; input.abort(); }, {once: true, passive: true, signal: input.signal});
        }
        document.fonts.ready.then(() => {
          if (untouched) restore();
          input.abort();
        });
      });
    }
  }

  const nav = document.querySelector('nav[aria-label="Primary navigation"]');
  if (nav) {
    let nearTop = false;
    let overNav = false;
    let keyboard = false;
    let touchReveal = false;
    let lastY = scrollY;
    let touchScrollAt = -Infinity;
    const touch = matchMedia('(hover: none)').matches;
    const render = () => {
      const focused = keyboard && nav.contains(document.activeElement);
      const menuOpen = Boolean(nav.querySelector('[aria-expanded="true"], details[open]'));
      const visible = scrollY < 80 || nearTop || overNav || focused || menuOpen || (touch && touchReveal);
      nav.classList.toggle('hp-nav-is-hidden', !visible);
    };
    document.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch') return;
      nearTop = event.clientY <= 28;
      overNav = nav.contains(event.target);
      render();
    }, {passive: true});
    document.addEventListener('pointerdown', () => { keyboard = false; render(); }, {passive: true});
    document.addEventListener('keydown', event => {
      if (event.key === 'Tab') { keyboard = true; render(); }
    });
    nav.addEventListener('focusin', render);
    nav.addEventListener('focusout', () => queueMicrotask(render));
    document.addEventListener('pointerleave', () => { nearTop = false; overNav = false; render(); });
    addEventListener('touchmove', () => { touchScrollAt = performance.now(); }, {passive: true});
    document.addEventListener('click', event => {
      if (event.target.closest('[data-content-directory] a')) {
        touchReveal = false;
        render();
      }
    });
    new MutationObserver(render).observe(nav, {subtree: true, attributes: true, attributeFilter: ['aria-expanded', 'open']});
    addEventListener('scroll', () => {
      const delta = scrollY - lastY;
      // Image reflow and fragment restoration also scroll the page. Reveal the
      // mobile header only when a recent touch gesture establishes direction.
      if (Math.abs(delta) > 3 && performance.now() - touchScrollAt < 500) touchReveal = delta < 0;
      lastY = scrollY;
      render();
    }, {passive: true});
    render();
  }
}
