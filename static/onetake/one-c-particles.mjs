// Conceptual single-stranded RNA, not an experimentally resolved APOE fold.
// A single coiled backbone carries volumetric nucleotide units. Only CGC is
// lettered; flanking sequence is omitted. Lettering is projected by the UI.
import {legacyRnaData} from './legacy-rna-shape.mjs';
import {createCursorScatter,cursorScatterDeclarations,cursorScatterPosition} from './particle-cursor-scatter.mjs';
import {rnaCellState,rnaInCell} from './rna-cell-state.mjs';
import {coverCTravel} from './cover-c-bridge.mjs';
import {oneCState} from './one-c-context.mjs';
const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
const mix=(a,b,t)=>a+(b-a)*t;
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const mul=(a,s)=>a.map(v=>v*s);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const unit=a=>mul(a,1/Math.max(.00001,Math.hypot(...a)));
const phase=x=>Math.PI+x*.85+Math.sin(x*.27)*.28;
const axisY=x=>-1+Math.sin(x*.29)*.18;
export const rnaBackboneAt=x=>[x,axisY(x)+Math.cos(phase(x))*1.15,Math.sin(phase(x))*1.3];
const baseAt=x=>[x,axisY(x)+Math.cos(phase(x))*.18,Math.sin(phase(x))*.24];
export function oneCParticleData({small=false,strand=null}={}){
 const original=legacyRnaData(strand,{small});if(original)return original;
 let seed=1122026;
 const rand=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 const positions=[],roles=[],seeds=[],normals=[];
 const point=(p,n,role)=>{positions.push(...p);normals.push(...n);roles.push(role);seeds.push(rand());};
 const direction=()=>{const z=rand()*2-1,a=rand()*Math.PI*2,r=Math.sqrt(1-z*z);return [r*Math.cos(a),r*Math.sin(a),z];};
 function tube(a,b,r,n,role){
  const along=unit(sub(b,a)),u=unit(cross(along,Math.abs(along[1])>.9?[1,0,0]:[0,1,0])),v=cross(along,u);
  for(let i=0;i<n;i++){const t=rand(),angle=rand()*Math.PI*2,normal=add(mul(u,Math.cos(angle)),mul(v,Math.sin(angle)));point(add(add(a,mul(sub(b,a),t)),mul(normal,r)),normal,role);}
 }
 function bead(center,r,n,role,angle=0){
  const u=[1,0,0],v=[0,Math.cos(angle),Math.sin(angle)],w=[0,-Math.sin(angle),Math.cos(angle)];
  for(let i=0;i<n;i++){
   const d=direction(),p=add(add(mul(u,d[0]*r[0]),mul(v,d[1]*r[1])),mul(w,d[2]*r[2]));
   const normal=unit(add(add(mul(u,d[0]/r[0]),mul(v,d[1]/r[1])),mul(w,d[2]/r[2])));
   point(add(center,p),normal,role);
  }
 }
 const half=small?5:11,step=1.1,width=half*step;
 // The one backbone follows an irregular coil through all three dimensions.
 for(let i=0,n=small?2600:5200;i<n;i++){
  const x=(rand()*2-1)*width,a=rnaBackboneAt(x),tangent=unit(sub(rnaBackboneAt(x+.01),a));
  const u=unit(cross(tangent,[0,1,0])),v=cross(tangent,u),angle=rand()*Math.PI*2;
  const normal=add(mul(u,Math.cos(angle)),mul(v,Math.sin(angle)));
  point(add(a,mul(normal,.075)),normal,2);
 }
 // Stylized sugar/phosphate beads and flattened base surfaces give the RNA
 // thickness, changing orientations and readable foreground/background layers.
 for(let i=-half;i<=half;i++){
  const x=i*step,a=phase(x),back=rnaBackboneAt(x),head=baseAt(x),radial=[0,Math.cos(a),Math.sin(a)];
  const ring=[];
  for(let k=0;k<5;k++){
   const angle=k*Math.PI*2/5,p=add(back,add([Math.cos(angle)*.19,0,0],mul(radial,Math.sin(angle)*.19)));
   ring.push(p);bead(p,[.075,.075,.075],small?15:27,4);
  }
  for(let k=0;k<5;k++)tube(ring[k],ring[(k+1)%5],.035,small?10:20,4);
  bead(back,[.145,.145,.145],small?35:65,2);
  tube(back,head,.045,small?45:85,i===0?6:5);
  bead(head,[.14,.115,.075],small?65:120,i===0?6:5,a);
 }
 for(let i=0,n=small?180:300;i<n;i++){
  const t=rand()*4,k=Math.floor(t),u=t-k;
  const p=k===0?[-.52+u*1.04,.55,.03]:k===1?[.52,.55-u*1.1,.03]:k===2?[.52-u*1.04,-.55,.03]:[-.52,-.55+u*1.1,.03];
  point(p,[0,0,1],3);
 }
 const anchors=[0,step,step*2].map(x=>add(baseAt(x),[0,1.18,0]));
 return {positions:new Float32Array(positions),ends:new Float32Array(positions),roles:new Float32Array(roles),seeds:new Float32Array(seeds),normals:new Float32Array(normals),anchors};
}
export function oneCCameraPose(take,time,aspect=1.6){
 const context=oneCState(take).context,phone=aspect<1;
 const near=Math.max(4.4,2.35/aspect),far=phone?28:22,travel=smooth((take-.20)/.37);
 return {position:[Math.sin(time*.13)*.075+context*.22+travel*(phone?1.2:3.4),Math.sin(time*.17)*.04+travel*.6,mix(near,far,context)*(1-travel*.06)],look:[context*.18+travel*(phone?.3:1.1),mix(-.13,-.95,context)+travel*.14,0]};
}
const vertex=`
attribute vec3 aNormal;
attribute float aRole,aSeed;
uniform float uTime,uOpacity,uContext,uEdit,uPR,uMotion,uLegacy,uEditor;
varying vec3 vColor;varying float vAlpha;
${cursorScatterDeclarations}
${cursorScatterPosition}
void main(){
 vec3 p=position;
 p+=vec3(sin(uTime*.7+aSeed*32.),cos(uTime*.54+aSeed*44.),sin(uTime*.43+aSeed*69.))*.013*uMotion;
 vec4 mv=modelViewMatrix*vec4(p,1.);
 mv=cursorScatterPosition(mv,abs(aRole-3.)<.1?0.:1.,aSeed);
 gl_Position=projectionMatrix*mv;
 gl_PointSize=clamp((1.25+aSeed*.8)*uPR*pow(10./max(1.,-mv.z),.28),.9*uPR,3.2*uPR);
 vColor=vec3(.53,.68,.94);
 if(aRole>3.5)vColor=vec3(.67,.59,.86);
 if(aRole>4.5)vColor=mix(vec3(.56,.73,.85),vec3(.72,.6,.9),aSeed);
 if(aRole>5.5||abs(aRole-3.)<.1)vColor=mix(vec3(1.,.58,.69),vec3(.55,1.,.79),uEdit);
 vColor=mix(vColor,aRole>4.5?vec3(.75,.72,.95):vec3(.78,.86,1.),uLegacy*.65);
 float light=mix(.4,.65,uLegacy)+mix(.6,.35,uLegacy)*max(0.,dot(normalize(normalMatrix*aNormal),normalize(vec3(-.4,.65,1.))));
 vColor*=light;
 float flow=.8+.2*sin(position.x*1.4-uTime*1.2);
 vAlpha=uOpacity*uContext*(.55+.4*aSeed)*flow;
 if(abs(aRole-3.)<.1)vAlpha*=.72*(1.-uEditor);
}`;
const fragment=`varying vec3 vColor;varying float vAlpha;
void main(){float a=1.-smoothstep(.05,.5,length(gl_PointCoord-.5));if(a*vAlpha<.045)discard;gl_FragColor=vec4(vColor,a*a*vAlpha);}`;
export function createOneCParticles(THREE,scene,{enabled=true,small=false,strand=null}={}){
 if(!enabled)return {camera(){},update(){},labels(){return null;}};
 const data=oneCParticleData({small,strand}),geometry=new THREE.BufferGeometry();
 geometry.setAttribute('position',new THREE.BufferAttribute(data.positions,3));
 geometry.setAttribute('aNormal',new THREE.BufferAttribute(data.normals,3));
 geometry.setAttribute('aRole',new THREE.BufferAttribute(data.roles,1));
 geometry.setAttribute('aSeed',new THREE.BufferAttribute(data.seeds,1));
 const scatter=createCursorScatter(THREE);
 const uniforms={...scatter.uniforms,uTime:{value:0},uOpacity:{value:0},uContext:{value:0},uEdit:{value:0},uPR:{value:1},uMotion:{value:1},uLegacy:{value:data.fromLegacy?1:0},uEditor:{value:0}};
 const material=new THREE.ShaderMaterial({uniforms,vertexShader:vertex,fragmentShader:fragment,transparent:true,depthWrite:true,blending:THREE.AdditiveBlending});
 const points=new THREE.Points(geometry,material);points.name='one-c-rna-particles';points.frustumCulled=false;points.visible=false;scene.add(points);
 const position=new THREE.Vector3(),look=new THREE.Vector3(),projected=new THREE.Vector3(),upper=new THREE.Vector3(),lower=new THREE.Vector3();
 let context=0;
 return {points,camera(take,time,aspect,camPos,camLook,replay,opacity=1){
  if(replay||take<-.108||take>.625)return;
  const pose=oneCCameraPose(take,time,aspect),blend=(1-smooth((take-.57)/.055))*opacity;
  camPos.lerp(position.fromArray(pose.position),blend);camLook.lerp(look.fromArray(pose.look),blend);
 },update(take,time,dt,edited,replay,motion=1,viewOpacity=1,editorReplay=null,pointer={}){
  scatter.update(pointer,globalThis.innerWidth,globalThis.innerHeight,dt,motion);
  const state=oneCState(take),cell=rnaCellState(take),transform=rnaInCell(take,globalThis.innerWidth/globalThis.innerHeight||1.6);
  uniforms.uEditor.value=0;
  context=state.context;const opacity=Math.max(state.opacity,cell.opacity)*viewOpacity;points.visible=opacity>.001&&context>.001&&!replay;
  points.position.fromArray(transform.position);points.scale.setScalar(transform.scale);
  uniforms.uOpacity.value=replay?0:opacity;
  uniforms.uTime.value=time;uniforms.uContext.value=context;uniforms.uMotion.value=motion;
  uniforms.uPR.value=Math.min(globalThis.devicePixelRatio||1,small?1.5:1.75);
  if(data.editorTransform&&!editorReplay&&!edited)uniforms.uEdit.value=0;
  uniforms.uEdit.value+=(Number(edited)-uniforms.uEdit.value)*(1-Math.exp(-Math.max(0,dt)*5));
  points.rotation.y=Math.sin(time*.17)*.055*motion*(1-cell.zoom);points.rotation.z=Math.sin(time*.12)*.012*motion*(1-cell.zoom);
  const phase=editorReplay?.phase,editing=data.editorTransform&&['target','placement','docking','edit','return'].includes(phase);
  if(editing){
   const handoff=phase==='target'?Math.max(0,Math.min(1,editorReplay.contextHandoff??0)):1;
   uniforms.uEditor.value=handoff;
   const endpoint=data.editorTransform;
   points.position.lerp(position.fromArray(endpoint.position),handoff);
   points.scale.set(...endpoint.scale.map(v=>mix(transform.scale,v,handoff)));
   points.rotation.set(points.rotation.x*(1-handoff),points.rotation.y*(1-handoff),points.rotation.z*(1-handoff));
   const presence=phase==='return'?1-Math.max(0,Math.min(1,editorReplay.cameraBlend??0)):1;
   uniforms.uOpacity.value=mix(Math.max(state.opacity,cell.opacity),.74,handoff)*presence*(editorReplay.presence??1);
   uniforms.uContext.value=1;uniforms.uEdit.value=editorReplay.fix??0;
   points.visible=uniforms.uOpacity.value>.001;
  }
  points.updateMatrixWorld(true);
 },labels(camera,width,height){
  const capHeight=mix(1.3,.78,coverCTravel(context));
  return data.anchors.map(anchor=>{
   projected.fromArray(anchor).applyMatrix4(points.matrixWorld).project(camera);
   upper.fromArray(anchor).add(new THREE.Vector3(0,capHeight/2,0)).applyMatrix4(points.matrixWorld).project(camera);
   lower.fromArray(anchor).add(new THREE.Vector3(0,-capHeight/2,0)).applyMatrix4(points.matrixWorld).project(camera);
   return {x:(projected.x*.5+.5)*width,y:(.5-projected.y*.5)*height,size:Math.abs(upper.y-lower.y)*height/.8/2,visible:projected.z>-1&&projected.z<1};
  });
 }};
}
