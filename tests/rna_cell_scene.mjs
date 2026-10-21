import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as THREE from '../static/vendor/three/three.module.js';
import {cellLayout,rnaCellState,rnaInCell,lipidPath} from '../static/onetake/rna-cell-state.mjs';
import {cellParticleData,createRnaCellScene} from '../static/onetake/rna-cell-scene.mjs';
// Unit and integration checks focus on the meaning of the scale transition:
// molecule identity/containment, independent translation, one transport pass,
// reversible timing, stable contours, mobile framing, and later-scene isolation.
for(const small of [false,true]){
 const width=small?390:1440,height=small?844:900,aspect=width/height,l=cellLayout(aspect);
 const scene=new THREE.Scene(),labels=['rna','astro','neuron','protein','transport','focus','amyloid'].map(name=>({dataset:{rnaCellLabel:name,stages:name==='rna'?'inside translation':name==='astro'?'inside transport':name==='neuron'?'transport flight':name==='amyloid'?'flight':name==='transport'?'transport':'translation'},style:{}}));
 const el={dataset:{},style:{},querySelectorAll:()=>labels};
 const root={querySelector:()=>el,classList:{add(){}}};
 const view=createRnaCellScene(THREE,scene,root,{small}),camera=new THREE.PerspectiveCamera(38,aspect,.1,200);
 const p=new THREE.Vector3(),target=new THREE.Vector3();
 const contours=new Float32Array(view.objects.astro.geometry.attributes.position.array);
 for(const take of [.43,.49,.59,.64,.68,.49,.43]){
  p.fromArray(l.camera);target.set(0,0,0);const bank=view.camera(take,aspect,p,target,null);camera.up.set(Math.sin(bank),Math.cos(bank),0);camera.position.copy(p);camera.lookAt(target);camera.updateMatrixWorld();
  view.update(take,1,camera,null,1,width,height);
  assert.deepEqual(view.objects.astro.geometry.attributes.position.array,contours,'the cell never morphs or heals');
  const visible=labels.filter(n=>!n.hidden).length;assert(visible>=1&&visible<=3,'one to three information points per stage');
  for(const label of labels.filter(n=>!n.hidden)){
   const x=parseFloat(label.style.left),y=parseFloat(label.style.top);
   assert(x>12&&x<width-12&&y>65&&y<height-12,`${label.dataset.rnaCellLabel} stays in ${width}px viewport`);
  }
 }
 view.update(.42,0,camera,null,1,width,height);assert.equal(view.objects.protein.visible,false);
 view.update(.49,0,camera,null,1,width,height);assert(view.objects.protein.visible);
 assert.notEqual(view.objects.protein.geometry,view.objects.astro.geometry);
 view.update(.62,0,camera,null,1,width,height);const end=view.objects.carriers.map(c=>c.position.toArray());
 view.update(.62,40,camera,null,1,width,height);assert.deepEqual(view.objects.carriers.map(c=>c.position.toArray()),end,'lipids do not loop while idle');
 for(const obj of scene.children)assert(obj.isPoints,'every biological subject, callout and relationship path consists of particles');
 assert(scene.children.reduce((n,o)=>n+o.geometry.attributes.position.count,0)<56000);
 view.update(.6,0,camera,{phase:'docking'},1,width,height);assert(el.hidden);assert(scene.children.every(o=>!o.visible));
 p.set(1,2,3);target.set(4,5,6);view.camera(.6,aspect,p,target,{phase:'docking'});assert.deepEqual(p.toArray(),[1,2,3]);
 const molecule=rnaInCell(.5,aspect),center=molecule.position.map((v,i)=>(v-l.astro[i])/([1.45,1.2,.7][i]*l.scale));
 assert(center.reduce((n,v)=>n+v*v,0)<1,'RNA remains inside the astrocyte soma');
 assert(molecule.scale>0,'RNA is retained instead of replaced by cell particles');
 for(const kind of ['astro','neuron','protein']){
  const data=cellParticleData(kind,{small});assert(data.positions.every(Number.isFinite));assert(data.positions.length>300);
 }
}
for(let take=-.2;take<1;take+=.002){
 const original=rnaCellState(take);rnaCellState(1);rnaCellState(-1);assert.deepEqual(rnaCellState(take),original);
 const a=rnaInCell(take),b=rnaInCell(take+.001);assert(Math.abs(a.scale-b.scale)<.02);assert(a.position.every((v,i)=>Math.abs(v-b.position[i])<.06));
}
assert.equal(rnaCellState(.3).opacity,0);assert.equal(rnaCellState(.76).opacity,0);
assert.equal(rnaCellState(.49).transport,0);assert.equal(rnaCellState(.63).transport,1);
assert.deepEqual(lipidPath(2),lipidPath(1));assert.deepEqual(lipidPath(-1),lipidPath(0));
const isolated=new THREE.Scene();createRnaCellScene(THREE,isolated,{querySelector:()=>null});assert.equal(isolated.children.length,0);
const markup=readFileSync(new URL('../wiki/components/rna_cell_context.html',import.meta.url),'utf8');
assert(!/[\u2190-\u21ff\u27f0-\u27ff\u2900-\u297f]/u.test(markup));
for(const text of ['Design schematic','Arg112','Cys112'])assert(markup.includes(text));
console.log('Passed particle-only biology, retained intracellular RNA, separate apoE, one transport pass, stable cell contours, three information points, desktop/mobile labels, reversible handoff, replay and /next isolation.');
