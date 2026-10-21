import { initHandDraw } from '../overview/hand-draw.mjs';
import { inclusivityDrawingPlan } from './plan.mjs';

const source = document.querySelector('[data-content-source="docs/human-practices/inclusivity.md"]');
const figure = source?.querySelector('#inclusivity-figure-1');
const header = document.querySelector('#main-content > .content-overview');
if (figure && header) {
  document.body.classList.add('inc-overview-page');
  header.after(figure);
  initHandDraw(figure, {
    width: 1280,
    height: 666,
    duration: 24000,
    id: 'inc-hand-draw',
    controlsLabel: 'Inclusivity overview drawing playback',
    stylesheet: new URL('./overview.css', import.meta.url).href,
    plan: inclusivityDrawingPlan,
  }).catch(() => {
    figure.querySelector('.hp-hand-draw-source')?.classList.remove('hp-hand-draw-source');
    figure.querySelector('.hp-hand-draw-canvas')?.remove();
    figure.querySelector('.hp-hand-draw-controls')?.remove();
    delete figure.dataset.handDraw;
  }).then(() => {
    if (location.hash !== '#inclusivity-figure-1') return;
    const restore = () => requestAnimationFrame(() => figure.scrollIntoView({block: 'start'}));
    restore();
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
