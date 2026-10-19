(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((node) => node.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        instance.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach((node) => observer.observe(node));
  }

  const backToTop = document.querySelector('[data-back-to-top]');

  const updateScrollUI = () => {
    if (backToTop) backToTop.classList.toggle('is-visible', window.scrollY > 700);
  };

  window.addEventListener('scroll', updateScrollUI, { passive: true });
  updateScrollUI();

  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
  }

  const navigation = document.querySelector('.whale-navigation');
  const groups = [...document.querySelectorAll('[data-rna-nav]')];
  const menuMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let menuEffect;
  let closeTimer;

  function stopMenuParticles(panel) {
    if (!menuEffect || (panel && menuEffect.panel !== panel)) return;
    cancelAnimationFrame(menuEffect.frame);
    menuEffect.panel.classList.remove('is-particle-arrival');
    menuEffect.panel.style.removeProperty('--menu-particle-radius');
    menuEffect = null;
  }

  function gatherMenu(panel) {
    stopMenuParticles();
    if (menuMotion.matches || document.hidden) return;
    // Assemble the real surface, border, nodes and lettering together through
    // one particle mask. No raster text substitute or end-of-effect swap.
    panel.style.setProperty('--menu-particle-radius', '0px');
    panel.classList.add('is-particle-arrival');
    const effect = { panel, frame: 0 };
    menuEffect = effect;
    const started = performance.now();
    function frame(now) {
      if (menuEffect !== effect) return;
      if (panel.hidden || document.hidden || menuMotion.matches) { stopMenuParticles(panel); return; }
      const progress = Math.min(1, (now - started) / 440);
      const ease = progress * progress * (3 - 2 * progress);
      // Radius exceeds the half-diagonal of an 8 px tile, so the mask is
      // already fully opaque before it is removed. Cleanup changes no pixels.
      panel.style.setProperty('--menu-particle-radius', `${6.2 * ease}px`);
      if (progress === 1) { stopMenuParticles(panel); return; }
      effect.frame = requestAnimationFrame(frame);
    }
    effect.frame = requestAnimationFrame(frame);
  }

  // Measure rows rather than assuming their height: wrapped labels and fonts
  // remain aligned with the SVG, including in scrollable mobile menus.
  function drawStrand(panel) {
    const strand = panel.querySelector('.rna-strand');
    const svg = strand.querySelector('svg');
    const bases = [...strand.querySelectorAll('.rna-branch__base')];
    const origin = strand.getBoundingClientRect();
    if (!origin.height) return;
    const points = bases.map(base => {
      const box = base.getBoundingClientRect();
      return { x:box.left - origin.left + box.width / 2, y:box.top - origin.top + box.height / 2 };
    });
    const vertices = [{ x:points[0].x, y:0 }, ...points,
      { x:points.at(-1).x, y:origin.height }];
    // Share the same tangent on both sides of each vertex, even when a
    // wrapped label changes a row's height. The resulting path is C1 smooth.
    const tangents = vertices.map((point, i) => Math.min(
      i ? point.y - vertices[i - 1].y : Infinity,
      i < vertices.length - 1 ? vertices[i + 1].y - point.y : Infinity
    ) / 4);
    let d = `M ${vertices[0].x} 0`;
    for (let i = 1; i < vertices.length; i++) {
      const previous = vertices[i - 1], point = vertices[i];
      const dy = (point.y - previous.y) / 4;
      const midY = (point.y + previous.y) / 2;
      const midX = point.x + (i > 1 && i < vertices.length - 1 ? (i % 2 ? 8 : -8) : 0);
      d += ` C ${previous.x} ${previous.y + tangents[i - 1]} ${midX} ${midY - dy} ${midX} ${midY}`;
      d += ` C ${midX} ${midY + dy} ${point.x} ${point.y - tangents[i]} ${point.x} ${point.y}`;
    }
    svg.setAttribute('viewBox', `0 0 ${parseFloat(getComputedStyle(svg).width)} ${origin.height}`);
    svg.querySelectorAll('path').forEach(path => path.setAttribute('d', d));
    // Keep the glass nodes translucent while removing the strand beneath them.
    // ResizeObserver repositions these cutouts when labels wrap or fonts load.
    if (bases.length) {
      const ns = 'http://www.w3.org/2000/svg';
      let mask = svg.querySelector('mask');
      if (!mask) {
        const defs = document.createElementNS(ns, 'defs');
        mask = document.createElementNS(ns, 'mask');
        mask.id = `${panel.id}-node-cutouts`;
        mask.setAttribute('maskUnits', 'userSpaceOnUse');
        defs.append(mask);
        svg.prepend(defs);
      }
      const width = parseFloat(getComputedStyle(svg).width);
      mask.setAttribute('x', '0');
      mask.setAttribute('y', '0');
      mask.setAttribute('width', width);
      mask.setAttribute('height', origin.height);
      const surface = document.createElementNS(ns, 'rect');
      surface.setAttribute('width', width);
      surface.setAttribute('height', origin.height);
      surface.setAttribute('fill', 'white');
      mask.replaceChildren(surface);
      bases.forEach((base, i) => {
        const hole = document.createElementNS(ns, 'circle');
        hole.setAttribute('cx', points[i].x);
        hole.setAttribute('cy', points[i].y);
        hole.setAttribute('r', base.getBoundingClientRect().width / 2 + 1.5);
        hole.setAttribute('fill', 'black');
        mask.append(hole);
      });
      svg.querySelectorAll('path').forEach(path => path.setAttribute('mask', `url(#${mask.id})`));
    }
  }
  const strandObserver = new ResizeObserver(entries => {
    entries.forEach(({ target }) => drawStrand(target.closest('.rna-menu')));
  });

  function closeGroup(group) {
    const panel = group.querySelector('.rna-menu');
    stopMenuParticles(panel);
    group.classList.remove('is-open');
    group.querySelector('.rna-toggle').setAttribute('aria-expanded', 'false');
    panel.hidden = true;
    panel.querySelectorAll(".is-editing").forEach(link => link.classList.remove("is-editing"));
  }
  function closeAll(except) {
    groups.forEach((group) => {
      if (group === except) return;
      closeGroup(group);
    });
  }
  function open(group) {
    clearTimeout(closeTimer);
    closeAll(group);
    if (group.classList.contains('is-open')) return;
    group.classList.add('is-open');
    group.querySelector('.rna-toggle').setAttribute('aria-expanded', 'true');
    const panel = group.querySelector('.rna-menu');
    panel.hidden = false;
    drawStrand(panel);
    try { gatherMenu(panel); } catch { stopMenuParticles(panel); }
  }
  groups.forEach((group) => {
    const toggle = group.querySelector('.rna-toggle');
    const panel = group.querySelector('.rna-menu');
    strandObserver.observe(panel.querySelector('.rna-strand'));
    panel.addEventListener('click', event => {
      const base = event.target.closest('.rna-base-flip');
      // A touch on the decorative C previews editing; the text still navigates.
      if (!base || (event.pointerType !== 'touch' && !matchMedia('(hover:none)').matches)) return;
      event.preventDefault();
      base.closest('a').classList.toggle('is-editing');
    });
    group.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'touch') open(group);
    });
    group.addEventListener('pointerleave', () => {
      closeTimer = setTimeout(() => {
        if (group.classList.contains('is-open') && !group.matches(':hover') && !group.contains(document.activeElement)) closeAll();
      }, 240);
    });
    panel.addEventListener('pointerenter', () => clearTimeout(closeTimer));
    panel.addEventListener('focusin', () => stopMenuParticles(panel));
    toggle.addEventListener('click', (event) => {
      if (event.pointerType === 'touch' && group.classList.contains('is-open')) closeAll();
      else open(group);
    });
    group.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') stopMenuParticles(panel);
      if (event.key === 'Escape') {
        event.preventDefault();
        closeAll();
        toggle.focus();
      } else if (event.target === toggle && event.key === 'ArrowDown') {
        event.preventDefault();
        open(group);
        stopMenuParticles(panel);
        panel.querySelector('a').focus();
      }
    });
    group.addEventListener('focusout', () => {
      setTimeout(() => {
        if (!group.contains(document.activeElement) && !group.matches(':hover')) {
          closeGroup(group);
        }
      }, 0);
    });
  });
  document.addEventListener('pointerdown', (event) => {
    if (navigation && !navigation.contains(event.target)) closeAll();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAll();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) closeAll(); });
  window.addEventListener('resize', () => stopMenuParticles());
  menuMotion.addEventListener?.('change', () => stopMenuParticles());

})();
