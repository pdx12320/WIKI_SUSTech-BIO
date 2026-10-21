// Carry the actual opening SVG C into the RNA scene. The original node is
// restored when scrolling back to the cover; its siblings never move with it.
import {INTRO_FADE,INTRO_END} from './rna-cell-state.mjs';
import {createCEdgeGlow} from './c-edge-glow.mjs';
import {createCFrostedGlass} from './c-frosted-glass.mjs';
const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
export function coverCTravel(context){
 const t=Math.max(0,Math.min(1,context));return 1-(1-t)**3;
}
export function coverCRectAt(cover,anchor,context){
 if(!anchor||context<=0)return {...cover};
 const destination={left:anchor.x-.36*anchor.size,top:anchor.y-.4*anchor.size,width:.75*anchor.size,height:.8*anchor.size};
 const travel=coverCTravel(context);
 return Object.fromEntries(Object.keys(destination).map(key=>[key,cover[key]+(destination[key]-cover[key])*travel]));
}
export function coverCColor(context){
 const t=Math.max(0,Math.min(1,context));
 return [255,255,255].map((n,i)=>Math.round(n+([245,143,156][i]-n)*t));
}
export function createCoverCBridge(root,{document:doc=globalThis.document}={}){
 const main=root.querySelector('.memory-room .orca-opening-wordmark--main');
 const letter=main?.querySelector('[data-letter="C"]');
 if(!doc||!letter)return {capture(){},update(){return false;}};
 const path=letter.querySelector('path:not(.orca-wordmark__edit)'),dot=letter.querySelector('.orca-wordmark__edit');
 const originalFill=path.getAttribute('fill'),originalDotOpacity=dot?.getAttribute('opacity');
 const place=doc.createComment('Opening C returns here on reverse scroll');
 const layer=doc.createElement('div');layer.className='one-c-cover-overlay';layer.setAttribute('aria-hidden','true');layer.hidden=true;
 const svg=doc.createElementNS('http://www.w3.org/2000/svg','svg');
 svg.setAttribute('viewBox','0 0 372 100');svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('fill','#ffffff');svg.setAttribute('focusable','false');
 const edgeGlow=createCEdgeGlow(svg,path,{document:doc});
 const frostedGlass=createCFrostedGlass(svg,path,{document:doc});
 layer.append(svg);root.append(layer);
 let cover=null,currentRect=null,detached=false;
 function capture(){
  if(detached)return;
  const r=letter.getBoundingClientRect();
  if(r.width>0&&r.height>0)cover={left:r.left,top:r.top,width:r.width,height:r.height};
 }
 function restore(){
  if(!detached)return;
  main.insertBefore(letter,place);place.remove();detached=false;
  if(originalFill===null)path.removeAttribute('fill');else path.setAttribute('fill',originalFill);
  if(dot){if(originalDotOpacity===null)dot.removeAttribute('opacity');else dot.setAttribute('opacity',originalDotOpacity);}
  root.classList.remove('is-cover-c-extracted');
 }
 capture();
 return {capture,bounds:()=>currentRect,update(take,replay,anchor,context,_retiredEdit,opacity=1){
  if(take<=-.18){restore();layer.hidden=true;return false;}
  if(replay||take>=INTRO_END){layer.hidden=true;return false;}
  if(!cover)return false;
  if(!detached){main.insertBefore(place,letter);svg.append(letter);detached=true;root.classList.add('is-cover-c-extracted');}
  const rect=coverCRectAt(cover,anchor,context);currentRect=rect;
  edgeGlow.update(take,context);frostedGlass.update(context);
  // The C's ink bounds are x=194..269, y=10..90 in the 372×100 logo.
  Object.assign(svg.style,{left:`${rect.left-rect.width*194/75}px`,top:`${rect.top-rect.height*10/80}px`,width:`${rect.width*372/75}px`,height:`${rect.height*100/80}px`});
  path.setAttribute('fill',`rgb(${coverCColor(context).join(',')})`);
  if(dot)dot.setAttribute('opacity',String(1-context));
  layer.hidden=false;
  layer.style.opacity=String((1-smooth((take-INTRO_FADE)/(INTRO_END-INTRO_FADE)))*opacity);
  return true;
 }};
}
