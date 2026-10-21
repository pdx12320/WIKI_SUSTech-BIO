import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const source = readFileSync(new URL('../static/entry-loading/page-warmup.js', import.meta.url), 'utf8');
const element = attrs => ({ getAttribute: name => attrs[name] || null });
const flush = () => new Promise(setImmediate);
function harness(connection = {}, prefix = '/', covered = false) {
  const requests = [], links = [], events = new Map(), idle = [];
  let coverChanged, disconnected = 0;
  const page = {
    querySelector: selector => selector.includes('data-team-opening') ? {
      querySelectorAll: () => [element({ 'data-image': 'https://static.igem.wiki/opening.webp' }), element({ src: '/assets/second.webp' })],
    } : null,
    querySelectorAll: selector => ({
      'link[rel~="stylesheet"][href]': [element({ href: '/static/shared.css' }), element({ href: '/static/opening.css' }), element({ href: 'https://unrelated.test/x.css' })],
      'script[src]': [element({ src: '/static/opening.js' }), element({ src: '/static/data.json', type: 'application/json' })],
      'link[rel="preload"][as="font"][href]': [element({ href: '/static/font.woff2' })],
    }[selector] || []),
  };
  const sandbox = { URL, AbortController, setTimeout, clearTimeout, navigator: { connection },
    location: { href: `https://wiki.test${prefix}`, origin: 'https://wiki.test', pathname: prefix },
    window: { __orcaWhiteHole: { home: `https://wiki.test${prefix}` } },
    requestIdleCallback: fn => { idle.push(fn); return idle.length; }, cancelIdleCallback() {},
    addEventListener: (type, fn) => events.set(type, fn), removeEventListener: type => events.delete(type),
    MutationObserver: class { constructor(fn) { coverChanged = fn; } observe() {} disconnect() { disconnected++; } },
    document: { documentElement: { hasAttribute: () => covered }, querySelectorAll: selector => selector === 'link[href], script[src], img[src]' ? [{ href: 'https://wiki.test/static/shared.css' }] : selector === '[data-rna-nav]' ? [{ querySelector: () => ({ href: `https://wiki.test${prefix}team` }) }] : [],
      addEventListener: (type, fn) => events.set(type, fn), removeEventListener: type => events.delete(type),
      createElement(tag) { assert.equal(tag, 'link', 'Never create an executable script, image or hidden document'); return { remove() { this.removed = true; } }; },
      head: { append: link => links.push(link) } },
    DOMParser: class { parseFromString() { return page; } },
    fetch(url, options) { return new Promise((resolve, reject) => {
      const request = { url, options, complete() { resolve({ ok: true, url, headers: { get: () => 'text/html' }, text: async () => '<inert markup>' }); } };
      options.signal.addEventListener('abort', () => reject(Error('Aborted')), { once: true }); requests.push(request);
    }); },
  };
  sandbox.window.requestIdleCallback = sandbox.requestIdleCallback;
  sandbox.window.cancelIdleCallback = sandbox.cancelIdleCallback;
  runInNewContext(source, sandbox);
  return { api: sandbox.window.ORCAOpeningWarmup, requests, links, events, idle, reveal() { covered = false; coverChanged?.(); }, get disconnected() { return disconnected; } };
}
const cover = harness({}, '/', true);
cover.idle[0](); assert.equal(cover.requests.length, 0, 'Speculative HTML parsing waits while the entry cover is visible');
cover.reveal(); cover.idle[1](); assert.equal(cover.requests.length, 1, 'Speculation resumes after reveal');
assert.ok(cover.disconnected > 0); cover.api.stop();
const site = harness();
const one = site.api.warm('/team'), two = site.api.warm('/description'), three = site.api.warm('/model');
assert.equal(site.requests.length, 2, 'At most two page requests run together');
assert.equal(site.requests[0].options.priority, 'low');
assert.equal(await site.api.warm('https://unrelated.test/team'), false);
assert.equal(await site.api.warm('/assets/a.png'), false);
site.requests[0].complete(); await one; await flush();
assert.equal(site.requests.length, 3, 'Next page starts only when a request slot is free');
assert.equal(site.links.length, 5, 'Opening CSS, executable JS, font and two opening images warm; shared/external/data resources do not');
assert.ok(site.links.every(link => link.rel === 'prefetch'));
assert.ok(site.links.some(link => link.href === 'https://static.igem.wiki/opening.webp'), 'Authored opening data-image is discovered before animation runs');
await site.api.warm('/team', true);
assert.equal(site.requests.length, 3, 'Repeated navigation intent reuses the fetched page');
assert.ok(site.links.every(link => link.rel === 'preload'), 'Intent promotes existing links without duplicates');
site.requests[1].complete(); site.requests[2].complete(); await Promise.all([two, three]);
assert.equal(site.links.length, 5, 'Shared opening assets deduplicate across pages');
const pending = site.api.warm('/engineering');
site.events.get('pagehide')(); assert.equal(await pending, false);
assert.ok(site.links.every(link => link.removed));
site.events.get('pageshow')({ persisted: true });
assert.ok(site.events.has('focusin'), 'Restored Home keeps keyboard intent warming');
site.api.stop();
for (const connection of [{ saveData: true }, { effectiveType: 'slow-2g' }, { effectiveType: '2g' }])
  assert.equal(harness(connection).api, undefined, 'Save-data/2G sessions make no speculative requests');
const frozen = harness({}, '/sustech/');
assert.equal(await frozen.api.warm('/team'), false);
const hosted = frozen.api.warm('/sustech/team'); frozen.requests[0].complete(); assert.equal(await hosted, true); frozen.api.stop();
console.log('Passed opening resource discovery, inert loading, concurrency, dedup/promotion, origin/hosting guards, cleanup, restored navigation and constrained networks.');
