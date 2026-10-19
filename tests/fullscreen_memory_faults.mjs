import assert from 'node:assert/strict';
import {fullscreenFaultPhase,createFullscreenMemoryFaults} from '../static/onetake/fullscreen-memory-faults.mjs';
assert(!fullscreenFaultPhase(0).active);assert(fullscreenFaultPhase(1000).active);
assert(!fullscreenFaultPhase(2000).active);assert(fullscreenFaultPhase(2800).active);
assert.deepEqual(fullscreenFaultPhase(5600),fullscreenFaultPhase(1000));
let now=0,layer;const rectangles=[];const noop=()=>{};
Object.defineProperty(globalThis,'performance',{value:{now:()=>now},configurable:true});
globalThis.innerWidth=1280;globalThis.innerHeight=800;
globalThis.document={body:{append:n=>{layer=n;}},createElement:()=>({
  style:{},dataset:{},setAttribute:noop,append(...children){this.children=children;},
  getContext:()=>({setTransform:noop,clearRect:noop,fillRect:(...r)=>rectangles.push(r)}),
})};
const effect=createFullscreenMemoryFaults();
assert.equal(layer.style.pointerEvents,'none');assert.equal(layer.style.position,'fixed');
assert.equal(layer.style.inset,'0');assert(Number(layer.style.zIndex)>1000000);
now=1000;effect.update(0,false);assert.equal(layer.hidden,false);
assert(rectangles.some(([,y])=>y<110)); // Corruption reaches the navigation.
assert(rectangles.some(([,y])=>y>300)); // And the title/story surface.
effect.update(1,false);assert.equal(layer.hidden,true);
effect.update(0,true);assert.equal(layer.hidden,true);
now=2000;effect.update(0,false);assert.equal(layer.hidden,true);
console.log('Passed full-viewport/topmost/nonblocking layer, nav/story coverage, brief bursts, quiet gaps, exit and reduced-motion cleanup.');
