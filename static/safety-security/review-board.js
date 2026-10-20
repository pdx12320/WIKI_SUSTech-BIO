/* Local interaction only: no timers, requests, automatic decisions or stored state. */
(() => {
  const board = document.querySelector('.sb-board');
  if (!board) return;
  // The miniature is a reading aid; it never reflects a safety approval state.
  const template = document.getElementById('safety-mini-template');
  const layout = document.querySelector('.markdown-page[data-content-source="docs/wet-lab/safety-and-security.md"]');
  const directory = layout?.querySelector(':scope > .content-directory');
  if (template && directory && !layout.querySelector('.safety-nav-dock')) {
    const dock = document.createElement('aside');
    dock.className = 'safety-nav-dock';
    dock.setAttribute('aria-label', 'Safety page navigation');
    directory.before(dock);
    dock.append(template.content.cloneNode(true), directory);
    const miniLinks = [...dock.querySelectorAll('[data-safety-mini-stage]')];
    const headings = [...document.querySelectorAll('.markdown-content h2[id]')];
    let queued = false;
    const update = () => {
      queued = false;
      const top = (document.querySelector('.site-nav')?.getBoundingClientRect().bottom || 100) + 52;
      const scrollPadding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      let current = '';
      for (const heading of headings) {
        const readingOffset = scrollPadding + (parseFloat(getComputedStyle(heading).scrollMarginTop) || 0) + 36;
        if (heading.getBoundingClientRect().top > Math.max(top, readingOffset)) break;
        current = heading.id;
      }
      miniLinks.forEach(link => {
        if (link.getAttribute('href') === '#' + current) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    };
    const schedule = () => {
      if (!queued) { queued = true; requestAnimationFrame(update); }
    };
    addEventListener('scroll', schedule, {passive: true});
    addEventListener('resize', schedule);
    addEventListener('hashchange', schedule);
    addEventListener('pageshow', schedule);
    update();
  }

  const live = board.closest('figure')?.querySelector('[data-board-live]');
  const outcomes = [...board.querySelectorAll('[data-outcome]')];
  const focusedModule = () => document.activeElement?.closest?.('[data-module]')?.dataset.module || '';
  const setActive = value => { board.dataset.active = value; };
  board.querySelectorAll('[data-module]').forEach(module => {
    module.addEventListener('pointerenter', () => setActive(module.dataset.module));
    module.addEventListener('pointerleave', () => setActive(focusedModule()));
    module.addEventListener('focusin', () => setActive(module.dataset.module));
    module.addEventListener('focusout', () => setActive(''));
  });
  board.querySelectorAll('[data-return]').forEach(route => {
    const target = route.dataset.return === 'more' ? 'detect' : 'constrain';
    route.addEventListener('pointerenter', () => setActive(target));
    route.addEventListener('pointerleave', () => setActive(focusedModule()));
  });
  const describe = {
    proceed: 'Proceed to the next defined step.',
    redesign: 'Redesign selected: return to Constrain.',
    more: 'More evidence selected: return to Detect.',
    stop: 'Stop selected: pause the next step.'
  };
  const select = choice => {
    const next = board.dataset.selection === choice ? '' : choice;
    board.dataset.selection = next;
    outcomes.forEach(item => item.setAttribute('aria-pressed', String(item.dataset.outcome === next)));
    if (live) live.textContent = next ? describe[next] : 'Decision route cleared.';
  };
  outcomes.forEach(outcome => {
    outcome.addEventListener('click', () => select(outcome.dataset.outcome));
    outcome.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        select(outcome.dataset.outcome);
      }
    });
  });
  board.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      delete board.dataset.selection;
      outcomes.forEach(item => item.setAttribute('aria-pressed', 'false'));
      if (live) live.textContent = 'Decision route cleared.';
    }
  });
})();
