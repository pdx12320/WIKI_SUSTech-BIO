import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../static/navigation-scroll.js', import.meta.url), 'utf8');
const classes = new Set();
const events = new Map();
const navEvents = new Map();
let interacting = false;
let nextFrame;
const navigation = {
  offsetHeight: 100,
  setAttribute() {},
  classList: { add: name => classes.add(name), remove: name => classes.delete(name) },
  querySelector: () => interacting ? {} : null,
  addEventListener: (name, handler) => navEvents.set(name, handler),
};
const window = {
  scrollY: 0, innerHeight: 800,
  addEventListener: (name, handler) => events.set(name, handler),
};
runInNewContext(source, {
  window,
  document: { querySelector: selector => selector === '.whale-navigation' ? navigation : null, documentElement: { scrollHeight: 4000 } },
  requestAnimationFrame: handler => { nextFrame = handler; return 1; },
});
const scroll = y => {
  window.scrollY = y;
  events.get('scroll')();
  nextFrame();
};
const hidden = () => classes.has('is-scroll-hidden');

scroll(70);
assert.equal(hidden(), false, 'Keep the opening menu visible');
scroll(200);
assert.equal(hidden(), true, 'Hide after downward reading passes the header');
scroll(197);
assert.equal(hidden(), true, 'Ignore tiny upward jitter');
scroll(190);
assert.equal(hidden(), false, 'Reveal after a deliberate upward movement');
scroll(194);
assert.equal(hidden(), false, 'Ignore tiny downward jitter');
scroll(210);
assert.equal(hidden(), true);
navEvents.get('focusin')();
assert.equal(hidden(), false, 'Keyboard focus reveals offscreen navigation');
interacting = true;
scroll(400);
assert.equal(hidden(), false, 'Open menus, search and keyboard use keep navigation visible');
interacting = false;
scroll(500);
assert.equal(hidden(), true);
scroll(3200);
scroll(3280);
scroll(3200);
assert.equal(hidden(), true, 'Bottom overscroll bounce does not reveal the menu');
scroll(3180);
assert.equal(hidden(), false);
scroll(20);
assert.equal(hidden(), false);
scroll(-40);
scroll(0);
assert.equal(hidden(), false, 'Top overscroll keeps navigation visible');
scroll(500);
events.get('resize')();
assert.equal(hidden(), false, 'Viewport changes restore a usable header');
scroll(700);
events.get('pageshow')();
assert.equal(hidden(), false, 'History restoration starts with usable navigation');
console.log('Navigation scroll: direction, jitter, focus, open menus, overscroll and restoration passed.');

// Programmatic rewinds, resize and history restoration must not expose the
// navigation while the Home story owns the screen. Static fallbacks stay usable.
const storyClasses = new Set();
let frameHandler, classChanged;
const storyRoot = {
  classList: {
    contains: name => storyClasses.has(name),
    toggle(name, enabled) { enabled ? storyClasses.add(name) : storyClasses.delete(name); },
  },
  addEventListener(name, handler) { if (name === 'ot:frame') frameHandler = handler; },
};
runInNewContext(source, {
  window,
  document: { querySelector: selector => selector === '.whale-navigation' ? navigation : storyRoot,
    documentElement: { scrollHeight: 4000 } },
  MutationObserver: class { constructor(callback) { classChanged = callback; } observe() {} },
  requestAnimationFrame: handler => { nextFrame = handler; return 1; },
});
assert.equal(navigation.inert, true, 'Hide interaction before the first animation frame');
frameHandler({ detail: { p: .8 } });
for (const name of ['resize', 'pageshow']) events.get(name)();
scroll(200);
scroll(100);
assert.equal(navigation.inert, true, 'Rewinds and header resets must respect the story');
frameHandler({ detail: { p: 1 } });
assert.equal(navigation.inert, false, 'Restore the menu at the project index');
frameHandler({ detail: { p: .9 } });
assert.equal(navigation.inert, true, 'Hide it when returning into the story');
storyClasses.add('ot--static');
classChanged();
assert.equal(navigation.inert, false, 'A WebGL failure or static fallback restores navigation');
console.log('Home navigation: first frame, rewind, restoration, story exit and static fallback passed.');

// The full-screen Engineering workspace uses edge hover, not scroll direction.
let finePointer = true;
let mediaChanged;
const engineeringDocument = {
  body: { classList: { contains: name => name === 'engineering-workspace-page' } },
  activeElement: null,
  querySelector: () => navigation,
};
navigation.contains = element => element === navigation;
navigation.classList.toggle = (name, enabled) => enabled ? classes.add(name) : classes.delete(name);
window.matchMedia = () => ({
  get matches() { return finePointer; },
  addEventListener: (name, handler) => { mediaChanged = handler; },
});
events.clear();
navEvents.clear();
runInNewContext(source, {
  window, document: engineeringDocument,
  requestAnimationFrame: handler => { nextFrame = handler; return 1; },
});
assert.equal(hidden(), true, 'Engineering starts with its header tucked away');
const pointer = (clientY, target = null) => events.get('pointermove')({ clientY, target, pointerType: 'mouse' });
pointer(12);
assert.equal(hidden(), false, 'Top edge reveals the header');
pointer(90, navigation);
assert.equal(hidden(), false, 'Moving into the revealed menu keeps it open');
pointer(300);
assert.equal(hidden(), true, 'Leaving the header hides it again');
engineeringDocument.activeElement = navigation;
navEvents.get('focusin')();
pointer(300);
assert.equal(hidden(), false, 'Keyboard focus takes priority over pointer position');
engineeringDocument.activeElement = null;
navEvents.get('focusout')();
nextFrame();
assert.equal(hidden(), true);
interacting = true;
pointer(300);
assert.equal(hidden(), false, 'Open search or touch disclosures remain usable');
interacting = false;
pointer(300);
finePointer = false;
mediaChanged();
assert.equal(hidden(), false, 'Touch devices retain a visible menu');
finePointer = true;
mediaChanged();
assert.equal(hidden(), true);
pointer(12);
events.get('pageshow')();
assert.equal(hidden(), true, 'Re-entering Engineering resets the hover state');
assert.equal(events.has('scroll'), false, 'Document scroll cannot fight Engineering hover');
console.log('Engineering navigation: entry, hover, focus, disclosures, touch and restoration passed.');
