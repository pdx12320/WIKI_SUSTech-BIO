// Procedural 3D particle surfaces. Neither cell morphology nor molecular
// shapes are presented as reconstructions of experimental measurements.
export function cellParticleData(kind,{small=false}={}){
 let seed=kind==='astro'?112:kind==='neuron'?158:420;
 const rand=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 const positions=[],tones=[],normals=[],factor=small?.44:1;
 const norm=a=>{const n=Math.hypot(...a)||1;return a.map(v=>v/n);};
 const add=(a,b)=>a.map((v,i)=>v+b[i]);
 const mul=(a,k)=>a.map(v=>v*k);
 const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
 const point=(p,k,normal)=>{positions.push(...p);tones.push(k);normals.push(...normal);};
 const direction=()=>{const z=rand()*2-1,a=rand()*Math.PI*2,r=Math.sqrt(1-z*z);return [Math.cos(a)*r,Math.sin(a)*r,z];};
 function sphere(center,radii,count,tone=0,interior=false){
  for(let i=0;i<Math.ceil(count*factor);i++){
   const normal=direction(),r=interior?Math.cbrt(rand()):.96+.04*rand();
   const taper=kind==='neuron'&&tone===0?1-normal[1]*.2:1;
   point(center.map((v,j)=>v+normal[j]*radii[j]*r*(j===0?taper:1)),tone,normal);
  }
 }
 function branch(a,c,b,r0,r1,count,tone=0){
  for(let i=0;i<Math.ceil(count*factor);i++){
   const t=rand(),angle=rand()*Math.PI*2;
   const tangent=norm(a.map((v,j)=>2*(1-t)*(c[j]-v)+2*t*(b[j]-c[j])));
   const u=norm(cross(tangent,Math.abs(tangent[1])>.9?[1,0,0]:[0,1,0])),v=cross(tangent,u);
   const normal=u.map((x,j)=>x*Math.cos(angle)+v[j]*Math.sin(angle));
   const bulge=1+.16*Math.sin(t*Math.PI*4),radius=(r0+(r1-r0)*t)*bulge*(.82+.18*rand());
   point(a.map((x,j)=>(1-t)**2*x+2*(1-t)*t*c[j]+t*t*b[j]+normal[j]*radius),tone,normal);
  }
 }
 if(kind==='protein'){
  for(let i=0;i<120;i++){
   const t=i/119,a=[Math.sin(t*16)*.17,(t-.5)*1.05,Math.cos(t*16)*.17],b=[Math.sin((t+.009)*16)*.17,(t+.009-.5)*1.05,Math.cos((t+.009)*16)*.17];
   branch(a,a.map((v,j)=>(v+b[j])/2),b,.045,.045,14,2);
  }
 }else{
  const astro=kind==='astro';
  sphere([0,0,0],astro?[1.45,1.2,1.15]:[.9,1.3,.95],astro?3600:2600);
  sphere([-.2,.15,-.04],astro?[.52,.48,.45]:[.42,.5,.38],astro?1150:900,1);
  sphere([0,0,0],astro?[1.25,1.05,.98]:[.72,1.05,.8],astro?900:650,0,true);
  const angles=astro?Array.from({length:12},(_,i)=>i*Math.PI/6+.13):[.25,1.3,2.3,2.95,3.6];
  for(let arm=0;arm<angles.length;arm++){
   const angle=angles[arm]+(rand()-.5)*.16,z=astro?Math.sin(arm*2.399)*.72:[.38,-.62,.7,-.46,.2][arm];
   const radial=Math.sqrt(1-z*z),dir=[Math.cos(angle)*radial,Math.sin(angle)*radial,z];
   const start=mul(dir,.7),length=(astro?2.5:2.9)+rand()*.7,end=mul(dir,length);
   const bend=direction(),control=start.map((v,j)=>(v+end[j])/2+bend[j]*.65);
   branch(start,control,end,astro?.43:.36,astro?.18:.14,astro?650:800);
   for(const side of [-1,1]){
    const theta=angle+side*(astro?.58:.45),next=norm([Math.cos(theta)*radial,Math.sin(theta)*radial,z+side*.48]);
    const tip=add(end,mul(next,astro?.85:1.05)),ctrl=add(end,mul(bend,.35));
    branch(end,ctrl,tip,astro?.2:.16,.07,astro?290:350);
    for(const fork of [-1,1]){
     const fine=norm(add(next,[fork*.28,-fork*.22,fork*.48])),b=add(tip,mul(fine,.62));
     branch(tip,add(tip,mul(next,.3)),b,.09,.025,astro?150:180);
     sphere(b,[.07,.08,.08],28);
    }
   }
  }
  if(!astro){
   const a=[.2,-.8,0],end=[2.6,-3.5,1.5];
   branch(a,[.25,-2.8,2.4],end,.27,.08,1600);
   for(const side of [-1,1])branch(end,[end[0]+side*.4,end[1]-.2,end[2]+side*.3],[end[0]+side*.9,end[1]-.7,end[2]+side*.5],.09,.025,260);
  }
 }
 return {positions:new Float32Array(positions),tones:new Float32Array(tones),normals:new Float32Array(normals)};
}

// Reuse the exact legacy cell cloud supplied by onetake.js. Astrocyte geometry
// keeps its old branching topology; the neuron is another 3D view of that
// arbor, with an elongated soma and a distinct long axon.
export function legacyCellParticles(cell,{small=false,kind='astro'}={}){
 if(!cell?.pos?.length)return cellParticleData(kind,{small});
 const positions=[],normals=[],tones=[],sourceIndices=[],count=cell.pos.length/3;
 const budget=small?13000:36000,stride=Math.max(1,Math.ceil(count/budget)),neuron=kind==='neuron';
 if(neuron&&cell.branchIds?.length===count&&cell.arbors?.length>=3){
  const selected=neuronArborSelection(cell.arbors);
  if(selected.length>=3)return directionalNeuron(cell,{small,stride,selected});
 }
 for(let i=0;i<count;i+=stride){
  const meta=cell.meta[i],body=meta!==1,k=body?1.18:1.1;
  let x=cell.pos[i*3]*k,y=cell.pos[i*3+1]*k,z=cell.pos[i*3+2]*k;
  if(neuron){
   x*=body?.82:1;y*=body?1.22:1.12;
   const a=.82,xx=x*Math.cos(a)+z*Math.sin(a),zz=-x*Math.sin(a)+z*Math.cos(a);x=xx;z=zz;
   const b=-.25,yy=y*Math.cos(b)-x*Math.sin(b);x=y*Math.sin(b)+x*Math.cos(b);y=yy;
  }
  positions.push(x,y,z);const length=Math.hypot(x,y,z)||1;normals.push(x/length,y/length,z/length);tones.push(meta===2?1:0);sourceIndices.push(i);
 }
 if(neuron)for(let i=0,n=small?750:1800;i<n;i++){
  const t=i/n,a=i*2.39996,r=.25*(1-t)+.04,x=.2+3*t*t,y=-.8-4.8*t,z=Math.sin(t*Math.PI)*2.2;
  const nx=Math.cos(a),nz=Math.sin(a);positions.push(x+nx*r,y,z+nz*r);normals.push(nx,0,nz);tones.push(0);sourceIndices.push(-1);
 }
 return {positions:new Float32Array(positions),normals:new Float32Array(normals),tones:new Float32Array(tones),sourceIndices:new Int32Array(sourceIndices),fromLegacy:true};
}

// Keep the old view transform, but select whole original arbors rather than
// cutting angular wedges through their fine branches. No source array changes.
function neuronRotation([x,y,z]){
 const yaw=.82,roll=-.25,xx=x*Math.cos(yaw)+z*Math.sin(yaw),zz=-x*Math.sin(yaw)+z*Math.cos(yaw);
 return [y*Math.sin(roll)+xx*Math.cos(roll),y*Math.cos(roll)-xx*Math.sin(roll),zz];
}
function neuronArborSelection(arbors){
 const unit=a=>{const length=Math.hypot(...a)||1;return a.map(v=>v/length);};
 const dot=(a,b)=>a.reduce((sum,v,i)=>sum+v*b[i],0);
 const candidates=arbors.filter(arbor=>Number.isInteger(arbor.id)&&arbor.direction?.length===3&&arbor.direction.every(Number.isFinite))
  .map(arbor=>({id:arbor.id,direction:unit(neuronRotation([arbor.direction[0],arbor.direction[1]*1.12,arbor.direction[2]]))}));
 const upper=candidates.filter(arbor=>arbor.direction[1]>-.2),pool=upper.length>=3?upper:candidates;
 const targets=[[0,1,.1],[-.85,.45,-.25],[.85,.35,.3],[.05,.35,-.9]].map(unit),selected=[];
 for(const target of targets.slice(0,Math.min(4,pool.length))){
  const available=pool.filter(arbor=>!selected.some(previous=>previous.id===arbor.id));
  if(!available.length)break;
  const separated=available.filter(arbor=>selected.every(previous=>dot(previous.direction,arbor.direction)<.82));
  const choices=separated.length?separated:available;
  const score=arbor=>dot(arbor.direction,target)*.9+arbor.direction[1]*.25+(selected.length?Math.min(...selected.map(previous=>1-dot(previous.direction,arbor.direction)))*.65:0);
  selected.push(choices.reduce((best,arbor)=>score(arbor)>score(best)?arbor:best));
 }
 return selected.map(arbor=>arbor.id);
}
function directionalNeuron(cell,{small,stride,selected}){
 const positions=[],normals=[],tones=[],sourceIndices=[],ids=new Set(selected),count=cell.pos.length/3;
 const append=(p,normal,tone,index)=>{positions.push(...p);normals.push(...normal);tones.push(tone);sourceIndices.push(index);};
 const rootDirections=cell.arbors.filter(arbor=>ids.has(arbor.id)).map(arbor=>{const length=Math.hypot(...arbor.direction)||1;return arbor.direction.map(v=>v/length);});
 // A shared smooth field bends complete arbors and opens the canopy. Nearby
 // source points stay nearby: there is no independent random displacement.
 const organic=p=>{
  const [x,y,z]=p,t=Math.max(0,Math.min(1,(Math.hypot(...p)-.55)/3.2)),w=t*t*(3-2*t);
  return [x*(1+.20*w)+(Math.sin(y*.6+z*.25)*.40+Math.sin(z*.45)*.17)*w,
   y+(Math.sin(x*.58-z*.25)*.30+Math.sin(z*.5)*.10)*w,
   z*(1+.08*w)+(Math.sin(y*.5+x*.35)*.40-Math.sin(x*.6)*.12)*w];
 };
 for(let i=0;i<count;i+=stride){
  const meta=cell.meta[i],body=meta!==1;
  if(!body&&!ids.has(cell.branchIds[i]))continue;
  const k=body?1.18:1.1;
  let x=cell.pos[i*3]*k,y=cell.pos[i*3+1]*k,z=cell.pos[i*3+2]*k;
  if(body){
   // Rounded asymmetric lobes merge toward the retained dendrite roots.
   // A full, wide body replaces the formerly elongated egg-like boundary.
   const radius=Math.hypot(x,y,z)||1,normal=[x/radius,y/radius,z/radius];
   const necks=rootDirections.reduce((sum,direction)=>sum+Math.pow(Math.max(0,direction.reduce((dot,v,j)=>dot+v*normal[j],0)),6),0)*.055;
   const lobes=1+Math.cos(Math.atan2(y,x)*3+.6)*.07+Math.sin(y*1.1+z*.8)*.035+necks;
   const taper=1-.10*Math.max(-1,Math.min(1,y/1.35));
   if(meta===2){x*=.88;y*=1.0;z*=.9;}
   else{x*=.91*taper*lobes;y*=.98*lobes;z*=.92*lobes;}
  }else y*=1.12;
  const p=neuronRotation(organic([x,y,z])),length=Math.hypot(...p)||1;
  append(p,p.map(v=>v/length),meta===2?1:0,i);
 }
 const add=(a,b)=>a.map((v,i)=>v+b[i]),scale=(a,n)=>a.map(v=>v*n);
 const unit=a=>scale(a,1/(Math.hypot(...a)||1));
 const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
 const a=[.04,-.85,.02],b=[-2.2,-2.25,-.9],c=[2.5,-4.3,1.15],d=[.8,-6.2,-.35];
 // One thin axon starts inside the soma, curves through depth, and tapers
 // continuously. Its particle budget is the same as the former axon.
 for(let i=0,n=small?750:1800;i<n;i++){
  const t=(i+.5)/n,u=1-t,angle=i*2.39996;
  const center=a.map((v,j)=>u*u*u*v+3*u*u*t*b[j]+3*u*t*t*c[j]+t*t*t*d[j]);
  const tangent=unit(a.map((v,j)=>3*u*u*(b[j]-v)+6*u*t*(c[j]-b[j])+3*t*t*(d[j]-c[j])));
  const normalA=unit(cross(tangent,Math.abs(tangent[1])>.9?[1,0,0]:[0,1,0])),normalB=cross(tangent,normalA);
  const normal=normalA.map((v,j)=>v*Math.cos(angle)+normalB[j]*Math.sin(angle));
  const radius=(.035+.14*Math.pow(1-t,1.3))*(.94+.06*Math.sin(t*19));
  append(neuronRotation(organic(add(center,scale(normal,radius)))),neuronRotation(normal),0,-1);
 }
 return {positions:new Float32Array(positions),normals:new Float32Array(normals),tones:new Float32Array(tones),sourceIndices:new Int32Array(sourceIndices),fromLegacy:true,selectedArborIds:new Int16Array(selected)};
}
