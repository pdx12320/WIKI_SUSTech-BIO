import assert from 'node:assert/strict';
import * as THREE from '../static/vendor/three/three.module.js';
import {AUTO_DOCK_DURATION,autoDockFrame} from '../static/onetake/auto-docking.mjs';
import {createEditReplay} from '../static/onetake/edit-replay.mjs';
import {createBiologyScene} from '../static/onetake/biology-scene.mjs';
assert.deepEqual(autoDockFrame(0).dock,{pod:0,cetus:0});
const puf=autoDockFrame(1.1),apobec=autoDockFrame(2.75);
assert(Math.abs(puf.dock.pod-.5)<1e-8);assert.equal(puf.dock.cetus,0);
assert.equal(apobec.dock.pod,1);assert(Math.abs(apobec.dock.cetus-.5)<1e-8);
assert.deepEqual(autoDockFrame(AUTO_DOCK_DURATION).dock,{pod:1,cetus:1});
const flags=['data-edit-auto-confirm','data-edit-auto-dock','data-edit-scroll-return','data-edit-quick-rewind'];
globalThis.innerWidth=1280;globalThis.innerHeight=800;globalThis.devicePixelRatio=1;
globalThis.window={scrollY:0,scrollTo(){},addEventListener(){}};
let skipClick;const skip={hidden:true,addEventListener(type,fn){skipClick=fn;}};
const root={dataset:{},hasAttribute:a=>flags.includes(a),querySelector:s=>s==='[data-edit-skip]'?skip:null,querySelectorAll:()=>[]};
const replay=createEditReplay({root,story:{getBoundingClientRect:()=>({top:0,height:20800})},toProgress:x=>x,enabled:true});
replay.update(.8,.05);const frames=[];let frame;
for(let i=0;i<650;i++){
 replay.setReady(false); // No user placement or ready notification is needed.
 frame=replay.update(.55,.05);if(frame)frames.push(frame);
 if(frame?.phase==='return')break;
}
assert(!frames.some(f=>f.phase==='placement'));
assert.deepEqual([...new Set(frames.filter(f=>f.phase==='docking').map(f=>f.stage))],['docking-start','dock-puf','dock-apobec','dock-complete']);
assert(frames.filter(f=>f.phase==='docking').every(f=>f.fix===0));
assert.deepEqual([...new Set(frames.filter(f=>f.phase==='edit').map(f=>f.stage))],['confirm','highlight','convert','hold']);
assert.equal(frame.phase,'return');assert.equal(frame.fix,1);assert.equal(frame.cameraBlend,0);
const skipReplay=createEditReplay({root,story:{getBoundingClientRect:()=>({top:0,height:20800})},toProgress:x=>x,enabled:true});
skipReplay.update(.8,.05);skipClick();assert.equal(skipReplay.update(.55,.05).fix,1);
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,1.6,.1,200);
camera.position.set(0,0,15);camera.lookAt(0,0,0);camera.updateMatrixWorld();
const cell={pos:new Float32Array([0,0,0,1,0,0,0,1,0]),meta:new Uint8Array([0,1,2])};
const strand={...cell,target:{x:0}};
const biology=createBiologyScene(THREE,scene,{root,cell,strand,small:false});
const update=t=>biology.update(.55,0,camera,1,{phase:'docking',...autoDockFrame(t)});
const pod=scene.getObjectByName('pod-recognition'),cetus=scene.getObjectByName('cetus-editing');
update(0);const startP=pod.position.clone(),startC=cetus.position.clone();
update(1.1);assert(pod.position.length()<startP.length());assert(cetus.position.distanceTo(startC)<1e-8);
update(2.75);assert(pod.position.length()<1e-8);assert(cetus.position.length()<startC.length());
update(AUTO_DOCK_DURATION);assert(pod.position.length()<1e-8);assert(cetus.position.length()<1e-8);
for(const name of ['pod-docking-outline','cetus-docking-outline']){
 const guide=scene.getObjectByName(name);assert(guide.visible);assert(guide.material.uniforms.uOpacity.value>0);
 const color=guide.geometry.attributes.aColor.array;assert(color[0]>color[1]&&color[1]>color[2],'guide remains pale yellow');
}
console.log('Passed unattended PUF→APOBEC docking before C→U, no placement wait, no early edit, Skip completion, real particle positions and persistent pale yellow guides.');
