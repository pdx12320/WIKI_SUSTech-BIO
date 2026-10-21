// A restrained blue-white grain over a pure white C, clipped to its exact
// outline. It never changes the original path or the letter's measured box.
let serial=0;
export function createCFrostedGlass(svg,path,{document:doc=globalThis.document}={}){
 if(!path?.getPointAtLength||!doc)return {update(){}};
 const ns='http://www.w3.org/2000/svg',id=`one-c-frost-${++serial}`;
 const node=(name,attrs={})=>{const el=doc.createElementNS(ns,name);for(const [k,v] of Object.entries(attrs))el.setAttribute(k,String(v));return el;};
 const defs=node('defs'),clip=node('clipPath',{id:`${id}-clip`}),filter=node('filter',{id:`${id}-grain`,x:'0%',y:'0%',width:'100%',height:'100%','color-interpolation-filters':'sRGB'});
 clip.append(node('path',{d:path.getAttribute('d')}));defs.append(clip);
 filter.append(node('feTurbulence',{type:'fractalNoise',baseFrequency:.85,numOctaves:2,seed:112,stitchTiles:'stitch'}));
 // Only a small blue-white tint: even peak grain keeps the white luminous.
 filter.append(node('feColorMatrix',{type:'matrix',values:'0 0 0 0 .78  0 0 0 0 .86  0 0 0 0 1  0 0 0 .22 0'}));defs.append(filter);svg.append(defs);
 const group=node('g',{transform:'translate(184)','clip-path':`url(#${id}-clip)`,'aria-hidden':'true','pointer-events':'none'});
 group.append(node('rect',{x:8,y:8,width:80,height:84,filter:`url(#${id}-grain)`}));
 group.append(node('path',{d:path.getAttribute('d'),fill:'none',stroke:'#edf6ff','stroke-width':.22,opacity:.16}));
 return {update(context){
  // Keep the grain above the actual C, including after a reverse-scroll return.
  if(group.parentNode!==svg||group.nextSibling)svg.append(group);
  const t=Math.max(0,Math.min(1,context/.65));group.style.opacity=String(1-t*t*(3-2*t));
 }};
}
