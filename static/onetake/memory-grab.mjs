// Pick the nearest painted memory, using its rendered rotation and shear.
export function containsMemory(r,x,y){
  const dx=x-r.x,dy=y-r.y,c=Math.cos(r.roll),s=Math.sin(r.roll);
  const localY=(-dx*s+dy*c)/r.squash;
  const localX=(dx*c+dy*s-r.tilt*localY)/(r.stretch??1);
  return Math.abs(localX)<r.width/2&&Math.abs(localY)<r.height/2;
}
export function createMemoryGrab(){
  let active=null;
  return {
    get active(){return active;},
    begin(records,x,y,id,camera){
      if(active)return false;
      const r=[...records].reverse().find(r=>!r.item.fling&&r.alpha>.25&&r.width>28&&containsMemory(r,x,y));
      if(!r)return false;
      active={...r,id,offsetX:r.x-x,offsetY:r.y-y,camera};return true;
    },
    move(x,y,id){if(active&&active.id===id){active.x=x+active.offsetX;active.y=y+active.offsetY;}},
    release(id){if(!active||id!==active.id)return null;const result=active;active=null;return result;},
    cancel(){const result=active;active=null;return result;},
  };
}
