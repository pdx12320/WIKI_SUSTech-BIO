const clamp=v=>Math.max(-1,Math.min(1,Number.isFinite(v)?v:0));
const smooth=v=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v);};
export function atmospherePose(take,x=0,y=0,reduced=false){
 const px=clamp(x),py=clamp(y),t=Number.isFinite(take)?take:0;
 // Different depths keep the coloured light moving slowly around the subject.
 const lights=reduced?[{x:0,y:0},{x:0,y:0},{x:0,y:0}]:[
  {x:px*23+Math.sin(t*4.2)*16,y:py*16+Math.sin(t*3.1)*20},
  {x:-px*29-Math.sin(t*3.3+1)*18,y:py*20-Math.cos(t*4.1)*24},
  {x:px*34-Math.sin(t*3.7+.5)*22,y:-py*23+Math.sin(t*4.6+.9)*26}
 ];
 return {opacity:smooth((t+.14)/.1)*(1-smooth((t-.99)/.04)),lights};
}
export function createParticleAtmosphere(root){
 const stage=root.querySelector('.ot-stage');
 if(!stage)return {update(){}};
 const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('./particle-atmosphere.css',import.meta.url).href;
 document.head.append(css);
 const layer=document.createElement('div');layer.className='particle-atmosphere';layer.setAttribute('aria-hidden','true');
 layer.innerHTML='<i class="particle-atmosphere__glow particle-atmosphere__glow--purple"></i><i class="particle-atmosphere__glow particle-atmosphere__glow--pink"></i><i class="particle-atmosphere__glow particle-atmosphere__glow--mint"></i>';
 stage.insertBefore(layer,stage.querySelector('.ot-vignette'));
 const lights=[...layer.children],positions=lights.map(()=>({x:0,y:0}));
 return {update(take,x,y,reduced,dt){
  const pose=atmospherePose(take,x,y,reduced),ease=reduced?1:1-Math.exp(-Math.min(.05,Math.max(0,dt||0))*2.6);
  const scale=Math.min(1,Math.max(.55,stage.clientWidth/1000));
  layer.style.opacity=String(pose.opacity);
  lights.forEach((light,i)=>{
   const p=positions[i],target=pose.lights[i];p.x+=(target.x*scale-p.x)*ease;p.y+=(target.y*scale-p.y)*ease;
   light.style.transform=`translate3d(${p.x.toFixed(2)}px,${p.y.toFixed(2)}px,0)`;
  });
 }};
}
