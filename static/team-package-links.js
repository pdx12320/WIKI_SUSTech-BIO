/* Member-file links are enabled after the real compilation docks in the header. */
(() => {
  'use strict';
  const header = document.querySelector('[data-team-package-header]');
  const mount = header?.querySelector('[data-team-package-mount]');
  if (!mount || header.dataset.memberLinksReady === 'true') return;
  header.dataset.memberLinksReady = 'true';
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const duration = 1000;
  let navigation = 0;
  let activeCard;
  let activeAnimation;
  let restoreTimer;

  const enhance = () => {
    for (const line of mount.querySelectorAll('[data-team-member-target]')) {
      if (line.querySelector('[data-team-member-link]')) continue;
      const id = line.dataset.teamMemberTarget;
      if (!document.getElementById(id)) continue;
      const link = document.createElement('a');
      link.className = 'team-skill-file';
      link.href = `#${id}`;
      link.dataset.teamMemberLink = id;
      link.textContent = line.textContent;
      line.replaceChildren(link);
      line.closest('.team-opening__compile-code')?.removeAttribute('aria-hidden');
    }
  };
  const pulse = card => {
    clearTimeout(restoreTimer);
    activeAnimation?.cancel();
    activeCard?.classList.remove('is-package-target');
    // Finish an outstanding entrance without changing its CSS animation name.
    for (const animation of card.getAnimations?.() || []) {
      if (animation.animationName === 'team-card-package-in') animation.finish();
    }
    activeCard = card;
    activeAnimation = null;
    card.classList.add('is-package-target');
    card.focus({ preventScroll: true });
    if (!motion.matches && card.animate) {
      activeAnimation = card.animate([
        { transform: 'translateX(0px) scale(1) rotate(0deg)', offset: 0, easing: 'cubic-bezier(.22,.7,.2,1)' },
        { transform: 'translateX(0px) scale(1.16) rotate(0deg)', offset: .26, easing: 'ease-in-out' },
        { transform: 'translateX(-3px) scale(1.16) rotate(-2deg)', offset: .4, easing: 'ease-in-out' },
        { transform: 'translateX(3px) scale(1.14) rotate(2deg)', offset: .56, easing: 'ease-in-out' },
        { transform: 'translateX(-1px) scale(1.1) rotate(-.8deg)', offset: .7, easing: 'ease-in-out' },
        { transform: 'translateX(.5px) scale(1.04) rotate(.3deg)', offset: .84, easing: 'ease-in-out' },
        { transform: 'translateX(0px) scale(1) rotate(0deg)', offset: 1 },
      ], { duration, easing: 'linear' });
    }
    restoreTimer = setTimeout(() => {
      activeAnimation?.cancel();
      card.classList.remove('is-package-target');
      activeAnimation = null;
      activeCard = null;
    }, duration);
  };
  const emphasizeAfterScroll = (card, token) => {
    const started = performance.now();
    let previousTop;
    let settled = 0;
    const check = () => {
      if (token !== navigation) return;
      const rect = card.getBoundingClientRect();
      const visible = rect.bottom > 0 && rect.top < innerHeight;
      settled = previousTop != null && Math.abs(rect.top - previousTop) < 1 ? settled + 1 : 0;
      previousTop = rect.top;
      const elapsed = performance.now() - started;
      if (visible && (motion.matches || (settled >= 3 && elapsed > 80) || elapsed > 2400)) {
        pulse(card);
      } else if (elapsed <= 2400) {
        requestAnimationFrame(check);
      }
    };
    requestAnimationFrame(check);
  };
  header.addEventListener('click', event => {
    if (event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest?.('[data-team-member-link]');
    if (!link || !header.contains(link)) return;
    const card = document.getElementById(link.dataset.teamMemberLink);
    if (!card) return;
    event.preventDefault();
    const group = card.closest('.team-category');
    if (card.hidden || group?.hidden) header.querySelector('[data-team-filter-reset]')?.click();
    if (card.hidden || group?.hidden) return;
    try { window.history.replaceState(window.history.state, '', link.hash); } catch { /* Hash updates are optional. */ }
    card.scrollIntoView({ behavior: motion.matches ? 'auto' : 'smooth', block: 'center' });
    emphasizeAfterScroll(card, ++navigation);
  });
  motion.addEventListener?.('change', () => { if (motion.matches) activeAnimation?.cancel(); });
  enhance();
  new MutationObserver(enhance).observe(mount, { childList: true, subtree: true });
})();
