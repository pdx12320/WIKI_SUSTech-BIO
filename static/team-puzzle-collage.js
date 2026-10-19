/* Decode the four whole collages before unfolding. Keep the 40-photo review usable. */
(() => {
  const root = document.querySelector('[data-team-puzzle-collages]');
  if (!root) return;
  if (root.dataset.teamPuzzleMode === 'composites') {
    const opening = root.closest('[data-team-opening]');
    const puzzle = opening?.querySelector('.team-opening__puzzle');
    // Paint the outline, photographs and lettering inside ONE moving parent.
    // Separate HTML/SVG animations can drift by a compositor frame on WebKit.
    if (puzzle) {
      for (const collage of root.querySelectorAll('[data-team-puzzle-group]')) {
        const direction = collage.dataset.teamPuzzleGroup;
        const source = puzzle.querySelector(`.team-opening__piece--${direction}`);
        const label = opening.querySelector(`.team-opening__puzzle-labels > .team-opening__piece--${direction}`);
        if (!source) continue;
        const outline = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        outline.setAttribute('class', 'team-opening__collage-outline');
        outline.setAttribute('viewBox', '0 0 1200 800');
        outline.setAttribute('preserveAspectRatio', 'none');
        outline.setAttribute('aria-hidden', 'true');
        const stroke = source.cloneNode(false);
        stroke.setAttribute('class', 'team-opening__collage-stroke');
        outline.appendChild(stroke);
        collage.appendChild(outline);
        if (label) collage.appendChild(label);
      }
      opening.dataset.teamPuzzleRenderer = 'grouped';
    }
    const photos = [...root.querySelectorAll('[data-team-puzzle-image], [data-team-puzzle-fragment-image]')];
    const retry = opening?.querySelector('[data-team-puzzle-retry]');
    const status = opening?.querySelector('[data-team-puzzle-loading-status]');
    const sources = photos.map(photo => photo.src);
    let cleanups = [], deadline, attempt = 0;
    const load = () => {
      clearTimeout(deadline);
      cleanups.forEach(cleanup => cleanup());
      cleanups = [];
      let remaining = photos.length, failed = false, settled = false;
      root.dataset.teamPuzzleReady = 'pending';
      if (opening) opening.dataset.teamImages = 'pending';
      if (retry) retry.hidden = true;
      if (status) status.textContent = 'Loading team photos';
      const unavailable = () => {
        if (settled) return;
        root.dataset.teamPuzzleReady = 'error';
        if (opening) opening.dataset.teamImages = 'error';
        if (retry) retry.hidden = false;
        if (status) status.textContent = 'Waiting for team photos';
      };
      const finish = () => {
        if (settled) return;
        if (failed) { unavailable(); return; }
        settled = true;
        clearTimeout(deadline);
        cleanups.forEach(cleanup => cleanup());
        cleanups = [];
        root.dataset.teamPuzzleReady = 'ready';
        if (opening) opening.dataset.teamImages = 'ready';
        if (retry) retry.hidden = true;
      };
      // A slow connection keeps the loading view, never exposes empty pieces.
      // Late loads can still complete; an error also offers an explicit retry.
      deadline = setTimeout(unavailable, 12000);
      photos.forEach((photo, index) => {
        let done = false, active = true;
        const settle = ok => {
          if (!active || done || settled) return;
          done = true;
          if (!ok) { failed = true; unavailable(); }
          if (--remaining === 0) finish();
        };
        const loaded = () => {
          if (!photo.naturalWidth) { settle(false); return; }
          if (typeof photo.decode === 'function') photo.decode().then(() => settle(true), () => settle(false));
          else settle(true);
        };
        const error = () => settle(false);
        photo.addEventListener('load', loaded, { once: true });
        photo.addEventListener('error', error, { once: true });
        cleanups.push(() => {
          active = false;
          photo.removeEventListener('load', loaded);
          photo.removeEventListener('error', error);
        });
        if (attempt && (!photo.complete || !photo.naturalWidth)) {
          const source = new URL(sources[index], document.baseURI);
          source.searchParams.set('team_retry', attempt);
          photo.src = source.href;
        } else if (photo.complete) loaded();
      });
      if (!remaining) finish();
    };
    retry?.addEventListener('click', () => { attempt += 1; load(); });
    load();
    return;
  }
  if (!root.dataset.teamPuzzleLayouts) return;
  const boards = [...root.querySelectorAll('[data-team-puzzle-board]')];
  let layouts;
  let pending = 0;
  const fit = () => {
    pending = 0;
    if (!layouts || !root.isConnected) return;
    for (const board of boards) {
      // Offset dimensions ignore the opening's animated transform.
      const ratio = board.offsetWidth / board.offsetHeight;
      const options = layouts[board.dataset.teamPuzzleBoard];
      if (!options?.length || !Number.isFinite(ratio) || ratio <= 0) continue;
      const distance = plan => Math.abs(Math.log(plan.ratio / ratio));
      const nearest = Math.min(...options.map(distance));
      const plan = options.filter(option => distance(option) <= nearest + .015)
        .reduce((best, next) => next.quality < best.quality ? next : best);
      [...board.children].forEach((photo, index) => {
        plan.boxes[index]?.forEach((value, coordinate) =>
          photo.style.setProperty(`--snapshot-${'xywh'[coordinate]}-current`, String(value))
        );
      });
    }
  };
  const schedule = () => { if (!pending) pending = requestAnimationFrame(fit); };
  const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(schedule) : null;
  boards.forEach(board => observer?.observe(board));
  window.addEventListener('resize', schedule, { passive: true });
  fetch(root.dataset.teamPuzzleLayouts)
    .then(response => { if (!response.ok) throw new Error('Photo layouts unavailable'); return response.json(); })
    .then(data => { layouts = data; fit(); })
    .catch(() => { /* The inline desktop, tablet and phone layouts remain usable. */ });
  const lifecycle = new MutationObserver(() => {
    if (root.isConnected) return;
    observer?.disconnect();
    window.removeEventListener('resize', schedule);
    if (pending) cancelAnimationFrame(pending);
    lifecycle.disconnect();
  });
  const opening = root.closest('.team-opening');
  if (opening?.parentNode) lifecycle.observe(opening.parentNode, { childList: true });
})();
