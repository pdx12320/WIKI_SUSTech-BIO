// Quiet space around the title, including a margin for each object's silhouette.
export function memoryPresence(x,y,width,height,w,h){
  const radius=Math.hypot((x-w*.5)/(w*.29+width*.3),(y-h*.47)/(h*.23+height*.3));
  const t=Math.max(0,Math.min(1,(radius-.85)/.4));
  return t*t*(3-2*t);
}
export function memoryMaxWidth(w,h,aspect){return Math.min(w*.29,h*.34*aspect);}
export function memoryEdgePresence(x,y,width,height,w,h,navBottom){
  const smooth=v=>{const t=Math.max(0,Math.min(1,v));return t*t*(3-2*t);};
  // Fade the whole tilted silhouette before it reaches the navigation seam.
  const radius=Math.hypot(width,height)*.5;
  const top=smooth((y-radius-navBottom+12)/64);
  const left=smooth((x+width*.25)/Math.max(32,width*.65));
  const right=smooth((w-x+width*.25)/Math.max(32,width*.65));
  const bottom=smooth((h-y+height*.25)/Math.max(32,height*.65));
  return top*left*right*bottom;
}
