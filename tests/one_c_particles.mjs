import assert from 'node:assert/strict';
import * as THREE from '../static/vendor/three/three.module.js';
import {cellLayout,rnaInCell} from '../static/onetake/rna-cell-state.mjs';
import {oneCParticleData,oneCCameraPose,createOneCParticles} from '../static/onetake/one-c-particles.mjs';
for(const small of [false,true]){
 const data=oneCParticleData({small});
 assert(data.roles.length<26000,'the volumetric RNA stays within its independent particle budget');
 assert.equal(data.normals.length,data.positions.length);
 assert.deepEqual(data.positions,data.ends,'the comparison preserves all RNA particle identities');
 assert(data.roles.includes(6),'one nucleotide is separately identified as the target');
 const depth=[];
 for(let i=0;i<data.positions.length;i++){assert(Number.isFinite(data.positions[i]));if(i%3===2)depth.push(data.positions[i]);}
 assert(Math.max(...depth)-Math.min(...depth)>2.5,'the RNA has substantial foreground/background depth');
 const aspect=small?390/844:1440/900,camera=new THREE.PerspectiveCamera(38,aspect,.1,200);
 const scene=new THREE.Scene(),view=createOneCParticles(THREE,scene,{small});
 const labelSize=take=>{
  const pose=oneCCameraPose(take,0,aspect);camera.position.fromArray(pose.position);camera.lookAt(new THREE.Vector3().fromArray(pose.look));camera.updateMatrixWorld();
  view.update(take,0,.016,false,null);
  const labels=view.labels(camera,small?390:1440,small?844:900);
  for(const label of take>.2?labels:[labels[0]])assert(label.x>0&&label.x<(small?390:1440)&&label.y>0&&label.y<(small?844:900)&&label.visible);
  return labels[0].size;
 };
 assert(labelSize(0)>labelSize(.3)*4,'the same projected C recedes into its nucleotide context');
}
const scene=new THREE.Scene(),view=createOneCParticles(THREE,scene),geometry=view.points.geometry;
view.update(.3,0,.016,false,null);assert(view.points.visible);
view.update(.3,1,.1,true,null);assert.equal(view.points.geometry,geometry);assert(view.points.material.uniforms.uEdit.value>0);assert.equal(view.points.material.uniforms.uTime.value,1);
assert.notDeepEqual(oneCCameraPose(.3,0),oneCCameraPose(.5,0),'camera continues along the RNA after the reveal');
assert.notDeepEqual(oneCCameraPose(.4,0),oneCCameraPose(.4,1),'camera drifts at a stationary scroll position');
const pos=new THREE.Vector3(9,8,7),look=new THREE.Vector3(2,3,4);
view.camera(.55,1,1.6,pos,look,{phase:'docking'});assert.deepEqual(pos.toArray(),[9,8,7]);
view.update(.55,2,.1,false,{phase:'docking'});assert.equal(view.points.visible,false);
const isolated=new THREE.Scene();createOneCParticles(THREE,isolated,{enabled:false});assert.equal(isolated.children.length,0);
console.log('Passed volumetric single-backbone RNA, unchanged molecular particles, projected codon labels, continuous camera motion, desktop/mobile framing, replay and /next isolation.');

// The existing RNA object becomes intracellular without changing its vertices.
for(const small of [false,true]){
 globalThis.innerWidth=small?390:1440;globalThis.innerHeight=small?844:900;
 const aspect=innerWidth/innerHeight,l=cellLayout(aspect),view=createOneCParticles(THREE,new THREE.Scene(),{small});
 const object=view.points,geometry=object.geometry,positions=new Float32Array(geometry.attributes.position.array);
 for(const take of [.3,.5,.68,.3]){
  view.update(take,0,.016,false,null);assert.equal(view.points,object);assert.equal(object.geometry,geometry);assert.deepEqual(geometry.attributes.position.array,positions);assert(object.visible);
 }
 view.update(.5,0,.016,false,null);
 for(let i=0;i<positions.length;i+=3){
  const distance=[0,1,2].reduce((n,j)=>n+((object.position.getComponent(j)+positions[i+j]*object.scale.x-l.astro[j])/([1.45,1.2,.7][j]*l.scale))**2,0);
  assert(distance<1,'every RNA particle remains inside the astrocyte soma');
 }
 view.update(.76,0,.016,false,null);assert(!object.visible);
}
delete globalThis.innerWidth;delete globalThis.innerHeight;
console.log('Passed actual RNA object identity, unchanged vertices, full molecular containment and reversible cell-scale transition.');
