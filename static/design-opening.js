(() => {
  'use strict';
  const releaseCover = () => window.ORCADesignOpeningCover?.release();
  const opening = document.querySelector('[data-design-opening]');
  const header = document.querySelector('.content-page .content-overview');
  const replay = document.querySelector('[data-design-opening-replay]');
  if (!opening || !header || !replay) { releaseCover(); return; }
  const animations = [...opening.querySelectorAll('[data-design-opening-animation]')];
  const still = opening.querySelector('[data-design-opening-still]');
  if (!animations.length || !still) { releaseCover(); return; }
  const skip = opening.querySelector('[data-design-opening-skip]');
  const title = opening.querySelector('[data-design-opening-title]');
  const replayLabel = replay.querySelector('[data-design-opening-replay-label]');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const gifURLs = animations.map(image => new URL(image.dataset.image, document.baseURI));
  const duration = Number(opening.dataset.duration);
  if (!Number.isFinite(duration) || duration <= 0) { releaseCover(); return; }
  let preparationTimeout;
  let resources;
  let run = 0;
  let request = 0;
  let closing;
  let titleMotion;
  let playing = false;
  let playbackURLs = [];
  let background = [];
  let pageLocked = false;
  let restoreFocus = false;
  let entryPending = false;

  document.body.append(opening);
  header.append(replay);
  replay.hidden = false;
  const updateLabel = () => {
    replayLabel.textContent = motion.matches ? 'View mascot' : 'Replay opening';
  };
  updateLabel();

  function lockPage() {
    if (pageLocked) return;
    pageLocked = true;
    background = [...document.body.children]
      .filter(element => element !== opening && !['SCRIPT', 'STYLE', 'LINK'].includes(element.tagName))
      .map(element => ({element, inert: element.inert}));
    background.forEach(({element}) => { element.inert = true; });
    document.documentElement.classList.add('design-opening-active');
  }
  function unlockPage() {
    if (!pageLocked) return;
    background.forEach(({element, inert}) => { element.inert = inert; });
    background = [];
    pageLocked = false;
    document.documentElement.classList.remove('design-opening-active');
  }
  async function load() {
    if (!resources) resources = Promise.all(gifURLs.map(async url => {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Opening GIF unavailable');
      return response.blob();
    })).catch(error => { resources = undefined; throw error; });
    return resources;
  }

  function releaseMedia() {
    animations.forEach(image => image.removeAttribute('src'));
    still.removeAttribute('src');
    playbackURLs.forEach(url => URL.revokeObjectURL(url));
    playbackURLs = [];
  }

  function finish(immediate = false, showTitle = false) {
    if (!immediate && closing) return;
    const token = ++run;
    clearTimeout(preparationTimeout);
    releaseCover();
    cancelAnimationFrame(request);
    closing?.cancel();
    closing = undefined;
    titleMotion?.cancel();
    titleMotion = undefined;
    playing = false;
    restoreFocus = restoreFocus || opening.contains(document.activeElement);
    opening.inert = !showTitle;
    const complete = () => {
      if (token !== run) return;
      opening.hidden = true;
      opening.inert = true;
      opening.dataset.state = 'complete';
      closing = undefined;
      titleMotion?.cancel();
      titleMotion = undefined;
      releaseMedia();
      unlockPage();
      replay.disabled = false;
      if (restoreFocus && !document.hidden) replay.focus({preventScroll: true});
      restoreFocus = false;
    };
    if (opening.hidden) { complete(); return; }
    opening.dataset.state = showTitle ? 'revealing' : 'complete';
    if (immediate || motion.matches || !opening.animate) {
      complete();
      return;
    }
    if (showTitle) {
      skip.textContent = 'Continue to page ↗';
      titleMotion = title?.animate([
        {opacity: 0, transform: 'translateY(14px)', offset: 0},
        {opacity: 0, transform: 'translateY(14px)', offset: 416 / 3400, easing: 'ease-in-out'},
        {opacity: 1, transform: 'translateY(0)', offset: 988 / 3400},
        {opacity: 1, transform: 'translateY(0)', offset: 2620 / 3400, easing: 'ease-in-out'},
        {opacity: 0, transform: 'translateY(0)', offset: 1},
      ], {duration: 3400, easing: 'linear', fill: 'both'});
    }
    closing = opening.animate(showTitle ? [
      {opacity: 1, backdropFilter: 'blur(18px)', webkitBackdropFilter: 'blur(18px)', offset: 0},
      {opacity: 1, backdropFilter: 'blur(18px)', webkitBackdropFilter: 'blur(18px)', offset: 780 / 3400, easing: 'ease-in-out'},
      {opacity: 1, backdropFilter: 'blur(10px)', webkitBackdropFilter: 'blur(10px)', offset: 2360 / 3400, easing: 'ease-in-out'},
      {opacity: 1, backdropFilter: 'blur(8px)', webkitBackdropFilter: 'blur(8px)', offset: 2620 / 3400, easing: 'ease-in-out'},
      {opacity: 0, backdropFilter: 'blur(0px)', webkitBackdropFilter: 'blur(0px)', offset: 1},
    ] : [
      {opacity: 1, backdropFilter: 'blur(18px)', webkitBackdropFilter: 'blur(18px)'},
      {opacity: 0, backdropFilter: 'blur(0px)', webkitBackdropFilter: 'blur(0px)'},
    ], {duration: showTitle ? 3400 : 350, easing: showTitle ? 'linear' : 'ease-in-out', fill: 'forwards'});
    const transition = closing;
    closing.finished.then(() => {
      complete();
      transition.cancel();
    }).catch(() => {});
  }

  async function play(manual = false) {
    const token = ++run;
    cancelAnimationFrame(request);
    closing?.cancel();
    closing = undefined;
    titleMotion?.cancel();
    titleMotion = undefined;
    releaseMedia();
    replay.disabled = true;
    // Show the actual blur synchronously, before fetch/decode yields to a paint.
    // It replaces the parser-time cover in the same task.
    animations.forEach(image => { image.hidden = true; });
    still.hidden = true;
    opening.hidden = false;
    opening.inert = false;
    opening.dataset.state = 'preparing';
    lockPage();
    releaseCover();
    clearTimeout(preparationTimeout);
    preparationTimeout = setTimeout(() => { if (token === run) finish(true); }, 10000);
    try {
      if (motion.matches) {
        still.src = new URL(still.dataset.image, document.baseURI).href;
        await still.decode();
      } else {
        const blobs = await load();
        if (token !== run) return;
        // A fresh object URL gives every entry/replay its own GIF decoder clock.
        playbackURLs = blobs.map(blob => URL.createObjectURL(blob));
        animations.forEach((image, i) => { image.src = playbackURLs[i]; });
        await Promise.all(animations.map(image => image.decode()));
      }
    }
    catch {
      if (token === run) finish(true);
      return;
    }
    if (token !== run) return;
    clearTimeout(preparationTimeout);
    if (document.hidden || (!manual && (location.hash || motion.matches))) {
      finish(true);
      return;
    }
    animations.forEach(image => { image.hidden = motion.matches; });
    still.hidden = !motion.matches;
    opening.hidden = false;
    opening.inert = false;
    opening.dataset.state = motion.matches ? 'still' : 'playing';
    opening.dataset.still = String(motion.matches);
    skip.textContent = motion.matches ? 'Continue to page ↗' : 'Skip opening ↗';
    lockPage();
    skip.focus({preventScroll: true});
    if (motion.matches) {
      replay.disabled = false;
      return;
    }
    playing = true;
    const start = performance.now();
    const tick = now => {
      if (token !== run) return;
      if (now - start >= duration) finish(false, true);
      else request = requestAnimationFrame(tick);
    };
    request = requestAnimationFrame(tick);
  }

  replay.addEventListener('click', () => play(true));
  skip.addEventListener('click', () => finish(true));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && (!opening.hidden || replay.disabled)) finish(true);
    if (event.key === 'Tab' && !opening.hidden) {
      event.preventDefault();
      skip.focus({preventScroll: true});
    }
  });
  motion.addEventListener('change', () => {
    updateLabel();
    if (playing || !opening.hidden) finish(true);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && (!opening.hidden || replay.disabled)) finish(true);
    else if (!document.hidden && entryPending) enter();
  });
  window.addEventListener('pagehide', () => finish(true));
  window.addEventListener('pageshow', event => {
    if (event.persisted) enter();
  });
  function enter() {
    entryPending = false;
    if (location.hash || motion.matches) { releaseCover(); return; }
    if (document.hidden) { entryPending = true; return; }
    play();
  }
  enter();
})();
