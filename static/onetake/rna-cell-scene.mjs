import {cellLayout,rnaCellState,lipidPath,ease} from './rna-cell-state.mjs';
// All biological subjects and the relationship path are THREE.Points.
// No RNA-to-cell morph, clinical recovery switch, or disappearance of Aβ.
export {cellParticleData} from './cell-volume-shapes.mjs';
import {cellParticleData,legacyCellParticles} from './cell-volume-shapes.mjs';
import {cellCameraPose,cellQuestionPose,amyloidFlight} from './cell-fpv-motion.mjs';
const vertex=`attribute float aTone;attribute vec3 aNormal;
uniform float uTime,uOpacity,uPR,uPath,uTravel,uBody,uHover,uMotion,uSway;uniform vec3 uColor,uTrails[5];uniform vec2 uPointer,uViewport;
varying vec3 vColor;varying float vAlpha;
void main(){
 vec3 local=position+aNormal*sin(uTime*.7+dot(position,vec3(.7,.4,.6)))*.018*uBody*uMotion;
 float arm=smoothstep(.55,3.8,length(position));
 float flex=(.18+.82*arm)*uSway*uMotion;
 local+=vec3(sin(uTime*.32+position.y*.7+position.z*.35)*.22,sin(uTime*.27+position.x*.65)*.12,sin(uTime*.24+position.y*.6-position.x*.25)*.27)*flex;
 vec4 mv=modelViewMatrix*vec4(local,1.);vec4 before=projectionMatrix*mv;
 float seed=fract(sin(dot(position,vec3(12.9898,78.233,37.719)))*43758.5453);
 float push=0.;vec2 away=vec2(1.,0.);
 for(int i=0;i<5;i++){
  vec2 delta=(before.xy/max(.001,before.w)-uTrails[i].xy)*uViewport*.5;float d=length(delta);
  float influence=exp(-pow(d/62.,2.))*uTrails[i].z;
  if(influence>push){push=influence;away=normalize((d>.01?delta/d:vec2(1.,0.))+vec2(sin(seed*6.283),cos(seed*6.283))*.72);}
 }
 push*=uHover*uBody*uMotion;
 mv.xy+=away*push*(32.+seed*16.)*2./uViewport*(-mv.z)/vec2(projectionMatrix[0][0],projectionMatrix[1][1]);mv.z+=(seed-.5)*push*1.4;
 gl_Position=projectionMatrix*mv;gl_PointSize=clamp((1.8+.35*uBody)*uPR*pow(22./max(1.,-mv.z),.8),.9*uPR,5.*uPR);
 float light=.4+.6*max(0.,dot(normalize(normalMatrix*aNormal),normalize(vec3(-.3,.5,1.))));
 vColor=mix(uColor,vec3(.95,.85,1.),step(.5,aTone)*.56)*light;
 float signal=uPath*.8*exp(-pow((aTone-uTravel)*12.,2.));float depth=clamp(1.45+mv.z*.026,.38,1.);
 float grain=mix(1.,.82+.18*seed,uSway);
 vAlpha=uOpacity*(.76+.12*sin(uTime*.65+position.y*2.)+signal)*depth*grain;
}`;
const fragment=`varying vec3 vColor;varying float vAlpha;void main(){float a=1.-smoothstep(.05,.5,length(gl_PointCoord-.5));if(a*vAlpha<.025)discard;gl_FragColor=vec4(vColor,a*a*vAlpha);}`;
export function createRnaCellScene(THREE,scene,root,{small=false,cell=null}={}){
 const el=root.querySelector('[data-rna-cell]');
 if(!el)return {camera(){},update(){}};
 root.classList.add('has-rna-cell');
 const trails=Array.from({length:5},()=>new THREE.Vector3(9,9,0));let trailClock=0;
 const make=(data,color,name)=>{
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(data.positions,3));g.setAttribute('aTone',new THREE.BufferAttribute(data.tones,1));
  const normals=data.normals||new Float32Array(data.positions.length);if(!data.normals)for(let i=2;i<normals.length;i+=3)normals[i]=1;
  g.setAttribute('aNormal',new THREE.BufferAttribute(normals,3));
  const uniforms={uTime:{value:0},uOpacity:{value:0},uPR:{value:1},uPath:{value:0},uTravel:{value:0},uBody:{value:0},uSway:{value:0},uHover:{value:0},uMotion:{value:1},uPointer:{value:new THREE.Vector2(9,9)},uViewport:{value:new THREE.Vector2(1440,900)},uTrails:{value:trails},uColor:{value:new THREE.Color(color)}};
  const material=new THREE.ShaderMaterial({uniforms,vertexShader:vertex,fragmentShader:fragment,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
  const points=new THREE.Points(g,material);points.name=name;points.frustumCulled=false;points.visible=false;scene.add(points);return points;
 };
 const astro=make(legacyCellParticles(cell,{small,kind:'astro'}),0xc6d7ff,'rna-context-astrocyte');
 const neuron=make(legacyCellParticles(cell,{small,kind:'neuron'}),0xaecbff,'rna-context-neuron');
 astro.material.uniforms.uBody.value=neuron.material.uniforms.uBody.value=1;
 neuron.material.uniforms.uSway.value=1;
 astro.material.depthWrite=true;
 // Let front and back particles contribute through the neuron volume.
 neuron.material.depthWrite=false;
 const protein=make(cellParticleData('protein',{small}),0xf2d6a1,'rna-context-translated-apoE');
 const route=make({positions:new Float32Array(180*3),tones:new Float32Array(180)},0x9edbca,'rna-context-relationship-path');
 const translation=make({positions:new Float32Array(80*3),tones:new Float32Array(80)},0xf2d6a1,'rna-context-translation-path');
 for(const obj of [route,translation]){const a=obj.geometry.attributes.aTone;for(let i=0;i<a.count;i++)a.array[i]=i/(a.count-1);obj.material.uniforms.uPath.value=1;}
 // A small particulate callout encloses the residue target, not a second scene.
 const frame=[];for(let i=0;i<240;i++){const t=i/60,k=Math.floor(t),u=t-k;frame.push(...(k===0?[-1.5+3*u,.4,0]:k===1?[1.5,.4-.8*u,0]:k===2?[1.5-3*u,-.4,0]:[-1.5,-.4+.8*u,0]));}
 const focus=make({positions:new Float32Array(frame),tones:new Float32Array(240)},0xd3b4de,'rna-context-residue-callout');
 // Each carrier has a lipid core and an apoE-like particle surface, schematic.
 const carriers=Array.from({length:4},(_,i)=>{
  const p=[],tones=[];for(let k=0;k<100;k++){const z=1-2*(k+.5)/100,a=k*2.39996,r=Math.sqrt(1-z*z)*.12;p.push(Math.cos(a)*r,Math.sin(a)*r,z*.12);tones.push(k%4===0?1:0);}
  return make({positions:new Float32Array(p),tones:new Float32Array(tones)},0xf3cf88,`rna-context-apoE-lipid-${i}`);
 });
 const projected=new THREE.Vector3(),destination=new THREE.Vector3(),look=new THREE.Vector3();
 const labels=[...el.querySelectorAll('[data-rna-cell-label]')],questions=el.querySelector('[data-rna-cell-questions]');
 let aspect=0,amyloid=null,amyloidPortrait=null,amyloidCenters=[[0,0,0]];
 function bindAmyloid(){
  const portrait=aspect<1;
  if(amyloid&&amyloidPortrait===portrait)return;
  amyloid=scene.getObjectByName('extracellular-amyloid');if(!amyloid)return;
  amyloidPortrait=portrait;
  const n=amyloid.geometry.attributes.position.count,positions=new Float32Array(n*3);
  const groups=[[-1.05,.82,-.7],[1.2,.55,-1.5],[-1.55,-.72,-1.9],[1.4,-1.15,-.85]].map(([x,y,z])=>[x*(portrait?.25:1),y,z]);
  amyloidCenters=[[0,0,0],...groups];
  for(let i=0;i<n;i++){
   const seed=j=>{const x=Math.sin((i+j)*127.1+311.7)*43758.5453;return x-Math.floor(x);};
   const z=seed(1)*2-1,angle=seed(2)*6.283,r=Math.sqrt(1-z*z),fraction=i/n;
   const group=fraction<.16?-1:fraction<.60?Math.min(groups.length-1,Math.floor((fraction-.16)/.11)):-2;
   const radius=(.17+seed(3)*.12)*(group>=0?.72+group*.07:1);
   // Retain the leading sphere, add four coherent surrounding clusters,
   // and leave diffuse particles between them using the same vertex budget.
   const offset=group===-1?[0,0,0]:group>=0?groups[group]:[(seed(5)-.5)*8,(seed(6)-.5)*6,(seed(7)-.5)*7];
   positions.set([offset[0]+Math.cos(angle)*r*radius,offset[1]+Math.sin(angle)*r*radius,offset[2]+z*radius],i*3);
  }
  amyloid.geometry.setAttribute('aFpv',new THREE.BufferAttribute(positions,3));
 }
 function place(nextAspect){
  aspect=nextAspect;const l=cellLayout(aspect);
  astro.position.fromArray(l.astro);neuron.position.fromArray(l.neuron);protein.position.fromArray(l.protein);
  astro.scale.setScalar(l.scale);neuron.scale.setScalar(l.scale);protein.scale.setScalar(l.scale);
  focus.position.fromArray(l.focus);focus.scale.setScalar(aspect<1?1.45:1.65);
  const a=route.geometry.attributes.position.array;for(let i=0;i<180;i++)a.set(lipidPath(i/179,aspect),i*3);route.geometry.attributes.position.needsUpdate=true;
  const b=translation.geometry.attributes.position.array;for(let i=0;i<80;i++)b.set(l.rna.map((v,j)=>v+(l.protein[j]-v)*i/79),i*3);translation.geometry.attributes.position.needsUpdate=true;
 }
 return {objects:{astro,neuron,protein,route,translation,focus,carriers},camera(take,camAspect,position,target,replay,time=0,pointer={}){
  if(replay||take<.32||take>.752)return 0;
  const pose=cellCameraPose(take,time,camAspect,pointer);
  position.lerp(destination.fromArray(pose.position),pose.blend);target.lerp(look.fromArray(pose.look),pose.blend);
  return pose.bank;
 },questionCamera(take,camAspect,position,target,replay,time=0,pointer={}){
  if(replay)return;
  const pose=cellQuestionPose(take,time,camAspect,pointer);
  position.lerp(destination.fromArray(pose.position),pose.blend);target.lerp(look.fromArray(pose.look),pose.blend);
 },update(take,time,camera,replay,motion=1,width=globalThis.innerWidth,height=globalThis.innerHeight,pointer={},dt=.016){
  const s=rnaCellState(take),opacity=replay?0:s.opacity,question=replay?0:s.question,l=cellLayout(width/height);
  if(aspect!==width/height)place(width/height);
  // The same arbor stays gently alive in both the approach and the wide view.
  neuron.rotation.set(Math.sin(time*.16)*.022*motion,Math.sin(time*.13)*.032*motion,Math.sin(time*.11)*.012*motion);
  const step=Math.max(0,dt);trailClock+=step;trails.forEach(p=>{p.z*=Math.exp(-step*3.8);});
  if(!replay&&(pointer.on??0)>0&&motion){
   const x=pointer.x??9,y=pointer.y??9;
   if(trails[0].z<.05||Math.hypot(trails[0].x-x,trails[0].y-y)>.035||trailClock>.09){
    for(let i=4;i>0;i--)trails[i].copy(trails[i-1]);trails[0].set(x,y,1);trailClock=0;
   }else trails[0].z=1;
  }
  for(const obj of [astro,neuron,protein,route,translation,focus,...carriers]){
   obj.material.uniforms.uTime.value=time*motion;obj.material.uniforms.uPR.value=Math.min(globalThis.devicePixelRatio||1,small?1.5:1.75);
   const u=obj.material.uniforms;u.uMotion.value=motion;u.uViewport.value.set(width,height);u.uPointer.value.set(pointer.x??9,pointer.y??9);
   u.uHover.value+=((replay?0:motion)-u.uHover.value)*(1-Math.exp(-step*10));
   obj.material.uniforms.uOpacity.value=(obj===neuron?Math.max(opacity,question):opacity)*(obj===protein?s.protein:carriers.includes(obj)?s.protein*.9:obj===route?s.protein*.16:obj===translation?s.protein*.24:obj===focus?(s.stage==='translation'?.24:0):obj===neuron?.56:.68);
   obj.visible=obj.material.uniforms.uOpacity.value>.001;
  }
  // One scroll-linked journey; a stationary reader never sees repeated delivery.
  carriers.forEach((obj,i)=>{const u=ease((s.transport-i*.12)/.64);obj.position.fromArray(lipidPath(u,aspect));obj.visible&&=s.transport>i*.12;});
  translation.material.uniforms.uTravel.value=s.protein;route.material.uniforms.uTravel.value=s.transport;
  bindAmyloid();const flight=amyloidFlight(take,aspect);
  if(amyloid){
   const u=amyloid.material.uniforms;u.uFpvMix.value=replay?0:flight.particleMix;u.uFpvCenter.value.fromArray(flight.position);
   if(!replay&&take>=.50&&take<.737){u.uOpacity.value=flight.opacity*.4;u.uGather.value=1;amyloid.visible=flight.opacity>.001;}
   if(!replay&&take>=.50&&take<.752){const label=root.querySelector('[data-bio-label="amyloid"]');if(label){label.style.opacity='0';label.style.visibility='hidden';}}
  }
  if(amyloid&&question>0){
   const u=amyloid.material.uniforms;u.uFpvMix.value=1;u.uParisMorph.value*=1-question;
   u.uFpvCenter.value.fromArray(flight.position);u.uOpacity.value=Math.max(u.uOpacity.value,question*.4);amyloid.visible=true;
  }
  el.hidden=opacity<.01;el.style.opacity=String(opacity);el.dataset.stage=s.stage;
  if(el.hidden)return;
  const labelPositions={rna:l.rna.map((v,i)=>v+[0,-1.05*l.scale,0][i]),astro:l.astro.map((v,i)=>v+[0,2.2*l.scale,0][i]),neuron:l.neuron.map((v,i)=>v+[0,-1.4*l.scale,0][i]),protein:l.protein.map((v,i)=>v+[.3,1.15*l.scale,0][i]),transport:lipidPath(.55,aspect),focus:l.focus};
  amyloidCenters.forEach((center,i)=>{labelPositions[i?`amyloid-${i}`:'amyloid']=flight.position.map((v,j)=>v+center[j]);});
  labels.forEach(node=>{
   const stages=node.dataset.stages.split(' ');node.hidden=!stages.includes(s.stage);
   if(node.hidden)return;
   projected.fromArray(labelPositions[node.dataset.rnaCellLabel]).project(camera);
   if(projected.z<=-1||projected.z>=1){node.hidden=true;return;}
   const x=(projected.x*.5+.5)*width,y=(.5-projected.y*.5)*height;
   if(node.dataset.rnaCellLabel.startsWith('amyloid')){
    // Surface marks stay centered inside their own moving particle cluster.
    // Offscreen spheres take their labels with them instead of clamping to an edge.
    node.hidden=x<18||x>width-18||y<18||y>height-18;
    node.style.left=`${x}px`;node.style.top=`${y}px`;
   }else{
    const margin=Math.min(width*.3,Math.max(28,(node.textContent?.length??16)*3.8+12));
    node.style.left=`${Math.max(margin,Math.min(width-margin,x))}px`;
    node.style.top=`${Math.max(94,Math.min(height-36,y))}px`;
   }
  });
  questions.hidden=s.stage!=='questions';
 }};
}
