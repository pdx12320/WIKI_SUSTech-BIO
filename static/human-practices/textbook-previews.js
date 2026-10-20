import { renderPdfReader } from '../contribution-assets/previews.js';

// Use the same PDF reader as Contribution, directly from the uploaded PDFs.
for (const edition of document.querySelectorAll('.education-manuscript .hp-handbook-edition')) {
  const link = edition.querySelector('a[data-pdf-title]');
  if (!link || edition.querySelector('.contribution-pdf-resource')) continue;
  const resource = document.createElement('div');
  resource.className = 'contribution-pdf-resource';
  const details = document.createElement('details');
  details.className = 'contribution-pdf';
  details.open = true;
  const summary = document.createElement('summary');
  summary.textContent = 'Preview PDF';
  const body = document.createElement('div');
  body.className = 'contribution-pdf-reader';
  details.append(summary, body);
  resource.append(details);
  link.closest('p').before(resource);
  const start = () => {
    if (details.open && !body.childElementCount) renderPdfReader(body, link, link.dataset.pdfTitle);
  };
  details.addEventListener('toggle', start);
  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      start();
      observer.disconnect();
    }
  }, { rootMargin: '300px' });
  observer.observe(resource);
}
