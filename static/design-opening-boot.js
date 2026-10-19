/* Parser-time cover: the loading shield must reveal blur, never clear content. */
(() => {
  'use strict';
  if (location.hash || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const root = document.documentElement;
  root.classList.add('design-opening-pending');
  const release = () => {
    root.classList.remove('design-opening-pending');
    clearTimeout(watchdog);
  };
  const watchdog = setTimeout(release, 12000);
  window.ORCADesignOpeningCover = {release};
})();
