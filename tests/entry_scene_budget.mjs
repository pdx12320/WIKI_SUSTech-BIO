import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const source = readFileSync(new URL('../static/onetake/onetake.js', import.meta.url), 'utf8');
const begin = source.indexOf('    // Let one frame initialize shaders/readiness');
assert.ok(begin > 0);
const guard = source.slice(begin, source.indexOf('    const dt = Math.min(clock.getDelta()', begin));
for (const [started, cover, work] of [[false, 'active', true], [true, 'active', false], [true, 'preview', false], [true, 'leaving', true], [true, undefined, true]]) {
  let ticks = 0, scheduled = 0;
  const scope = { started, document: { documentElement: { dataset: { entryLoading: cover } } },
    clock: { getDelta() { ticks++; return .016; } }, frame() {}, raf: 0,
    requestAnimationFrame() { scheduled++; return 42; } };
  const result = runInNewContext(`(() => { ${guard} return 'render'; })()`, scope);
  assert.equal(result === 'render', work);
  assert.equal(scheduled, work ? 0 : 1);
  assert.equal(ticks, work ? 0 : 1, 'Covered scene clock is drained, so reveal does not jump');
}
console.log('Passed first-frame readiness, covered preview rendering budget, fade/resume and clock handling.');
