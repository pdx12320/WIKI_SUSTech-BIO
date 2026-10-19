import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const source=readFileSync(new URL('../static/onetake/home-entry.js',import.meta.url),'utf8');
function beforeModules(search='',reduced=false){
 const classes=new Set(['ot--static']),events=new Map();
 const root={classList:{toggle(name,on){on?classes.add(name):classes.delete(name);},remove(name){classes.delete(name);},add(...names){names.forEach(n=>classes.add(n));}}};
 runInNewContext(source,{document:{currentScript:{closest:()=>root}},location:{search},URLSearchParams,
  matchMedia:()=>({matches:reduced}),window:{addEventListener:(name,fn)=>events.set(name,fn)}});
 return {classes,events};
}
for(const query of ['', '?review=crt-purple']){
 const frame=beforeModules(query);
 assert(frame.classes.has('ot-crt-preview'),'Select the new cabinet-hiding style before async modules execute');
 assert(!frame.classes.has('ot--static'));
 frame.events.get('error')({target:{matches:()=>true}});
 assert(frame.classes.has('ot--static')&&frame.classes.has('is-ready'),'Module failure restores readable fallback');
}
assert(!beforeModules('?review=crt-legacy').classes.has('ot-crt-preview'));
const reduced=beforeModules('',true);
assert(reduced.classes.has('ot--static'));assert(reduced.classes.has('ot-crt-preview'));
console.log('Passed pre-module opening selection, explicit legacy comparison, reduced motion and import-error fallback.');
