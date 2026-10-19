/* Keep tilted puzzle corners visible around the central package stage. */
(() => {
  'use strict';
  const opening = document.querySelector('[data-team-opening]');
  const puzzle = opening?.querySelector('.team-opening__puzzle');
  const title = opening?.querySelector('.team-opening__title');
  if (!puzzle || !title || opening.dataset.layoutReady === 'true') return;
  const pieces = [...puzzle.querySelectorAll('.team-opening__piece')];
  if (pieces.length !== 4) return;
  opening.dataset.layoutReady = 'true';
  const listeners = new AbortController();
  let frame = 0;
  let resizeObserver;
  let completionObserver;
  const dispose = () => {
    cancelAnimationFrame(frame);
    resizeObserver?.disconnect();
    completionObserver?.disconnect();
    listeners.abort();
  };
  const update = () => {
    frame = 0;
    if (!opening.isConnected) { dispose(); return; }
    const viewport = opening.getBoundingClientRect();
    const svg = puzzle.getBoundingClientRect();
    const box = puzzle.viewBox.baseVal;
    if (!svg.width || !svg.height || !box.width || !box.height) return;
    const unitsPerPixel = box.height / svg.height;
    const scaleRatio = (svg.width / box.width) * unitsPerPixel;
    opening.style.setProperty('--opening-svg-ratio', scaleRatio);
    opening.style.setProperty('--opening-svg-inverse-ratio', 1 / scaleRatio);
    const visibleX = box.width * .28;
    const visibleY = box.height * .25;
    for (const piece of pieces) {
      const upper = piece.classList.contains('team-opening__piece--nw') || piece.classList.contains('team-opening__piece--ne');
      const left = piece.classList.contains('team-opening__piece--nw') || piece.classList.contains('team-opening__piece--sw');
      const direction = upper ? (left ? 'nw' : 'ne') : (left ? 'sw' : 'se');
      const bounds = piece.getBBox();
      const originX = box.x + box.width * (left ? .25 : .75);
      const originY = box.y + box.height * (upper ? .25 : .75);
      const angle = (parseFloat(getComputedStyle(piece).getPropertyValue('--opening-turn')) || 0) * Math.PI / 180;
      const c = Math.cos(angle), sin = Math.sin(angle);
      // HTML photos rotate in physical pixels; map that same motion into SVG units.
      const corners = [bounds.x, bounds.x + bounds.width].flatMap(x =>
        [bounds.y, bounds.y + bounds.height].map(y => ({
          x: originX + .92 * ((x - originX) * c - (y - originY) / scaleRatio * sin),
          y: originY + .92 * ((x - originX) * scaleRatio * sin + (y - originY) * c),
        })));
      const xs = corners.map(point => point.x), ys = corners.map(point => point.y);
      const exitX = left ? box.x + visibleX - Math.max(...xs) : box.x + box.width - visibleX - Math.min(...xs);
      const exitY = upper ? box.y + visibleY - Math.max(...ys) : box.y + box.height - visibleY - Math.min(...ys);
      // Put each title inside the visible photo area after the piece rotates.
      // Invert that same transform so the lettering stays attached to its piece.
      const targetX = box.x + box.width * (left ? .10 : .90);
      const targetY = box.y + box.height * (upper ? .07 : .93);
      const localX = (targetX - originX - exitX) / .92;
      const localY = (targetY - originY - exitY) / .92;
      const labelX = originX + localX * c + localY / scaleRatio * sin;
      const labelY = originY - localX * scaleRatio * sin + localY * c;
      opening.style.setProperty(`--opening-label-${direction}-x`, `${((labelX - box.x) / box.width * 100).toFixed(5)}%`);
      opening.style.setProperty(`--opening-label-${direction}-y`, `${((labelY - box.y) / box.height * 100).toFixed(5)}%`);
      opening.style.setProperty(`--opening-exit-${direction}-x`, `${(exitX / box.width * 100).toFixed(5)}%`);
      opening.style.setProperty(`--opening-exit-${direction}-y`, `${(exitY / box.height * 100).toFixed(5)}%`);
    }
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  update();
  const options = { passive: true, signal: listeners.signal };
  window.addEventListener('resize', schedule, options);
  window.visualViewport?.addEventListener('resize', schedule, options);
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(opening);
    resizeObserver.observe(title);
  }
  if (typeof MutationObserver !== 'undefined') {
    completionObserver = new MutationObserver(() => { if (!opening.isConnected) dispose(); });
    completionObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }
})();
