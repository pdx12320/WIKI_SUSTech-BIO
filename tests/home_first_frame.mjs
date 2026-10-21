import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const source=readFileSync(new URL('../static/onetake/home-entry.js',import.meta.url),'utf8');
function beforeModules(search='',reduced=false){
 const classes=new Set(['ot--static']),events=new Map();
 const timers=new Map();
 const root={dataset:{},querySelectorAll:()=>[],addEventListener:(name,fn)=>events.set(name,fn),classList:{contains:name=>classes.has(name),toggle(name,on){on?classes.add(name):classes.delete(name);},remove(name){classes.delete(name);},add(...names){names.forEach(n=>classes.add(n));}}};
 runInNewContext(source,{document:{currentScript:{closest:()=>root}},location:{search},URLSearchParams,
  setTimeout:(fn,ms)=>{timers.set(ms,fn);return ms;},clearTimeout:id=>timers.delete(id),
  matchMedia:()=>({matches:reduced}),window:{addEventListener:(name,fn)=>events.set(name,fn)}});
 return {classes,events,timers,root};
}
for(const query of ['', '?review=crt-purple']){
 const frame=beforeModules(query);
 assert(frame.classes.has('ot-crt-preview'),'Select the new cabinet-hiding style before async modules execute');
 assert(!frame.classes.has('ot--static'));
 frame.events.get('error')({target:{matches:()=>true}});
 assert(frame.classes.has('ot--static')&&frame.classes.has('is-ready'),'Module failure restores readable fallback');
}
assert(!beforeModules('?review=crt-legacy').classes.has('ot-crt-preview'));
const stalled=beforeModules();stalled.timers.get(12000)();
assert(stalled.classes.has('ot--static'));assert.equal(stalled.root.dataset.homeStartup,'fallback');
const ready=beforeModules();ready.events.get('ot:startup-ready')();assert.equal(ready.timers.size,0);
const reduced=beforeModules('',true);
assert(reduced.classes.has('ot--static'));assert(reduced.classes.has('ot-crt-preview'));
console.log('Passed pre-module opening selection, explicit legacy comparison, reduced motion and import-error fallback.');
