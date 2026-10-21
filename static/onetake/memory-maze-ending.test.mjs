import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import * as THREE from '../vendor/three/three.module.js';
import {matchBrainToMaze} from './brain-correspondence.mjs';
import {MEMORY_MAZE_RANGE,memoryMazeState,memoryMazeRoute,sampleMemoryRoute,memoryPathPoint,createMemoryMazeEnding,createMemoryMazeTravel,extendMemoryMazeExit,memoryMazeArrivalPop} from './memory-maze-ending.mjs';
const at=progress=>MEMORY_MAZE_RANGE.start+(MEMORY_MAZE_RANGE.end-MEMORY_MAZE_RANGE.start)*progress;

// Exercise the actual legacy geometry and navigation, not an invented maze.
const source=readFileSync(new URL('./onetake.js',import.meta.url),'utf8');
const helpers=source.slice(source.indexOf('const clamp ='),source.indexOf('function astrocyteShape'));
const sorting=source.slice(source.indexOf('function sortShape'),source.indexOf('/* Shaders'));
const {maze,brain:unmatched}=await runInNewContext(`(async()=>{const small=true;${helpers}\n${sorting}\nconst maze=sortShape(mazeShape(2048),2048);return {maze,brain:await brainShape(2048)};})()`);
const brain=matchBrainToMaze(maze,unmatched),route=memoryMazeRoute(maze.navigation);
assert(route.points[0][0]<-6 && route.points.at(-1)[0]>6,'route reaches actual opposite entrances');
for(let i=1;i<route.ids.length;i++)assert(maze.navigation.adj.get(route.ids[i-1]).includes(route.ids[i]),'route traverses only existing open passages');
for(const t of [0,.1,.37,.5,.89,1]){
 const p=sampleMemoryRoute(route,t);assert(p.every(Number.isFinite));
 assert.deepEqual(memoryPathPoint(route,t,0),p,'straightening starts with the exact traversed route');
 const straight=memoryPathPoint(route,t,1);assert(Math.abs(straight[0]-(-1.9+3.8*t))<1e-6);assert(Math.abs(straight[1]-.8)<1e-6);
}
assert.equal(memoryMazeState(at(0)).phase,'brain');
assert.equal(memoryMazeState(at(.5)).phase,'path');
assert.equal(memoryMazeState(at(.7333)).phase,'straightening');
assert.equal(memoryMazeState(at(1)).phase,'final');
assert.equal(memoryMazeState(at(1)).mazeOpacity,0);assert.equal(memoryMazeState(at(1)).travel,1);assert.equal(memoryMazeState(at(1)).letters,1);
for(let progress=0;progress<=1;progress+=.001){
 const take=at(progress),before=memoryMazeState(take);memoryMazeState(at(1));memoryMazeState(at(0));assert.deepEqual(before,memoryMazeState(take),'all stages reverse deterministically');
 if(before.travel>0&&before.travel<1){assert.equal(before.morph,1);assert.equal(before.straighten,0);assert.equal(before.letters,0);}
 if(before.letters>0){assert.equal(before.straighten,1);assert.equal(before.travel,1);assert.equal(before.mazeOpacity,0);}
}
// Stop scrolling at the settled maze: scene time alone must reach U.
const stopped=createMemoryMazeTravel();
assert.equal(stopped.update(.30,0).travel,0);
const halfway=stopped.update(.30,1.5);assert(halfway.travel>.35&&halfway.travel<.65);assert(halfway.pending);
const arrived=stopped.update(.30,3.05);assert.equal(arrived.travel,1);assert.equal(arrived.progress,.61);
assert.equal(stopped.update(.30,3.5).pending,false,'fixed scroll never stalls the automatic route');
// A fast scroll to the final position cannot bypass traversal or arrival.
const rushed=createMemoryMazeTravel();rushed.update(1,0);
assert(rushed.update(1,1.5).progress<.61);
assert.equal(rushed.update(1,3.1).progress,.61);
const released=rushed.update(1,8);assert.equal(released.progress,1);assert.equal(released.pending,false,'later lettering catches up without scroll locking');
rushed.update(.25,8.1);const again=rushed.update(.30,8.2);assert.equal(again.travel,0);assert(again.pending,'backscroll below the settled maze rearms entry');
const still=createMemoryMazeTravel().update(.30,0,{reduced:true});assert.equal(still.travel,1);assert.equal(still.pending,false);
const extended=extendMemoryMazeExit(route);
assert.equal(extended.points.length,route.points.length+1);assert(Math.abs(extended.length-route.length-.55)<1e-8);
assert.deepEqual(extended.mazeExit,route.points.at(-1));assert.equal(extended.points.at(-1)[0],route.points.at(-1)[0]+.55);
assert.equal(memoryMazeArrivalPop(-.1).visible,false);assert.equal(memoryMazeArrivalPop(1).opacity,0);
assert(memoryMazeArrivalPop(.15).opacity>.7);assert.equal(memoryMazeArrivalPop(.15,{reduced:true}).visible,false);
class Node {
 constructor(tag){this.tag=tag;this.attributes={};this.style={setProperty(k,v){this[k]=v;}};this.children=[];this.dataset={};this.classList={add(){},toggle(){}};}
 setAttribute(k,v){this.attributes[k]=String(v);}append(child){this.children.push(child);child.parent=this;}remove(){this.parent.children=this.parent.children.filter(n=>n!==this);}
}
globalThis.document={createElementNS:(_,tag)=>new Node(tag),createElement:tag=>new Node(tag)};
for(const small of [false,true]){
 const width=small?390:1440,height=small?844:900,aspect=width/height;
 const host=new Node('div'),classes=new Set(),root={querySelector:()=>host,classList:{add(name){classes.add(name);},toggle(name,on){if(on)classes.add(name);else classes.delete(name);}}},scene=new THREE.Scene();
 const beforeMaze=Array.from(maze.pos),beforeBrain=Array.from(brain.pos);
 const view=createMemoryMazeEnding(THREE,scene,root,{maze,brain,small});
 assert(host.children.every(child=>child.tag!=='a'),'the ending creates no duplicate Explore link');
 assert(view.enabled);assert.equal(view.group.children[0].geometry.attributes.position.count,brain.meta.length,'same number of original brain and maze particles');
 assert.deepEqual(Array.from(view.group.children[0].geometry.attributes.aMaze.array),Array.from(view.layout.pos),'the new passages and particle maze share one layout');
 assert.deepEqual(Array.from(view.group.children[0].geometry.attributes.position.array),beforeBrain);
 for(let i=1;i<view.route.ids.length;i++)assert(view.layout.navigation.adj.get(view.route.ids[i-1]).includes(view.route.ids[i]),'ORCA lettering follows actual open passages');
 const line=view.group.getObjectByName('ending-continuous-memory-route'),sparks=view.group.getObjectByName('ending-route-becomes-arrow');
 assert(line.isLine&&sparks.isPoints);assert.equal(line.geometry,sparks.geometry,'the visible line and particle trail use the exact same revealed/straightened path samples');
 assert.equal(line.material.uniforms,sparks.material.uniforms,'line and spark reveal use the same progress');assert.equal(line.material.depthTest,false);
 assert(line.geometry.attributes.aEmphasis.array.some(v=>v<.5),'connecting passages stay quieter than ORCA');
 const camera=new THREE.PerspectiveCamera(38,aspect,.1,200),position=new THREE.Vector3(0,.5,small?38:15),look=new THREE.Vector3(0,.2,0);
 for(const take of [.935,.951,.954,MEMORY_MAZE_RANGE.start-.003]){
  assert.equal(view.backdrop(take),1,'the two restored concluding brain scenes keep their original particles');
  view.update(take,20,camera,1,width,height,null,take);assert.equal(view.group.visible,false,'the maze does not cover the original concluding scenes');
 }
 const originalCamera=position.toArray();view.camera(MEMORY_MAZE_RANGE.start-.0031,20,aspect,position,look,null);assert.deepEqual(position.toArray(),originalCamera,'ending recenter does not begin until both original scenes have ended');
 let time=20;
 for(const progress of [0,.2667,.5,.6333,.7333,.9167,1,.7333,.5,0]){
  const take=at(progress);
  view.camera(take,time,aspect,position,look,null);camera.position.copy(position);camera.lookAt(look);camera.updateMatrixWorld();view.update(take,time,camera,1,width,height,null,take);time+=8;view.update(take,time,camera,1,width,height,null,take);
  assert.equal(host.dataset.memoryMazePhase,memoryMazeState(take).phase);
  const [c,u]=host.children[0].children;
  if(progress>.3){for(const label of [c,u]){const x=Number(label.attributes.x);assert(x>20&&x<width-20,`${small?'phone':'desktop'} endpoint label stays in viewport`);}}
 }
 // Runtime integration, not only the standalone controller: the same fixed
 // take advances the drawn route and reveals U without another scroll.
 view.update(at(.2),time,camera,1,width,height,null,at(.2));
 view.update(at(.30),time+.1,camera,1,width,height,null,at(.30));assert.equal(host.dataset.memoryMazeTravel,'0.0000');
 const duration=small?4.2:4.8;
 view.update(at(.30),time+.1+duration*.5,camera,1,width,height,null,at(.30));assert(Number(host.dataset.memoryMazeTravel)>.3);
 view.update(at(.30),time+.1+duration+.15,camera,1,width,height,null,at(.30));assert.equal(host.dataset.memoryMazeTravel,'1.0000');
 assert.equal(host.dataset.memoryMazePop,'true','one small celebration follows the completed route');
 view.update(at(.30),time+.1+duration+.9,camera,1,width,height,null,at(.30));assert.equal(host.dataset.memoryMazePop,'false','celebration clears while the complete ORCA is still held');
 assert.equal(host.dataset.memoryMazePhase,'path','the full maze is held until scrolling resumes');
 assert.equal(Number(host.children[0].children[1].style.opacity),1,'U is revealed on automatic arrival');
 assert.deepEqual(Array.from(maze.pos),beforeMaze,'source maze was not overwritten');assert.deepEqual(Array.from(brain.pos),beforeBrain,'source brain was not overwritten');
 view.update(1,20,camera,1,width,height,null,1.02);assert.equal(view.group.visible,false,'ending gives Explore its own clear screen');
 assert(classes.has('is-memory-maze-past'),'past the story, the fixed particle backdrop is hidden above the opaque footer');
 position.set(12,5,11);const prior=position.toArray();view.camera(at(.5),20,aspect,position,look,{phase:'edit'});assert.deepEqual(position.toArray(),prior,'editing and earlier replay cameras remain authoritative');
 view.camera(at(.5),20,aspect,position,look,{phase:'return'});assert.notDeepEqual(position.toArray(),prior,'late return hands the camera to the ending before replay ends');
 view.update(at(.5),20,camera,1,width,height,{phase:'return'},at(.5));assert(view.group.visible,'real home replay return does not skip the maze beginning');
 assert(!classes.has('is-memory-maze-past'),'scrolling back restores the particle stage for the maze');
 view.update(at(.5),20,camera,1,width,height,{phase:'edit'},at(.5));assert.equal(view.group.visible,false,'molecular editing still vetoes the ending');
 assert.equal(view.backdrop(at(0)),1);assert.equal(view.backdrop(at(1)),0);assert.equal(view.backdrop(at(.5),{phase:'return'}),0);assert.equal(view.backdrop(at(.5),{phase:'edit'}),1);assert.equal(view.backdrop(MEMORY_MAZE_RANGE.start-.01,{phase:'return'}),1);
 view.dispose();assert.equal(scene.children.length,0);
}
const separate=new THREE.Scene();assert.equal(createMemoryMazeEnding(THREE,separate,{querySelector:()=>null},{maze,brain}).enabled,false);assert.equal(separate.children.length,0,'/next without marker stays isolated');
console.log(`Passed: original ${brain.meta.length} particle identities; real ORCA maze passages; extended exit and single arrival pop; continuous route-to-arrow; reversible scroll; desktop/mobile framing; project handoff; replay and /next isolation.`);
