// Hold the map for the authored arrival; a missing controller fails open.
(() => {
  if (location.hash ||
      performance.getEntriesByType('navigation')[0]?.type === 'back_forward') return;
  document.documentElement.setAttribute('data-engineering-arrival', '');
  window.ORCAEngineeringArrival = setTimeout(() => {
    document.documentElement.removeAttribute('data-engineering-arrival');
  }, 4000);
})();
