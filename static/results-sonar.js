/* Anchor the three circular connectors to the actual, wrapped card bounds. */
(() => {
  const ring = document.querySelector('.sonar-ring');
  if (!ring || ring.dataset.connectorsReady) return;
  ring.dataset.connectorsReady = 'true';
  const svg = ring.querySelector('.sonar-ring-arrows');
  const paths = [...svg.querySelectorAll('.sonar-ring-path')];
  const engineering = ring.querySelector('.sonar-ring-engineering');
  const measurement = ring.querySelector('.sonar-ring-measurement');
  const contribution = ring.querySelector('.sonar-ring-contribution');
  let frame;
  function draw() {
    if (getComputedStyle(svg).display === 'none') return;
    const origin = ring.getBoundingClientRect();
    const box = element => {
      const r = element.getBoundingClientRect();
      return {left:r.left-origin.left, right:r.right-origin.left,
        top:r.top-origin.top, bottom:r.bottom-origin.top,
        center:(r.left+r.right)/2-origin.left};
    };
    const e = box(engineering), m = box(measurement), c = box(contribution);
    const edge = origin.width - 12;
    const sideY = e.bottom - 46;
    const rightY = m.top - 18, leftY = c.top - 18;
    const lowerY = Math.max(m.bottom, c.bottom) + 12;
    const curveY = lowerY + 160;
    svg.setAttribute('viewBox', `0 0 ${origin.width} ${origin.height}`);
    svg.setAttribute('preserveAspectRatio', 'none');
    paths[0].setAttribute('d', `M${e.right+12} ${sideY} C${edge} ${sideY+20} ${edge} ${rightY-65} ${m.right-52} ${rightY}`);
    paths[1].setAttribute('d', `M${m.center} ${lowerY} C${m.center-40} ${curveY} ${c.center+40} ${curveY} ${c.center} ${lowerY}`);
    paths[2].setAttribute('d', `M${c.left+52} ${leftY} C12 ${leftY-65} 12 ${sideY+20} ${e.left-12} ${sideY}`);
  }
  function schedule() { cancelAnimationFrame(frame); frame = requestAnimationFrame(draw); }
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(schedule);
    [ring, engineering, measurement, contribution].forEach(element => observer.observe(element));
  }
  window.addEventListener('resize', schedule, {passive:true});
  document.fonts?.ready.then(schedule);
  schedule();
})();
