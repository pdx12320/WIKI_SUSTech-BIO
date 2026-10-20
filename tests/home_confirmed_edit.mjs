import assert from 'node:assert/strict';
import {createEditReplay,confirmedEditFrame,CONFIRMED_EDIT_DURATION,CONFIRMED_EDIT_TIMING} from '../static/onetake/edit-replay.mjs';
const t=CONFIRMED_EDIT_TIMING;
assert.equal(confirmedEditFrame(0).stage,'confirm');
assert.equal(confirmedEditFrame(t.confirm+.01).stage,'highlight');
assert.equal(confirmedEditFrame(t.confirm+t.highlight-.01).fix,0);
assert.ok(Math.abs(confirmedEditFrame(t.confirm+t.highlight+t.convert/2).fix-.5)<1e-8);
assert.equal(confirmedEditFrame(t.confirm+t.highlight+t.convert+.1).fix,1);
assert.equal(confirmedEditFrame(CONFIRMED_EDIT_DURATION-.01).stage,'hold');
const events=new Map(),scrolls=[];
globalThis.innerHeight=800;
globalThis.window={scrollY:0,addEventListener(type,fn){events.set(type,fn);},scrollTo(o){scrolls.push(o.top);}};
const skip={hidden:true,addEventListener(type,fn){this.click=fn;}},status={hidden:true,textContent:''};
const root={dataset:{},hasAttribute:a=>['data-edit-auto-confirm','data-edit-scroll-return'].includes(a),
 querySelector:s=>s==='[data-edit-skip]'?skip:s==='[data-edit-status]'?status:null};
const replay=createEditReplay({root,story:{getBoundingClientRect:()=>({top:0,height:10800})},toProgress:x=>x,enabled:true});
replay.update(.8,.05);
for(let i=0;i<200&&root.dataset.editReplay!=='placement';i++)replay.update(.8,.05);
assert.equal(root.dataset.editReplay,'placement');
replay.setReady(false);
for(let i=0;i<20;i++)assert.equal(replay.update(.55,.05).phase,'placement','wait for both modules');
replay.setReady(true);
const frames=[];
let result=replay.update(.55,.05);
assert.equal(result.stage,'confirm','second drop starts confirmation without any gesture');
assert.equal(result.fix,0);
assert.match(status.textContent,/Both modules/);
let blocked=0;
for(let i=0;i<160;i++) {
 if(result.phase==='return')break;
 frames.push(result);
 // Habitual extra input cannot restart the automatic sequence.
 events.get('wheel')({deltaY:100,preventDefault(){blocked++;}});
 events.get('touchstart')({touches:[{clientY:700}]});
 events.get('touchmove')({target:{closest:()=>null},touches:[{clientY:500}],preventDefault(){blocked++;}});
 events.get('keydown')({key:'ArrowDown',preventDefault(){blocked++;}});
 replay.setReady(true);
 result=replay.update(.55,.05);
}
assert.deepEqual([...new Set(frames.map(f=>f.stage))],['confirm','highlight','convert','hold']);
for(let i=1;i<frames.length;i++)assert.ok(frames[i].fix>=frames[i-1].fix,'all edit labels share a monotonic edit value');
const held=frames.filter(f=>f.stage==='hold');
assert.ok(held.length>=38,'completed UGC result remains readable for about two seconds');
assert.ok(held.every(f=>f.fix===1&&f.edit===1));
assert.ok(blocked>0);
assert.equal(result.phase,'return');
assert.equal(result.cameraBlend,0,'no automatic camera pullback after the result hold');
assert.equal(result.fix,1);
assert.match(status.textContent,/Scroll down/);
const before=scrolls.length;
for(let i=0;i<300;i++)assert.equal(replay.update(.89,.05).cameraBlend,0);
assert.equal(scrolls.length,before,'waiting does not advance beyond the result');
let prevented=false;
events.get('wheel')({deltaY:100,preventDefault(){prevented=true;}});
assert.equal(prevented,false,'native scrolling resumes only after the complete automatic sequence');
assert.equal(status.hidden,true,'first wheel gesture immediately dismisses the completion hint');
assert.ok(replay.update(.92,.05).cameraBlend>0,'existing manual camera handoff preserved');
assert.equal(status.hidden,true,'completion hint stays dismissed on later frames');
replay.update(.956,.05);
assert.equal(status.hidden,true,'status clears when the existing return completes');
const disabled=createEditReplay({root,story:{getBoundingClientRect:()=>({height:10800})},toProgress:x=>x,enabled:false});
disabled.setReady(true);assert.equal(disabled.update(.8,.05),null);
console.log('Passed second-drop automatic confirmation, target highlight, C→U conversion, two-second result hold, no extra gesture, input continuity and unchanged manual handoff');

// Main combines quick rewind with automatic editing: confirmation keeps its
// full duration, and Skip must enter the completed state rather than mid-edit.
for(const useSkip of [false,true]){
 const quickRoot={...root,dataset:{},hasAttribute:a=>['data-edit-auto-confirm','data-edit-scroll-return','data-edit-quick-rewind'].includes(a)};
 const quick=createEditReplay({root:quickRoot,story:{getBoundingClientRect:()=>({top:0,height:10800})},toProgress:x=>x,enabled:true});
 quick.update(.8,.05);
 for(let i=0;i<220&&quickRoot.dataset.editReplay!=='placement';i++)quick.update(.8,.05);
 assert.equal(quickRoot.dataset.editReplay,'placement');
 if(useSkip)skip.click();else quick.setReady(true);
 let frame=quick.update(.55,.05),elapsed=0;
 while(frame.phase!=='return'&&elapsed<10){elapsed+=.05;frame=quick.update(.55,.05);}
 assert.equal(frame.phase,'return');assert.equal(frame.fix,1);assert.equal(frame.cameraBlend,0);
 if(!useSkip)assert(elapsed>=CONFIRMED_EDIT_DURATION-.1);
}
console.log('Passed combined quick rewind, full automatic confirmation and Skip-to-completed-result.');
