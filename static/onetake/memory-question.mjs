import {memoryQuestionState} from './memory-constellation-state.mjs';
// This runs after the normal Paris and cell updates in the existing render
// loop. Captions and tower removal therefore describe the same exact frame.
export function createMemoryQuestion(scene,root){
 const el=root.querySelector('[data-memory-question]');
 if(!el?.querySelector)return {update(){},dispose(){}};
 const prefix=el.querySelector('[data-memory-question-prefix]');
 const full=el.querySelector('[data-memory-question-full]');
 const cities=scene.getObjectByName('paris-population-world-particles');
 // Paris is created later in boot, so bind the existing objects lazily.
 let cityPoints=cities,amyloid=null;
 return {update(take,replay){
  const s=memoryQuestionState(take,replay),staticMode=root.classList.contains('ot--static');
  const visible=!staticMode&&s.presence>.001;
  el.hidden=!visible;
  prefix.style.opacity=String(s.prefix);full.style.opacity=String(s.full);
  prefix.setAttribute('aria-hidden',String(!visible||s.prefix<.01));
  full.setAttribute('aria-hidden',String(!visible||s.full<.01));
  cityPoints??=scene.getObjectByName('paris-population-world-particles');
  if(s.cityFade>=1){if(cityPoints)cityPoints.visible=true;return;}
  amyloid??=scene.getObjectByName('extracellular-amyloid');
  if(cityPoints){
   cityPoints.material.uniforms.uOpacity.value*=s.cityFade;
   if(s.cityFade===0)cityPoints.visible=false;
   else cityPoints.visible=cityPoints.material.uniforms.uOpacity.value>.00001;
  }
  // Preserve Aβ beside the neuron while removing its remaining tower form.
  if(amyloid?.material.uniforms.uParisMorph)amyloid.material.uniforms.uParisMorph.value*=s.cityFade;
 },dispose(){el.hidden=true;}};
}
