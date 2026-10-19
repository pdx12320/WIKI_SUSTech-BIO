import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../static/team-puzzle-collage.js', import.meta.url), 'utf8');
function setup(grouped = false) {
  const timers = new Map();
  const node = (attrs = {}) => ({
    attrs: { ...attrs }, children: [], parentNode: null,
    setAttribute(key, value) { this.attrs[key] = value; },
    cloneNode() { return node(this.attrs); },
    appendChild(child) {
      if (child.parentNode) child.parentNode.children.splice(child.parentNode.children.indexOf(child), 1);
      this.children.push(child); child.parentNode = this;
    },
  });
  const directions = ['nw', 'ne', 'sw', 'se'];
  const groups = directions.map(direction => Object.assign(node(), { dataset: { teamPuzzleGroup: direction } }));
  const shapes = directions.map(direction => node({ class: `team-opening__piece team-opening__piece--${direction}`, d: `path-${direction}` }));
  const labels = directions.map(() => node());
  const labelLayer = node(); labels.forEach(label => labelLayer.appendChild(label));
  const directionIndex = selector => directions.findIndex(direction => selector.endsWith(`--${direction}`));
  const puzzle = { querySelector: selector => shapes[directionIndex(selector)] };
  const photos = Array.from({ length: 8 }, () => {
    const events = new Map();
    let decode;
    return {
      complete: false, naturalWidth: 0, style: {}, src: 'https://static.igem.wiki/test.avif',
      addEventListener: (type, fn) => events.set(type, fn),
      removeEventListener: type => events.delete(type),
      decode: () => new Promise(resolve => { decode = resolve; }),
      load() { this.complete = true; this.naturalWidth = 1500; events.get('load')?.(); },
      error() { this.complete = true; events.get('error')?.(); },
      decoded: () => decode?.(),
      get listenerCount() { return events.size; },
    };
  });
  const retry = { hidden: true, addEventListener(type, callback) { this.click = callback; } };
  const status = { textContent: '' };
  const opening = {
    dataset: { teamImages: 'pending' },
    querySelector(selector) {
      if (selector === '.team-opening__puzzle') return grouped ? puzzle : null;
      if (selector.includes('.team-opening__puzzle-labels >')) return labels[directionIndex(selector)];
      return selector === '[data-team-puzzle-retry]' ? retry : selector === '[data-team-puzzle-loading-status]' ? status : null;
    },
  };
  const root = {
    dataset: { teamPuzzleMode: 'composites', teamPuzzleReady: 'pending' },
    querySelectorAll: selector => selector === '[data-team-puzzle-group]' ? groups : photos,
    closest: () => opening,
  };
  vm.runInNewContext(source, {
    document: { querySelector: () => root, baseURI: 'http://localhost/team', createElementNS: () => node() }, URL,
    setTimeout(fn) { timers.set(1, fn); return 1; },
    clearTimeout: id => timers.delete(id),
    fetch() { assert.fail('The four-image opening must not fetch the 40-photo layout JSON.'); },
  });
  return { root, opening, retry, status, photos, groups, shapes, labels, labelLayer, timers, expire() { timers.get(1)?.(); } };
}
const mounted = setup(true);
assert.equal(mounted.opening.dataset.teamPuzzleRenderer, 'grouped');
mounted.groups.forEach((group, index) => {
  const outline = group.children.find(child => child.attrs.class === 'team-opening__collage-outline');
  assert.ok(outline, 'Each moving photo parent must carry its own outline.');
  assert.equal(outline.children[0].attrs.d, mounted.shapes[index].attrs.d, 'Use exactly the same geometry as the photo mask.');
  assert.equal(outline.children[0].attrs.class, 'team-opening__collage-stroke', 'The nested outline must not inherit a second independent piece animation.');
  assert.equal(mounted.labels[index].parentNode, group, 'Lettering must share the photo/outline transform rather than run a separate animation.');
});
assert.equal(mounted.labelLayer.children.length, 0);
const ready = setup();
ready.photos.forEach(photo => photo.load());
assert.equal(ready.root.dataset.teamPuzzleReady, 'pending', 'Network load alone must not start the unfolding before decoding.');
ready.photos.slice(0, 7).forEach(photo => photo.decoded());
await Promise.resolve();
assert.equal(ready.root.dataset.teamPuzzleReady, 'pending', 'All four collages must be ready.');
assert.equal(ready.opening.dataset.teamImages, 'pending', 'Do not expose the borders while even one photo fragment is still decoding.');
ready.photos[7].decoded();
await Promise.resolve();
assert.equal(ready.root.dataset.teamPuzzleReady, 'ready');
assert.equal(ready.opening.dataset.teamImages, 'ready');
assert.equal(ready.timers.size, 0);
assert.ok(ready.photos.every(photo => photo.listenerCount === 0));

const broken = setup();
broken.photos[0].error();
broken.photos.slice(1).forEach(photo => { photo.load(); photo.decoded(); });
await Promise.resolve();
assert.equal(broken.root.dataset.teamPuzzleReady, 'error', 'An image failure must not reveal empty pieces.');
assert.equal(broken.opening.dataset.teamImages, 'error');
assert.equal(broken.retry.hidden, false, 'A failed photo can be retried without reloading the page.');
broken.retry.click();
assert.equal(broken.root.dataset.teamPuzzleReady, 'pending');
assert.match(broken.photos[0].src, /team_retry=1/);
broken.photos.forEach(photo => { photo.load(); photo.decoded(); });
await Promise.resolve();
assert.equal(broken.root.dataset.teamPuzzleReady, 'ready');
assert.equal(broken.retry.hidden, true);

const slow = setup();
slow.photos[0].load();
slow.photos[0].decoded();
await Promise.resolve();
slow.expire();
assert.equal(slow.root.dataset.teamPuzzleReady, 'error', 'A slow connection keeps the loading screen instead of starting an empty puzzle.');
assert.notEqual(slow.opening.dataset.teamImages, 'ready');
slow.photos.slice(1).forEach(photo => { photo.load(); photo.decoded(); });
await Promise.resolve();
assert.equal(slow.root.dataset.teamPuzzleReady, 'ready', 'Late images complete normally without forcing a retry.');
assert.ok(slow.photos.every(photo => photo.listenerCount === 0));
console.log('Puzzle imagery: all-eight atomic decode gate, no empty failure/timeout state, explicit retry, late completion and listener cleanup passed.');
