// Add travel and A-beta-to-population reading distance without changing any
// camera key, scene order, or the scroll mapping used by other routes.
const bands=[
 [.50,.525,.737,.747,1.1],
 // Ease into the separate A-beta flight with one third more scroll distance.
 [.605,.62,.665,.68,.7],
 // Let the A-beta cloud settle, form one tower, then breathe before pullback.
 [.725,.737,.752,.758,1.2],
 // Two text-rich brain chapters get more room before the maze begins.
 [.932,.935,.969,.971,.85],
];
const rampArea=u=>u*u*u-.5*u*u*u*u;
// Integral of each extra pacing weight: ease in, hold, then ease out.
function bandArea(take,[START,CRUISE_IN,CRUISE_OUT,END,EXTRA]){
 if(take<=START)return 0;
 if(take<CRUISE_IN)return EXTRA*(CRUISE_IN-START)*rampArea((take-START)/(CRUISE_IN-START));
 const entrance=EXTRA*(CRUISE_IN-START)*.5;
 if(take<CRUISE_OUT)return entrance+EXTRA*(take-CRUISE_IN);
 const cruise=entrance+EXTRA*(CRUISE_OUT-CRUISE_IN);
 if(take<END){const u=(take-CRUISE_OUT)/(END-CRUISE_OUT);return cruise+EXTRA*(END-CRUISE_OUT)*(u-rampArea(u));}
 return cruise+EXTRA*(END-CRUISE_OUT)*.5;
}
const addedArea=take=>bands.reduce((total,band)=>total+bandArea(take,band),0);
// The existing mapper interpolates linearly inside a track segment. Small
// subdivisions let that mapper approximate the eased speed at both edges;
// each subdivision retains the exact integrated reading distance.
const rawCuts=[.62,.655];
for(const [START,CRUISE_IN,CRUISE_OUT,END] of bands){
 rawCuts.push(START,CRUISE_IN,CRUISE_OUT,END);
 for(let i=1;i<12;i++){
  rawCuts.push(START+(CRUISE_IN-START)*i/12,CRUISE_OUT+(END-CRUISE_OUT)*i/12);
 }
}
const cuts=[...new Set(rawCuts)].sort((a,b)=>a-b);

export function paceCellScroll(base,enabled){
 if(!enabled||!base.track.length)return base;
 const track=[];let length=0;
 for(const part of base.track){
  // Combined optional sections can contribute the same cut twice. Such a
  // zero-width source segment carries no distance and needs no inverse.
  if(part.to===part.from)continue;
  const density=(part.end-part.start)/(part.to-part.from);
  const edges=[part.from,...cuts.filter(cut=>cut>part.from&&cut<part.to),part.to];
  for(let i=1;i<edges.length;i++){
   const from=edges[i-1],to=edges[i],start=length;
   length+=density*(to-from+addedArea(to)-addedArea(from));
   track.push({...part,from,to,start,end:length});
  }
 }
 return {...base,track,length,scale:base.scale*length/base.length};
}
