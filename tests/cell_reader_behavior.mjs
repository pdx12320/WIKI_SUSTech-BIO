// Exercise timing, scroll restoration and reduced-motion behavior without a browser.
import vm from 'node:vm';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const code = fs.readFileSync(new URL('../static/cell-reader/cell-reader.js', import.meta.url), 'utf8');
function fixture(start = 0, reduced = false, readingOrigin = null) {
  const nodes = new Map(), events = {}, timers = new Map(); let timerId = 0;
  const motion = {matches:reduced, addEventListener(name, fn) {this[name] = fn;}};
  function element(key) {
    if (!nodes.has(key)) nodes.set(key, {
      hidden:false, clientHeight:400, listeners:{}, values:new Set(), styles:{},
      style:{setProperty(name, value) {element(key).styles[name] = value;}},
      classList:{toggle(name, on) {on ? element(key).values.add(name) : element(key).values.delete(name);}},
      getAttribute:() => readingOrigin === null ? null : '#reading-start',
      querySelector:element, addEventListener(name, fn) {this.listeners[name] = fn;},
    });
    return nodes.get(key);
  }
  const root = element('[data-cell-reader]');
  const context = {
    window:{}, innerHeight:1000, scrollY:start, document:{
      documentElement:{scrollHeight:4000}, body:{},
      querySelector:key => key === 'footer' ? null : key === '#reading-start' ? {getBoundingClientRect:() => ({top:readingOrigin - context.scrollY})} : element(key),
    }, matchMedia:() => motion,
    setTimeout(fn, ms) {timers.set(++timerId, {fn, ms}); return timerId;},
    clearTimeout(id) {timers.delete(id);},
    addEventListener(name, fn) {events[name] = fn;},
    requestAnimationFrame(fn) {fn();},
    scrollTo(options) {context.lastScroll = options;},
  };
  vm.createContext(context); vm.runInContext(code, context);
  return {root, element, context, timers, motion,
    scroll(y) {context.scrollY = y; events.scroll();},
    run(ms) {for (const [id,timer] of [...timers]) if (timer.ms === ms) {timers.delete(id); timer.fn();}},
    resize() {events.resize();},
  };
}
{
  const f = fixture();
  f.scroll(1001); assert.match(f.element('[data-cell-reader-message]').textContent,/One third/);
  assert(f.root.values.has('cell-reader__resting'));
  f.run(400); assert(!f.root.values.has('cell-reader__resting'));
  assert.equal(f.element('.cell-reader__tip').hidden,false);
  f.run(6500); assert.equal(f.element('.cell-reader__tip').hidden,true);
  f.scroll(0); f.scroll(1001); assert.equal(f.element('.cell-reader__tip').hidden,true);
  f.scroll(2001); assert.match(f.element('[data-cell-reader-message]').textContent,/Two thirds/);
  f.element('[data-cell-reader-dismiss]').listeners.click();
  assert.equal(f.timers.size > 0,true); // Idle timer is independent of reminder timers.
  assert.equal([...f.timers.values()].some(t => [400,6500].includes(t.ms)),false);
}
{
  const f = fixture(2100); // A restored position must not immediately trigger a reminder.
  assert.equal(f.element('[data-cell-reader-message]').textContent,undefined);
  assert.equal(f.element('[data-cell-reader-value]').value,'70%');
  f.scroll(0); f.scroll(2500); assert.match(f.element('[data-cell-reader-message]').textContent,/Two thirds/);
}
{
  const f = fixture(); f.scroll(500); assert(f.root.values.has('cell-reader__swimming'));
  f.run(100); assert(f.root.values.has('cell-reader__swimming'));
  const body = f.element('.cell-reader__swim-body');
  body.listeners.animationiteration({target:body}); assert(!f.root.values.has('cell-reader__swimming'));
  f.scroll(600); f.motion.matches = true; f.motion.change(); assert(!f.root.values.has('cell-reader__swimming'));
  f.element('[data-cell-reader-top]').listeners.click(); assert.equal(f.context.lastScroll.behavior,'instant');
}
{
  const f = fixture(0,true); f.scroll(1200); assert(!f.root.values.has('cell-reader__swimming'));
  f.context.document.documentElement.scrollHeight = 1000; f.resize(); assert(f.root.hidden);
  f.context.document.documentElement.scrollHeight = 4000; f.resize(); assert(!f.root.hidden);
}
console.log('PASS: cell progress, once-only reminders, 400ms eye reset, dismissal, restored scroll, landing, reduced motion, short-page recovery.');

{
  const f = fixture(0, true, 600);
  assert(f.root.hidden, 'opening photo hides the cell');
  f.scroll(599); assert(f.root.hidden);
  f.scroll(600); assert(!f.root.hidden); assert.equal(f.element('[data-cell-reader-value]').value, '0%');
  f.scroll(1401); assert.match(f.element('[data-cell-reader-message]').textContent, /One third/);
  f.run(6500);
  f.scroll(2201); assert.match(f.element('[data-cell-reader-message]').textContent, /Two thirds/);
  f.element('[data-cell-reader-top]').listeners.click(); assert.equal(f.context.lastScroll.top,600);
  f.scroll(3000); assert.equal(f.element('[data-cell-reader-value]').value, '100%');
  f.scroll(200); assert(f.root.hidden); assert.equal(f.element('.cell-reader__tip').hidden,true);
  console.log('PASS: photo excluded; title starts at 0%; both reminders use new range; back-to-top returns to title.');
}
