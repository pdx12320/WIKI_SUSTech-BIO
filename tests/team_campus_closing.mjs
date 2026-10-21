import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../static/team-campus-closing.js', import.meta.url), 'utf8');

function setup({ reduced = false, height = 900, panelHeight = 360, documentHeight = 6000 } = {}) {
  let top = height + 300, focused = false, reads = 0, writes = 0, now = 0, nextId = 0;
  const frames = new Map(), events = new Map(), sectionEvents = new Map(), classes = new Set();
  const panel = {
    style: { set transform(value) { this.value = value; writes++; } },
    getBoundingClientRect() { reads++; return { top, bottom: top + panelHeight, height: panelHeight }; },
  };
  const section = {
    dataset: {}, querySelector: () => panel, contains: () => focused,
    classList: { toggle(name, enabled) { enabled ? classes.add(name) : classes.delete(name); } },
    addEventListener: (name, fn) => sectionEvents.set(name, fn),
  };
  const root = { clientHeight: height, scrollHeight: documentHeight, classList: { contains: () => false } };
  const motion = { matches: reduced, addEventListener: (_, fn) => events.set('motion', fn) };
  const win = { innerHeight: height, scrollY: 2000, addEventListener: (name, fn) => events.set(name, fn) };
  vm.runInNewContext(source, {
    document: { querySelector: () => section, documentElement: root, scrollingElement: root, activeElement: {} },
    window: win, matchMedia: () => motion,
    requestAnimationFrame(fn) { frames.set(++nextId, fn); return nextId; },
    cancelAnimationFrame(id) { frames.delete(id); },
  });
  const step = (ms = 1000 / 60) => {
    now += ms;
    const pending = [...frames.values()]; frames.clear();
    pending.forEach(fn => fn(now));
  };
  return {
    panel, classes, frames, motion, root,
    get reads() { return reads; }, get writes() { return writes; },
    progress: () => 1 + Number(panel.style.value.match(/translate3d\(([-.\d]+)%/)[1]) / 102,
    event: name => events.get(name)(), step,
    scroll(value, scrollY = win.scrollY) { top = value; win.scrollY = scrollY; events.get('scroll')(); },
    focus(value) { focused = value; sectionEvents.get(value ? 'focusin' : 'focusout')(); },
    settle() { for (let i = 0; frames.size && i < 200; i++) step(); assert.equal(frames.size, 0); },
  };
}

const run = setup();
assert.equal(run.progress(), 0, 'The offscreen panel starts fully hidden.');
assert.equal(run.frames.size, 0, 'An idle page must not run animation frames.');
run.scroll(600);
run.step();
const first = run.progress();
assert.ok(first > 0 && first < .2, 'One coarse wheel step should move through intermediate positions.');
const measuredReads = run.reads;
run.step();
assert.ok(run.progress() > first, 'Motion continues smoothly between scroll events.');
assert.equal(run.reads, measuredReads, 'Interpolation frames must not remeasure layout.');
run.settle();
const at600 = run.progress();
assert.ok(Math.abs(at600 - (882 - 600) / (882 - 270)) < .00001);
const settledWrites = run.writes;
run.event('resize'); run.step();
assert.equal(run.writes, settledWrites, 'Unchanged progress must not rewrite the transform.');

run.scroll(300); run.step();
const forward = run.progress();
assert.ok(forward > at600);
run.scroll(700); run.step();
assert.ok(run.progress() < forward, 'Reversing scroll must immediately reverse motion.');
run.scroll(270); run.settle();
assert.equal(run.progress(), 1, 'The full panel must finish at the original screen-center endpoint.');
assert.equal(run.classes.has('is-scroll-ready'), false, 'Release the compositor layer after finishing.');

run.scroll(800); run.step(); run.focus(true); run.step();
assert.equal(run.progress(), 1, 'Keyboard focus must reveal the link without waiting for damping.');
assert.equal(run.frames.size, 0);
run.focus(false); run.step();
run.motion.matches = true; run.event('motion'); run.step();
assert.equal(run.progress(), 1, 'Changing to reduced motion reveals the whole panel immediately.');
assert.equal(run.frames.size, 0);

const reduced = setup({ reduced: true });
reduced.scroll(700); reduced.step();
assert.equal(reduced.progress(), 1);
assert.equal(reduced.reads, 0, 'Reduced motion needs no panel measurements.');

const short = setup({ height: 1200, panelHeight: 360, documentHeight: 3300 });
short.scroll(600, 2100); short.settle();
assert.equal(short.progress(), 1, 'A short footer must still allow the panel to finish.');
const lifecycle = setup();
lifecycle.scroll(600); lifecycle.step(); lifecycle.event('pagehide');
assert.equal(lifecycle.frames.size, 0);
lifecycle.event('pageshow'); lifecycle.settle();
assert.ok(lifecycle.progress() > 0, 'History restoration must resume with the current position.');

const sample = hz => {
  const test = setup(); test.scroll(600); test.step();
  for (let i = 0; i < hz / 10; i++) test.step(1000 / hz);
  return test.progress();
};
assert.ok(Math.abs(sample(60) - sample(120)) < .00001, 'Equal elapsed time must produce equal motion at 60 and 120 Hz.');
console.log('Campus closing: smooth wheel steps, reversal, idle cost, endpoints, focus, reduced motion and frame-rate independence passed.');
