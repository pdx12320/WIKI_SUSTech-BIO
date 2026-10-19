import assert from 'node:assert/strict';
import { createEditReplay, replayFrame, REPLAY_TIMING, HOME_REPLAY_TIMING } from '../static/onetake/edit-replay.mjs';
import { editState } from '../static/onetake/biology-scene.mjs';

const editStart = REPLAY_TIMING.question + REPLAY_TIMING.rewind + REPLAY_TIMING.target;
assert.equal(replayFrame(0).phase, 'question');
assert.ok(replayFrame(4).take < replayFrame(3).take);
assert.equal(replayFrame(editStart + .2).take, .55);
assert.equal(replayFrame(editStart + 8).phase, 'edit');
assert.equal(editState(.5).pod, 1);
assert.equal(editState(.5).cetus, 1);
assert.equal(editState(.5).fix, 0);
assert.ok(editState(.65).fix > 0 && editState(.65).fix < 1);
assert.equal(editState(.85).fix, 1);

const events = new Map(), scrolls = [];
globalThis.innerHeight = 800;
globalThis.window = { addEventListener(type, fn) { events.set(type, fn); }, scrollTo(options) { scrolls.push(options.top); } };
const button = { hidden: true, addEventListener(type, fn) { this.click = fn; } };
const startButton = { hidden: true, addEventListener(type, fn) { this.click = fn; } };
const root = { dataset: {}, querySelector(selector) { return selector === '[data-edit-start]' ? startButton : button; } };
const story = { getBoundingClientRect() { return { height: 10800 }; } };
const replay = createEditReplay({ root, story, toProgress: x => x, enabled: true });
assert.equal(replay.update(.75, .05), null);
assert.equal(replay.update(.8, .05).phase, 'question');
assert.equal(button.hidden, false);
// Trackpad momentum and continued forward scrolling must reach placement.
for (const expected of ['question','rewind','target']) {
  while (root.dataset.editReplay !== expected) replay.update(.8,.05);
  let preventedForward = false;
  events.get('wheel')({deltaY:100,preventDefault(){preventedForward=true;}});
  assert.equal(preventedForward,true);
  events.get('touchstart')({touches:[{clientY:700}]});
  events.get('touchmove')({target:{closest(){return null;}},touches:[{clientY:500}],preventDefault(){}});
  events.get('keydown')({key:'ArrowDown',preventDefault(){}});
  assert.equal(replay.update(.8,.05).phase,expected);
}
for (let i = 0; i < 250; i++) replay.update(.8, .05);
assert.equal(root.dataset.editReplay,'placement');
assert.equal(replay.update(.8,.05).take,.55);
replay.setReady(true);
assert.equal(replay.update(.8,.05).phase,'placement','placing both modules does not start editing before the gesture');
let prevented = false;
events.get('wheel')({deltaY:100,preventDefault(){prevented=true;}});
assert.equal(prevented,true);
assert.equal(replay.update(.8,.05).phase,'edit');
for (let i = 0; i < 600; i++) replay.update(.8, .05);
assert.equal(button.hidden, true);
assert.ok(Math.min(...scrolls) <= 5500.01);
assert.equal(scrolls.at(-1), 9550);
assert.equal(replay.update(.8, .05), null, 'replay only runs once');

const interrupted = createEditReplay({ root, story, toProgress: x => x, enabled: true });
interrupted.update(.8, .05);
events.get('wheel')({deltaY:-100,preventDefault(){}});
assert.equal(interrupted.update(.8, .05), null);
assert.equal(button.hidden, true);
const reduced = createEditReplay({ root, story, toProgress: x => x, enabled: false });
assert.equal(reduced.update(.8, .05), null);
assert.equal(startButton.hidden,true);
startButton.click();
assert.equal(reduced.update(.8,.05),null,'reduced-motion mode keeps the static reading layout');

const direct = createEditReplay({root,story,toProgress:x=>x,enabled:true});
assert.equal(direct.update(1,.05),null,'project anchor does not automatically hijack the page');
assert.equal(startButton.hidden,false,'project anchor exposes a manual drag entry');
startButton.click();
assert.equal(direct.update(1,.05).phase,'target');
for (let i=0;i<30;i++) direct.update(.55,.05);
assert.equal(root.dataset.editReplay,'placement');
assert.equal(scrolls.at(-1),5500);
direct.setReady(true);
const session=root.dataset.editSession;
button.click();
direct.update(1,.05);
startButton.click();
for (let i=0;i<30;i++) direct.update(.55,.05);
assert.notEqual(root.dataset.editSession,session,'manual re-entry resets the protein placement session');
events.get('wheel')({deltaY:100,preventDefault(){}});
assert.equal(direct.update(.55,.05).phase,'placement','old readiness cannot begin a new edit');
console.log('Passed edit order, forward wheel/touch/key continuity, readable hold, real rewind, placement pause, one-gesture playback, interruption, direct project entry, session reset and reduced-motion checks.');

// Home holds the completed edit indefinitely; only native scroll moves the
// camera toward the conclusion. Other previews keep their existing timing.
const controlled = createEditReplay({ root, story, toProgress: x => x, enabled: true, scrollReturn: true });
controlled.update(.8, .05);
for (let i = 0; i < 250; i++) controlled.update(.8, .05);
assert.equal(root.dataset.editReplay, 'placement');
controlled.setReady(true);
events.get('wheel')({ deltaY: 100, preventDefault() {} });
let held;
for (let i = 0; i < 180; i++) held = controlled.update(.89, .05);
assert.equal(held.phase, 'return');
assert.equal(held.cameraBlend, 0);
assert.equal(held.edit, 1);
assert.equal(button.hidden, true, 'animation control disappears when the edit is complete');
const heldScrolls = scrolls.length;
for (let i = 0; i < 300; i++) assert.equal(controlled.update(.89, .05).cameraBlend, 0);
assert.equal(scrolls.length, heldScrolls, 'waiting does not move the document');
let blocked = false;
events.get('wheel')({ deltaY: 100, preventDefault() { blocked = true; } });
events.get('touchstart')({ touches: [{ clientY: 700 }] });
events.get('touchmove')({ target: { closest() { return null; } }, touches: [{ clientY: 500 }], preventDefault() { blocked = true; } });
events.get('keydown')({ key: 'PageDown', preventDefault() { blocked = true; } });
assert.equal(blocked, false, 'wheel, touch and keyboard continue native scrolling');
const middle = controlled.update(.9225, .05);
assert.ok(Math.abs(middle.cameraBlend - .5) < 1e-8);
assert.ok(controlled.update(.91, .05).cameraBlend < middle.cameraBlend, 'scrolling back reverses the transition');
assert.equal(controlled.update(.956, .05).cameraBlend, 1);
assert.equal(controlled.update(.956, .05), null);
console.log('Passed completed-edit hold, hidden animation control, scroll-only reversible return, and wheel/touch/keyboard continuity.');

// The homepage shortens the question, rewind and edit and joins the live take
// continuously, including when a fast scroll passes the trigger threshold.
assert.equal(HOME_REPLAY_TIMING.question, REPLAY_TIMING.question / 2);
assert.equal(HOME_REPLAY_TIMING.rewind, REPLAY_TIMING.rewind / 2);
assert.equal(HOME_REPLAY_TIMING.edit, REPLAY_TIMING.edit / 2);
for (const phase of ['target', 'return']) assert.equal(HOME_REPLAY_TIMING[phase], REPLAY_TIMING[phase]);
for (const questionFrom of [.797, .81, .9]) {
  const options = { timing: HOME_REPLAY_TIMING, questionFrom };
  assert.equal(replayFrame(0, options).take, questionFrom);
  const boundary = HOME_REPLAY_TIMING.question;
  assert.ok(Math.abs(replayFrame(boundary - 1e-6, options).take - replayFrame(boundary, options).take) < 1e-8);
  assert.equal(replayFrame(boundary + HOME_REPLAY_TIMING.rewind + 1e-6, options).phase, 'target');
}
const homeRoot = { ...root, dataset: {}, hasAttribute(name) { return name === 'data-edit-quick-rewind'; } };
const homeReplay = createEditReplay({ root: homeRoot, story, toProgress: x => x, enabled: true });
homeReplay.update(.79, 0);
assert.equal(homeReplay.update(.798, 0).take, .798, 'automatic entry starts at the live camera position');
for (let i = 0; i < 57; i++) homeReplay.update(.8, .05);
assert.equal(homeRoot.dataset.editReplay, 'target', 'homepage reaches RNA after the shortened question and rewind');
const homeEditStart = HOME_REPLAY_TIMING.question + HOME_REPLAY_TIMING.rewind + HOME_REPLAY_TIMING.target;
const homeOptions = { timing: HOME_REPLAY_TIMING };
assert.equal(replayFrame(homeEditStart + 4.2, homeOptions).phase, 'edit');
assert.equal(replayFrame(homeEditStart + 4.3, homeOptions).phase, 'return');
assert.equal(replayFrame(homeEditStart + 4.3, homeOptions).edit, 1);
console.log('Passed homepage half-duration timing, continuous handoff, fast-scroll entry and completed edit before return.');
