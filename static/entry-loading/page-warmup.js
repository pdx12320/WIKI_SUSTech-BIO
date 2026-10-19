// Download likely opening resources while Home is visible. Never mount another
// page, execute its scripts, initialize its GPU scene, or start its animation.
(() => {
  'use strict';
  const connection = navigator.connection;
  if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || '')) return;
  const base = new URL(window.__orcaWhiteHole?.home || './', location.href);
  const prefix = base.pathname.replace(/\/$/, '') + '/';
  const pages = new Map(), assets = new Map(), queue = [], controllers = new Set();
  let active = 0, stopped = false, intentTimer, idleTask;
  const existing = new Set(Array.from(document.querySelectorAll('link[href], script[src], img[src]'), el => el.href || el.src));
  const route = value => {
    let url; try { url = new URL(value, location.href); } catch { return null; }
    if (url.origin !== location.origin || !['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
    const relative = url.pathname.slice(prefix.length).replace(/\/$/, '');
    if (!url.pathname.startsWith(prefix) || !/^[a-z0-9-]+$/i.test(relative) || /^(next|404)/.test(relative) ||
        url.pathname.replace(/\/$/, '') === location.pathname.replace(/\/$/, '')) return null;
    url.hash = ''; url.search = ''; return url;
  };
  function resource(value, as, page, urgent, module = false) {
    if (!value || stopped) return;
    let url; try { url = new URL(value, page.url); } catch { return; }
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password ||
        (url.origin !== location.origin && url.hostname !== 'static.igem.wiki') || existing.has(url.href)) return;
    const key = `${as}:${url.href}`;
    let link = assets.get(key);
    if (!link) {
      if (assets.size >= (urgent ? 96 : 48)) return;
      link = document.createElement('link'); link.href = url.href; link.as = as;
      // Prefetch is low priority. On actual navigation intent, promote these
      // same links to preload rather than creating a second download stream.
      link._orcaModule = module;
      link.rel = urgent ? module ? 'modulepreload' : 'preload' : 'prefetch'; link.fetchPriority = 'low';
      if (as === 'font' || module) link.crossOrigin = 'anonymous';
      assets.set(key, link); document.head.append(link);
    } else if (urgent) link.rel = link._orcaModule ? 'modulepreload' : 'preload';
    page.links.add(link);
  }
  function opening(html, page) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const pageBase = doc.querySelector('base[href]')?.getAttribute('href');
    if (pageBase) {
      const resolved = new URL(pageBase, page.url);
      if (resolved.origin === page.url.origin) page.url = resolved;
    }
    for (const style of Array.from(doc.querySelectorAll('link[rel~="stylesheet"][href]')).slice(0, 20))
      resource(style.getAttribute('href'), 'style', page, page.urgent);
    for (const script of Array.from(doc.querySelectorAll('script[src]')).slice(0, 24)) {
      const type = (script.getAttribute('type') || '').toLowerCase();
      if (!type || ['module', 'text/javascript', 'application/javascript'].includes(type))
        resource(script.getAttribute('src'), 'script', page, page.urgent, type === 'module');
    }
    for (const font of Array.from(doc.querySelectorAll('link[rel="preload"][as="font"][href]')).slice(0, 2))
      resource(font.getAttribute('href'), 'font', page, page.urgent);
    const own = doc.querySelector('[data-team-opening], [data-design-opening], [data-wh-own-opening]');
    const images = own ? own.querySelectorAll('img[src], img[data-image], image[href]') : doc.querySelectorAll('main img[src]');
    for (const image of Array.from(images).slice(0, 2))
      resource(image.getAttribute('src') || image.getAttribute('data-image') || image.getAttribute('href'), 'image', page, page.urgent);
  }
  async function pump() {
    if (stopped || active >= 2 || !queue.length) return;
    const page = queue.shift(); active++;
    const controller = new AbortController(); controllers.add(controller);
    const timeout = setTimeout(() => controller.abort(), 6000);
    try {
      const response = await fetch(page.url.href, { signal: controller.signal, credentials: 'same-origin', priority: 'low', headers: { Accept: 'text/html' } });
      if (!response.ok || new URL(response.url).origin !== location.origin || !response.headers.get('content-type')?.includes('text/html')) throw Error('Unavailable');
      const html = await response.text();
      if (stopped) throw Error('Stopped');
      opening(html, page); page.resolve(true);
    } catch { if (pages.get(page.key) === page) pages.delete(page.key); page.resolve(false); }
    finally { clearTimeout(timeout); controllers.delete(controller); active--; void pump(); }
  }
  function warm(value, urgent = false) {
    const url = route(value);
    if (!url || stopped) return Promise.resolve(false);
    let page = pages.get(url.href);
    if (page) {
      if (urgent) {
        page.urgent = true; page.links.forEach(link => { link.rel = link._orcaModule ? 'modulepreload' : 'preload'; });
        const index = queue.indexOf(page);
        if (index > 0) { queue.splice(index, 1); queue.unshift(page); }
      }
      return page.promise;
    }
    page = { key: url.href, url, urgent, links: new Set() };
    page.promise = new Promise(resolve => { page.resolve = resolve; });
    pages.set(page.key, page); urgent ? queue.unshift(page) : queue.push(page);
    void pump(); return page.promise;
  }
  function intent(event) {
    const link = event.target.closest?.('a[href]') || event.target.closest?.('[data-rna-nav]')?.querySelector('a[href]');
    if (!link || link.hasAttribute('download') || link.target === '_blank' || link.closest('[data-wh-exclude]')) return;
    clearTimeout(intentTimer);
    intentTimer = setTimeout(() => { void warm(link.href, true); }, event.type === 'pointerover' ? 90 : 0);
  }
  function stop() {
    stopped = true; clearTimeout(intentTimer);
    if ('cancelIdleCallback' in window) cancelIdleCallback(idleTask); else clearTimeout(idleTask);
    controllers.forEach(controller => controller.abort());
    queue.splice(0).forEach(page => page.resolve(false));
    assets.forEach(link => link.remove());
    for (const type of ['pointerover', 'focusin', 'pointerdown']) document.removeEventListener(type, intent);
    removeEventListener('pagehide', stop);
  }
  const initial = () => {
    if (stopped) return;
    // The first destination in each real navigation group covers the main
    // chapters without fetching the entire website during the first second.
    for (const group of Array.from(document.querySelectorAll('[data-rna-nav]')).slice(0, 5)) {
      const link = group.querySelector('a[href]'); if (link) void warm(link.href);
    }
  };
  function start() {
    stopped = false;
    for (const type of ['pointerover', 'focusin', 'pointerdown']) document.addEventListener(type, intent, { passive: true });
    addEventListener('pagehide', stop, { once: true });
    idleTask = 'requestIdleCallback' in window ? requestIdleCallback(initial, { timeout: 1500 }) : setTimeout(initial, 450);
  }
  addEventListener('pageshow', event => {
    if (event.persisted && stopped) { pages.clear(); assets.clear(); start(); }
  });
  start();
  window.ORCAOpeningWarmup = { warm, stop };
})();
