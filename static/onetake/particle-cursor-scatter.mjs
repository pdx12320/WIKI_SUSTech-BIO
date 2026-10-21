// Screen-space cursor scattering for an existing Points material. Particle
// positions remain immutable; only short-lived shader impulses are updated.
export const cursorScatterDeclarations=`
uniform vec3 uCursorTrails[5];
uniform vec2 uCursorViewport;
uniform float uCursorMotion;
`;

export const cursorScatterPosition=`
vec4 cursorScatterPosition(vec4 mv,float influenceMask,float seed){
 if(influenceMask<=0.||uCursorMotion<=0.)return mv;
 vec4 clip=projectionMatrix*mv;
 if(clip.w<=.001)return mv;
 vec2 ndc=clip.xy/clip.w;
 float push=0.;vec2 away=vec2(1.,0.);
 float variation=clamp(seed,0.,1.);
 vec2 jitter=vec2(cos(variation*6.283185),sin(variation*6.283185));
 for(int i=0;i<5;i++){
  vec2 delta=(ndc-uCursorTrails[i].xy)*uCursorViewport*.5;
  float distance2=dot(delta,delta);
  float influence=exp(-2.5*distance2/(62.*62.))*uCursorTrails[i].z;
  if(influence>push){
   push=influence;
   vec2 radial=distance2>.0001?delta/sqrt(distance2):jitter;
   away=normalize(radial+jitter*.22);
  }
 }
 float strength=push*clamp(influenceMask,0.,1.)*uCursorMotion;
 vec2 pixels=away*strength*(38.+variation*14.);
 mv.xy+=pixels*2./uCursorViewport*max(.001,-mv.z)/vec2(projectionMatrix[0][0],projectionMatrix[1][1]);
 mv.z+=(variation-.5)*strength;
 return mv;
}
`;

export function createCursorScatter(THREE){
 const trails=Array.from({length:5},()=>new THREE.Vector3(9,9,0));
 const uniforms={uCursorTrails:{value:trails},uCursorViewport:{value:new THREE.Vector2(1440,900)},uCursorMotion:{value:1}};
 let clock=0;
 return {uniforms,update(pointer={},width=1440,height=900,dt=.016,motion=1){
  const w=Math.max(1,Number.isFinite(width)?width:1440),h=Math.max(1,Number.isFinite(height)?height:900);
  const step=Math.max(0,Number.isFinite(dt)?dt:0),activity=Math.max(0,Math.min(1,motion));
  uniforms.uCursorViewport.value.set(w,h);uniforms.uCursorMotion.value=activity;
  if(activity===0){trails.forEach(trail=>trail.set(9,9,0));clock=0;return;}
  clock+=step;
  for(const trail of trails){trail.z*=Math.exp(-step*4.8);if(trail.z<.0001)trail.set(9,9,0);}
  const on=Math.max(0,Math.min(1,pointer.on??0));
  if(!on||!Number.isFinite(pointer.x)||!Number.isFinite(pointer.y))return;
  const previous=trails[0],distance=Math.hypot((pointer.x-previous.x)*w*.5,(pointer.y-previous.y)*h*.5);
  if(previous.z<.05||distance>12||clock>.06){
   for(let i=trails.length-1;i>0;i--)trails[i].copy(trails[i-1]);
   previous.set(pointer.x,pointer.y,on);clock=0;
  }else previous.z=on;
 }};
}
