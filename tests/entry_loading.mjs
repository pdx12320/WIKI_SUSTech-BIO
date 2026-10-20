import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const boot = fs.readFileSync(new URL('../static/entry-loading/boot.js', import.meta.url), 'utf8');
const animation = fs.readFileSync(new URL('../static/entry-loading/entry-loading.js', import.meta.url), 'utf8');
function run(options = {}) {
  let now = 0, next = 0, ready = false, removed = false, draws = 0, textDraws = 0, atlasDraws = 0, observer;
  const timers = new Map(), frames = new Map(), events = new Map(), layerEvents = new Map(), documentEvents = new Map();
  const assigned = [], workers = [];
  const storage = options.storage || new Map(options.seen ? [['orca.entry-seen.v1', '1']] : []);
  const root = { dataset: {}, hasAttribute: name => name === 'data-wh-cover' ? !!options.cover : 'entryLoading' in root.dataset,
    removeAttribute() { delete root.dataset.entryLoading; } };
  const positions = [], eyes = [], mask = [];
  const ctx = { setTransform() {}, clearRect() { positions.length = 0; eyes.length = 0; mask.length = 0; }, save() {}, restore() {},
    beginPath() {}, moveTo(x, y) { mask.push([x, y]); }, lineTo(x, y) { mask.push([x, y]); }, closePath() {}, clip() {}, ellipse(...args) { eyes.push(args); }, fill() {},
    fillText(text, x, y) { draws++; textDraws++; positions.push([x, y]); },
    drawImage(atlas, sx, sy, sw, sh, x, y, width, height) { draws++; positions.push([x + width / 2, y + height / 2]); } };
  const replacement = { getContext: () => ctx };
  const canvas = { getContext: () => options.noCanvas ? null : ctx, cloneNode: () => replacement, replaceWith() {} };
  if (options.worker) canvas.transferControlToOffscreen = () => ({ offscreen: true });
  const layer = { dataset: {}, querySelector: () => canvas, remove() { removed = true; }, addEventListener(name, fn) { layerEvents.set(name, fn); }, removeEventListener(name) { layerEvents.delete(name); }, append() {} };
  const motion = { matches: !!options.reduced, addEventListener() {}, removeEventListener() {} };
  const env = {
    document: { documentElement: root, readyState: options.content ? 'loading' : 'complete',
      currentScript: { src: options.worker ? 'https://wiki.test/static/entry-loading/entry-loading.js' : undefined, dataset: { home: options.home || '/' } },
      addEventListener: (name, fn) => documentEvents.set(name, fn), removeEventListener: name => documentEvents.delete(name),
      querySelector: selector => selector === '[data-entry-loader]' ? layer : selector === '[data-ot]' ? (options.content ? null : {}) : ready ? {} : null,
      createElement: tag => tag === 'canvas' ? { getContext: () => options.noAtlas ? null : { fillText() { atlasDraws++; } } } : ({}) },
    location: { href: `https://wiki.test${options.path || '/'}`, origin: 'https://wiki.test',
      assign: url => assigned.push(url), search: options.preview ? '?loading=preview' : '' }, URL, URLSearchParams, Math,
    performance: { now: () => now, getEntriesByType: () => [{ type: options.history ? 'back_forward' : options.reload ? 'reload' : 'navigate' }] },
    sessionStorage: { getItem(key) { if (options.blocked) throw Error('denied'); return storage.get(key); },
      setItem(key, value) { if (options.blocked) throw Error('denied'); storage.set(key, value); },
      removeItem(key) { if (options.blocked) throw Error('denied'); storage.delete(key); } },
    matchMedia: () => motion, innerWidth: options.width || 1063, innerHeight: options.height || 756, devicePixelRatio: 2,
    setTimeout(fn, delay) { const id = ++next; timers.set(id, { fn, at: now + delay }); return id; },
    clearTimeout: id => timers.delete(id),
    requestAnimationFrame(fn) { const id = ++next; frames.set(id, fn); return id; },
    cancelAnimationFrame: id => frames.delete(id),
    addEventListener: (name, fn) => events.set(name, fn), removeEventListener: name => events.delete(name),
    MutationObserver: class { constructor(fn) { observer = fn; } observe() {} disconnect() {} },
  };
  if (options.worker) env.Worker = class {
    constructor(url) { this.url = url; this.messages = []; workers.push(this); }
    postMessage(message) { this.messages.push(message); }
    terminate() { this.terminated = true; }
  };
  env.window = env;
  vm.createContext(env); vm.runInContext(boot, env); vm.runInContext(animation, env);
  function advance(ms) {
    const end = now + ms;
    for (;;) {
      const due = [...timers].filter(([, t]) => t.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
      if (!due) break;
      now = due[1].at; timers.delete(due[0]); due[1].fn();
    }
    now = end;
  }
  return { root, layer, storage, frames, events, layerEvents, documentEvents, assigned, workers, advance, positions, eyes, mask, get removed() { return removed; }, get draws() { return draws; }, get textDraws() { return textDraws; }, get atlasDraws() { return atlasDraws; },
    renderAt(ms) { now = ms; const pending = [...frames.values()]; frames.clear(); pending.forEach(fn => fn(now)); },
    ready() { ready = true; env.document.readyState = 'complete'; observer?.(); documentEvents.get('DOMContentLoaded')?.(); } };
}
const threaded = run({ preview: true, worker: true });
assert.equal(threaded.layer.dataset.renderer, 'worker');
assert.equal(threaded.workers[0].messages[0].type, 'init');
assert.equal(threaded.frames.size, 0, 'Worker mode does not queue rendering on the busy page main thread');
threaded.workers[0].onmessage({ data: { type: 'ready' } });
threaded.layerEvents.get('pointermove')({ clientX: 400, clientY: 420, pointerType: 'mouse' });
assert.equal(threaded.workers[0].messages.at(-1).type, 'pointer');
threaded.events.get('pagehide')(); assert.ok(threaded.workers[0].terminated);
const workerFailure = run({ preview: true, worker: true });
workerFailure.workers[0].onerror();
assert.equal(workerFailure.layer.dataset.renderer, 'main', 'Failed worker replaces the transferred canvas and falls back');
assert.ok(workerFailure.draws > 500);
const workerTimeout = run({ preview: true, worker: true }); workerTimeout.advance(1000);
assert.equal(workerTimeout.layer.dataset.renderer, 'main', 'Unresponsive worker never traps an empty cover');
const first = run();
assert.ok(first.draws > 500, 'Letters already fill the logo on the first frame');
assert.equal(first.atlasDraws, 28, 'Seven glyphs in four inks are rasterized only once');
assert.equal(first.textDraws, 0, 'Normal animation copies cached sprites instead of laying out text');
const fallbackAtlas = run({ noAtlas: true });
assert.ok(fallbackAtlas.textDraws > 500, 'Missing atlas context still uses the working text renderer');
const initialMask = first.mask.map(p => [...p]);
const initialPositions = first.positions.map(p => [...p]);
first.renderAt(400);
assert.deepEqual(first.mask, initialMask, 'The full logo silhouette stays fixed while letters move');
const center = [1063 / 2, 756 / 2 - 18];
const angle = .4 * .85, c = Math.cos(angle), sn = Math.sin(angle);
const nearCenter = initialPositions.filter(([x, y]) => Math.hypot(x - center[0], y - center[1]) < 60).slice(0, 12);
assert.ok(nearCenter.length > 5);
for (const [x, y] of nearCenter) {
  const dx = x - center[0], dy = y - center[1];
  const target = [center[0] + dx * c - dy * sn, center[1] + dx * sn + dy * c];
  assert.ok(first.positions.some(p => Math.hypot(p[0] - target[0], p[1] - target[1]) < 1e-7),
    'Letters rotate clockwise inside the stationary mask');
}
first.renderAt(8000);
assert.deepEqual(first.mask, initialMask, 'There is no swimming, tail beat, scale change or pose reset');
assert.equal(first.layer.dataset.stage, 'loading');
assert.equal(first.atlasDraws, 28, 'Subsequent frames do not rebuild the letter atlas');
assert.equal(first.textDraws, 0);
assert.ok(first.positions.every(([x, y]) => Number.isFinite(x) && Number.isFinite(y)));
// Compare identical timelines with and without a pointer: only nearby glyphs yield.
const idle = run({ preview: true }), hover = run({ preview: true });
const cursor = { clientX: 420, clientY: 450, pointerType: 'mouse' };
hover.layerEvents.get('pointermove')(cursor);
for (let t = 16; t <= 320; t += 16) { idle.renderAt(t); hover.renderAt(t); }
let nearMoved = 0;
idle.positions.forEach(([x, y], i) => {
  const p = hover.positions[i];
  const distance = Math.hypot(x - cursor.clientX, y - cursor.clientY);
  if (distance < 30 && Math.hypot(x - p[0], y - p[1]) > 8) nearMoved++;
  if (distance > 130) assert.ok(Math.hypot(x - p[0], y - p[1]) < 1, 'Distant glyphs stay on their orbits');
});
assert.ok(nearMoved > 5, 'Hover repels nearby letters visibly');
assert.deepEqual(hover.mask, idle.mask, 'Hover does not deform or move the whale silhouette');
hover.layerEvents.get('pointerleave')();
for (let t = 336; t <= 2400; t += 16) { idle.renderAt(t); hover.renderAt(t); }
assert.ok(idle.positions.every(([x, y], i) => Math.hypot(x - hover.positions[i][0], y - hover.positions[i][1]) < .01),
  'Letters smoothly return to the same rotating field after pointer exit');
hover.events.get('pagehide')(); assert.equal(hover.layerEvents.has('pointermove'), false);
// A ready scene should reveal Home after the original one-second loading beat.
const readyEntry = run(); readyEntry.renderAt(250); readyEntry.ready(); readyEntry.advance(0);
assert.equal(readyEntry.root.dataset.entryLoading, 'active');
readyEntry.advance(750);
assert.equal(readyEntry.root.dataset.entryLoading, 'leaving');
readyEntry.advance(260); assert.ok(readyEntry.removed); assert.equal(readyEntry.frames.size, 0);
assert.equal(readyEntry.storage.get('orca.entry-seen.v1'), '1');
for (const [width, height] of [[320, 568], [390, 844], [844, 390]]) {
  const mobile = run({ preview: true, width, height });
  assert.ok(mobile.mask.every(([x, y]) => x > 10 && x < width - 10 && y > 10 && y < height - 10),
    'The complete fixed logo fits phone portrait and landscape viewports');
  const mask = mobile.mask.map(p => [...p]); mobile.renderAt(7000);
  assert.deepEqual(mobile.mask, mask);
}
const content = run({ content: true, path: '/description' });
content.renderAt(200); content.ready(); content.advance(800);
assert.equal(content.root.dataset.entryLoading, 'leaving', 'First entry through a content URL gets the same one-second loader');
const homeClick = run({ seen: true, content: true, path: '/description' });
const click = (app, href, extras = {}) => {
  const link = { target: '', rel: '', hasAttribute: () => false, getAttribute: () => href };
  const event = { button: 0, defaultPrevented: false, target: { closest: () => link },
    preventDefault() { this.defaultPrevented = true; }, ...extras };
  app.documentEvents.get('click')(event); return event;
};
assert.ok(click(homeClick, '/').defaultPrevented, 'Light-to-dark Home navigation records an arrival cover');
assert.equal(homeClick.assigned[0], 'https://wiki.test/');
const returnedHome = run({ storage: homeClick.storage });
assert.equal(returnedHome.root.dataset.entryLoading, 'active', 'Clicking Home replays the entry loader after a previous visit');
assert.equal(returnedHome.storage.has('orca.entry-route.v1'), false, 'Route intent is consumed once');
const genericClick = run({ seen: true });
assert.ok(click(genericClick, '/description').defaultPrevented, 'Dark-to-light navigation uses the same whale cover');
const arrivedContent = run({ storage: genericClick.storage, content: true, path: '/description' });
assert.equal(arrivedContent.root.dataset.entryLoading, 'active');
assert.equal(arrivedContent.storage.has('orca.entry-route.v1'), false);
// Exercise every registered public content route, including the real Home/Team pair.
const registeredPages = [...fs.readFileSync(new URL('../wiki_content.py', import.meta.url), 'utf8').matchAll(/"([a-z0-9-]+)": PageConfig\(/g)].map(match => '/' + match[1]);
assert.ok(registeredPages.includes('/team'));
for (const route of registeredPages) {
  const departure = run({ seen: true });
  assert.ok(click(departure, route).defaultPrevented, `Home → ${route} uses whale intent`);
  assert.equal(departure.assigned[0], `https://wiki.test${route}`);
  const arrival = run({ storage: departure.storage, content: true, path: route });
  assert.equal(arrival.root.dataset.entryLoading, 'active', `${route} reveals the whale after Home`);
  assert.ok(arrival.draws > 500);
  const back = run({ seen: true, content: true, path: route });
  assert.ok(click(back, '/').defaultPrevented, `${route} → Home uses whale intent`);
  assert.equal(run({ storage: back.storage }).root.dataset.entryLoading, 'active');
  for (const target of registeredPages) {
    const light = run({ seen: true, content: true, path: route });
    assert.equal(click(light, target).defaultPrevented, false, `${route} → ${target} stays native`);
    assert.equal(light.storage.has('orca.entry-route.v1'), false);
  }
}
const lightClick = run({ seen: true, content: true, path: '/team' });
assert.equal(click(lightClick, '/description').defaultPrevented, false, 'Light-to-light navigation stays native');
assert.equal(lightClick.storage.has('orca.entry-route.v1'), false);
assert.ok(run({ seen: true, content: true, path: '/description' }).removed, 'Repeat light pages do not replay');
assert.equal(click(genericClick, '/next').defaultPrevented, false, 'Review routes stay isolated');
assert.equal(click(genericClick, '/404.html').defaultPrevented, false);
assert.equal(click(genericClick, '/static/example.html').defaultPrevented, false);
assert.ok(click(homeClick, '/#chapter').defaultPrevented, 'Cross-page Home anchors retain their hash and use a cover');
assert.equal(homeClick.assigned.at(-1), 'https://wiki.test/#chapter');
const expired = new Map([['orca.entry-seen.v1', '1'], ['orca.entry-route.v1', JSON.stringify({ to: '/', at: Date.now() - 20000 })]]);
assert.ok(run({ storage: expired }).removed, 'Expired intents do not replay');
const reload = new Map([['orca.entry-seen.v1', '1'], ['orca.entry-route.v1', JSON.stringify({ to: '/', at: Date.now() })]]);
assert.ok(run({ storage: reload, reload: true }).removed, 'Reload does not replay a pending route intent');
assert.equal(click(run({ seen: true, reduced: true }), '/description').defaultPrevented, false);
assert.equal(click(genericClick, '/#chapter').defaultPrevented, false, 'Home section anchors stay native');
assert.equal(click(genericClick, '/', { ctrlKey: true }).defaultPrevented, false);
assert.equal(click(genericClick, 'https://other.test/').defaultPrevented, false);
const frozenClick = run({ seen: true, content: true, path: '/sustech/team', home: '/sustech/' });
assert.ok(click(frozenClick, '/sustech/index.html').defaultPrevented);
assert.equal(run({ storage: frozenClick.storage, path: '/sustech/', home: '/sustech/' }).root.dataset.entryLoading, 'active');
assert.ok(run({ seen: true }).removed, 'Returning Home does not replay the loader');
assert.ok(run({ cover: true }).draws > 500, 'Stale legacy white-hole state cannot suppress the new loader');
assert.ok(run({ reduced: true }).removed); assert.ok(run({ history: true }).removed);
assert.ok(run({ noCanvas: true }).removed, 'Missing Canvas never traps the visitor');
const failed = run({ blocked: true }); failed.advance(3500);
assert.ok(failed.removed, 'Failed Home boot and blocked storage still reveal the site');
const restored = run(); restored.events.get('pagehide')();
assert.ok(restored.removed); assert.equal(restored.frames.size, 0);
const preview = run({ preview: true, seen: true }); preview.ready(); preview.advance(5000);
assert.equal(preview.root.dataset.entryLoading, 'preview');
preview.events.get('keydown')({ key: 'Escape' }); preview.advance(260); assert.ok(preview.removed);
console.log('Passed fixed logo, clockwise letter flow, phone bounds, one-second readiness, session/bypass, recovery and cleanup.');
