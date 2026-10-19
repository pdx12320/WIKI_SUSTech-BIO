import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../static/design-opening.js', import.meta.url), 'utf8');
const flush = async () => { for (let i = 0; i < 32; i++) await Promise.resolve(); };

function setup({reduced = false, seen = false, hash = '', fail = false, decodeFail = false, holdFade = false, hidden = false, scroll = 0, holdFetch = false} = {}) {
  const frames = new Map();
  const timers = new Map();
  let timerId = 0;
  let coverReleased = false;
  let resolveFetch;
  let frameId = 0;
  let fetchCount = 0;
  let gifDecodes = 0;
  let stillDecodes = 0;
  let urlId = 0;
  const liveURLs = new Set();
  let resolveFade;
  let transitionOptions;
  const titleAnimations = [];
  const documentEvents = {};
  const windowEvents = {};
  const motionEvents = {};
  const rootClasses = new Set();
  const background = [{tagName: 'NAV', inert: false}, {tagName: 'MAIN', inert: false}, {tagName: 'ASIDE', inert: true}];
  const control = () => ({
    hidden: true, disabled: false, events: {},
    addEventListener(name, callback) { this.events[name] = callback; },
    focus() { document.activeElement = this; },
  });
  const replay = control();
  const skip = control();
  const label = {};
  const title = {animate(keyframes, options) { titleAnimations.push({keyframes, options}); return {cancel() {}}; }};
  replay.querySelector = () => label;
  const animations = ['bottom-left', 'top-right'].map((corner, i) => ({hidden: true, dataset: {image: `/assets/images/design-communication/opening/mascot-opening-${corner}.gif`}, removeAttribute() { delete this.src; }, async decode() { gifDecodes++; if (decodeFail && i === 1) throw new Error('Invalid second GIF'); }}));
  const animation = animations[0];
  const still = {hidden: true, dataset: {image: '/assets/images/design-communication/opening/mascot-opening-still.png'}, removeAttribute() { delete this.src; }, async decode() { stillDecodes++; }};
  const opening = {
    hidden: true, inert: true, dataset: {duration: '7500'},
    querySelector: selector => selector === '[data-design-opening-animation]' ? animation : selector === '[data-design-opening-still]' ? still : selector === '[data-design-opening-title]' ? title : selector === '[data-design-opening-skip]' ? skip : null,
    querySelectorAll: () => animations,
    contains: element => element === skip,
    animate: (keyframes, options) => {
      transitionOptions = options;
      assert.equal(keyframes.at(-1).opacity, 0);
      assert.equal(keyframes.at(-1).backdropFilter, 'blur(0px)');
      assert.ok(!('height' in keyframes.at(-1)), 'Fullscreen exit must not collapse the document layout');
      return {cancel() {}, finished: holdFade ? new Promise(resolve => { resolveFade = resolve; }) : Promise.resolve()};
    },
  };
  const header = {append(element) { assert.equal(element, replay); }};
  const motion = {matches: reduced, addEventListener(name, callback) { motionEvents[name] = callback; }};
  const document = {
    baseURI: 'https://wiki.example/design-communication', hidden, activeElement: null,
    body: {children: background, append(element) { this.children.push(element); }},
    documentElement: {classList: {add: value => rootClasses.add(value), remove: value => rootClasses.delete(value)}},
    querySelector: selector => selector === '[data-design-opening]' ? opening : selector === '[data-design-opening-replay]' ? replay : header,
    addEventListener(name, callback) { documentEvents[name] = callback; },
  };
  const storage = new Map(seen ? [['orca-design-opening-v2', 'seen']] : []);
  vm.runInNewContext(source, {
    document, setTimeout: callback => { timers.set(++timerId, callback); return timerId; }, clearTimeout: id => timers.delete(id), window: {ORCADesignOpeningCover: {release() { coverReleased = true; }}, devicePixelRatio: 2, addEventListener(name, callback) { windowEvents[name] = callback; }},
    location: {hash}, scrollY: scroll,
    URL: class extends URL {
      static createObjectURL() { const value = `blob:gif-${++urlId}`; liveURLs.add(value); return value; }
      static revokeObjectURL(value) { assert.ok(liveURLs.has(value)); liveURLs.delete(value); }
    },
    performance: {now: () => 0}, matchMedia: () => motion,
    sessionStorage: {setItem: (key, value) => storage.set(key, value), getItem: key => storage.get(key)},
    fetch: async () => {
      fetchCount++;
      if (holdFetch) await new Promise(resolve => { resolveFetch = resolve; });
      if (fail) throw new Error('Offline');
      return {ok: true, blob: async () => ({type: 'image/gif'})};
    },
    requestAnimationFrame: callback => { frames.set(++frameId, callback); return frameId; },
    cancelAnimationFrame: id => frames.delete(id),
  });
  return {
    opening, replay, skip, label, storage, document, documentEvents, windowEvents, background, rootClasses, titleAnimations, animation, animations, still, liveURLs,
    get coverReleased() { return coverReleased; },
    timeout() { [...timers.values()].forEach(callback => callback()); },
    get fetched() { return fetchCount; }, get gifDecodes() { return gifDecodes; }, get stillDecodes() { return stillDecodes; },
    get transition() { return transitionOptions; },
    get pending() { return frames.size; },
    finishFade() { resolveFade(); },
    step(time) { const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(callback => callback(time)); },
  };
}

const normal = setup();
assert.equal(normal.opening.hidden, false, 'The blur mask must be visible before the first fetch/decode await');
assert.equal(normal.opening.dataset.state, 'preparing');
assert.equal(normal.coverReleased, true, 'The head cover hands off synchronously to the visible mask');
await flush();
assert.equal(normal.opening.hidden, false);
assert.ok(normal.rootClasses.has('design-opening-active'));
assert.ok(normal.background.slice(0, 3).every(element => element.inert));
assert.ok(normal.animations.every(image => !image.hidden));
assert.equal(normal.liveURLs.size, 2);
assert.notEqual(normal.animations[0].src, normal.animations[1].src);
assert.equal(normal.still.hidden, true);
assert.match(normal.animation.src, /^blob:gif-/);
normal.step(3500);
assert.equal(normal.gifDecodes, 2, 'Native image decoding replaces per-frame Canvas drawing');
normal.step(7500);
await flush();
assert.equal(normal.opening.hidden, true);
assert.equal(normal.replay.disabled, false);
assert.equal(normal.pending, 0);
assert.equal(normal.storage.size, 0, 'Playback must not create session suppression');
assert.ok(!normal.rootClasses.has('design-opening-active'));
assert.deepEqual(normal.background.slice(0, 3).map(element => element.inert), [false, false, true], 'Pre-existing inert content must stay inert');
assert.equal(normal.transition.duration, 3400);
assert.equal(normal.liveURLs.size, 0, 'Finished playback must release its decoder URL');
assert.equal(normal.animation.src, undefined);

const fade = setup({holdFade: true});
await flush();
fade.step(7500);
assert.equal(fade.opening.hidden, false, 'Keep the full mask present during the reveal');
assert.ok(fade.rootClasses.has('design-opening-active'));
assert.equal(fade.replay.disabled, true);
assert.equal(fade.opening.dataset.state, 'revealing');
assert.equal(fade.titleAnimations.length, 1, 'The centered page title must appear after the mascot finishes');
assert.equal(fade.titleAnimations[0].options.duration, 3400);
const titleHold = fade.titleAnimations[0];
const fullOpacity = titleHold.keyframes.filter(frame => frame.opacity === 1);
assert.equal(Math.round((fullOpacity[1].offset - fullOpacity[0].offset) * titleHold.options.duration), 1632, 'Full title hold extends the previous 832 ms by 800 ms');
fade.finishFade();
await flush();
assert.equal(fade.opening.hidden, true);
assert.equal(fade.document.activeElement, fade.replay);
assert.ok(!fade.rootClasses.has('design-opening-active'));

const interruptTitle = setup({holdFade: true});
await flush();
interruptTitle.step(7500);
interruptTitle.skip.events.click();
assert.equal(interruptTitle.opening.hidden, true, 'Continue must not wait for the slow title reveal');
assert.ok(!interruptTitle.rootClasses.has('design-opening-active'));

const focused = setup();
await flush();
let trapped = false;
focused.documentEvents.keydown({key: 'Tab', preventDefault() { trapped = true; }});
assert.ok(trapped);
assert.equal(focused.document.activeElement, focused.skip);
focused.windowEvents.pagehide();
assert.equal(focused.opening.hidden, true);
assert.ok(!focused.rootClasses.has('design-opening-active'));
assert.equal(focused.liveURLs.size, 0);

for (const options of [{hash: '#our-design-principles'}, {reduced: true}]) {
  const page = setup(options);
  await flush();
  assert.equal(page.fetched, 0);
  assert.equal(page.opening.hidden, true);
}

for (const options of [{seen: true}, {scroll: 500}]) {
  const entry = setup(options);
  await flush();
  const firstDecoderURL = entry.animation.src;
  assert.equal(entry.opening.hidden, false, 'Every normal entry must play, including old sessions and restored scroll positions');
  entry.skip.events.click();
  entry.windowEvents.pageshow({persisted: true});
  await flush();
  assert.equal(entry.opening.hidden, false, 'Returning from the browser page cache must play again');
  assert.equal(entry.fetched, 2, 'Returning may reuse resources but must not suppress playback');
  assert.notEqual(entry.animation.src, firstDecoderURL, 'Every entry must restart the GIF from its first frame');
  assert.equal(entry.liveURLs.size, 2);
}

const backgroundEntry = setup({hidden: true});
await flush();
assert.equal(backgroundEntry.fetched, 0);
backgroundEntry.document.hidden = false;
backgroundEntry.documentEvents.visibilitychange();
await flush();
assert.equal(backgroundEntry.opening.hidden, false, 'A newly opened background tab should play when first shown');

const reduced = setup({reduced: true});
await reduced.replay.events.click();
assert.equal(reduced.opening.dataset.state, 'still');
assert.equal(reduced.gifDecodes, 0);
assert.equal(reduced.fetched, 0);
assert.equal(reduced.stillDecodes, 1);
assert.equal(reduced.animation.hidden, true);
assert.equal(reduced.still.hidden, false);
assert.equal(reduced.pending, 0);
reduced.skip.events.click();
assert.equal(reduced.opening.hidden, true);
assert.equal(reduced.document.activeElement, reduced.replay);

const skipped = setup({seen: true});
await skipped.replay.events.click();
skipped.skip.events.click();
await flush();
assert.equal(skipped.opening.hidden, true);
assert.equal(skipped.pending, 0);
assert.equal(skipped.document.activeElement, skipped.replay);
await skipped.replay.events.click();
skipped.documentEvents.keydown({key: 'Escape'});
await flush();
assert.equal(skipped.opening.hidden, true);
assert.equal(skipped.fetched, 2, 'Replay should reuse decoded resources');

const offline = setup({fail: true});
await flush();
assert.equal(offline.opening.hidden, true);
assert.equal(offline.replay.disabled, false);

const brokenImage = setup({decodeFail: true});
await flush();
assert.equal(brokenImage.opening.hidden, true);
assert.equal(brokenImage.replay.disabled, false);
assert.equal(brokenImage.liveURLs.size, 0);
assert.ok(!brokenImage.rootClasses.has('design-opening-active'));

const earlyEscape = setup();
earlyEscape.documentEvents.keydown({key: 'Escape'});
await flush();
assert.equal(earlyEscape.opening.hidden, true, 'Escape during loading must prevent late playback');
assert.equal(earlyEscape.replay.disabled, false);

const backgrounded = setup();
await flush();
backgrounded.document.hidden = true;
backgrounded.documentEvents.visibilitychange();
assert.equal(backgrounded.opening.hidden, true);
assert.equal(backgrounded.pending, 0);

console.log('GIF opening: fresh decoder on each entry/replay, resource reuse and release, native GIF/static-image selection, slow title reveal, background/focus restoration, skipping, anchors, loading/decode failure and cancellation passed.');

const slow = setup({holdFetch: true});
await flush();
assert.equal(slow.opening.hidden, false, 'Slow media must keep the page blurred throughout loading');
assert.equal(slow.opening.dataset.state, 'preparing');
assert.ok(slow.rootClasses.has('design-opening-active'));
slow.timeout();
assert.equal(slow.opening.hidden, true, 'A stalled download must eventually restore the readable page');
assert.ok(!slow.rootClasses.has('design-opening-active'));
assert.ok(!slow.replay.disabled);

const boot = readFileSync(new URL('../static/design-opening-boot.js', import.meta.url), 'utf8');
for (const [hash, reduced, expected] of [['', false, true], ['#read', false, false], ['', true, false]]) {
  const classes = new Set();
  const window = {};
  let watchdog;
  vm.runInNewContext(boot, {
    location: {hash}, matchMedia: () => ({matches: reduced}), window,
    document: {documentElement: {classList: {add: v => classes.add(v), remove: v => classes.delete(v)}}},
    setTimeout: callback => { watchdog = callback; return 1; }, clearTimeout() {},
  });
  assert.equal(classes.has('design-opening-pending'), expected, 'The head cover must exist before any deferred controller runs');
  if (expected) {
    watchdog();
    assert.ok(!classes.size, 'A missing controller must not leave the page covered forever');
  }
}
console.log('Loading handoff: parser-time blur, synchronous mask before media, stalled download recovery and motion/anchor exemptions passed.');
