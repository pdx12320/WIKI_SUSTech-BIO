import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import * as THREE from '../vendor/three/three.module.js';
import {matchBrainToMaze} from './brain-correspondence.mjs';
import {MEMORY_MAZE_RANGE,memoryMazeState,memoryMazeRoute,sampleMemoryRoute,memoryPathPoint,createMemoryMazeEnding,createMemoryMazeTravel,memoryMazeLetterPose,memoryMazeHandoff,extendMemoryMazeExit,memoryMazeArrivalPop} from './memory-maze-ending.mjs';
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
// One entry gesture must finish every stage even if scrolling stops at C.
const stopped=createMemoryMazeTravel(),rushed=createMemoryMazeTravel();
assert.equal(stopped.update(.269,0).progress,.269,'the earlier maze still follows scrolling');
for(const time of [0,.2,.45,2,5.4,6.4,7.6,9.5,10.3,11.35,14.05,14.5]){
 const a=stopped.update(.28,time),b=rushed.update(1,time);
 assert.deepEqual(a,b,'fixed scroll and fast scroll play the same timed sequence');
 if(time===5.4){assert.equal(a.progress,.61);assert.equal(a.travel,1);assert(a.arrivalAge>0);}
 if(time===6.4)assert.equal(a.progress,.61,'hold the full maze before it straightens');
 if(time===7.6){const state=memoryMazeState(at(a.progress));assert(state.straighten>0&&state.straighten<1,'straightening has a visible intermediate stage');}
 if(time===9.5||time===10.3){assert.equal(memoryMazeState(at(a.progress)).straighten,1);assert.equal(a.letters,0,'C arrow U gets its own reading hold');}
 if(time===11.35)assert(a.letters>0&&a.letters<1,'fall follows automatically after the arrow hold');
 if(time>=14.05){assert.equal(a.letters,1);assert.equal(a.progress,1);assert.equal(a.pending,false);}
}
rushed.update(.25,15);const again=rushed.update(.28,16);assert.equal(again.travel,0);assert(again.pending,'backscroll before C rearms the complete sequence');
const still=createMemoryMazeTravel().update(.28,0,{reduced:true});assert.equal(still.progress,1);assert.equal(still.letters,1);assert.equal(still.pending,false);
for(const index of [0,1]){
 assert.equal(memoryMazeLetterPose(0,index).drop,0);
 assert.deepEqual(memoryMazeLetterPose(1,index),{drop:1,sway:0,lift:0,angle:0});
 const rocking=[.69,.76,.84,.92].map(p=>memoryMazeLetterPose(p,index).angle);
 assert(rocking.some(v=>v<0)&&rocking.some(v=>v>0),'landed letters rock to both sides');
 assert(Math.abs(memoryMazeLetterPose(.97,index).angle)<.2,'rocking decays before the phrase unlocks');
}
assert(memoryMazeLetterPose(.5,0).drop>memoryMazeLetterPose(.5,1).drop,'C and U fall slightly out of step');
for(let age=0;age<=1.7;age+=.01){
 const handoff=memoryMazeHandoff(age);
 assert(handoff.opacity===0||handoff.incoming===0,'the two lines and Explore never overlap');
 if(age<.85){assert.equal(handoff.incoming,0);assert.equal(handoff.past,false,'keep the upper arrow visible while it fades');}
 if(age>.85){assert.equal(handoff.opacity,0);assert(handoff.incoming>0,'Explore begins immediately after the complete fade');}
}
assert.equal(memoryMazeHandoff(.4).opacity>0,true);
assert.equal(memoryMazeHandoff(.85).opacity,0);assert.equal(memoryMazeHandoff(.85).incoming,0);
assert.equal(memoryMazeHandoff(1.6).incoming,1);
assert.equal(memoryMazeHandoff(-1).opacity,1,'hold the phrase until the heading approaches');
assert.equal(memoryMazeHandoff(1,{unlocked:false}).opacity,1,'fast scrolling cannot bypass letter landing');
assert.equal(memoryMazeHandoff(-1,{skipped:true}).incoming,1,'explicit skip immediately reveals Explore');
assert.equal(memoryMazeHandoff(-1,{reduced:true}).incoming,1,'reduced motion reveals the directory without a fade');
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
 const host=new Node('div'),directory=new Node('section'),classes=new Set(),heading={top:height*1.1,getBoundingClientRect(){return {top:this.top};}},root={style:{setProperty(k,v){this[k]=v;}},querySelector:selector=>selector==='[data-explore-slides]'?directory:selector.includes('explore-slides')?heading:host,classList:{add(name){classes.add(name);},toggle(name,on){if(on)classes.add(name);else classes.delete(name);}}},scene=new THREE.Scene();
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
 for(const progress of [0,.2667]){
  const take=at(progress);
  view.camera(take,time,aspect,position,look,null);camera.position.copy(position);camera.lookAt(look);camera.updateMatrixWorld();view.update(take,time,camera,1,width,height,null,take);
  assert.equal(host.dataset.memoryMazePhase,memoryMazeState(take).phase);time+=1;
 }
 // Hold the real runtime at the first C all the way to the settled phrase.
 const firstC=at(.28),start=time+.1,duration=small?4.2:4.8,arrivalAt=.45+duration,fallAt=arrivalAt+1.25+.65+2.3+1;
 view.update(firstC,start,camera,1,width,height,null,firstC);assert.equal(host.dataset.memoryMazeTravel,'0.0000');
 view.update(firstC,start+.45+duration*.5,camera,1,width,height,null,firstC);assert(Number(host.dataset.memoryMazeTravel)>.3);
 view.update(firstC,start+arrivalAt+.15,camera,1,width,height,null,firstC);assert.equal(host.dataset.memoryMazeTravel,'1.0000');
 assert.equal(host.dataset.memoryMazePop,'true','one small celebration follows the completed route');
 view.update(firstC,start+arrivalAt+.9,camera,1,width,height,null,firstC);assert.equal(host.dataset.memoryMazePop,'false');
 assert.equal(host.dataset.memoryMazePhase,'path','the completed maze has its own hold');
 assert.equal(Number(host.children[0].children[1].style.opacity),1,'U is revealed on automatic arrival');
 view.update(firstC,start+arrivalAt+1.25+.65+1.15,camera,1,width,height,null,firstC);
 assert(line.material.uniforms.uStraighten.value>0&&line.material.uniforms.uStraighten.value<1,'the real route straightens gradually');
 view.update(firstC,start+fallAt-.5,camera,1,width,height,null,firstC);
 assert.equal(line.material.uniforms.uStraighten.value,1);assert.equal(host.dataset.memoryMazeLetters,'0.0000','hold C arrow U before the letters fall');
 view.update(firstC,start+fallAt+1.8,camera,1,width,height,null,firstC);
 assert.equal(host.dataset.memoryMazeLetters,'0.5000');assert(!classes.has('is-memory-maze-complete'));
 view.update(firstC,start+fallAt+3.61,camera,1,width,height,null,firstC);
 assert.equal(host.dataset.memoryMazeLetters,'1.0000');assert.equal(host.dataset.memoryMazePhase,'final');
 assert(!classes.has('is-memory-maze-complete'),'the final phrase has a reading hold');
 view.update(firstC,start+fallAt+4.31,camera,1,width,height,null,firstC);
 assert(classes.has('is-memory-maze-complete'),'fixed scroll at the first C completes the entire ending');
 const period=host.children[0].children[7];assert.equal(period.textContent,'.');assert.equal(Number(period.style.opacity),1,'the final full stop is visible');
 for(const label of [host.children[0].children[2],host.children[0].children[3],period]){
  const x=Number(label.attributes.x);assert(x>20&&x<width-20,'final letters and period fit desktop and mobile');
 }
 assert.deepEqual(Array.from(maze.pos),beforeMaze,'source maze was not overwritten');assert.deepEqual(Array.from(brain.pos),beforeBrain,'source brain was not overwritten');
 time=start+fallAt+4.31;
 const rush=time+duration+3;
 view.update(at(.2),rush,camera,1,width,height,null,at(.2));
 view.update(1,rush+.1,camera,1,width,height,null,1.02,2);
 assert(view.group.visible,'scrolling past the story cannot hide the unfinished route');
 assert(!classes.has('is-memory-maze-complete'),'Explore remains gated during the timed route');
 const finalTime=rush+.1+fallAt;
 view.update(1,finalTime,camera,1,width,height,null,1.02,2);
 assert(!classes.has('is-memory-maze-complete'),'the fall starts before the final reading hold');
 view.update(1,finalTime+1.8,camera,1,width,height,null,1.02,2);
 assert(!classes.has('is-memory-maze-complete'),'Explore cannot cover the falling letters');
 const lowerC=host.children[0].children[2];
 assert(!lowerC.attributes.transform.startsWith('rotate(0,'),'the visible glyph tilts during its fall');
 view.update(1,finalTime+3.61,camera,1,width,height,null,1.01,1.1);
 assert(!classes.has('is-memory-maze-complete'),'the settled phrase gets its own reading hold');
 view.update(1,finalTime+4.31,camera,1,width,height,null,1.01,1.1);
 assert(classes.has('is-memory-maze-complete'));assert(view.group.visible,'final phrase holds until the actual heading enters');
 view.update(1,finalTime+4.35,camera,1,width,height,null,1.02,2.5);
 assert.equal(Number(host.style['--memory-maze-opacity']),1,'scroll distance alone cannot fade the phrase before a late incoming heading');
 heading.top=height*.75;
 const handoffStart=finalTime+4.38;
 view.update(1,handoffStart,camera,1,width,height,null,1.02,1.35);
 view.update(1,handoffStart+.4,camera,1,width,height,null,1.02,1.35);
 assert(Number(host.style['--memory-maze-opacity'])>0&&Number(host.style['--memory-maze-opacity'])<1,'both lines fade with time at a fixed scroll position');
 assert.equal(Number(root.style['--memory-explore-opacity']),0,'the incoming directory remains invisible while letters fade');
 assert(directory.inert,'invisible links cannot receive focus or clicks');
 assert(!classes.has('is-memory-maze-past'),'the upper arrow fades with both lines');
 view.update(1,handoffStart+.86,camera,1,width,height,null,1.02,1.35);
 assert.equal(Number(host.style['--memory-maze-opacity']),0,'both lines fully disappear before Explore begins');
 assert(Number(root.style['--memory-explore-opacity'])>0,'Explore then fades in without another scroll gesture');
 assert.equal(view.group.visible,false);
 assert.equal(parseFloat(root.style['--memory-maze-stage-clip']),height,'the outgoing canvas cannot cover the incoming cards');
 assert(classes.has('is-memory-maze-past'));
 view.update(1,handoffStart+1.61,camera,1,width,height,null,1.02,1.35);
 assert.equal(Number(root.style['--memory-explore-opacity']),1);assert.equal(directory.inert,false);
 heading.top=height*1.1;
 position.set(12,5,11);const prior=position.toArray();view.camera(at(.5),20,aspect,position,look,{phase:'edit'});assert.deepEqual(position.toArray(),prior,'editing and earlier replay cameras remain authoritative');
 view.camera(at(.5),20,aspect,position,look,{phase:'return'});assert.notDeepEqual(position.toArray(),prior,'late return hands the camera to the ending before replay ends');
 view.update(at(.5),20,camera,1,width,height,{phase:'return'},at(.5));assert(view.group.visible,'real home replay return does not skip the maze beginning');
 assert(!classes.has('is-memory-maze-past'),'scrolling back restores the particle stage for the maze');
 view.skipToProject();assert.equal(Number(root.style['--memory-explore-opacity']),1);assert.equal(directory.inert,false);assert(classes.has('is-memory-maze-complete'));assert(!view.group.visible,'the explicit skip bypasses the complete ending');
 view.update(at(.2),finalTime+1,camera,1,width,height,null,at(.2));assert(!classes.has('is-memory-maze-complete'),'backscroll rearms the ending after a skip');
 view.update(at(.5),20,camera,1,width,height,{phase:'edit'},at(.5));assert.equal(view.group.visible,false,'molecular editing still vetoes the ending');
 assert.equal(view.backdrop(at(0)),1);assert.equal(view.backdrop(at(1)),0);assert.equal(view.backdrop(at(.5),{phase:'return'}),0);assert.equal(view.backdrop(at(.5),{phase:'edit'}),1);assert.equal(view.backdrop(MEMORY_MAZE_RANGE.start-.01,{phase:'return'}),1);
 view.dispose();assert.equal(scene.children.length,0);
}
const separate=new THREE.Scene();assert.equal(createMemoryMazeEnding(THREE,separate,{querySelector:()=>null},{maze,brain}).enabled,false);assert.equal(separate.children.length,0,'/next without marker stays isolated');
console.log(`Passed: original ${brain.meta.length} particle identities; real ORCA maze passages; extended exit and single arrival pop; continuous route-to-arrow; reversible scroll; desktop/mobile framing; project handoff; replay and /next isolation.`);
