/* Team opening controller: progressive, package-gated and package-aware. */
(() => {
  'use strict';
  const opening = document.querySelector('[data-team-opening]');
  if (!opening || opening.dataset.initialized === 'true') return;
  opening.dataset.initialized = 'true';
  let finished = false;
  const completionKey = 'orcaTeamPackageOpen';
  let restoredPackage = false;
  try {
    const navigation = performance.getEntriesByType?.('navigation')?.[0];
    const legacyType = performance.navigation?.type;
    const freshNavigation = ['navigate', 'reload'].includes(navigation?.type)
      || (!navigation && [0, 1].includes(legacyType));
    const history = window.history;
    const state = history?.state;
    restoredPackage = !freshNavigation && state?.[completionKey] === true;
    // Fresh visits/reloads replay; back/forward and unknown WebView recovery stay completed.
    if (freshNavigation && state?.[completionKey] === true && history?.replaceState && !Array.isArray(state)) {
      const freshState = { ...state };
      delete freshState[completionKey];
      history.replaceState(freshState, '');
    }
  } catch { /* Optional WebView state must not prevent an explicit package click. */ }
  const rememberCompletion = () => {
    try {
      const history = window.history;
      const state = history?.state;
      if (!history?.replaceState || (state != null && (typeof state !== 'object' || Array.isArray(state)))) return;
      history.replaceState({ ...state, [completionKey]: true }, '');
    } catch { /* Completion must still work when history access is unavailable. */ }
  };
  const scrollRoot = document.documentElement;
  if (!restoredPackage) {
    scrollRoot.style.setProperty('--team-opening-scroll-top', `${-window.scrollY}px`);
    scrollRoot.classList.add('team-opening-scroll-locked');
  }
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const packageButton = opening.querySelector('[data-team-package]');
  const packageFrames = (packageButton?.dataset.teamPackageFrames || '').split('|').filter(Boolean);
  const frameCache = new Map(packageFrames.map(source => {
    const cached = new Image();
    cached.src = source;
    cached.decode?.().catch(() => {});
    return [source, cached];
  }));
  const phaseTimers = [];
  let startTimer;
  let compileTimer;
  let frameTimer;
  let compiledLines = [];

  const clearTimers = () => {
    clearTimeout(startTimer);
    clearTimeout(frameTimer);
    clearInterval(compileTimer);
    phaseTimers.splice(0).forEach(clearTimeout);
  };
  const readCompiledLines = () => [...opening.querySelectorAll('[data-team-compile-order]')]
    .sort((a, b) => Number(a.dataset.teamCompileOrder) - Number(b.dataset.teamCompileOrder))
    .map(node => ({ node, text: node.textContent.trim() }));
  const setPhase = phase => {
    if (finished || opening.hidden) return;
    opening.dataset.phase = phase;
    document.body.classList.toggle('team-page--opening-blur', ['preview', 'title', 'package'].includes(phase));
  };
  const createParticleBurst = (deck, origin) => {
    if (!deck || motion.matches) return;
    const cards = [...deck.querySelectorAll('.member-card')].map(card => card.getBoundingClientRect())
      .filter(rect => rect.width && rect.height && rect.bottom > -80 && rect.top < innerHeight + 80);
    if (!cards.length) return;
    const field = document.createElement('div');
    field.className = 'team-particle-field';
    field.setAttribute('aria-hidden', 'true');
    const pattern = [
      [.08, .12], [.5, .08], [.92, .12],
      [.14, .4], [.5, .38], [.86, .4],
      [.08, .84], [.5, .86], [.92, .84],
      [.28, .6], [.72, .6], [.5, .98],
    ];
    const colors = ['#E9E8FF', '#F58F9C', '#BFA8FF', '#FFFFFF'];
    const originX = origin ? origin.left + origin.width / 2 : innerWidth / 2;
    const originY = origin ? origin.top + origin.height / 2 : innerHeight / 2;
    field.style.setProperty('--particle-origin-x', `${originX}px`);
    field.style.setProperty('--particle-origin-y', `${originY}px`);
    cards.forEach(rect => pattern.forEach(([x, y], index) => {
      const particle = document.createElement('i');
      particle.style.setProperty('--particle-x', `${rect.left + rect.width * x - originX}px`);
      particle.style.setProperty('--particle-y', `${rect.top + rect.height * y - originY}px`);
      particle.style.setProperty('--particle-delay', `${index * 24}ms`);
      particle.style.setProperty('--particle-size', `${3 + (index % 3)}px`);
      particle.style.setProperty('--particle-color', colors[index % colors.length]);
      field.appendChild(particle);
    }));
    document.body.appendChild(field);
    requestAnimationFrame(() => field.classList.add('is-active'));
    setTimeout(() => field.remove(), 1700);
  };
  const listeners = new AbortController();
  const options = { signal: listeners.signal };

  const finish = ({ packageOpen = false, restored = false } = {}) => {
    if (finished || opening.hidden) return;
    finished = true;
    const restoreFocus = !restored && opening.contains(document.activeElement);
    clearTimers();
    const deck = packageOpen ? document.querySelector('.team-deck') : null;
    const header = document.querySelector('[data-team-package-header]');
    if (packageOpen) {
      if (!compiledLines.length) compiledLines = readCompiledLines();
      compiledLines.forEach(({ node, text }) => {
        node.hidden = false;
        node.textContent = text;
        node.classList.remove('is-typing');
      });
      const compilation = opening.querySelector('[data-team-compile]');
      const button = opening.querySelector('[data-team-package]');
      button?.classList.remove('is-unpacking');
      button?.classList.remove('is-complete');
      button?.setAttribute('aria-busy', 'false');
      button?.setAttribute('aria-label', 'ORCA team package unpacked');
      if (button) button.disabled = true;
      if (restored && packageFrames.length) {
        const frame = button?.querySelector('[data-team-package-frame]');
        if (frame) frame.src = packageFrames[packageFrames.length - 1];
      }
      const status = button?.querySelector('[data-team-package-status]');
      if (status) status.textContent = 'ORCA team package unpacked.';
      if (compilation) document.querySelector('[data-team-package-mount]')?.replaceChildren(compilation);
      document.body.classList.add('team-package-open');
      if (!restored) deck?.classList.add('team-deck--package-open');
      rememberCompletion();
      document.querySelectorAll('.team-deck .member-card').forEach((card, index) => {
        card.style.setProperty('--package-index', String(index));
      });
    }
    // Detach the fixed/filtered opening before unlocking the mobile viewport.
    opening.dataset.phase = 'clear';
    opening.hidden = true;
    opening.remove();
    document.body.classList.remove('team-page--opening-blur');
    scrollRoot.classList.remove('team-opening-scroll-locked');
    scrollRoot.style.removeProperty('--team-opening-scroll-top');
    listeners.abort();
    motion.removeEventListener('change', motionChanged);
    if (restoreFocus) header?.focus({ preventScroll: true });
    if (packageOpen) {
      requestAnimationFrame(() => {
        if (!restored) window.scrollTo({ top: 0, behavior: 'auto' });
        header?.querySelectorAll('.team-opening__compile-code').forEach(panel => {
          panel.scrollTo({ top: panel.scrollHeight, behavior: 'auto' });
        });
        if (!restored) requestAnimationFrame(() => createParticleBurst(deck, header?.querySelector('.team-opening__pkg-art')?.getBoundingClientRect()));
      });
    }
  };

  const motionChanged = () => {
    if (motion.matches && !opening.hidden) {
      if (opening.dataset.phase === 'package') {
        finish({ packageOpen: true });
        return;
      }
      clearTimers();
      opening.dataset.unfolding = 'complete';
      setPhase('title');
    }
  };
  let timelineStarted = false;
  const startTimeline = () => {
    if (opening.hidden || timelineStarted) return;
    const collages = opening.querySelector('[data-team-puzzle-collages]');
    if (document.documentElement.matches('[data-wh-cover], [data-wh-busy]')
        || ['pending', 'error'].includes(collages?.dataset.teamPuzzleReady)) {
      startTimer = setTimeout(startTimeline, 120);
      return;
    }
    timelineStarted = true;
    // The blurred roster is already underneath the moving puzzle pieces.
    document.body.classList.add('team-page--opening-blur');
    if (motion.matches) {
      opening.dataset.unfolding = 'complete';
      setPhase('title');
      return;
    }
    let revealed = false;
    const reveal = () => {
      if (revealed || finished || opening.hidden) return;
      revealed = true;
      setPhase('preview');
      phaseTimers.push(setTimeout(() => setPhase('title'), 1350));
    };
    const complete = () => {
      if (finished || opening.hidden) return;
      opening.dataset.unfolding = 'complete';
      reveal();
    };
    const pieces = new Set(opening.querySelectorAll('.team-opening__piece'));
    const ended = new Set();
    let revealScheduled = false;
    opening.addEventListener?.('animationstart', event => {
      if (event.animationName !== 'team-opening-unfold' || !pieces.has(event.target) || revealScheduled) return;
      revealScheduled = true;
      // Bring in the letters earlier while the puzzle continues moving outward.
      phaseTimers.push(setTimeout(reveal, 1500));
    }, options);
    opening.addEventListener?.('animationend', event => {
      if (event.animationName !== 'team-opening-unfold' || !pieces.has(event.target)) return;
      ended.add(event.target);
      if (ended.size === pieces.size) complete();
    }, options);
    // Layout setup and the shared page transition finish before this arms CSS motion.
    opening.dataset.unfolding = 'true';
    // A missing animation event may reveal the PKG gate, never the formal page.
    phaseTimers.push(setTimeout(complete, 3600));
  };

  packageButton?.addEventListener('click', event => {
    const button = event.currentTarget;
    const frame = button.querySelector('[data-team-package-frame]');
    const status = button.querySelector('[data-team-package-status]');
    const frames = (button.dataset.teamPackageFrames || '').split('|').filter(Boolean);
    const sequence = [...frames, ...frames];
    if (!frame || !sequence.length || button.disabled) return;
    clearTimers();
    const compilation = opening.querySelector('[data-team-compile]');
    const lines = readCompiledLines();
    compiledLines = lines;
    compilation?.classList.add('is-active');
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    button.classList.add('is-unpacking');
    if (status) status.textContent = 'Compiling ORCA_TEAM.skill…';
    setPhase('package');

    if (motion.matches) {
      lines.forEach(({ node, text }) => { node.hidden = false; node.textContent = text; });
      phaseTimers.push(setTimeout(() => finish({ packageOpen: true }), 350));
      return;
    }

    const durationScale = .8;
    const baseHoldDuration = 600;
    const holdDuration = baseHoldDuration * durationScale;
    const outputSpeed = 1.1 * 1.3;
    const outputDuration = (Math.max(8000, lines.length * 260 + baseHoldDuration) - baseHoldDuration) / outputSpeed * durationScale;
    const duration = outputDuration + holdDuration;
    const lineInterval = outputDuration / Math.max(lines.length, 1);
    const typingDuration = Math.min(190 / outputSpeed * durationScale, lineInterval * .75);
    const startedAt = performance.now();
    let codeComplete = false;
    let framesComplete = false;
    let completionStarted = false;
    const completeWhenReady = () => {
      if (!codeComplete || !framesComplete || completionStarted || opening.hidden) return;
      completionStarted = true;
      button.setAttribute('aria-busy', 'false');
      button.classList.remove('is-unpacking');
      button.classList.add('is-complete');
      if (status) status.textContent = 'Unpacked';
      phaseTimers.push(setTimeout(() => finish({ packageOpen: true }), 1400));
    };
    const showFrame = index => {
      if (opening.hidden) return;
      let ready = false;
      const holdFrame = () => {
        if (ready || opening.hidden) return;
        ready = true;
        frame.removeEventListener('load', holdFrame);
        frame.removeEventListener('error', holdFrame);
        clearTimeout(frameTimer);
        frameTimer = setTimeout(() => {
          if (index + 1 < sequence.length) showFrame(index + 1);
          else {
            framesComplete = true;
            completeWhenReady();
          }
        }, duration / sequence.length);
      };
      frame.addEventListener('load', holdFrame, options);
      frame.addEventListener('error', holdFrame, options);
      // A missing image must not keep the page locked indefinitely.
      frameTimer = setTimeout(holdFrame, 2000);
      frame.src = frameCache.get(sequence[index])?.src || sequence[index];
      if (frame.complete) holdFrame();
    };
    const advance = () => {
      const elapsed = performance.now() - startedAt;
      const scrollPanels = new Set();
      lines.forEach(({ node, text }, index) => {
        const lineElapsed = elapsed - index * lineInterval;
        if (lineElapsed < 0) return;
        if (node.hidden) {
          node.hidden = false;
          scrollPanels.add(node.parentElement);
        }
        const length = Math.min(text.length, Math.max(1, Math.ceil(text.length * lineElapsed / typingDuration)));
        const typed = text.slice(0, length);
        if (node.textContent !== typed) {
          node.textContent = typed;
          if (length === text.length) scrollPanels.add(node.parentElement);
        }
        node.classList.toggle('is-typing', length < text.length);
      });
      scrollPanels.forEach(panel => panel.scrollTo({ top: panel.scrollHeight, behavior: 'smooth' }));
      if (elapsed >= duration) {
        clearInterval(compileTimer);
        codeComplete = true;
        completeWhenReady();
      }
    };
    advance();
    compileTimer = setInterval(advance, 32);
    showFrame(0);
  }, options);
  motion.addEventListener('change', motionChanged);
  if (restoredPackage) finish({ packageOpen: true, restored: true });
  else {
    // Opening is intentional: a click, downward scroll/swipe, or keyboard action.
    let wheelDistance = 0;
    let touchStartY = null;
    const requestOpen = () => {
      if (timelineStarted || opening.hidden) return;
      const collages = opening.querySelector('[data-team-puzzle-collages]');
      if (document.documentElement.matches('[data-wh-cover], [data-wh-busy]')
          || ['pending', 'error'].includes(collages?.dataset.teamPuzzleReady)) return;
      startTimeline();
    };
    opening.addEventListener('click', event => {
      if (event.target.closest?.('[data-team-puzzle-retry], [data-team-package]')) return;
      requestOpen();
    }, options);
    opening.addEventListener('wheel', event => {
      if (timelineStarted) return;
      event.preventDefault();
      const pixels = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
      wheelDistance = Math.max(0, wheelDistance + pixels);
      if (wheelDistance >= 80) requestOpen();
    }, { ...options, passive: false });
    opening.addEventListener('touchstart', event => {
      touchStartY = event.touches[0]?.clientY ?? null;
    }, { ...options, passive: true });
    opening.addEventListener('touchmove', event => {
      if (timelineStarted || touchStartY == null) return;
      if (touchStartY - (event.touches[0]?.clientY ?? touchStartY) >= 60) requestOpen();
    }, { ...options, passive: true });
    opening.addEventListener('touchend', () => { touchStartY = null; }, options);
    document.addEventListener?.('keydown', event => {
      if (timelineStarted || !['Enter', ' ', 'ArrowDown', 'PageDown'].includes(event.key)) return;
      event.preventDefault();
      requestOpen();
    }, options);
  }
})();
