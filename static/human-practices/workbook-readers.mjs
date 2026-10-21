import { renderPdfReader } from '../contribution-assets/previews.js';

// The frames are already open in the document. Load each original PDF when
// its frame approaches the screen, keeping long pages light on memory.
for (const resource of document.querySelectorAll('[data-workbook-edition]')) {
  const details = resource.querySelector('details');
  const body = resource.querySelector('.contribution-pdf-reader');
  const link = resource.querySelector('a[data-pdf-title]');
  let started = false;
  const start = () => {
    if (started || !details.open) return;
    started = true;
    renderPdfReader(body, link, link.dataset.pdfTitle);
  };
  details.addEventListener('toggle', start);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      start();
      observer.disconnect();
    }, { rootMargin: '300px' });
    observer.observe(resource);
  } else {
    start();
  }
}
