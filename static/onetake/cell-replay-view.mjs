const clamp=x=>Math.max(0,Math.min(1,x));
// Approach the editor while the rewind is still inside the molecular view.
// The following target beat holds that completed approach instead of starting
// a second, wider RNA shot. Callers opt in without changing the replay clock.
export function rnaReplayApproach(take,replay,enabled){
 if(!enabled||!replay)return null;
 if(replay.phase==='rewind'&&Number.isFinite(take)&&take<=.37){
  const amount=clamp((.37-take)/(.37-.26));
  return {...replay,phase:'target',contextTake:take,contextHandoff:amount*amount*(3-2*amount),duringRewind:true,rnaApproach:true};
 }
 if(replay.phase==='target'&&Number.isFinite(replay.contextTake)){
  return {...replay,contextHandoff:1,duringRewind:false,rnaApproach:true};
 }
 return null;
}
// Rewind uses the exact forward particle scenes. Only the final close-up
// crossfades to the editor, whose local RNA origin is shared with the intro.
export function cellReplayView(take,replay,enabled){
 if(enabled&&replay?.phase==='question')return {take:.803,replay:null,opacity:1,backdrop:0};
 if(enabled&&replay?.phase==='rewind')return {take,replay:null,opacity:1,backdrop:null};
 if(enabled&&replay?.phase==='target'&&Number.isFinite(replay.contextTake)){
  const amount=clamp(replay.contextHandoff??0);
  const labelExit=clamp(amount/.45);
  return {take:replay.contextTake,replay:null,opacity:1-labelExit*labelExit*(3-2*labelExit),backdrop:replay.rnaApproach&&replay.duringRewind?0:amount,...(replay.rnaApproach?{cameraOpacity:1}:{})};
 }
 return {take,replay,opacity:1,backdrop:null};
}
export function editOriginOffset(strandTarget,replay,enabled,take){
 if(!enabled)return 0;
 if(!replay){const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};return Number.isFinite(take)?-strandTarget*smooth((take-.775)/.035)*(1-smooth((take-.914)/.036)):0;}
 if(!['target','placement','docking','edit','return'].includes(replay.phase))return 0;
 return -strandTarget*(replay.phase==='return'?1-clamp(replay.cameraBlend??0):1);
}

// The new home keeps its neuron object throughout the A-beta flight. The
// older middle cell layer is only needed by routes without this component.
export function legacyParticleOpacity(take,cellContext){
 const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
 return 1-smooth((take-.335)/(.387-.335))
  +(cellContext?0:smooth((take-.634)/(.674-.634))*(1-smooth((take-.786)/(.808-.786))))
  +smooth((take-.914)/(.95-.914));
}

// The ordinary scroll path shares the same editor origin and RNA object as
// the timed replay, including when the reader revisits or skips ahead.
export function rnaEditorView(take,replay,enabled,fix=0){
 if(replay)return replay;
 if(!enabled||take<.815||take>=.95)return null;
 const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
 return {phase:take>.914?"return":"edit",fix,cameraBlend:smooth((take-.914)/.036),presence:smooth((take-.815)/.012)};
}
