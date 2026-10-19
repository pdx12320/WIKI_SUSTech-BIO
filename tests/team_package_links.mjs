import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../static/team-package-links.js', import.meta.url), 'utf8');

function setup(reduced = false) {
  let now = 0;
  let timerId = 0;
  const timers = new Map();
  const schedule = (fn, delay) => { const id = ++timerId; timers.set(id, { fn, time: now + delay }); return id; };
  const advance = ms => {
    const end = now + ms;
    while (true) {
      const next = [...timers].filter(([, item]) => item.time <= end).sort((a, b) => a[1].time - b[1].time)[0];
      if (!next) break;
      const [id, item] = next;
      timers.delete(id); now = item.time; item.fn();
    }
    now = end;
  };
  const values = new Set();
  const animations = [];
  const group = { hidden: false };
  let entranceFinished = false;
  const card = {
    hidden: false, focused: false, scrolls: [],
    classList: { add: name => values.add(name), remove: name => values.delete(name), contains: name => values.has(name) },
    closest: () => group,
    scrollIntoView(options) { this.scrolls.push(options); },
    getBoundingClientRect: () => ({ top: 180, bottom: 460 }),
    focus() { this.focused = true; },
    getAnimations: () => [{ animationName: 'team-card-package-in', finish() { entranceFinished = true; } }],
    animate(frames, options) {
      const animation = { frames, options, cancelled: false, cancel() { this.cancelled = true; } };
      animations.push(animation); return animation;
    },
  };
  const panel = { hiddenFromAccessibility: true, removeAttribute(name) { if (name === 'aria-hidden') this.hiddenFromAccessibility = false; } };
  const line = {
    dataset: { teamMemberTarget: 'team-card-3' }, textContent: 'extract chenfan_liao_skill.md', link: null,
    querySelector() { return this.link; },
    replaceChildren(link) { this.link = link; },
    closest: () => panel,
  };
  let docked = false;
  let observer;
  const mount = { querySelectorAll: () => docked ? [line] : [] };
  let resetClicks = 0;
  const reset = { click() { resetClicks++; card.hidden = false; group.hidden = false; } };
  let click;
  const header = {
    dataset: {}, contains: link => link === line.link,
    querySelector: selector => selector.includes('mount') ? mount : reset,
    addEventListener(type, fn) { if (type === 'click') click = fn; },
  };
  const history = { state: { orcaTeamPackageOpen: true }, replaceState(state, title, hash) { this.state = state; this.hash = hash; } };
  const motion = { matches: reduced, addEventListener() {} };
  const document = {
    querySelector: () => header,
    getElementById: id => id === 'team-card-3' ? card : null,
    createElement: () => ({ dataset: {}, closest() { return this; }, get hash() { return this.href; } }),
  };
  class Observer {
    constructor(callback) { observer = callback; }
    observe() {}
  }
  vm.runInNewContext(source, {
    document, matchMedia: () => motion, window: { history }, MutationObserver: Observer,
    performance: { now: () => now }, innerHeight: 844,
    requestAnimationFrame: fn => schedule(fn, 16), setTimeout: schedule, clearTimeout: id => timers.delete(id),
  });
  return {
    line, card, group, values, animations, panel, history, advance,
    get resetClicks() { return resetClicks; },
    get entranceFinished() { return entranceFinished; },
    dock() { docked = true; observer(); },
    click(overrides = {}) {
      const event = { target: line.link, button: 0, preventDefault() { this.prevented = true; }, ...overrides };
      click(event); return event;
    },
  };
}

const page = setup();
assert.equal(page.line.link, null, 'Typing in the opening must not expose interactive member links.');
page.dock();
assert.equal(page.line.link.href, '#team-card-3');
assert.equal(page.line.link.textContent, 'extract chenfan_liao_skill.md');
assert.equal(page.panel.hiddenFromAccessibility, false);
const firstLink = page.line.link;
page.dock();
assert.equal(page.line.link, firstLink, 'Repeated mount notifications must not nest or duplicate links.');
page.card.hidden = true;
page.group.hidden = true;
assert.equal(page.click().prevented, true);
assert.equal(page.resetClicks, 1, 'A filtered-out member/category must be revealed before scrolling.');
assert.equal(page.history.state.orcaTeamPackageOpen, true, 'Updating a member hash must preserve unpacked history state.');
assert.equal(page.history.hash, '#team-card-3');
assert.equal(page.card.scrolls[0].block, 'center');
assert.equal(page.card.scrolls[0].behavior, 'smooth');
page.advance(96);
assert.equal(page.card.focused, true);
assert.equal(page.entranceFinished, true);
assert.equal(page.animations[0].options.duration, 1000);
const popFrames = page.animations[0].frames;
const scales = popFrames.map(frame => Number(frame.transform.match(/scale\(([^)]+)\)/)[1]));
const angles = popFrames.map(frame => Number(frame.transform.match(/rotate\(([^)]+)deg\)/)[1]));
assert.equal(Math.max(...scales), 1.16);
assert.ok(angles.some(value => value < 0) && angles.some(value => value > 0), 'The card should gently sway in both directions.');
assert.ok(Math.abs(angles.at(-2)) < Math.max(...angles.map(Math.abs)), 'The sway should settle before restoring the card.');
assert.equal(popFrames[0].transform, popFrames.at(-1).transform, 'The pop must return exactly to its initial position and scale.');
assert.equal(page.values.has('is-package-target'), true);
page.advance(999);
assert.equal(page.values.has('is-package-target'), true);
page.advance(1);
assert.equal(page.values.has('is-package-target'), false, 'The card must return to normal after exactly 1 second.');
assert.equal(page.animations[0].cancelled, true);
const scrolls = page.card.scrolls.length;
assert.equal(page.click({ ctrlKey: true }).prevented, undefined);
assert.equal(page.card.scrolls.length, scrolls, 'Modified clicks must keep native link behavior.');

const quiet = setup(true);
quiet.dock(); quiet.click(); quiet.advance(16);
assert.equal(quiet.card.scrolls[0].behavior, 'auto');
assert.equal(quiet.animations.length, 0, 'Reduced motion must skip scaling and swaying.');
assert.equal(quiet.values.has('is-package-target'), true);
quiet.advance(1000);
assert.equal(quiet.values.has('is-package-target'), false);

console.log('Package links: docking-only enhancement, target mapping, filter reset, state preservation, 1000ms restoration, keyboard/native links and reduced motion passed.');
