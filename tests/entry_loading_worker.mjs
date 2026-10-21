import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const source = readFileSync(new URL('../static/entry-loading/entry-loading.js', import.meta.url), 'utf8');
let now = 0, next = 0, letters = 0;
const frames = new Map(), messages = [];
const context = { setTransform() {}, clearRect() {}, save() {}, restore() {}, beginPath() {}, moveTo() {}, lineTo() {}, closePath() {}, clip() {},
  drawImage() { letters++; } };
const sandbox = { self: {}, performance: { now: () => now },
  requestAnimationFrame(fn) { const id = ++next; frames.set(id, fn); return id; }, cancelAnimationFrame(id) { frames.delete(id); },
  postMessage: data => messages.push(data),
  OffscreenCanvas: class { getContext() { return { fillText() {} }; } },
};
runInNewContext(source, sandbox);
sandbox.self.onmessage({ data: { type: 'init', canvas: { getContext: () => context }, width: 1063, height: 756, dpr: 1.5, debug: true } });
assert.equal(messages[0].type, 'ready');
for (let i = 0; i < 80; i++) {
  now += 16.67;
  const pending = [...frames.values()]; frames.clear(); pending.forEach(fn => fn(now));
}
assert.ok(letters > 50000, 'Worker draws independently without any page main-thread animation callbacks');
assert.ok(messages.some(m => m.type === 'stats' && m.backend === 'worker'));
sandbox.self.onmessage({ data: { type: 'pointer', clientX: 420, clientY: 440 } });
sandbox.self.onmessage({ data: { type: 'resize', width: 390, height: 844, dpr: 1.5 } });
sandbox.self.onmessage({ data: { type: 'stop' } }); assert.equal(frames.size, 0);
assert.ok(!messages.some(m => m.type === 'error'));
console.log('Passed independent worker rendering, diagnostics, pointer/resize messages and termination.');
