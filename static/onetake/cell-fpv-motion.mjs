import {cellLayout,rnaCellState,lipidPath,ease} from './rna-cell-state.mjs';
const clamp=x=>Math.max(0,Math.min(1,x));
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const scale=(a,n)=>a.map(v=>v*n);
const mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
const unit=a=>scale(a,1/(Math.hypot(...a)||1));
const smoother=x=>{x=clamp(x);return x*x*x*(x*(x*6-15)+10);};
function flightPath(t,aspect){
 const center=cellLayout(aspect).neuron,offsets=aspect<1?[[-.4,.8,4],[.3,.35,3.6],[.2,.3,2.8],[-.15,.2,2]]:[[-.8,.6,4.5],[-.3,1,3.9],[-.1,.5,3],[-.3,.2,2.15]];
 const points=offsets.map(p=>add(center,p));
 const [a,b,c,d]=points,u=1-t;
 return {position:a.map((v,i)=>u*u*u*v+3*u*u*t*b[i]+3*u*t*t*c[i]+t*t*t*d[i]),
  tangent:unit(a.map((v,i)=>3*u*u*(b[i]-v)+6*u*t*(c[i]-b[i])+3*t*t*(d[i]-c[i])))};
}
export function amyloidFlight(take,aspect=1.6){
 const travel=smoother((take-.655)/.075),path=flightPath(travel,aspect),handoff=ease((take-.737)/.015);
 return {travel,position:path.position,tangent:path.tangent,mix:ease((take-.615)/.04),
  opacity:ease((take-.51)/.035)*(1-handoff),particleMix:ease((take-.50)/.04)*(1-ease((take-.752)/.02)),
  camera:add(sub(path.position,scale(path.tangent,2.8)),[0,.3,.2]),look:mix(add(path.position,scale(path.tangent,1.4)),cellLayout(aspect).neuron,ease(travel)*.65),
  bank:Math.sin(travel*Math.PI*2)*.045*(1-handoff)};
}
export function cellCameraPose(take,time=0,aspect=1.6,pointer={}){
 const l=cellLayout(aspect),s=rnaCellState(take),wide=ease((take-.39)/.13),flight=amyloidFlight(take,aspect);
 const close=add(l.astro,[1.3,1.2,aspect<1?11:13.5]);
 let position=mix(close,l.camera,wide),look=mix(l.astro,[0,0,0],wide);
 position[0]+=Math.sin(time*.15)*.14;position[1]+=Math.sin(time*.12)*.08;
 // Ride the lipid relationship line before following a separate A-beta cluster.
 const cargo=lipidPath(s.transport,aspect),cargoLead=lipidPath(Math.min(1,s.transport+.15),aspect);
 const transportCamera=add(cargo,[-1.2*l.scale,1.15*l.scale,9.8-2.6*s.transport]);
 const transportBlend=ease((take-.50)/.045);
 position=mix(position,transportCamera,transportBlend);look=mix(look,cargoLead,transportBlend);
 // Orbit around the subject, instead of translating a flat picture.
 const yaw=clamp((pointer.x??0)*.5+.5)*2-1,pitch=clamp((pointer.y??0)*.5+.5)*2-1;
 const response=(pointer.on??0)*(1-flight.mix*.8),v=sub(position,look),a=yaw*.09*response,b=pitch*.055*response;
 const x=v[0]*Math.cos(a)+v[2]*Math.sin(a),z=-v[0]*Math.sin(a)+v[2]*Math.cos(a);
 position=add(look,[x,v[1]*Math.cos(b)+z*Math.sin(b),-v[1]*Math.sin(b)+z*Math.cos(b)]);
 return {position:mix(position,flight.camera,flight.mix),look:mix(look,flight.look,flight.mix),
  blend:s.zoom,bank:flight.bank,flight};
}

export function cellQuestionPose(take,time=0,aspect=1.6,pointer={}){
 const l=cellLayout(aspect),terminal=amyloidFlight(.73,aspect),look=add(l.neuron,[0,-1.7,0]);
 // Pull back along the preceding FPV sightline, keeping the same neuron pose.
 const v=scale(unit(sub(terminal.camera,terminal.look)),aspect<1?18.5:18);
 const response=pointer.on??0,a=(pointer.x??0)*.065*response,b=(pointer.y??0)*.04*response;
 const x=v[0]*Math.cos(a)+v[2]*Math.sin(a),z=-v[0]*Math.sin(a)+v[2]*Math.cos(a);
 const position=add(look,[x+Math.sin(time*.15)*.12,v[1]*Math.cos(b)+z*Math.sin(b),-v[1]*Math.sin(b)+z*Math.cos(b)]);
 return {blend:rnaCellState(take).question,position,look};
}
export function cellPointerTranslation(take,enabled){
 return enabled?1-ease((take-.58)/.03)*(1-ease((take-.81)/.02)):1;
}
