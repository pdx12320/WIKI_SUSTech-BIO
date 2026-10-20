(() => {
  'use strict';
  const workspace = document.querySelector('[data-engineering-workspace]');
  const opening = workspace?.querySelector('[data-engineering-opening]');
  const control = workspace?.querySelector('[data-engineering-opening-control]');
  const map = workspace?.querySelector('[data-engineering-map]');
  if (!opening || !control || !map) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const wheel = opening.querySelector('[data-opening-dbtl]');
  const stages = [...wheel.querySelectorAll('.dbtl-wheel__stage')];
  let exitTimer, cycleTimer, generation = 0, angle = 0;
  function releaseCover() {
    clearTimeout(window.ORCAEngineeringArrival);
    document.documentElement.removeAttribute('data-engineering-arrival');
  }
  function pauseWheel() {
    clearInterval(cycleTimer);
    wheel.setAttribute('data-paused', '');
  }
  function startWheel() {
    pauseWheel();
    if (motion.matches || document.hidden || workspace.dataset.opening !== 'playing') return;
    wheel.removeAttribute('data-paused');
    cycleTimer = setInterval(() => {
      angle += 90;
      wheel.style.setProperty('--dbtl-angle', `${angle}deg`);
      stages.forEach((stage, i) => {
        if (i === angle / 90 % 4) stage.setAttribute('aria-current', 'location');
        else stage.removeAttribute('aria-current');
      });
    }, 1800);
  }
  function finish({preserveCover = false} = {}) {
    generation++;
    clearTimeout(exitTimer);
    pauseWheel();
    workspace.removeAttribute('data-opening');
    map.inert = false;
    control.hidden = false;
    if (!preserveCover) releaseCover();
  }
  function enter() {
    if (workspace.dataset.opening !== 'playing') return;
    pauseWheel();
    workspace.dataset.opening = 'leaving';
    // Preserve keyboard focus when the cover's button disappears.
    const focusMap = opening.contains(document.activeElement);
    const complete = () => {
      finish();
      if (focusMap) document.getElementById('engineering-project-overview').focus({preventScroll:true});
    };
    if (motion.matches) complete();
    else exitTimer = setTimeout(complete, 760);
  }
  async function play() {
    finish({preserveCover:true});
    if (workspace.dataset.engineeringView !== 'map') { releaseCover(); return; }
    const token = generation;
    await Promise.race([
      Promise.all([document.fonts.load('600 100px "ORCA Engineering"'), document.fonts.load('italic 400 25px "ORCA Odyssey"')]),
      new Promise(resolve => setTimeout(resolve, 250)),
    ]);
    if (generation !== token || workspace.dataset.engineeringView !== 'map') return;
    map.inert = true;
    workspace.dataset.opening = 'playing';
    control.hidden = true;
    releaseCover();
    startWheel();
  }
  control.hidden = true;
  control.setAttribute('aria-label', 'Replay opening animation');
  control.addEventListener('click', () => void play());
  opening.addEventListener('click', enter);
  // Scrolling/swiping does not leave the cover or reach the hidden map.
  for (const name of ['wheel', 'touchmove']) {
    workspace.addEventListener(name, event => {
      if (!workspace.hasAttribute('data-opening')) return;
      event.preventDefault();
      event.stopPropagation();
    }, {capture:true, passive:false});
  }
  workspace.addEventListener('keydown', event => {
    if (!workspace.hasAttribute('data-opening')) return;
    if (['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key) && event.target.tagName !== 'BUTTON') event.preventDefault();
  }, {capture:true});
  addEventListener('hashchange', finish);
  addEventListener('pagehide', finish);
  addEventListener('pageshow', event => { if (event.persisted) finish(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseWheel();
    else startWheel();
  });
  motion.addEventListener('change', startWheel);
  new MutationObserver(() => {
    if (workspace.dataset.engineeringView !== 'map') finish();
  }).observe(workspace, {attributes:true, attributeFilter:['data-engineering-view']});
  const navigation = performance.getEntriesByType('navigation')[0];
  if (!location.hash && navigation?.type !== 'back_forward') requestAnimationFrame(() => void play());
  else { releaseCover(); control.hidden = false; pauseWheel(); }
})();
