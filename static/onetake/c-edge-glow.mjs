// Sample the real C outline, so the light keeps the same shape, size and
// position as the original letter throughout its trip into the RNA.
const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
let serial=0;
export function createCEdgeGlow(svg,path,{document:doc=globalThis.document}={}){
 if(!path?.getTotalLength||!path?.getPointAtLength||!doc)return {update(){}};
 const length=path.getTotalLength();
 if(!Number.isFinite(length)||length<=0)return {update(){}};
 const ns='http://www.w3.org/2000/svg',id=`one-c-gaussian-${++serial}`;
 const node=(name,attrs={})=>{const el=doc.createElementNS(ns,name);for(const [key,value] of Object.entries(attrs))el.setAttribute(key,String(value));return el;};
 const group=node('g',{'class':'one-c-edge-glow',transform:'translate(184)','aria-hidden':'true','pointer-events':'none'});
 const defs=node('defs'),filter=node('filter',{id,x:'-35%',y:'-35%',width:'170%',height:'170%','color-interpolation-filters':'sRGB'});
 filter.append(node('feGaussianBlur',{stdDeviation:1.25}));defs.append(filter);group.append(defs);
 // A separate blurred outline leaves the carried letter's own geometry sharp.
 const halo=node('path',{d:path.getAttribute('d'),fill:'none',stroke:'#ffffff','stroke-width':1.1,opacity:.22,filter:`url(#${id})`});group.append(halo);
 let seed=1122026;const rand=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 for(let i=0;i<64;i++){
  const at=length*(i+rand()*.65)/64,p=path.getPointAtLength(at),a=path.getPointAtLength(Math.max(0,at-.2)),b=path.getPointAtLength(Math.min(length,at+.2));
  const magnitude=Math.hypot(b.x-a.x,b.y-a.y)||1,nx=(b.y-a.y)/magnitude,ny=-(b.x-a.x)/magnitude;
  const offset=.15+rand()*.45,drift=.8+rand()*2.1,radius=.12+rand()*.24;
  const particle=node('g',{'class':'one-c-edge-glow__particle'});
  particle.style.setProperty('--c-light-x',`${(nx*drift).toFixed(3)}px`);particle.style.setProperty('--c-light-y',`${(ny*drift).toFixed(3)}px`);
  particle.style.setProperty('--c-light-life',`${(2.5+rand()*2.1).toFixed(3)}s`);particle.style.setProperty('--c-light-delay',`${(-rand()*6).toFixed(3)}s`);
  const cx=p.x+nx*offset,cy=p.y+ny*offset;
  particle.append(node('circle',{cx,cy,r:radius*3,'class':'one-c-edge-glow__bloom'}));
  particle.append(node('circle',{cx,cy,r:radius,'class':'one-c-edge-glow__core'}));group.append(particle);
 }
 svg.append(group);
 return {update(take,context){
  const amount=smooth((take+.13)/.04)*(1-smooth(context/.85));
  group.style.opacity=String(amount);group.style.display=amount>.001?'':'none';
 }};
}
