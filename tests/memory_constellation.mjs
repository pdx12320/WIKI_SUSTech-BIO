import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import * as THREE from '../static/vendor/three/three.module.js';
import {buildScrollTrack} from '../static/onetake/burden-pacing.mjs';
import {paceCellScroll} from '../static/onetake/cell-scroll-pacing.mjs';
import {memoryConstellationState,memoryPopulationTake,memoryQuestionState,paceMemoryConstellation} from '../static/onetake/memory-constellation-state.mjs';
import {createMemoryQuestion} from '../static/onetake/memory-question.mjs';
import {createMemoryConstellation,memoryStarData,memorySignalPoint} from '../static/onetake/memory-constellation.mjs';
const source=readFileSync(new URL('../static/onetake/onetake.js',import.meta.url),'utf8');
const keys=[...source.matchAll(/\{ p: ([-\d.]+), stage: ([-\d.]+)/g)].map(m=>({p:+m[1],stage:+m[2]}));
const base=paceCellScroll(buildScrollTrack(keys,{paris:true,stagedConclusions:true}),true);
const preview=paceMemoryConstellation(base,true),distance=(m,t)=>{
 const p=m.track.find(p=>t>=p.from&&t<=p.to);
 return p.start+(t-p.from)/(p.to-p.from)*(p.end-p.start);
};
assert.equal(paceMemoryConstellation(base,false),base,'routes without the memory component keep the exact existing mapping');
for(const [a,b] of [[.1,.6],[.62,.72],[.771,.780],[.797,.98]])
 assert.ok(Math.abs(distance(base,b)-distance(base,a)-distance(preview,b)+distance(preview,a))<1e-9,'outside scenes keep their scroll speed');
assert.ok(Math.abs((distance(preview,.771)-distance(preview,.758))/(distance(base,.771)-distance(base,.758))-1.7)<1e-9,'one-to-27 Paris retreat gets 70% more scroll distance');
assert.ok(Math.abs((distance(preview,.797)-distance(preview,.780))/(distance(base,.797)-distance(base,.780))-1.8)<1e-9,'27-city-to-neuron return gets 80% more scroll distance');
assert(memoryQuestionState(.790).prefix>.99);
assert(memoryQuestionState(.7828).prefix>.99&&memoryQuestionState(.7828).cityFade>.99,'What if appears while the 27-city view is still intact');
assert.equal(memoryQuestionState(.790).full,0);
for(let t=.780;t<.815;t+=.0001){
 const s=memoryQuestionState(t);
 if(s.full>0)assert.equal(s.cityFade,0,'the complete question never coexists with any tower');
}
assert.equal(memoryQuestionState(.803,{phase:'question'}).full,1,'automatic question hold can display the complete question');
assert.equal(memoryQuestionState(.803,{phase:'rewind'}).presence,0,'question disappears before cities return during rewind');
{
 const scene=new THREE.Scene(),nodes=[{style:{},setAttribute(){}},{style:{},setAttribute(){}}];
 const section={hidden:true,querySelector:s=>nodes[s.includes('prefix')?0:1]};
 const qroot={querySelector:()=>section,classList:{contains:()=>false}};
 const cities=new THREE.Points(new THREE.BufferGeometry(),new THREE.ShaderMaterial({uniforms:{uOpacity:{value:1}}}));cities.name='paris-population-world-particles';scene.add(cities);
 const amyloid=new THREE.Points(new THREE.BufferGeometry(),new THREE.ShaderMaterial({uniforms:{uParisMorph:{value:1},uOpacity:{value:.4}}}));amyloid.name='extracellular-amyloid';scene.add(amyloid);
 const view=createMemoryQuestion(scene,qroot);
 view.update(.803,{phase:'question'});assert.equal(cities.visible,false);assert.equal(cities.material.uniforms.uOpacity.value,0);assert.equal(amyloid.material.uniforms.uParisMorph.value,0);assert.equal(amyloid.material.uniforms.uOpacity.value,.4,'Aβ remains beside the neuron');assert.equal(nodes[1].style.opacity,'1');
 cities.material.uniforms.uOpacity.value=1;amyloid.material.uniforms.uParisMorph.value=1;
 view.update(.790,null);assert.equal(cities.visible,true);assert.equal(nodes[1].style.opacity,'0');
 view.update(.803,{phase:'rewind'});assert.equal(section.hidden,true);
 view.update(.775,null);assert.equal(cities.visible,true,'backward traversal restores the original city object');
 view.dispose();assert.equal(section.hidden,true);
}
for(let t=-.19;t<=1;t+=.0003){
 const d=distance(preview,t),s=preview.track.find(s=>d<=s.end);
 assert.ok(Math.abs(s.from+(d-s.start)/(s.end-s.start)*(s.to-s.from)-t)<1e-9);
 assert.equal(memoryPopulationTake(t,false),t);
 assert.ok(memoryPopulationTake(t)>=memoryPopulationTake(t-.0001)-1e-10);
}
assert.equal(memoryPopulationTake(.745),.737,'tower cannot form during symptoms');
assert.equal(memoryPopulationTake(.760),.760,'27-city pullback resumes on its original clock');
assert.ok(memoryConstellationState(.749).presence>.99);
assert.equal(memoryConstellationState(.749).loss,1);
assert.equal(memoryConstellationState(.749).disorient,1);
assert.equal(memoryConstellationState(.749,{phase:'edit'}).presence,0);
const brain={pos:new Float32Array(Array.from({length:12000},(_,i)=>Math.sin(i*.3)*3))};
const original=brain.pos.slice(),data=memoryStarData(brain.pos);
assert.deepEqual(memoryStarData(brain.pos),data);
assert(data.position.every(Number.isFinite));
assert(data.anchors.some(a=>a.loss<1)&&data.anchors.filter(a=>a.loss>1).length>data.anchors.length*.6,'local loss leaves a majority of memories lit');
assert(data.edges.filter(e=>e.bridge).length<16,'sparse, readable inter-cluster structure');
const edge=data.edges.find(e=>e.bridge);
const normal=memorySignalPoint(edge,data.anchors,.5,0),lost=memorySignalPoint(edge,data.anchors,.5,1);
assert(Math.hypot(...normal.map((v,i)=>v-lost[i]))>.3,'disorientation changes the signal path');
const root={querySelector:()=>({querySelectorAll:()=>[]}),classList:{contains:()=>false},style:{setProperty(){}},dataset:{}};
for(const aspect of [1.6,825/756,.85,390/844]){
 const scene=new THREE.Scene(),view=createMemoryConstellation(THREE,scene,root,{brain,small:aspect<1});
 const camera=new THREE.PerspectiveCamera(38,aspect,.1,200);
 let last=null;
 for(let take=.728;take<=.756;take+=.00005){
  const p=new THREE.Vector3(1,2,16),look=new THREE.Vector3();
  view.camera(take,4,aspect,p,look,null);
  assert(p.toArray().every(Number.isFinite));
  if(last)assert(p.distanceTo(last)<1.4,'continuous camera with no boundary teleport');last=p.clone();
  camera.position.copy(p);camera.lookAt(look);camera.updateMatrixWorld();
  view.update(take,4,camera,null);
 }
 // Same take and time must yield identical state after traversing both ways.
 const read=()=>[view.objects.stars.material.uniforms.uLoss.value,view.objects.lines.material.uniforms.uDisconnect.value,Array.from(view.objects.flow.geometry.attributes.position.array)];
 view.update(.746,4,camera,null);const before=read();view.update(.756,4,camera,null);view.update(.730,4,camera,null);view.update(.746,4,camera,null);assert.deepEqual(read(),before);
 const p=new THREE.Vector3(1,2,16),look=new THREE.Vector3();view.camera(.7405,4,aspect,p,look,null);
 camera.position.copy(p);camera.lookAt(look);camera.updateMatrixWorld();scene.updateMatrixWorld(true);
 const projected=data.anchors.map(a=>new THREE.Vector3(...a.p).applyMatrix4(view.objects.group.matrixWorld).project(camera));
 assert(projected.every(p=>Math.abs(p.x)<1&&Math.abs(p.y)<.8),'desktop and portrait star map fits above caption');
 view.update(.9,4,camera,null);assert.equal(view.objects.group.visible,false);view.dispose();assert.equal(scene.children.length,0);
}
assert.deepEqual(brain.pos,original,'opening brain remains untouched');
assert.equal(createMemoryConstellation(THREE,new THREE.Scene(),{querySelector:()=>null}),null,'routes without the component allocate no constellation');
const home=readFileSync(new URL('../wiki/pages/home.html',import.meta.url),'utf8');
const next=readFileSync(new URL('../wiki/pages/home_next_structure.html',import.meta.url),'utf8');
assert(home.includes('data-memory-star-preview')&&home.includes('components/memory_constellation.html'),'approved constellation is mounted on production Home');
assert(next.includes('data-memory-star-preview')&&next.includes('components/memory_constellation.html'));
assert(!next.includes('components/apoe112.html'));
const normalized=next.replace('Home · Memory constellation preview','Home');
assert.equal(normalized,home,'approved preview and production Home share the same complete story');
const positions=Object.fromEntries(Object.entries({neuron:.726,brain:.7345,unfold:.738,ordered:.7406,loss:.7431,orientation:.7461,connection:.7493,survivors:.7512,global:.756,tower:.7585,cities:.774,whatIf:.7828,fullQuestion:.803}).map(([k,take])=>[k,{take,p:distance(preview,take)/preview.length}]));
const out=new URL('../docs/qa/memory-constellation-20261021/',import.meta.url);mkdirSync(out,{recursive:true});
writeFileSync(new URL('review-positions.json',out),JSON.stringify({positions,extraViewportHeights:2240/100*(preview.scale-base.scale)},null,2)+'\n');
console.log('PASS: preview isolation, retained Home, local reversible pacing, population clock, surviving clusters, signal paths, source immutability, camera continuity/framing at desktop and portrait, reversible symptoms, clean disposal.');
console.log(JSON.stringify(positions));
