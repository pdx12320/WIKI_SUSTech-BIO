// Match the original brain's screen-space pointer avoidance in onetake.js.
// Geometry stays immutable; a single eased pointer parts nearby particles.
export const cursorScatterDeclarations=`
uniform vec2 uCursorPointer;
uniform float uCursorAspect,uCursorOn,uCursorMotion;
`;

export const cursorScatterPosition=`
vec4 cursorScatterPosition(vec4 mv,float influenceMask,float seed){
 if(influenceMask<=0.||uCursorMotion<=0.||uCursorOn<=0.)return mv;
 vec4 clip=projectionMatrix*mv;
 if(clip.w<=.001)return mv;
 vec2 ndc=clip.xy/clip.w;
 vec2 dm=(ndc-uCursorPointer)*vec2(uCursorAspect,1.);
 float push=exp(-dot(dm,dm)*14.)*.07*uCursorOn*uCursorMotion*clamp(influenceMask,0.,1.);
 // Same projected displacement as the brain; no jitter, depth kick or trails.
 mv.xy+=normalize(dm+1e-5)*push*clip.w/vec2(projectionMatrix[0][0],projectionMatrix[1][1]);
 return mv;
}
`;

export function createCursorScatter(THREE){
 const pointerPosition=new THREE.Vector2(0,0),target=new THREE.Vector2(0,0);
 const uniforms={uCursorPointer:{value:pointerPosition},uCursorAspect:{value:1},uCursorOn:{value:0},uCursorMotion:{value:1}};
 return {uniforms,update(pointer={},width=1440,height=900,dt=.016,motion=1){
  const w=Math.max(1,Number.isFinite(width)?width:1440),h=Math.max(1,Number.isFinite(height)?height:900);
  const step=Math.max(0,Number.isFinite(dt)?dt:0),activity=Math.max(0,Math.min(1,motion));
  const on=Number.isFinite(pointer.x)&&Number.isFinite(pointer.y)?Math.max(0,Math.min(1,pointer.on??0)):0;
  uniforms.uCursorAspect.value=w/h;uniforms.uCursorMotion.value=activity;uniforms.uCursorOn.value=on;
  target.set(on?pointer.x:0,on?pointer.y:0);
  pointerPosition.lerp(target,1-Math.exp(-step*3));
  if(activity===0){pointerPosition.set(0,0);uniforms.uCursorOn.value=0;}
 }};
}
