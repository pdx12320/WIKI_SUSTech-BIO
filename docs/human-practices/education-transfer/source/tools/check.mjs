import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const root=fileURLToPath(new URL('..',import.meta.url)),require=createRequire(import.meta.url);
const kb=JSON.parse(fs.readFileSync(path.join(root,'education-transfer-knowledge.json'),'utf8'));
const M=require('../transfer-model.js');
const ids=Object.keys(kb.profiles),all=kb.domains.flatMap(d=>d.outcomes);
assert.equal(ids.length,4);assert.equal(kb.domains.length,6);assert.equal(all.length,76);assert.equal(new Set(all.map(o=>o.id)).size,76);
assert.deepEqual(kb.domains.map(d=>d.outcomes.length),[12,13,12,12,14,13]);
for(const tier of ['essential','recommended','advanced'])assert(all.some(o=>o.tier===tier));
let routes=0;
const snapshot=JSON.stringify(kb);
for(const source of ids)for(const target of ids){
 if(source===target){assert.throws(()=>M.compare(kb,source,target));continue}
 const rows=M.compare(kb,source,target),reverse=M.compare(kb,target,source);assert.equal(rows.length,6);routes++;
 rows.forEach((r,i)=>{assert.equal(r.source,reverse[i].target);assert.equal(r.target,reverse[i].source)});
}
assert.equal(routes,12);assert.equal(JSON.stringify(kb),snapshot);assert.throws(()=>M.compare(kb,'macau','china'));assert.throws(()=>M.compare(kb,'japan','ap'));
for(const d of kb.domains)for(const p of Object.values(d.profiles)){
 for(const type of ['curriculum','examination']){const [a,b]=p[type].range;assert(a>=0&&b<=3&&a<=b);assert(p[type].reported.startsWith(String(a)))}
 assert.equal(p.source.document,'analysis');assert.equal(p.source.page,Number(d.id.slice(1))+1);assert(p.summary&&p.evidence&&p.comment);
 assert(p.source.column>=1&&p.source.column<=4);
}
assert.equal(M.formatScore({range:[2,3]}),'2–3');assert.equal(M.formatScore({range:[3,3]}),'3');
assert.match(M.compareRange({range:[1,2]},{range:[2,3]}),/overlap/);
assert.match(M.compareRange({range:[1,1]},{range:[2,2]}),/target has a higher/);
assert.match(M.compareRange({range:[3,3]},{range:[1,2]}),/source has a higher/);
assert.equal(M.outcomes(kb.domains[1],'essential').length,5);assert.equal(M.outcomes(kb.domains[1],'all','polymerase').length,2);assert.equal(M.outcomes(kb.domains[0],'all','term-with-no-match').length,0);
const dataContext={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'education-transfer-knowledge.js'),'utf8'),dataContext);assert.equal(JSON.stringify(dataContext.window.BIOSPHERE_KNOWLEDGE),JSON.stringify(kb));
console.log('PASS: all 12 directed routes; source/target reversal; input guards; ordinal ranges; 76 reference outcomes; filters; browser data parity.');
// Exercise the actual retained D3 geographic renderer with a recording canvas stub.
// This is a unit test, not a browser or visual-layout verification.
const originalAssets=process.env.BIOSPHERE_MAP_ASSETS||path.join(root,'assets');
const noop=()=>{};
const gctx=new Proxy({createRadialGradient:()=>({addColorStop:noop}),createLinearGradient:()=>({addColorStop:noop})},{get:(o,k)=>k in o?o[k]:noop});
for(const width of [358,640,1000]){
 const elements=new Map();
 function el(id){if(!elements.has(id))elements.set(id,{id,clientWidth:width,clientHeight:440,offsetWidth:120,offsetHeight:40,style:{},classList:{add:noop,remove:noop,toggle:noop},listeners:{},getContext:()=>gctx,addEventListener(name,fn){this.listeners[name]=fn},getBoundingClientRect:()=>({left:0,top:0}),setPointerCapture:noop,dispatchEvent:noop});return elements.get(id)}
 const context={window:null,document:{getElementById:el},console,devicePixelRatio:2,addEventListener:noop,CustomEvent:class {constructor(type,options){this.type=type;Object.assign(this,options)}}};context.window=context;vm.createContext(context);
 for(const f of ['d3-array.min.js','d3-geo.min.js','topojson-client.min.js','map-topology.js'])vm.runInContext(fs.readFileSync(path.join(originalAssets,f),'utf8'),context);
 vm.runInContext(fs.readFileSync(path.join(root,'education-map.js'),'utf8'),context);
 assert(context.BioSphereMap.ready());
 let positions=vm.runInContext('regionScreenPos',context);
 for(const id of ids){assert(positions[id]);assert.equal(context.BioSphereMap.hit(positions[id].px,positions[id].py),id);const label=el('rl-'+id);assert(parseFloat(label.style.left)>=8);assert(parseFloat(label.style.left)+label.offsetWidth<=width-8)}
 assert.equal(context.BioSphereMap.hit(0,0),null);
 context.BioSphereMap.route('china','japan');context.BioSphereMap.highlight('japan');context.BioSphereMap.zoom(1.2);context.BioSphereMap.reset();
 assert.equal(el('globe-c').width,width*2);
 // Pointer selection dispatches only taps; a pan must not trigger a transfer.
 let selections=[];el('globe-c').dispatchEvent=e=>selections.push(e.detail);
 positions=vm.runInContext('regionScreenPos',context);const pos=positions.china;
 const listeners=el('globe-c').listeners;
 listeners.pointerdown({button:0,pointerId:1,clientX:pos.px,clientY:pos.py});listeners.pointerup({pointerId:1,clientX:pos.px,clientY:pos.py});assert.deepEqual(selections,['china']);
 listeners.pointerdown({button:0,pointerId:1,clientX:10,clientY:10});listeners.pointermove({pointerId:1,clientX:100,clientY:100});listeners.pointerup({pointerId:1,clientX:100,clientY:100});assert.equal(selections.length,1);
}
console.log('PASS: real topology + geographic hit testing at 358, 640 and 1000 px; Hong Kong/iAL targets; route drawing; zoom/reset; tap versus pan. Visual layout still requires browser review.');

await import("./check-pages.mjs");
