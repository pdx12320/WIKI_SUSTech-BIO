// Camera-space steering: the memory never chases the pointer after launch.
export function dodgePosition(index,cameraX=0,cameraY=0){
  const lane=(Math.floor(index/8)%3)-1;
  const x=lane*130-cameraX*550,y=(index%3-1)*90-cameraY*360;
  return {x,y,contact:Math.abs(x)<155&&Math.abs(y)<125};
}
export function crossedMemory(previousZ,z){
  // A wrap to far depth is a respawn, never an impact.
  return previousZ>300&&z<=300;
}
