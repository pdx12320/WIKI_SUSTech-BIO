import {normalizeMemoryTuning} from '../static/onetake/memory-tuning.mjs';
import {memoryPresence,memoryMaxWidth,memoryEdgePresence} from '../static/onetake/memory-clear-center.mjs';
import {memoryTumble} from '../static/onetake/memory-tumble.mjs';
import {dodgePosition,crossedMemory} from '../static/onetake/memory-dodge.mjs';
import assert from 'node:assert/strict';
import {projectMemoryPass,createMemoryTunnel,TUNNEL_OBJECT_TYPES,TUNNEL_DEPTH,memorySpeed,memoryType,memorySize} from '../static/onetake/memory-tunnel.mjs';
// Stable identities move closer and grow; wrapping always respawns at depth.
const far=projectMemoryPass(10,0,1280,800),near=projectMemoryPass(10,400,1280,800);
assert(near.z<far.z);assert(near.scale>far.scale);
for(let i=0;i<48;i++)for(const time of [0,1,1000,3400,1e7]){
 const p=projectMemoryPass(i,time,390,844);
 assert(p.z>=120&&p.z<TUNNEL_DEPTH+120);assert(Number.isFinite(p.x+p.y+p.scale));
 assert(Number.isFinite(p.roll+p.tilt));
}
const quadrants=new Set(Array.from({length:48},(_,i)=>{const p=projectMemoryPass(i,0,1280,800);return `${Math.sign(p.x)},${Math.sign(p.y)}`;}));
for(const q of ['1,1','1,-1','-1,1','-1,-1'])assert(quadrants.has(q));
const atPhase=phase=>projectMemoryPass(4,(4*211.7-(1-phase)*TUNNEL_DEPTH)/memorySpeed(4),1280,800);
assert(atPhase(.73).arc>.99);assert(atPhase(.4).arc<.01);assert(atPhase(.95).arc<.01);
assert(atPhase(.8).roll>atPhase(.6).roll);
const wrapped=projectMemoryPass(4,999,1280,800),again=projectMemoryPass(4,999+TUNNEL_DEPTH/memorySpeed(4),1280,800);
assert(Math.abs(wrapped.x-again.x)<1e-8);assert(Math.abs(wrapped.roll-again.roll)<1e-8);
const frontal=projectMemoryPass(2,300,1280,800),dodging=projectMemoryPass(2,300,1280,800,1,1);
assert(frontal.incoming);assert(frontal.contact);assert(!dodging.contact);
assert(dodging.x<frontal.x);assert(dodging.y<frontal.y);
assert(dodgePosition(2).contact);assert(!dodgePosition(2,1,1).contact);
assert(crossedMemory(330,280));assert(!crossedMemory(130,6200));assert(!crossedMemory(280,250));
// Actual depth displacement differs by type and by instance, with no wrapping.
const step=i=>projectMemoryPass(i,0,1280,800).z-projectMemoryPass(i,40,1280,800).z;
assert(step(4)>step(6)*2);assert(step(10)>step(12)*1.5);
// Handwritten cards are rare, smaller, and never thrown into the center.
const letters=Array.from({length:96},(_,i)=>i).filter(i=>memoryType(i)==='letter');
assert.deepEqual(letters,[14,62]);
for(const i of letters){
 assert.equal(memorySize(i),.6);
 for(const time of [0,1000,3400,1e7]){
  const p=projectMemoryPass(i,time,1280,800);
  assert(!p.incoming);assert(!p.airborne);assert.equal(p.arc,0);
 }
 assert(memorySpeed(i)<memorySpeed(10));
}
assert.equal(memorySize(4),1);
assert.equal(new Set(Array.from({length:96},(_,i)=>memoryType(i))).size,12);
assert.notEqual(memorySpeed(4),memorySpeed(11));
for(let i=0;i<48;i++)assert(memorySpeed(i)>.45&&memorySpeed(i)<1.9);
// Ambient memories turn through different axes in both directions.
assert(memoryTumble(0,.8).roll<memoryTumble(0,.2).roll);
assert(memoryTumble(1,.8).roll>memoryTumble(1,.2).roll);
const poses=Array.from({length:50},(_,i)=>memoryTumble(3,i/50));
assert(poses.some(p=>p.stretch<0)&&poses.some(p=>p.stretch>0));
assert(poses.some(p=>p.squash<0)&&poses.some(p=>p.squash>0));
for(const p of poses){assert(Math.abs(p.stretch)>=.16);assert(Math.abs(p.squash)>=.16);}
assert.notEqual(projectMemoryPass(3,0,1280,800).stretch,projectMemoryPass(3,400,1280,800).stretch);
for(const [w,h] of [[1280,800],[390,844]]){
 assert.equal(memoryPresence(w*.5,h*.47,120,90,w,h),0);
 assert.equal(memoryPresence(w*.05,h*.15,60,45,w,h),1);
 assert(memoryMaxWidth(w,h,1.3)<=w*.29);
}
assert.equal(memoryEdgePresence(120,100,120,90,1280,800,112),0);
assert.equal(memoryEdgePresence(300,350,100,80,1280,800,112),1);
assert(memoryEdgePresence(0,350,80,60,1280,800,112)<memoryEdgePresence(60,350,80,60,1280,800,112));
assert.equal(memoryEdgePresence(-40,350,80,60,1280,800,112),0);
let now=0;
Object.defineProperty(globalThis,'performance',{value:{now:()=>now},configurable:true});
globalThis.innerWidth=1280;globalThis.innerHeight=800;
const noop=()=>{};const context=new Proxy({}, {get:(o,k)=>o[k]??noop,set:(o,k,v)=>(o[k]=v,true)});
globalThis.document={createElement:()=>({setAttribute:noop,getContext:()=>context})};
globalThis.addEventListener=()=>{};
const room={addEventListener:noop,classList:{add:noop},prepend:noop,dataset:{}};
const tunnel=createMemoryTunnel(room);
assert.equal(TUNNEL_OBJECT_TYPES.length,12);
for(const name of TUNNEL_OBJECT_TYPES)tunnel.register(name,{width:88,height:68});
tunnel.register('brain',{width:88,height:68});
tunnel.update(0,0,0,-1,-1,false,false);now=40;tunnel.update(0,0,0,-1,-1,false,false);
assert.equal(room.dataset.tunnelSources,'12');
assert(Number(room.dataset.tunnelTravel)>0);
const moving=room.dataset.tunnelTravel;
now=80;tunnel.update(0,0,0,-1,-1,false,true);assert.equal(room.dataset.tunnelTravel,moving);
now=120;tunnel.update(1,0,0,-1,-1,false,false);assert.equal(room.dataset.tunnelTravel,moving);
for(let frame=0;frame<100;frame++){now+=40;tunnel.update(0,0,0,-1,-1,false,false);}
assert.equal(room.dataset.tunnelEncounter,'quiet-pass');
for(let frame=0;frame<100;frame++){now+=40;tunnel.update(0,1,1,-1,-1,false,false);}
assert.equal(room.dataset.tunnelEncounter,'quiet-pass'); // Offscreen passes must not flash the frame.
assert.deepEqual(normalizeMemoryTuning({count:999,speed:-1}),{count:144,speed:0});
assert.deepEqual(normalizeMemoryTuning({count:NaN,speed:Infinity}),{count:36,speed:1});
tunnel.setTuning({count:141,speed:1.2});
assert.equal(room.dataset.tunnelCount,'141');
assert.equal(room.dataset.tunnelSpeed,'1.2');
tunnel.setTuning({count:0,speed:0});const paused=room.dataset.tunnelTravel;
now+=40;tunnel.update(0,0,0,-1,-1,false,false);assert.equal(room.dataset.tunnelTravel,paused);
assert.equal(room.dataset.tunnelCount,'0');
tunnel.setTuning({count:72,speed:2});now+=40;tunnel.update(0,0,0,-1,-1,false,false);
assert(Math.abs(Number(room.dataset.tunnelTravel)-Number(paused)-184)<.11);
assert.equal(room.dataset.tunnelCount,'72');assert.equal(room.dataset.tunnelSpeed,'2');
console.log('Passed independent object speeds, overtaking, forward depth/scale, continuous wrapping, four-sided projection, inward arc and tumble, mouse steering, quiet center, peripheral encounters, idle movement, reduced motion and exit pause.');
