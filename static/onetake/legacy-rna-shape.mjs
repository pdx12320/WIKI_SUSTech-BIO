// Reuse the original home RNA cloud: a thin coiled backbone and radial stubs.
// X is spaced for the existing cover-letter typography; no bead caps or sugar
// rings are introduced. This remains a design schematic, not a resolved fold.
export function legacyRnaData(strand,{small=false}={}){
 if(!strand?.pos?.length||!strand.target)return null;
 const positions=[],roles=[],seeds=[],normals=[],sourceIndices=[];
 const step=1.1,stretch=step/.62,origin=strand.target,offsetY=origin.y+1.18;
 const half=small?3.3:7.05;
 for(let i=0;i<strand.meta.length;i++){
  const x=strand.pos[i*3]-origin.x;if(Math.abs(x)>half)continue;
  const y=strand.pos[i*3+1],z=strand.pos[i*3+2],r=Math.hypot(y,z)||1;
  positions.push(x*stretch,y-offsetY,z-origin.z);
  normals.push(0,y/r,z/r);roles.push(strand.meta[i]===2?6:strand.meta[i]===0?2:5);
  seeds.push(((Math.imul(i+112,1664525)+1013904223)>>>0)/4294967296);sourceIndices.push(i);
 }
 for(let i=0,n=small?180:300;i<n;i++){
  const t=i/n*4,k=Math.floor(t),u=t-k;
  positions.push(...(k===0?[-.52+u*1.04,.55,.03]:k===1?[.52,.55-u*1.1,.03]:k===2?[.52-u*1.04,-.55,.03]:[-.52,-.55+u*1.1,.03]));
  normals.push(0,0,1);roles.push(3);seeds.push(i/n);sourceIndices.push(-1);
 }
 const anchors=[0,.62,1.24].map(x=>{
  const a=(origin.x+22+x)/6.2*Math.PI*2;
  return [x*stretch,Math.cos(a)*.58+1.18-offsetY,Math.sin(a)*.58-origin.z];
 });
 // Keep the target's cover-C anchor exactly at the local origin.
 anchors[0]=[0,0,0];
 return {positions:new Float32Array(positions),ends:new Float32Array(positions),
  roles:new Float32Array(roles),seeds:new Float32Array(seeds),normals:new Float32Array(normals),
  sourceIndices:new Int32Array(sourceIndices),anchors,fromLegacy:true,
  editorTransform:{position:[0,offsetY,origin.z],scale:[1/stretch,1,1]}};
}
