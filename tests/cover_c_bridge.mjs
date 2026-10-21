import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createOneCContext} from '../static/onetake/one-c-context.mjs';
import {coverCRectAt,coverCColor,createCoverCBridge} from '../static/onetake/cover-c-bridge.mjs';
const cover={left:640,top:310,width:185,height:200},anchor={x:500,y:400,size:80,visible:true};
assert.deepEqual(coverCRectAt(cover,anchor,0),cover,'isolated C retains exactly the cover ink bounds');
assert.deepEqual(coverCRectAt(cover,anchor,1),{left:471.2,top:368,width:60,height:64});
assert.deepEqual(coverCColor(0),[255,255,255]);assert.deepEqual(coverCColor(1),[245,143,156]);
for(let t=0;t<1;t+=.02){const a=coverCRectAt(cover,anchor,t),b=coverCRectAt(cover,anchor,t+.001);assert(Math.abs(b.left-a.left)<1&&Math.abs(b.width-a.width)<1);}
class Node{
 constructor(name){this.name=name;this.children=[];this.style={};this.attrs=new Map();}
 append(node){node.remove();this.children.push(node);node.parentNode=this;}
 insertBefore(node,ref){node.remove();const i=this.children.indexOf(ref);assert(i>=0);this.children.splice(i,0,node);node.parentNode=this;}
 remove(){if(this.parentNode){const p=this.parentNode;p.children.splice(p.children.indexOf(this),1);this.parentNode=null;}}
 setAttribute(k,v){this.attrs.set(k,v);}getAttribute(k){return this.attrs.get(k)??null;}removeAttribute(k){this.attrs.delete(k);}
}
const main=new Node('main'),letter=new Node('C'),path=new Node('path'),dot=new Node('dot');
for(const name of ['O','R'])main.append(new Node(name));main.append(letter);main.append(new Node('A'));
letter.querySelector=s=>s==='.orca-wordmark__edit'?dot:path;letter.getBoundingClientRect=()=>({...cover});
main.querySelector=()=>letter;
const root=new Node('root');root.classList={add(){},remove(){}};root.querySelector=()=>main;
const doc={createElement:name=>new Node(name),createElementNS:(_,name)=>new Node(name),createComment:()=>new Node('placeholder')};
const bridge=createCoverCBridge(root,{document:doc});const layer=root.children[0],svg=layer.children[0];
assert.equal(svg.getAttribute('preserveAspectRatio'),'none','both measured ink dimensions are preserved, including a cover glitch frame');
bridge.capture();bridge.update(-.19,null,anchor,0,false);assert.equal(letter.parentNode,main);
assert(bridge.update(-.179,null,anchor,0,false));assert.equal(svg.children[0],letter,'the actual cover C is moved, never cloned');
const held={...svg.style};bridge.update(.02,null,{...anchor,x:50,size:500},0,false);assert.deepEqual(svg.style,held,'the next scene cannot reposition the C before context begins');
bridge.update(.21,null,anchor,1,false);assert.equal(path.getAttribute('fill'),'rgb(245,143,156)');assert.equal(dot.getAttribute('opacity'),'0');
assert.equal(bridge.update(.3,null,anchor,1,true),true);assert(!layer.hidden,'an obsolete manual-edit argument cannot suppress the original C');
bridge.update(.55,{phase:'docking'},anchor,1,false);assert(layer.hidden,'the cover C does not cover the later automatic edit');
bridge.update(-.19,null,anchor,0,false);assert.equal(letter.parentNode,main);assert.deepEqual(main.children.map(n=>n.name),['O','R','C','A']);assert.equal(path.getAttribute('fill'),null);assert.equal(dot.getAttribute('opacity'),null);
// Reproduce the user's journey through both modules, including a stale U
// from the retired comparison control, and return to the complete ORCA logo.
const previousDocument=globalThis.document;globalThis.document=doc;
const ui=new Node('intro'),target=new Node('target'),g=new Node('G'),c=new Node('neighbor-C'),caption=new Node('caption'),sequence=new Node('sequence'),legacy=new Node('old-tools');
target.textContent='U';g.textContent='G';c.textContent='C';ui.append(legacy);
const compared=new Set(['is-compared']);ui.classList={remove:n=>compared.delete(n),contains:n=>compared.has(n)};
const uiNodes={'[data-c-target]':target,'[data-c-caption]':caption,'[data-c-sequence]':sequence,'[data-c-tools]':legacy};
ui.querySelector=s=>uiNodes[s];ui.querySelectorAll=()=>[g,c];
root.querySelector=s=>s==='[data-one-c-context]'?ui:main;
const intro=createOneCContext(root),currentLayer=root.children.at(-1);
assert.equal(target.textContent,'C');assert.equal(legacy.parentNode,null);
for(let cycle=0;cycle<6;cycle++){
 intro.update(.3,null,[anchor,anchor,anchor]);assert.equal(letter.parentNode,currentLayer.children[0]);assert(!currentLayer.hidden);
 target.textContent='U';compared.add('is-compared');
 intro.update(-.14,null,[anchor,anchor,anchor]);assert.equal(target.textContent,'C');assert(!currentLayer.hidden,'the C is visible while the other opening letters return');
 intro.update(-.19,null,[anchor,anchor,anchor]);assert(currentLayer.hidden);assert(ui.hidden);assert.equal(letter.parentNode,main);assert.deepEqual(main.children.map(n=>n.name),['O','R','C','A']);assert.equal(intro.edited(),false);
}
globalThis.document=previousDocument;
const css=readFileSync(new URL('../static/onetake/one-c-context.css',import.meta.url),'utf8');
assert(css.includes('.one-c-context__letter--target{color:#f58f9c;'));
const laterRule=css.match(/\.ot-crt-home \.ot-codon__sequence\{([^}]+)\}/)?.[1];
assert(laterRule?.includes('font-family:"ORCA RNA"'));assert(!laterRule.includes('color:'),'later CGC/UGC colors remain controlled by their existing rules');
console.log('Passed original C node identity, exact cover bounds, continuous RNA placement, pink C, stale-U cleanup, repeated ORCA restoration and later codon typography/color preservation.');
