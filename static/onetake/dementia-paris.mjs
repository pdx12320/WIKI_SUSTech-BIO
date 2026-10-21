// A single scroll clock, with long reading holds and reversible reveals.
// The existing particle take already eases scroll: do not ease it a second time.
import { BURDEN_IN, BURDEN_OUT } from './burden-pacing.mjs';
const clamp = v => Math.max(0, Math.min(1, v));
const smooth = v => { const t = clamp(v); return t * t * (3 - 2 * t); };
export function parisState(take) {
  const progress = clamp((take - BURDEN_IN) / (BURDEN_OUT - BURDEN_IN));
  return {
    progress,
    step: progress < .17 ? 0 : progress < .48 ? 1 : 2,
    cities: 1 + 26 * smooth((take - .760) / .011),
    scene: 1 - smooth((take - .782) / .016),
    question: smooth((take - .795) / .008),
  };
}
function mount(el) {
  const root = el.closest('[data-ot]');
  if (!root) return;
  const steps = [...el.querySelectorAll('[data-paris-step]')];
  const clusters = [...el.querySelectorAll('[data-paris-cluster]')];
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  function render(take) {
    const state = parisState(take);
    const staticMode = root.classList.contains('ot--static') || media.matches;
    el.classList.toggle('is-static', staticMode);
    steps.forEach((step, i) => {
      const visible = staticMode || i === state.step;
      step.classList.toggle('is-on', visible);
      step.setAttribute('aria-hidden', String(!visible));
    });
    if (staticMode || !root.classList.contains('has-paris-particles')) clusters.forEach((cluster, i) => {
      const reveal = staticMode ? 1 : clamp(state.cities - i);
      cluster.style.opacity = String(.09 + reveal * .91);
    });
    root.style.setProperty('--burden-scene-opacity', state.scene.toFixed(3));
    root.style.setProperty('--burden-question-opacity', state.question.toFixed(3));
  }
  let current = BURDEN_IN;
  root.addEventListener('ot:frame', event => {
    const take = Number(event.detail?.populationTake ?? event.detail?.take);
    if (!Number.isFinite(take)) return;
    current = take;
    render(current);
  });
  new MutationObserver(() => render(current)).observe(root, { attributes: true, attributeFilter: ['class'] });
  media.addEventListener('change', () => render(current));
  render(current);
  el.closest('[data-ot-chapter]')?.classList.add('is-ready');
}
if (typeof document !== 'undefined') document.querySelectorAll('[data-burden-paris]').forEach(mount);
