import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {oneCState,oneCCaptions,createOneCContext} from '../static/onetake/one-c-context.mjs';
assert.equal(oneCState(-.19).opacity,0);assert.equal(oneCState(.1).opacity,1);assert.equal(oneCState(.63).opacity,0);
assert.equal(oneCState(.1).step,0);assert.equal(oneCState(.2).step,1);assert.equal(oneCState(.26).step,2);assert.equal(oneCState(.315).step,3);
assert.equal(oneCState(.01).context,0);assert.equal(oneCState(.21).context,1);
assert.equal(oneCState(.1).backdrop,0);assert.equal(oneCState(.76).backdrop,1);
for(let t=-.2;t<=1;t+=.005){const a=oneCState(t);oneCState(1);oneCState(-1);assert.deepEqual(oneCState(t),a);}
const element=()=>({style:{setProperty(){}},attrs:{},setAttribute(k,v){this.attrs[k]=v;},addEventListener(){assert.fail('the introduction must not bind a manual edit');}});
const target={...element(),textContent:'U'},other={...element(),textContent:'C'},g={...element(),textContent:'G'};
const classes=new Set(['is-compared']),caption=element(),legacyTools={removed:false,remove(){this.removed=true;}};
const nodes={'[data-c-target]':target,'[data-c-caption]':caption,'[data-c-tools]':legacyTools,'[data-c-sequence]':element()};
const el={style:{},classList:{remove:k=>classes.delete(k),contains:k=>classes.has(k)},querySelector:s=>nodes[s],querySelectorAll:()=>[g,other]};
const root={classList:{add(){}},querySelector:s=>s==='[data-one-c-context]'?el:null};
const scene=createOneCContext(root);
assert.equal(target.textContent,'C');assert.equal(scene.edited(),false);assert(legacyTools.removed,'retire a comparison control from an old cached template');assert(!classes.has('is-compared'));assert.equal(nodes['[data-c-sequence]'].attrs['aria-label'],'CGC codon');
for(let i=0;i<5;i++){
 scene.update(.4);assert.equal(target.textContent,'C');assert.equal(other.textContent,'C');assert.equal(g.textContent,'G');
 target.textContent='U';classes.add('is-compared');
 scene.update(-.15);assert.equal(target.textContent,'C','discard a stale U before entering the cover');assert.equal(scene.edited(),false);assert(el.hidden);
 scene.update(-.19);assert.equal(target.textContent,'C');assert(el.hidden);
}
for(const t of [.1,.2,.26,.315]){scene.update(t);assert.equal(caption.textContent,oneCCaptions[oneCState(t).step]);assert(!caption.textContent.includes('\n'));}
scene.update(.55,{phase:'docking'});assert.equal(el.hidden,true);assert.equal(scene.backdrop(.55,{phase:'docking'}),1);
scene.update(1);assert(el.hidden);assert(el.inert);
const template=readFileSync(new URL('../wiki/components/one_c_context.html',import.meta.url),'utf8');
assert.equal((template.match(/data-c-target/g)||[]).length,1);
assert.equal((template.match(/data-c-caption/g)||[]).length,1);
assert(!/<button|data-c-compare|data-c-tools|<h[1-6]|<small|<br/.test(template),'the introduction has one codon, one caption and no manual edit control');
for(const text of ['APOE4 messenger RNA','Genomic DNA is not rewritten','Design schematic','flanking sequence omitted','made from this RNA'])assert(template.includes(text));
console.log('Passed fixed CGC, no manual editing, stale U cleanup, repeated return to cover, single-caption information and replay handoff.');
