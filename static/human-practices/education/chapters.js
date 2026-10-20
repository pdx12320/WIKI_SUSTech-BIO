// Open preserved records before landing on a historical or directory anchor.
(() => {
  const article = document.querySelector('.education-manuscript');
  if (!article) return;
  function reveal(hash) {
    if (!hash || hash === '#') return;
    let target;
    try { target = document.getElementById(decodeURIComponent(hash.slice(1))); }
    catch { return; }
    if (!target || !article.contains(target)) return;
    let node = target.parentElement;
    while (node && node !== article) {
      if (node.tagName === 'DETAILS') node.open = true;
      node = node.parentElement;
    }
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const url = new URL(link.href, location.href);
    if (url.origin === location.origin && url.pathname === location.pathname) reveal(url.hash);
  }, true);
  addEventListener('hashchange', () => reveal(location.hash));
  reveal(location.hash);
})();

// Keep the original, version-labelled downloads visible beside enhanced readers.
(() => {
  const article = document.querySelector('.education-manuscript');
  if (!article) return;
  const labels = new Map([...article.querySelectorAll('a[href]')]
    .filter(link => /\.pdf(?:[?#]|$)/i.test(link.href) && !link.querySelector('img,svg'))
    .map(link => [link, link.textContent]));
  function keepDownloads() {
    for (const [link, label] of labels) {
      const source = link.closest('.hp-pdf-source');
      if (source?.hidden) source.hidden = false;
      if (link.textContent !== label) link.textContent = label;
    }
  }
  new MutationObserver(keepDownloads).observe(article, {
    subtree: true, childList: true, attributes: true, attributeFilter: ['hidden']
  });
  keepDownloads();
})();
