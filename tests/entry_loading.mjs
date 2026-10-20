import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const boot = fs.readFileSync(new URL('../static/entry-loading/boot.js', import.meta.url), 'utf8');
const animation = fs.readFileSync(new URL('../static/entry-loading/entry-loading.js', import.meta.url), 'utf8');
function run(options = {}) {
  let now = 0, next = 0, ready = false, removed = false, draws = 0, observer;
  const timers = new Map(), frames = new Map(), events = new Map(), layerEvents = new Map(), documentEvents = new Map();
  const assigned = [];
  const storage = options.storage || new Map(options.seen ? [['orca.entry-seen.v1', '1']] : []);
  const root = { dataset: {}, hasAttribute: name => name === 'data-wh-cover' ? !!options.cover : 'entryLoading' in root.dataset,
    removeAttribute() { delete root.dataset.entryLoading; } };
  const positions = [], eyes = [], mask = [];
  const ctx = { setTransform() {}, clearRect() { positions.length = 0; eyes.length = 0; mask.length = 0; }, save() {}, restore() {},
    beginPath() {}, moveTo(x, y) { mask.push([x, y]); }, lineTo(x, y) { mask.push([x, y]); }, closePath() {}, clip() {}, ellipse(...args) { eyes.push(args); }, fill() {},
    fillText(text, x, y) { draws++; positions.push([x, y]); } };
  const canvas = { getContext: () => options.noCanvas ? null : ctx };
  const layer = { dataset: {}, querySelector: () => canvas, remove() { removed = true; }, addEventListener(name, fn) { layerEvents.set(name, fn); }, removeEventListener(name) { layerEvents.delete(name); }, append() {} };
  const motion = { matches: !!options.reduced, addEventListener() {}, removeEventListener() {} };
  const env = {
    document: { documentElement: root, readyState: options.content ? 'loading' : 'complete',
      currentScript: { dataset: { home: options.home || '/' } },
      addEventListener: (name, fn) => documentEvents.set(name, fn), removeEventListener: name => documentEvents.delete(name),
      querySelector: selector => selector === '[data-entry-loader]' ? layer : selector === '[data-ot]' ? (options.content ? null : {}) : ready ? {} : null,
      createElement: () => ({}) },
    location: { href: `https://wiki.test${options.path || '/'}`, origin: 'https://wiki.test',
      assign: url => assigned.push(url), search: options.preview ? '?loading=preview' : '' }, URL, URLSearchParams, Math,
    performance: { now: () => now, getEntriesByType: () => [{ type: options.history ? 'back_forward' : 'navigate' }] },
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
  return { root, layer, storage, frames, events, layerEvents, documentEvents, assigned, advance, positions, eyes, mask, get removed() { return removed; }, get draws() { return draws; },
    renderAt(ms) { now = ms; const pending = [...frames.values()]; frames.clear(); pending.forEach(fn => fn(now)); },
    ready() { ready = true; env.document.readyState = 'complete'; observer?.(); documentEvents.get('DOMContentLoaded')?.(); } };
}
const first = run();
assert.ok(first.draws > 500, 'Letters already fill the logo on the first frame');
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
assert.ok(click(homeClick, '/').defaultPrevented, 'Explicit Home intent is captured before the white-hole handler');
assert.equal(homeClick.assigned[0], 'https://wiki.test/');
const returnedHome = run({ storage: homeClick.storage });
assert.equal(returnedHome.root.dataset.entryLoading, 'active', 'Clicking Home replays the entry loader after a previous visit');
assert.equal(returnedHome.storage.has('orca.entry-home.v1'), false, 'Home intent is consumed once');
const genericClick = run({ seen: true });
assert.equal(click(genericClick, '/description').defaultPrevented, true, 'Ordinary pages bypass the old tunnel and use the whale on arrival');
for (const path of ['/description', '/model', '/education', '/inclusivity', '/notebook']) {
  const arrival = run({ seen: true, content: true, path });
  assert.equal(arrival.root.dataset.entryLoading, 'active', `${path} replays the whale after the first visit`);
  arrival.ready(); arrival.advance(1260);
  assert.ok(arrival.removed, `${path} releases its cover when ready`);
}
for (const path of ['/team', '/design-communication', '/human-practices']) {
  assert.equal(click(genericClick, path).defaultPrevented, false, `${path} keeps its original navigation`);
  assert.ok(run({ content: true, path }).removed, `${path} keeps its own opening even on a first visit`);
}
for (const href of ['/next', '/next-journey', '/404.html', '/static/file.pdf', '/other/site']) {
  assert.equal(click(genericClick, href).defaultPrevented, false, `${href} is outside ordinary page navigation`);
}
const sectionClick = run({ seen: true, content: true, path: '/description' });
assert.equal(click(sectionClick, '/description#details').defaultPrevented, false, 'Same-page anchors stay native');
assert.equal(click(sectionClick, '/model#details').defaultPrevented, true, 'Cross-page anchors use the destination cover');
assert.equal(sectionClick.assigned.at(-1), 'https://wiki.test/model#details', 'Destination fragments are preserved');
assert.ok(run({ seen: true, content: true, path: '/model', history: true }).removed);
assert.ok(run({ seen: true, content: true, path: '/model', reduced: true }).removed);
const blockedContent = run({ seen: true, blocked: true, content: true, path: '/model' });
assert.equal(blockedContent.root.dataset.entryLoading, 'active', 'Content arrivals work without session storage');
blockedContent.advance(3500); assert.ok(blockedContent.removed, 'Failed content readiness cannot trap the visitor');
assert.equal(click(genericClick, '/#chapter').defaultPrevented, false, 'Home section anchors stay native');
assert.equal(click(genericClick, '/', { ctrlKey: true }).defaultPrevented, false);
assert.equal(click(genericClick, 'https://other.test/').defaultPrevented, false);
const frozenClick = run({ seen: true, content: true, path: '/sustech/team', home: '/sustech/' });
assert.ok(click(frozenClick, '/sustech/index.html').defaultPrevented);
assert.equal(run({ storage: frozenClick.storage, path: '/sustech/', home: '/sustech/' }).root.dataset.entryLoading, 'active');
assert.ok(click(frozenClick, '/sustech/model/index.html').defaultPrevented);
assert.equal(run({ seen: true, content: true, path: '/sustech/model/index.html', home: '/sustech/index.html' }).root.dataset.entryLoading, 'active');
assert.equal(click(frozenClick, '/sustech/team/index.html').defaultPrevented, false);
assert.ok(run({ content: true, path: '/sustech/team/index.html', home: '/sustech/index.html' }).removed);
assert.ok(run({ seen: true }).removed, 'Returning Home does not replay the loader');
assert.ok(run({ cover: true }).removed, 'A white-hole return does not add a second loader');
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
