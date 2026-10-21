import {INTRO_FADE,INTRO_END,rnaCellState} from './rna-cell-state.mjs';
import {createCoverCBridge} from './cover-c-bridge.mjs';
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
export function oneCState(take){
 const t=Number.isFinite(take)?take:-1;
 return {opacity:smooth((t+.108)/.035)*(1-smooth((t-INTRO_FADE)/(INTRO_END-INTRO_FADE))),
  context:smooth((t-.035)/.115),step:t<.12?0:t<.22?1:t<.29?2:3,
  backdrop:rnaCellState(t).backdrop};
}
// Reveal neighboring glyphs only after their measured ink boxes have room.
export function codonNeighboursOpacity(context,anchors,coverRect){
 if(!anchors)return context;
 const [c,g,last]=anchors;
 const right=coverRect?coverRect.left+coverRect.width:c.x+.39*c.size;
 const gap=Math.min(g.x-.36*g.size-right,last.x-.36*last.size-(g.x+.4*g.size));
 return context*smooth((gap-4)/Math.max(4,c.size*.12));
}
export const oneCCaptions=['APOE4 messenger RNA','One edit changes one amino acid.','Recognize the sequence. Edit one C.','Edit RNA. Leave DNA unchanged.'];
export function createOneCContext(root){
 const el=root.querySelector('[data-one-c-context]');
 if(!el)return {backdrop:()=>1,update(){}};
 root.classList.add('has-one-c-context');
 const coverC=createCoverCBridge(root);
 const target=el.querySelector('[data-c-target]'),neighbours=[...el.querySelectorAll('[data-c-neighbours]')];
 const letters=[target,...neighbours],caption=el.querySelector('[data-c-caption]'),sequence=el.querySelector('[data-c-sequence]');
 // Retire an old cached comparison control as well as the current markup.
 el.querySelector('[data-c-tools]')?.remove();
 function keepOriginalCodon(){
  target.textContent='C';target.setAttribute('aria-label','Target C');
  sequence.setAttribute('aria-label','CGC codon');el.classList.remove('is-compared');
 }
 keepOriginalCodon();
 let active=false,lastStep=-1;
 return {captureCover:coverC.capture,edited:()=>false,backdrop:(take,replay)=>replay?1:oneCState(take).backdrop,update(take,replay,anchors,opacity=1){
  if(target.textContent!=='C'||el.classList.contains('is-compared'))keepOriginalCodon();
  const state=oneCState(take);state.opacity*=opacity;active=state.opacity>.01&&!replay;
  const retainedC=coverC.update(take,replay,anchors?.[0],state.context,undefined,opacity);
  el.hidden=!active;el.inert=!active;el.style.opacity=String(state.opacity);
  if(!active)return;
  const neighbourOpacity=codonNeighboursOpacity(state.context,anchors,retainedC?coverC.bounds?.():null);
  neighbours.forEach(node=>{node.style.opacity=String(neighbourOpacity);});
  if(anchors)letters.forEach((node,i)=>{
   const p=anchors[i];node.style.left=`${p.x}px`;node.style.top=`${p.y}px`;node.style.fontSize=`${p.size}px`;node.style.visibility=p.visible?'visible':'hidden';
  });
  if(retainedC)target.style.visibility='hidden';
  if(lastStep!==state.step){caption.textContent=oneCCaptions[state.step];caption.animate?.([{opacity:.2},{opacity:1}],{duration:280});lastStep=state.step;}
 }};
}
