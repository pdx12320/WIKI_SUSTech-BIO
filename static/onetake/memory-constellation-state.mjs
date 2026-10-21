// Preview-only insertion. All disease changes are scroll-derived, so reverse
// traversal restores the same conceptual illustration rather than restarting it.
const clamp=x=>Math.max(0,Math.min(1,x));
const ease=x=>{x=clamp(x);return x*x*(3-2*x);};
export const MEMORY_START=.728, MEMORY_END=.756;
export function memoryConstellationState(take,replay){
 const enabled=!replay||replay.phase==='rewind';
 const enter=ease((take-.728)/.006),leave=ease((take-.750)/.006);
 return {presence:enabled?enter*(1-leave):0,enter,leave,
  expand:ease((take-.735)/.006),loss:ease((take-.741)/.003),
  disorient:ease((take-.744)/.003),disconnect:ease((take-.747)/.003),
  retreat:ease((take-.749)/.007),
  stage:take<.735?'brain':take<.741?'constellation':take<.744?'loss':take<.747?'orientation':take<.750?'connection':'survivors'};
}
// The original Paris clock resumes at .760. Nothing outside the insertion
// changes; population captions, camera and tower share this mapped clock.
export function memoryPopulationTake(take,enabled=true){
 if(!enabled||take<=.737||take>=.760)return take;
 if(take<.752)return .737;
 const u=(take-.752)/.008;
 // Hermite endpoints: depart the held clock at zero speed and rejoin the
 // original clock at speed one, including during the Paris pullback.
 return .737+.023*ease(u)+.008*(u*u*u-u*u);
}
export function memoryQuestionState(take,replay){
 const cityFade=1-ease((take-.782)/.0175);
 const on=(!replay||replay.phase==='question')&&take>=.7805&&take<.815;
 // The last tower is gone at .7995. A short, deliberate breath separates
 // that visual handoff from the first letter of the complete question.
 const full=on?ease((take-.8005)/.002):0;
 const presence=on?ease((take-.7805)/.002)*(1-ease((take-.812)/.003)):0;
 return {cityFade,presence,prefix:presence*(1-full),full:presence*full,
  populationFade:1-ease((take-.778)/.0025)};
}
export function paceMemoryConstellation(base,enabled){
 if(!enabled)return base;
 const cuts=[.728,.734,.735,.741,.744,.747,.750,.752,.756,.758,.760,.771,.780,.782,.784,.789,.795,.797];
 const track=[];let length=0;
 for(const part of base.track){
  if(part.to<=part.from)continue;
  const edges=[part.from,...cuts.filter(x=>x>part.from&&x<part.to),part.to];
  for(let i=1;i<edges.length;i++){
   const from=edges[i-1],to=edges[i],mid=(from+to)/2,start=length;
   // Approximately five additional screens, distributed across the three
   // symptoms. The 57-million reading hold follows after the star field.
   const extra=mid>=.728&&mid<.752?19:mid>=.752&&mid<.758?27:0;
   // Give the single-city → 27-city camera retreat 70% more wheel travel.
   // Its geometry and eased camera path stay on the same reversible clock.
   const parisRetreat=mid>=.758&&mid<.771?1.7:1;
   const neuronReturn=mid>=.780&&mid<.797?1.8:1;
   length+=((part.end-part.start)*(to-from)/(part.to-part.from)+extra*(to-from))*parisRetreat*neuronReturn;
   track.push({...part,from,to,start,end:length});
  }
 }
 return {...base,track,length,scale:base.scale*length/base.length};
}
