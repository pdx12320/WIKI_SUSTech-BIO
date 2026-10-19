import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const root=fileURLToPath(new URL('..',import.meta.url)),require=createRequire(import.meta.url);
const kb=JSON.parse(fs.readFileSync(path.join(root,'education-transfer-knowledge.json'),'utf8'));
const M=require('../transfer-model.js'),Loading=require('../education-loading.js');
const copyContext={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'education-copy.js'),'utf8'),copyContext);const copy=copyContext.window.BioSphereCopy;
const ids=Object.keys(kb.profiles);
for(const source of ids)for(const target of ids){if(source===target)continue;for(const page of ['map','report']){const url=M.routeUrl(kb,page,source,target);assert(url.startsWith(`education-transfer-${page}.html?`));assert.deepEqual(M.readRoute(kb,url.slice(url.indexOf('?'))),{source,target})}}
for(const query of ['', '?source=china','?source=china&target=china','?source=china&target=macau','?source=__proto__&target=china'])assert.equal(M.readRoute(kb,query),null);
assert.throws(()=>M.routeUrl(kb,'other','china','japan'));
function loadingHarness(reduced=false){
 const nodes=new Map(),timers=new Map();let serial=0,now=0,cancelled=0,restored=0;
 const classes=()=>{const set=new Set();return {toggle:(s,on)=>on?set.add(s):set.delete(s),contains:s=>set.has(s)}};
 function node(){return {textContent:'',children:[],style:{},classList:classes(),events:{},addEventListener(k,f){this.events[k]=f},appendChild(n){this.children.push(n)},replaceChildren(){this.children=[]}}}
 for(const id of ['transfer-loading','loading-steps','loading-bar','loading-status','dna-w','loading-route','cancel-loading','skip-loading'])nodes.set(id,node());
 const steps=Array.from({length:5},(_,i)=>{const n=node(),ck=node();n.textContent=`Evidence step ${i+1}`;n.querySelector=()=>ck;return n});nodes.get('loading-steps').querySelectorAll=()=>steps;
 const dialog=nodes.get('transfer-loading');dialog.showModal=()=>{dialog.open=true};dialog.close=()=>{dialog.open=false};
 const document={getElementById:id=>nodes.get(id),createElement:node,activeElement:{focus:()=>restored++}};
 const window={matchMedia:()=>({matches:reduced}),setTimeout:(fn,ms)=>{const id=++serial;timers.set(id,{fn,due:now+ms});return id},clearTimeout:id=>timers.delete(id)};
 const loader=Loading.create({document,window,onCancel:()=>cancelled++});
 function tick(ms){const stop=now+ms;for(;;){const first=[...timers].filter(([,t])=>t.due<=stop).sort((a,b)=>a[1].due-b[1].due)[0];if(!first)break;timers.delete(first[0]);now=first[1].due;first[1].fn()}now=stop}
 return {loader,nodes,steps,tick,timers,get cancelled(){return cancelled},get restored(){return restored}};
}
let h=loadingHarness(),completed=0;
assert(h.loader.start({source:'Mainland',target:'HKDSE',onComplete:()=>completed++}));assert(h.loader.active);assert(h.nodes.get('transfer-loading').open);assert.equal(h.nodes.get('dna-w').children.length,30);assert.equal(h.nodes.get('loading-route').textContent,'Mainland → HKDSE');
assert.equal(h.loader.start({source:'iAL',target:'Japan + AP',onComplete:()=>completed++}),false);
h.tick(600);assert(h.steps[0].classList.contains('done'));assert(h.steps[1].classList.contains('active'));h.tick(2650);assert.equal(completed,1);assert(!h.loader.active);assert.equal(h.timers.size,0);assert.equal(h.nodes.get('loading-bar').style.width,'100%');h.tick(10000);assert.equal(completed,1);
h=loadingHarness();h.loader.start({source:'A',target:'B',onComplete:()=>completed++});h.tick(700);h.nodes.get('cancel-loading').events.click();h.tick(10000);assert.equal(completed,1);assert.equal(h.cancelled,1);assert.equal(h.restored,1);assert(!h.nodes.get('transfer-loading').open);
h.loader.start({source:'A',target:'C',onComplete:()=>completed++});h.nodes.get('skip-loading').events.click();h.tick(10000);assert.equal(completed,2);
h.loader.start({source:'A',target:'D',onComplete:()=>completed++});let prevented=false;h.nodes.get('transfer-loading').events.cancel({preventDefault:()=>prevented=true});h.tick(10000);assert(prevented);assert.equal(completed,2);
h=loadingHarness(true);h.loader.start({source:'A',target:'B',onComplete:()=>completed++});h.tick(79);assert.equal(completed,2);h.tick(1);assert.equal(completed,3);
console.log('PASS: loading progression, single completion, duplicate start guard, cancellation, Escape, skip, restart and reduced-motion timing.');
// Execute the real report entry with a minimal DOM fixture, and deliberately no map/loader globals.
// This verifies page separation and route-driven rendering, not browser layout.
const reportHtml=fs.readFileSync(path.join(root,'education-transfer-report.html'),'utf8');
const app=fs.readFileSync(path.join(root,'education-transfer.js'),'utf8');
for(const source of ids)for(const target of ids){if(source===target)continue;
 const elements=new Map();
 function element(id){return {id,textContent:'',hidden:false,dataset:{},value:id.startsWith('tier-')?'all':'',events:{},attrs:{},setAttribute(k,v){this.attrs[k]=v},addEventListener(k,fn){this.events[k]=fn},set innerHTML(text){this.html=text;for(const [,childId] of text.matchAll(/id="([^"]+)"/g))elements.set(childId,element(childId))},get innerHTML(){return this.html||''}}}
 for(const [,id] of reportHtml.matchAll(/id="([^"]+)"/g))elements.set(id,element(id));
 const documentEvents={};const document={body:{dataset:{page:'report'}},getElementById:id=>elements.get(id)||null,addEventListener(k,fn){documentEvents[k]=fn},title:''},navigation=[];
 vm.runInNewContext(app,{document,window:{BIOSPHERE_KNOWLEDGE:kb,BioSphereModel:M,BioSphereCopy:copy},location:{search:`?source=${source}&target=${target}`,assign:url=>navigation.push(url)}});
 assert.equal(elements.get('comparison-title').textContent,`${kb.profiles[source].short} → ${kb.profiles[target].short}`);
 assert.equal((elements.get('comparison-content').innerHTML.match(/class="domain-row"/g)||[]).length,6);
 assert.equal(elements.get('back-to-map').href,M.routeUrl(kb,'map',source,target));
 elements.get('swap-route').events.click();assert.deepEqual(navigation,[M.routeUrl(kb,'report',target,source)]);
 documentEvents.click({target:{closest:()=>({dataset:{domainFocus:'d2'},hasAttribute:()=>false})}});
 assert.equal(elements.get('focus-d2').attrs['aria-pressed'],'true');
 assert(!elements.get('domain-focus').innerHTML.includes('id="tier-d1"'));
 assert(!/class="learning-reference" open/.test(elements.get('domain-focus').innerHTML));
 assert(!/class="support-notes" open/.test(elements.get('domain-focus').innerHTML));
 elements.get('search-d2').value='polymerase';elements.get('comparison-content').events.input({target:{dataset:{search:'d2'}}});assert.match(elements.get('count-d2').textContent,/2 reference outcomes/);
}
assert(!/id="comparison"/.test(fs.readFileSync(path.join(root,'education-transfer-map.html'),'utf8')));
assert(!/id="globe-c"|src="education-map.js"/.test(reportHtml));
console.log('PASS: 12 report URLs render independently of map/loader; back and reverse links retain routes; outcome search; map/report markup separated; single selected domain; supporting text collapsed.');
