/* Page previews preserve the supplied PDFs and work without a browser PDF plugin. */
(() => {
  const base = new URL('previews/', document.currentScript.src);
  const assetURL = file => {
    const url = new URL(file, base).href;
    return globalThis.wikiAssetURL?.(url) ?? url;
  };
  let manifest;
  const readManifest = () => {
    if (!manifest) {
      manifest = fetch(assetURL('manifest.json')).then(response => {
        if (!response.ok) throw new Error('Preview unavailable');
        return response.json();
      }).catch(error => { manifest = null; throw error; });
    }
    return manifest;
  };
  document.querySelectorAll('[data-contribution-document]').forEach((panel, panelIndex) => {
    let pending = false;
    const load = async () => {
      if (!panel.open || panel.querySelector('.contribution-pdf-pages') || pending) return;
      const source = panel.parentElement.querySelector('.contribution-pdf-link');
      const viewport = panel.querySelector('.contribution-pdf-viewport');
      if (!source || !viewport) return;
      pending = true;
      viewport.textContent = 'Loading document…';
      try {
        const data = await readManifest();
        // Upload services may rename the downloadable PDF; the manifest key stays stable.
        const name = panel.dataset.contributionFile;
        const pages = data[name]?.pages;
        if (!Array.isArray(pages) || !pages.length ||
            !pages.every(page => page.file && page.width > 0 && page.height > 0)) {
          throw new Error('Document unavailable');
        }
        const title = panel.dataset.contributionDocument;
        const status = document.createElement('p');
        status.className = 'contribution-pdf-status';
        status.setAttribute('aria-live', 'polite');
        status.hidden = true;
        const stack = document.createElement('div');
        stack.className = 'contribution-pdf-pages';
        pages.forEach((page, index) => {
          const wrap = document.createElement('div');
          wrap.className = 'contribution-pdf-page';
          const image = document.createElement('img');
          image.alt = `${title}, page ${index + 1} of ${pages.length}`;
          image.width = page.width;
          image.height = page.height;
          image.loading = 'lazy';
          image.decoding = 'async';
          image.src = assetURL(page.file);
          image.addEventListener('error', () => {
            status.hidden = false;
            status.textContent = 'A page preview is unavailable. Use Download to read the original PDF.';
          }, {once: true});
          wrap.append(image);
          stack.append(wrap);
        });
        viewport.id = `contribution-pdf-${panelIndex}`;
        viewport.tabIndex = 0;
        viewport.setAttribute('role', 'region');
        viewport.setAttribute('aria-label', `${title}. Scroll to read.`);
        viewport.replaceChildren(stack);
        const resize = document.createElement('div');
        resize.className = 'contribution-pdf-resize';
        resize.tabIndex = 0;
        resize.setAttribute('role', 'separator');
        resize.setAttribute('aria-orientation', 'horizontal');
        resize.setAttribute('aria-controls', viewport.id);
        resize.setAttribute('aria-label', `Resize ${title} reader. Drag or use the up and down arrow keys.`);
        resize.setAttribute('aria-valuemin', '240');
        resize.setAttribute('aria-valuemax', '900');
        function setHeight(height) {
          const value = Math.round(Math.max(240, Math.min(900, height)));
          viewport.style.height = `${value}px`;
          resize.setAttribute('aria-valuenow', String(value));
        }
        let drag;
        resize.addEventListener('pointerdown', event => {
          if (event.button !== 0) return;
          drag = {y: event.clientY, height: viewport.clientHeight};
          resize.setPointerCapture(event.pointerId);
          event.preventDefault();
        });
        resize.addEventListener('pointermove', event => {
          if (drag) setHeight(drag.height + event.clientY - drag.y);
        });
        for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) {
          resize.addEventListener(event, () => { drag = null; });
        }
        resize.addEventListener('keydown', event => {
          if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          setHeight(event.key === 'Home' ? 240 : event.key === 'End' ? 900 :
            viewport.clientHeight + (event.key === 'ArrowUp' ? -40 : 40));
        });
        viewport.after(resize, status);
        resize.setAttribute('aria-valuenow', String(viewport.clientHeight));
      } catch {
        viewport.textContent = 'Preview unavailable. Use Download to read the original PDF.';
      } finally {
        pending = false;
      }
    };
    panel.addEventListener('toggle', load);
    load();
  });
})();
