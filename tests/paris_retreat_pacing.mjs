import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {buildScrollTrack} from '../static/onetake/burden-pacing.mjs';
import {particlePhase} from '../static/onetake/paris-particles.mjs';
const source=await readFile(new URL('../static/onetake/onetake.js',import.meta.url),'utf8');
const keys=[...source.matchAll(/\{ p: ([-\d.]+), stage: ([-\d.]+)/g)].map(m=>({p:+m[1],stage:+m[2]}));
const original=buildScrollTrack(keys),slower=buildScrollTrack(keys,{paris:true});
const distance=(m,p)=>{const s=m.track.find(s=>p>=s.from&&p<=s.to);return s.start+(p-s.from)/(s.to-s.from)*(s.end-s.start);};
const span=(m,a,b)=>distance(m,b)-distance(m,a);
const ratio=span(slower,.758,.771)/span(original,.758,.771);
assert.ok(ratio>2.66&&ratio<2.67,'retreat buys 2.67 times the scroll distance');
for(const [a,b] of [[-.19,.747],[.753,.758],[.771,.78],[.797,1]])
  assert.ok(Math.abs(span(slower,a,b)-span(original,a,b))<1e-9,'unaffected chapters preserve their speed');
for(let p=-.19;p<=1;p+=.001) {
 const d=distance(slower,p),s=slower.track.find(s=>d<=s.end);
 assert.ok(Math.abs(s.from+(d-s.start)/(s.end-s.start)*(s.to-s.from)-p)<1e-9,'mapping remains reversible');
}
assert.ok(particlePhase(.758+.00001).zoom<1e-7,'retreat starts without a velocity jump');
assert.ok(1-particlePhase(.771-.00001).zoom<1e-7,'retreat settles without a velocity jump');
assert.deepEqual(buildScrollTrack(keys,{paris:false}),original,'legacy /next mapping unchanged');
console.log('Passed 2.67× slower Paris retreat, preserved unaffected speeds, reversible mapping and smooth endpoints');

for (const [a,b] of [[.747,.752],[.78,.797]]) assert.ok(Math.abs(span(slower,a,b)/span(original,a,b)-3)<1e-9, 'statistic and handoff have three times the scroll distance');
