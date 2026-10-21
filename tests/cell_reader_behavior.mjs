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
      hidden:false, clientHeight:400, listeners:{}, values:new Set(), styles:{}, attributes:{},
      getBoundingClientRect:() => ({top:200}),
      setAttribute(name,value) {this.attributes[name]=value;},
      focus() {}, setPointerCapture(id) {this.pointerId=id;}, hasPointerCapture(id) {return this.pointerId===id;}, releasePointerCapture() {this.pointerId=null;},
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
    scrollTo(options) {context.lastScroll = options; context.scrollY=options.top;},
  };
  vm.createContext(context); vm.runInContext(code, context);
  return {root, element, context, timers, motion,
    scroll(y) {context.scrollY = y; events.scroll();},
    run(ms) {for (const [id,timer] of [...timers]) if (timer.ms === ms) {timers.delete(id); timer.fn();}},
    resize() {events.resize();},
  };
}
const pointer = (y, extra={}) => ({isPrimary:true,button:0,pointerId:7,clientY:y,preventDefault(){},...extra});
{
  const f=fixture(), handle=f.element('[data-cell-reader-drag]');
  handle.listeners.pointerdown(pointer(200));
  handle.listeners.pointermove(pointer(400));
  assert.equal(f.context.scrollY,1500);assert.equal(f.element('[data-cell-reader-value]').value,'50%');
  assert.equal(handle.attributes['aria-valuenow'],'50');
  handle.listeners.pointermove(pointer(900));assert.equal(f.context.scrollY,3000);
  handle.listeners.pointermove(pointer(-200));assert.equal(f.context.scrollY,0);
  handle.listeners.pointerup(pointer(200));assert.equal(handle.pointerId,null);
  assert(!f.root.values.has('cell-reader__dragging'));
  assert.equal(handle.listeners.click,undefined,'Click must never jump to the top');
  handle.listeners.keydown({key:'End',preventDefault(){}});assert.equal(f.context.scrollY,3000);
  handle.listeners.keydown({key:'ArrowUp',preventDefault(){}});assert.equal(f.context.scrollY,2960);
  handle.listeners.keydown({key:'Home',preventDefault(){}});assert.equal(f.context.scrollY,0);
  handle.listeners.pointerdown(pointer(200));handle.listeners.pointercancel(pointer(200));
  assert(!f.root.values.has('cell-reader__dragging'));
  assert.equal([...f.timers.values()].some(t=>[400,6500].includes(t.ms)),false,'No eye-rest reminders');
}
{
  const f=fixture(2100);assert.equal(f.element('[data-cell-reader-value]').value,'70%');
  f.scroll(1001);f.scroll(2001);
  assert.equal([...f.timers.values()].some(t=>[400,6500].includes(t.ms)),false);
}
{
  const f=fixture();f.scroll(500);assert(f.root.values.has('cell-reader__swimming'));
  f.run(100);assert(f.root.values.has('cell-reader__swimming'));
  const body=f.element('.cell-reader__swim-body');
  body.listeners.animationiteration({target:body});assert(!f.root.values.has('cell-reader__swimming'));
  f.scroll(600);f.motion.matches=true;f.motion.change();assert(!f.root.values.has('cell-reader__swimming'));
}
{
  const f=fixture(0,true);f.scroll(1200);assert(!f.root.values.has('cell-reader__swimming'));
  f.context.document.documentElement.scrollHeight=1000;f.resize();assert(f.root.hidden);
  f.context.document.documentElement.scrollHeight=4000;f.resize();assert(!f.root.hidden);
}
{
  const f=fixture(0,true,600),handle=f.element('[data-cell-reader-drag]');
  assert(f.root.hidden);f.scroll(599);assert(f.root.hidden);
  f.scroll(600);assert(!f.root.hidden);assert.equal(f.element('[data-cell-reader-value]').value,'0%');
  handle.listeners.pointerdown(pointer(200));handle.listeners.pointermove(pointer(400));
  assert.equal(f.context.scrollY,1800);assert.equal(f.element('[data-cell-reader-value]').value,'50%');
  // Resizing the rail must rebase the grab point instead of jumping the page.
  f.element('.cell-reader__rail').clientHeight=300;f.resize();
  handle.listeners.pointermove(pointer(400));assert.equal(f.context.scrollY,1800);
  handle.listeners.pointerup(pointer(400));
  handle.listeners.keydown({key:'Home',preventDefault(){}});assert.equal(f.context.scrollY,600);
  f.scroll(3000);assert.equal(f.element('[data-cell-reader-value]').value,'100%');
  f.scroll(200);assert(f.root.hidden);
}
console.log('Passed drag scrolling, bounds, cancellation, keyboard, resizing, custom reading start, progress and reduced motion; no return-to-top or reminder handlers.');
