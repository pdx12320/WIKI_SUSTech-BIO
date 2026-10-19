export function memoryScreenBounds(x,y,width,height,roll,stretch,tilt,squash){
  const c=Math.cos(roll),s=Math.sin(roll);
  return {x,y,halfWidth:Math.max(14,(Math.abs(c*stretch)*width+Math.abs(c*tilt-s*squash)*height)/2+width*.08),
    halfHeight:Math.max(14,(Math.abs(s*stretch)*width+Math.abs(s*tilt+c*squash)*height)/2+height*.08)};
}
export function selectSpacedMemories(candidates){
  const accepted=[],ids=new Set();
  for(const next of [...candidates].sort((a,b)=>a.z-b.z)){
    const crowded=accepted.some(front=>{
      const overlapX=Math.max(0,Math.min(next.x+next.halfWidth,front.x+front.halfWidth)-Math.max(next.x-next.halfWidth,front.x-front.halfWidth));
      const overlapY=Math.max(0,Math.min(next.y+next.halfHeight,front.y+front.halfHeight)-Math.max(next.y-next.halfHeight,front.y-front.halfHeight));
      const area=Math.min(4*next.halfWidth*next.halfHeight,4*front.halfWidth*front.halfHeight);
      return overlapX*overlapY/area>.22;
    });
    if(!crowded){accepted.push(next);ids.add(next.index);}
  }
  return ids;
}
