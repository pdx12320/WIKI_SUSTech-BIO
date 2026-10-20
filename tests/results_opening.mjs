import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source = fs.readFileSync(new URL('../static/results-opening.js', import.meta.url), 'utf8');

function environment({ reduced = false, hash = '', navigation = 'navigate' } = {}) {
  const listeners = new Map(), timers = new Map();
  const media = { matches: reduced, addEventListener: (_name, fn) => listeners.set('motion', fn) };
  const root = { dataset: {}, removeAttribute: () => { delete root.dataset.resultsArrival; }, hasAttribute: () => false };
  const opening = { querySelector: () => ({ decode: () => Promise.resolve() }) };
  const document = {
    documentElement: root, hidden: false, readyState: 'complete',
    fonts: { load: () => Promise.resolve() },
    querySelector: selector => selector === '.results-opening' ? opening : null,
    addEventListener: (name, fn) => listeners.set(name, fn),
  };
  let nextTimer = 0;
  const context = {
    document, matchMedia: () => media, performance: { getEntriesByType: () => [{ type: navigation }] },
    location: { hash }, scrollY: 0, window: {},
    setTimeout: (fn, delay) => { const id = ++nextTimer; timers.set(id, {fn, delay}); return id; },
    clearTimeout: id => timers.delete(id), cancelAnimationFrame: () => {},
    addEventListener: (name, fn) => listeners.set(name, fn),
    MutationObserver: class { observe() {} disconnect() {} },
  };
  vm.runInNewContext(source, context);
  return { root, document, listeners, timers, media };
}
for (const options of [{reduced: true}, {hash: '#platform-achievements'}, {navigation: 'back_forward'}]) {
  const env = environment(options);
  assert.equal(env.root.dataset.resultsArrival, undefined, 'Reading/accessible entry must remain static');
  assert.equal(env.timers.size, 0);
}
const active = environment();
assert.equal(active.root.dataset.resultsArrival, 'pending');
await new Promise(resolve => setImmediate(resolve));
assert.equal(active.root.dataset.resultsArrival, 'playing');
active.listeners.get('motion')({matches: true});
assert.equal(active.root.dataset.resultsArrival, undefined, 'Live reduced-motion change must settle');
assert.ok(![...active.timers.values()].some(t => t.delay === 4900), 'Animation cleanup timer must be cleared');
const leaving = environment();
await new Promise(resolve => setImmediate(resolve));
leaving.document.hidden = true;
leaving.listeners.get('visibilitychange')();
assert.equal(leaving.root.dataset.resultsArrival, undefined, 'Backgrounding must settle');
console.log('Results opening: reduced motion, deep links, history return and lifecycle cleanup passed.');
