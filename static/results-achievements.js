(() => {
  const dialog = document.querySelector('[data-results-figure-dialog]');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  let trigger;
  document.querySelectorAll('.results-achievements [data-enlarge]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      trigger = link;
      const image = dialog.querySelector('img');
      image.src = link.href;
      image.alt = link.querySelector('img').alt;
      dialog.showModal();
    });
  });
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    }
  });
  dialog.addEventListener('close', () => trigger?.focus());
})();
