import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../static/team-package-mascots.js', import.meta.url), 'utf8');
const poses = [
  ['salmon', -1.07, -.42, -10, -1], ['coding', 1.07, -.42, 8, 1],
  ['singing', 1.16, .72, 9, -1], ['fashion', -1.16, .72, -8, 1], ['experiment', 0, 1.28, -3, 1],
];

function setup({ reduced = false, headerOnly = false, mobile = false } = {}) {
  let inOpening = !headerOnly;
  let width = mobile ? 353 : 900;
  const height = mobile ? 164 : 180;
  const slotSize = mobile ? 48 : 64;
  let now = 0;
  let timerId = 0;
  let dockObserver;
  let sizeObserver;
  const timers = new Map();
  const handlers = {};
  const classes = new Set();
  const animations = [];
  const cast = { removed: false, remove() { this.removed = true; } };
  const slots = poses.map((_, index) => ({
    getBoundingClientRect() {
      const centerX = mobile ? [52, 52, 52, 301, 301][index] * width / 353 : [.13, .23, .33, .75, .85][index] * width;
      const centerY = mobile ? [32, 82, 132, 57, 107][index] : height / 2;
      return { left: centerX - slotSize / 2, top: centerY - slotSize / 2, width: slotSize, height: slotSize };
    },
  }));
  const animate = owner => (frames, timing) => {
    const animation = {
      owner, frames, timing, currentTime: 0, playbackRate: 1, cancelled: false, plays: 0,
      pause() {}, play() { this.plays++; }, cancel() { this.cancelled = true; },
    };
    animations.push(animation);
    return animation;
  };
  const images = poses.map(([name, x, y, turn, winding], index) => ({
    dataset: { teamMascot: name, endX: String(x), endY: String(y), endTurn: String(turn), winding: String(winding) },
    animate: animate(name),
    closest: () => slots[index],
  }));
  cast.querySelectorAll = () => images;
  const heading = {
    classList: { toggle(name, on) { if (on) classes.add(name); else classes.delete(name); } },
    getBoundingClientRect: () => ({ left: 0, top: 0, width, height }),
    querySelector: () => cast,
  };
  const orbit = {
    dataset: {},
    classList: { toggle(name, on) { if (on) classes.add(name); else classes.delete(name); } },
    contains: target => target === 'inside',
    querySelectorAll: () => images,
    querySelector(selector) {
      if (selector === '[data-team-package-mascots]') return cast;
      return null;
    },
    getBoundingClientRect: () => ({ width }),
    addEventListener(type, fn) { handlers[type] = fn; },
  };
  const opening = { hidden: false, dataset: { phase: 'title' }, contains: () => inOpening, querySelector: selector => selector === '[data-team-mascot-heading]' ? heading : orbit };
  const motion = { matches: reduced, addEventListener(type, fn) { handlers.motion = fn; } };
  const document = {
    body: {}, hidden: false,
    querySelector: () => inOpening ? opening : null,
    querySelectorAll: () => [],
    addEventListener(type, fn) { handlers[type] = fn; },
  };
  const window = { addEventListener(type, fn) { handlers[type] = fn; } };
  class MutationObserver {
    constructor(fn) { this.callback = fn; dockObserver = this; }
    observe() {} disconnect() { this.disconnected = true; }
  }
  class ResizeObserver {
    constructor(fn) { this.callback = fn; sizeObserver = this; }
    observe() {} disconnect() { this.disconnected = true; }
  }
  const sandbox = {
    document, window, matchMedia: () => motion, AbortController, MutationObserver, ResizeObserver,
    setTimeout(fn, delay) { timers.set(++timerId, { fn, time: now + delay }); return timerId; },
    clearTimeout: id => timers.delete(id),
  };
  vm.runInNewContext(source, sandbox);
  return {
    images, animations, handlers, classes, cast, motion, slots, height,
    enter: () => handlers.pointerenter?.({ pointerType: 'mouse' }),
    leave: () => handlers.pointerleave?.({ pointerType: 'mouse' }),
    runAgain() { vm.runInNewContext(source, sandbox); },
    dock() { inOpening = false; dockObserver?.callback(); },
    resize(value) { width = value; sizeObserver?.callback(); },
    hide() { document.hidden = true; handlers.visibilitychange?.(); },
    advance(ms) {
      now += ms;
      for (const [id, timer] of [...timers]) if (timer.time <= now) { timers.delete(id); timer.fn(); }
    },
    get disposedObservers() { return dockObserver?.disconnected && sizeObserver?.disconnected; },
  };
}

const position = frame => frame.transform.match(/translate\(([^p]+)px, ([^p]+)px\)/).slice(1).map(Number);
const staysInTitleRow = page => {
  for (let index = 0; index < poses.length; index++) {
    const flight = page.animations.find(animation => animation.owner === poses[index][0]);
    const slot = page.slots[index].getBoundingClientRect();
    for (const frame of flight.frames) {
      const centerY = slot.top + slot.height / 2 + position(frame)[1];
      const scale = Number(frame.transform.match(/scale\(([^)]+)\)/)[1]);
      assert.ok(centerY - slot.height * scale / 2 >= -.01 && centerY + slot.height * scale / 2 <= page.height + .01,
        'Every point of the figure must stay inside the title row, above the pseudocode.');
    }
  }
};
const page = setup();
assert.equal(page.animations.length, 0, 'Flights must not auto-play on page initialization.');
const enterHandler = page.handlers.pointerenter;
page.runAgain();
assert.equal(page.handlers.pointerenter, enterHandler, 'Repeated setup must not duplicate input listeners.');
page.enter();
assert.equal(page.classes.has('is-revealed'), true);
assert.equal(page.animations.length, 5, 'Only the five mascot figures should animate, with no drawn trails.');
for (let index = 0; index < poses.length; index++) {
  const [name] = poses[index];
  const flight = page.animations.find(animation => animation.owner === name);
  assert.equal(flight.frames.length, 49);
  assert.equal(flight.timing.duration, 900);
  assert.equal(flight.timing.delay, index * 40);
  const middle = position(flight.frames[24]);
  const start = position(flight.frames[0]);
  const end = position(flight.frames.at(-1));
  assert.ok(Math.abs(end[0]) < .001 && Math.abs(end[1]) < .001, 'The figure must settle at its reserved title-side slot.');
  const chord = [end[0] - start[0], end[1] - start[1]];
  const distanceFromStraightLine = Math.abs((middle[0] - start[0]) * chord[1] - (middle[1] - start[1]) * chord[0]) / Math.hypot(...chord);
  assert.ok(distanceFromStraightLine > 10, `${name} must retain its curved flight.`);
}
staysInTitleRow(page);
page.animations.forEach(animation => { animation.currentTime = 480; });
page.leave();
assert.equal(page.classes.has('is-revealed'), false);
assert.ok(page.animations.every(animation => animation.playbackRate === -1 && animation.currentTime === 480),
  'Pointer exit reverses the existing path from its current point.');
page.enter();
assert.equal(page.animations.length, 5);
assert.ok(page.animations.every(animation => animation.playbackRate === 1 && animation.currentTime === 480),
  'Re-entering mid-return must not reset or jump to the package center.');
const oldStart = position(page.animations[0].frames[0]);
page.resize(600);
assert.ok(page.animations.slice(0, 5).every(animation => animation.cancelled));
assert.notDeepEqual(position(page.animations[5].frames[0]), oldStart);
assert.deepEqual(position(page.animations[5].frames.at(-1)), [0, 0]);
page.dock();
assert.equal(page.cast.removed, true, 'The opening mascots must be removed when the package docks in the formal page.');
assert.equal(page.disposedObservers, true);
assert.ok(page.animations.every(animation => animation.cancelled));
const count = page.animations.length;
page.enter();
assert.equal(page.animations.length, count);
assert.equal(page.classes.has('is-revealed'), false);

const formal = setup({ headerOnly: true });
assert.equal(formal.handlers.pointerenter, undefined, 'The formal page package must have no mascot interaction.');
assert.equal(formal.cast.removed, false, 'The formal title keeps its static figures without binding any PKG hover.');
const mobile = setup({ mobile: true });
mobile.enter();
staysInTitleRow(mobile);
const quiet = setup({ reduced: true });
quiet.enter();
assert.equal(quiet.animations.length, 0);
assert.equal(quiet.classes.has('is-revealed'), true);
quiet.leave();
assert.equal(quiet.classes.has('is-revealed'), false);

const touch = setup();
const event = { pointerType: 'touch', preventDefault() { assert.fail('The package click must never be intercepted.'); } };
touch.handlers.pointerdown(event);
touch.handlers.pointerup(event);
touch.handlers.pointerleave(event);
assert.equal(touch.classes.has('is-revealed'), true);
assert.equal(touch.handlers.click, undefined);
touch.advance(1200);
assert.equal(touch.classes.has('is-revealed'), false);
touch.handlers.pointerdown(event);
touch.advance(2000);
assert.equal(touch.classes.has('is-revealed'), false, 'A lost touch-up must not leave the cast stuck.');

const keyboard = setup();
keyboard.handlers.focusin({ target: { matches: () => true } });
assert.equal(keyboard.classes.has('is-revealed'), true);
keyboard.hide();
assert.equal(keyboard.classes.has('is-revealed'), false);
assert.ok(keyboard.animations.every(animation => animation.currentTime === 0));
console.log('Title-side mascots: five curved flights inside the reserved title row on desktop/mobile, static formal title, continuous reversal, opening cleanup, resize, touch, keyboard and reduced motion passed.');
