import assert from 'node:assert/strict';
import {mountHomeSkip} from '../static/onetake/home-skip.mjs';
import {createEditReplay} from '../static/onetake/edit-replay.mjs';
const calls=[],listeners=new Map();let click;
const target={hasAttribute:()=>false,setAttribute:(...v)=>calls.push(['attribute',...v]),scrollIntoView:v=>calls.push(['scroll',v]),focus:v=>calls.push(['focus',v])};
globalThis.document={getElementById:()=>target};
globalThis.location={hash:''};globalThis.history={pushState:(...v)=>calls.push(['history',...v])};
globalThis.CustomEvent=class{constructor(type){this.type=type;}};
const root={dataset:{},hasAttribute:()=>true,querySelector:()=>null,dispatchEvent:event=>{calls.push(['event',event.type]);listeners.get(event.type)?.();}};
const room={querySelector:()=>({addEventListener:(name,fn)=>{click=fn;}})};
mountHomeSkip(root,room);
let prevented=0;
click({button:0,preventDefault(){prevented++;}});
assert.equal(prevented,1);assert.deepEqual(calls.map(c=>c[0]),['history','scroll','event','attribute','focus']);
assert.deepEqual(calls[1][1],{behavior:'instant',block:'start'});assert.equal(calls[2][1],'ot:skip-story');
assert.deepEqual(calls[4][1],{preventScroll:true});
for(const modifier of ['metaKey','ctrlKey','shiftKey','altKey']){
 const n=calls.length;click({button:0,[modifier]:true,preventDefault(){throw Error('Modifier click hijacked');}});assert.equal(calls.length,n);
}
globalThis.document.getElementById=()=>null;
click({button:0,preventDefault(){throw Error('Missing target must retain native anchor');}});
globalThis.innerHeight=800;globalThis.window={scrollY:0,scrollTo(){},addEventListener(){}};
const replay=createEditReplay({root,story:{getBoundingClientRect:()=>({top:0,height:10800})},toProgress:x=>x,enabled:true});
replay.skipToProject();
for(const q of [.79,.8,.89,1])assert.equal(replay.update(q,.05),null,'skip cannot trigger placement or auto rewind');
const active=createEditReplay({root,story:{getBoundingClientRect:()=>({top:0,height:10800})},toProgress:x=>x,enabled:true});
active.update(.8,.05);active.skipToProject();assert.equal(active.update(.8,.05),null);assert(!root.dataset.editReplay);
console.log('Passed immediate project jump, keyboard focus, modifier clicks, missing-target fallback and cancellation/prevention of automatic replay.');
