/* Shared header: leave while reading down, return when scrolling up. */
(() => {
  const navigation = document.querySelector('.whale-navigation');
  if (!navigation) return;
  navigation.setAttribute('data-scroll-navigation', '');

  // Engineering owns a full-screen workspace rather than document scrolling.
  // Reveal its header at the top edge; touch and keyboard users keep access.
  if (document.body?.classList.contains('engineering-workspace-page')) {
    const hoverPointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    let atHeader = false;
    const sync = () => {
      const interacting = navigation.contains(document.activeElement) || navigation.querySelector(
        '.rna-toggle[aria-expanded="true"], [data-wiki-search][open]');
      navigation.classList.toggle('is-scroll-hidden', hoverPointer.matches && !atHeader && !interacting);
    };
    window.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch') return;
      atHeader = event.clientY <= 24 || navigation.contains(event.target);
      sync();
    }, { passive: true });
    navigation.addEventListener('pointerenter', () => { atHeader = true; sync(); });
    navigation.addEventListener('pointerleave', () => { atHeader = false; sync(); });
    navigation.addEventListener('focusin', () => navigation.classList.remove('is-scroll-hidden'));
    navigation.addEventListener('focusout', () => requestAnimationFrame(sync));
    hoverPointer.addEventListener('change', sync);
    window.addEventListener('pageshow', () => { atHeader = false; sync(); });
    window.addEventListener('resize', sync);
    sync();
    return;
  }

  const storyRoot = document.querySelector('[data-ot]');
  if (storyRoot) {
    const syncStory = () => {
      navigation.inert = !storyRoot.classList.contains('ot--static') &&
        !storyRoot.classList.contains('is-story-complete');
    };
    storyRoot.addEventListener('ot:frame', event => {
      storyRoot.classList.toggle('is-story-complete', event.detail.p >= 1);
      syncStory();
    });
    new MutationObserver(syncStory).observe(storyRoot, { attributes: true, attributeFilter: ['class'] });
    syncStory();
  }

  const position = () => Math.max(0, Math.min(window.scrollY,
    Math.max(0, document.documentElement.scrollHeight - window.innerHeight)));
  let previous = position();
  let travel = 0;
  let direction = 0;
  let frame = 0;

  const show = () => navigation.classList.remove('is-scroll-hidden');
  const update = () => {
    frame = 0;
    const current = position();
    const delta = current - previous;
    previous = current;
    // Keep open menus, touch disclosures and keyboard interaction reachable.
    const interacting = navigation.querySelector(
      ':focus-visible, .rna-toggle[aria-expanded="true"], [data-wiki-search][open]');
    if (current <= 24 || interacting) {
      travel = 0;
      direction = 0;
      show();
      return;
    }
    if (!delta) return;
    const nextDirection = Math.sign(delta);
    if (nextDirection !== direction) travel = 0;
    direction = nextDirection;
    travel += Math.abs(delta);
    // A short dead zone prevents trackpad jitter from flickering the menu.
    if (travel < 8) return;
    if (direction < 0) show();
    else if (current > navigation.offsetHeight + 24) {
      navigation.classList.add('is-scroll-hidden');
    }
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  const reset = () => {
    previous = position();
    travel = 0;
    direction = 0;
    show();
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', reset);
  window.addEventListener('pageshow', reset);
  // Offscreen links remain keyboard reachable and reveal the header on focus.
  navigation.addEventListener('focusin', reset);
})();
