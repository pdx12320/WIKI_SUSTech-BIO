import assert from 'node:assert/strict';
import {createMemoryGrab,containsMemory} from '../static/onetake/memory-grab.mjs';
const record=(name,z=0)=>({item:{name,fling:null},x:200,y:200,width:120,height:80,roll:z,tilt:.3,squash:.8,alpha:1});
const far=record('far'),near=record('near'),grab=createMemoryGrab();
assert(containsMemory(record('rotated',Math.PI/2),200,245));
assert(!containsMemory(record('rotated',Math.PI/2),260,200));
assert(containsMemory({...record('reverse'),stretch:-.5,squash:-.6},220,210));
assert(!containsMemory({...record('edge'),stretch:.16},230,200));
assert(grab.begin([far,near],210,215,5,[.2,.4]));
assert.equal(grab.active.item,near.item); // Nearest painted object wins.
grab.move(400,350,9);assert.equal(grab.active.x,200); // Ignore a second pointer.
grab.move(400,350,5);assert.equal(grab.active.x,390);assert.equal(grab.active.y,335);
assert.deepEqual(grab.active.camera,[.2,.4]);
assert.equal(grab.release(9),null);assert(grab.active);
const released=grab.release(5);assert.equal(released.x,390);assert.equal(grab.active,null);
near.item.fling={};assert(grab.begin([far,near],200,200,6,[0,0]));
assert.equal(grab.active.item,far.item);assert(grab.cancel());assert.equal(grab.active,null);
assert(!grab.begin([{...far,alpha:.1}],200,200,1,[0,0]));
console.log('Passed transformed picking, topmost memory, grab offset, pointer identity, release/cancel, camera lock and flying-object exclusion.');

// Exercise the actual event wiring and renderer, not just the picking helper.
const {createMemoryTunnel,TUNNEL_OBJECT_TYPES}=await import('../static/onetake/memory-tunnel.mjs');
let now=0,painted=[],position=[0,0];const handlers={};
Object.defineProperty(globalThis,'performance',{value:{now:()=>now},configurable:true});
globalThis.innerWidth=1280;globalThis.innerHeight=800;
globalThis.addEventListener=(name,fn)=>(handlers[name]??=[]).push(fn);
const noop=()=>{};
const context=new Proxy({translate:(x,y)=>{position=[x,y];},drawImage:(...args)=>{
  if(args.length===5)painted.push({x:position[0],y:position[1],width:args[3]});
}}, {get:(o,k)=>o[k]??noop,set:(o,k,v)=>(o[k]=v,true)});
globalThis.document={createElement:()=>({setAttribute:noop,getContext:()=>context})};
const room={classList:{add:noop},prepend:noop,dataset:{},addEventListener:noop};
const tunnel=createMemoryTunnel(room);
for(const name of TUNNEL_OBJECT_TYPES)tunnel.register(name,{width:88,height:68});
tunnel.update(0,0,0,-1,-1,false,false);
const target=painted.reverse().find(r=>r.width>35&&r.x>150&&r.x<1100&&r.y>160&&r.y<650);
assert(target);
const emit=(name,props={})=>handlers[name].forEach(fn=>fn({pointerId:1,button:0,target:{closest:()=>null},preventDefault:noop,...props}));
emit('pointerdown',{clientX:target.x,clientY:target.y});assert.equal(room.dataset.tunnelDrag,'held');
emit('pointermove',{clientX:target.x+100,clientY:target.y+70});
now=40;tunnel.update(0,1,1,target.x+100,target.y+70,true,false);
assert.equal(room.dataset.tunnelCamera,'0.00,0.00');
const dragged=room.dataset.tunnelDragged;assert(dragged);
now=80;tunnel.update(0,-1,-1,target.x+100,target.y+70,true,false);
assert.equal(room.dataset.tunnelDragged,dragged); // Held memory doesn't fly off.
emit('pointerup');assert.equal(room.dataset.tunnelDrag,'released');
for(let i=0;i<20;i++){now+=40;tunnel.update(0,0,0,-1,-1,false,false);}
assert(Number(room.dataset.tunnelTravel)>0);
tunnel.cancel();emit('pointerdown',{clientX:target.x,clientY:target.y});
assert.equal(room.dataset.tunnelDrag,'released'); // Hidden opening cannot grab.
console.log('Passed renderer pointer drag, stable held position, camera freeze, release flight and hidden-scene input cleanup.');
