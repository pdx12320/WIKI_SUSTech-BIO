import assert from 'node:assert/strict';
import { guardSceneFrame } from '../static/onetake/scene-frame-guard.mjs';
import { createEditReplay } from '../static/onetake/edit-replay.mjs';

let renders = 0, recoveries = 0, stopped = false;
const error = new Error('Simulated renderer failure');
const frame = guardSceneFrame(() => { if (++renders === 2) throw error; }, () => stopped,
  received => { assert.equal(received, error); recoveries++; });
frame(); frame(); frame();
assert.equal(renders, 2); assert.equal(recoveries, 1);
const cancelled = guardSceneFrame(() => renders++, () => stopped, () => assert.fail());
stopped = true; cancelled(); assert.equal(renders, 2, 'Late frames cannot revive a static fallback');

for (const type of ['wheel', 'touchmove', 'keydown']) {
  const events = new Map();
  globalThis.window = { addEventListener: (type, fn) => events.set(type, fn), scrollY: 0, scrollTo() {} };
  globalThis.innerHeight = 800;
  const root = { dataset: {}, querySelector: () => null };
  const replay = createEditReplay({ root, story: { getBoundingClientRect: () => ({ top: 0, height: 10800 }) }, toProgress: x => x, enabled: true });
  assert.equal(replay.update(.8, .05).phase, 'question');
  let prevented = false;
  const event = { deltaY: 100, key: 'ArrowDown', target: {}, touches: [{ clientY: 0 }], preventDefault() { prevented = true; } };
  events.get(type)(event);
  assert(prevented, 'Automatic replay normally captures forward input');
  root.dataset.homeStartup = 'fallback';
  prevented = false;
  events.get(type)(event);
  assert(!prevented, `${type} must remain usable after renderer failure`);
  assert.equal(root.dataset.editReplay, undefined);
  assert.equal(replay.update(.85, .05), null);
}
console.log('Passed runtime render failure, late frames, and wheel/touch/keyboard recovery.');
