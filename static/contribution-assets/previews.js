/* Original PDF links are the only content input; no page images or manifests. */
let engine;
function loadEngine() {
  return engine ??= import('./pdfjs/pdf.min.mjs').then(pdfjs => {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL('./pdfjs/pdf.worker.min.mjs', import.meta.url).href;
    return pdfjs;
  });
}
async function reader(body, link, title) {
  const status = document.createElement('span');
  status.textContent = 'Loading PDF…';
  status.setAttribute('aria-live', 'polite');
  const toolbar = document.createElement('div');
  toolbar.className = 'contribution-pdf-toolbar';
  const viewport = document.createElement('div');
  viewport.className = 'contribution-pdf-viewport';
  viewport.tabIndex = 0;
  viewport.setAttribute('role', 'region');
  viewport.setAttribute('aria-label', `${title} - scroll vertically through the PDF`);
  let pdf, pages = [], zoom = 1, observer, revision = 0;
  const active = new Set();
  function button(text, label, action) {
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = text; b.disabled = true;
    b.setAttribute('aria-label', label); b.addEventListener('click', action);
    return b;
  }
  const smaller = button('−', 'Zoom out PDF', () => { zoom = Math.max(.75, zoom - .25); layout(); });
  const larger = button('+', 'Zoom in PDF', () => { zoom = Math.min(2, zoom + .25); layout(); });
  toolbar.append(status, smaller, larger);
  body.append(toolbar, viewport);
  async function paint(slot, current) {
    if (slot.canvas || current !== revision) return;
    const canvas = document.createElement('canvas');
    slot.canvas = canvas;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', `${title}, page ${slot.number} of ${pdf.numPages}`);
    const view = slot.page.getViewport({ scale: slot.width / slot.original.width });
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(view.width * ratio); canvas.height = Math.round(view.height * ratio);
    canvas.style.width = `${view.width}px`; canvas.style.height = `${view.height}px`;
    slot.element.append(canvas);
    const task = slot.page.render({ canvasContext: canvas.getContext('2d'), viewport: view, transform: [ratio, 0, 0, ratio, 0, 0] });
    slot.task = task; active.add(task);
    try { await task.promise; }
    catch (error) {
      if (error.name !== 'RenderingCancelledException' && current === revision) {
        slot.element.textContent = 'This page could not be displayed. Open the PDF below.';
      }
    } finally { active.delete(task); if (slot.task === task) slot.task = null; }
  }
  function layout() {
    if (!pdf || !pages.length) return;
    const fraction = viewport.scrollTop / Math.max(1, viewport.scrollHeight);
    const current = ++revision;
    observer?.disconnect();
    for (const task of active) task.cancel();
    active.clear(); viewport.replaceChildren();
    const width = Math.max(160, viewport.clientWidth - 24) * zoom;
    const slots = pages.map((page, i) => {
      const original = page.getViewport({ scale: 1 });
      const element = document.createElement('div');
      element.className = 'contribution-pdf-page';
      element.style.width = `${width}px`;
      element.style.height = `${width * original.height / original.width}px`;
      element.setAttribute('aria-label', `Page ${i + 1} of ${pdf.numPages}`);
      viewport.append(element);
      return { page, original, element, width, number: i + 1, canvas: null, task: null };
    });
    const byElement = new Map(slots.map(slot => [slot.element, slot]));
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const slot = byElement.get(entry.target);
        if (entry.isIntersecting) paint(slot, current);
        else if (slot.canvas) {
          slot.task?.cancel(); slot.task = null;
          slot.canvas.remove(); slot.canvas = null;
        }
      }
    }, { root: viewport, rootMargin: '500px 0px' });
    for (const slot of slots) observer.observe(slot.element);
    viewport.scrollTop = fraction * viewport.scrollHeight;
    status.textContent = `${pdf.numPages} pages · scroll to read`;
    smaller.disabled = zoom <= .75; larger.disabled = zoom >= 2;
  }
  try {
    const pdfjs = await loadEngine();
    pdf = await pdfjs.getDocument({
      url: link.href,
      cMapUrl: new URL('./pdfjs/cmaps/', import.meta.url).href, cMapPacked: true,
      standardFontDataUrl: new URL('./pdfjs/standard_fonts/', import.meta.url).href,
      wasmUrl: new URL('./pdfjs/wasm/', import.meta.url).href,
      isEvalSupported: false,
    }).promise;
    pages = await Promise.all(Array.from({ length: pdf.numPages }, (_, i) => pdf.getPage(i + 1)));
    layout();
    let timer, lastWidth = viewport.clientWidth;
    new ResizeObserver(() => {
      if (viewport.clientWidth === lastWidth || !body.closest('details').open) return;
      lastWidth = viewport.clientWidth;
      clearTimeout(timer); timer = setTimeout(layout, 150);
    }).observe(viewport);
  } catch {
    status.textContent = 'Preview unavailable. Open the PDF below.';
  }
}

const article = document.querySelector('.markdown-content');
if (article) {
  let enabled = false, title = '';
  for (const node of [...article.children]) {
    if (node.tagName === 'H2') enabled = ['human-practices', 'education'].includes(node.id);
    if (!enabled) continue;
    if (node.tagName === 'H3') title = node.textContent.trim();
    const links = node.matches('a[href]') ? [node] : [...node.querySelectorAll('a[href]')];
    for (const link of links) {
      if (!/\.pdf$/i.test(new URL(link.href).pathname) || link.closest('.contribution-pdf-resource')) continue;
      const label = title || link.textContent.trim();
      const paragraph = link.closest('p');
      const host = paragraph && paragraph.children.length === 1 ? paragraph : link;
      const resource = document.createElement('div'); resource.className = 'contribution-pdf-resource';
      const details = document.createElement('details'); details.className = 'contribution-pdf';
      const summary = document.createElement('summary'); summary.textContent = 'Preview PDF';
      const body = document.createElement('div'); body.className = 'contribution-pdf-reader';
      details.append(summary, body);
      details.addEventListener('toggle', () => {
        if (details.open && !body.childElementCount) reader(body, link, label);
      });
      const download = document.createElement('div'); download.className = 'contribution-pdf-download';
      host.before(resource); resource.append(details, download); download.append(link);
      if (host !== link) host.remove();
    }
  }
}
