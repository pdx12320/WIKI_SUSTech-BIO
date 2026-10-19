// Reading stages must be deterministic in both scroll directions.
import assert from 'node:assert/strict';
import { parisState } from '../static/onetake/dementia-paris.mjs';
import { BURDEN_IN, BURDEN_OUT } from '../static/onetake/burden-pacing.mjs';
const at = p => parisState(BURDEN_IN + p * (BURDEN_OUT - BURDEN_IN));
assert.equal(at(.1).step, 0);
assert.equal(at(.1).cities, 1);
assert.equal(at(.3).step, 1);
assert.equal(at(.6).step, 2);
assert.equal(at(.8).cities, 27);
assert.equal(at(.97).step, 3);
for (let i = 0; i <= 100; i++) {
  const p = i / 100;
  const expected = at(p);
  at(1); at(0); // Scrubbing back must not depend on the preceding frame.
  assert.deepEqual(at(p), expected);
  assert.ok(expected.cities >= 1 && expected.cities <= 27);
}
assert.equal(parisState(.782).scene, 1);
assert.equal(parisState(.795).question, 0);
assert.equal(parisState(.81).scene, 0);
assert.equal(parisState(.81).question, 1);
assert.ok(57e6 / 2133111 > 26.7 && 57e6 / 2133111 < 27);
console.log('Passed Paris reading stages, reverse scroll, reveal bounds, handoff and ratio');
