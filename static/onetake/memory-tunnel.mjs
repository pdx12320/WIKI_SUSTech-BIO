import {memoryScreenBounds,selectSpacedMemories} from './memory-spacing.mjs';
import {normalizeMemoryTuning} from './memory-tuning.mjs';
import {memoryPresence,memoryMaxWidth,memoryEdgePresence} from './memory-clear-center.mjs';
import {paintMosaicWalls,paintSignalBreak} from './memory-atmosphere.mjs';
import {createPixelVolume,paintPixelVolume} from './memory-pixel-volume.mjs';
import {memoryTumble} from './memory-tumble.mjs';
import {createMemoryGrab} from './memory-grab.mjs';
import {dodgePosition,crossedMemory} from './memory-dodge.mjs';
// Peripheral memory flow around a quiet title, with faint four-sided mosaics.
const wrap=(v,n)=>(v%n+n)%n;
const hash=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};
export const TUNNEL_OBJECT_TYPES=['window','clock','letter','tape','glasses','cane','wheelchair','frame','pillbox','radio','keys','telephone'];
export const TUNNEL_DEPTH=6200;
// Heavy silhouettes hang back; small memories cut through and overtake them.
const TYPE_SPEED=[.68,.84,.9,1.2,1.65,1.08,.58,.72,1.24,.76,1.58,.64];
// Keep handwritten cards occasional: two peripheral instances in the full pool.
export function memoryType(index){
  const type=TUNNEL_OBJECT_TYPES[index%TUNNEL_OBJECT_TYPES.length];
  return type==='letter'&&index%48!==14?['frame','radio','telephone'][Math.floor(index/12)%3]:type;
}
export const memorySize=index=>memoryType(index)==='letter'?.6:1;
export const memorySpeed=index=>TYPE_SPEED[TUNNEL_OBJECT_TYPES.indexOf(memoryType(index))]*(.86+hash(index+83)*.28);
export function projectMemoryPass(index,travel,width,height,cameraX=0,cameraY=0){
  const z=120+wrap(index*211.7-travel*memorySpeed(index),TUNNEL_DEPTH);
  const incoming=memoryType(index)!=='letter'&&index%8===2;
  const phase=1-(z-120)/TUNNEL_DEPTH,airborne=memoryType(index)!=='letter'&&index%6===4;
  // Selected small objects sweep into the axis, roll, then peel away.
  const arc=airborne?Math.exp(-Math.pow((phase-.73)/.12,4)):0;
  const angle=index*2.39996+phase*.34+(airborne?arc*1.3:0);
  const radius=(720+hash(index+51)*360)*(1-arc*.91);
  const focal=Math.min(width,height)*1.05;
  const target=dodgePosition(index,cameraX,cameraY);
  const vertical=Math.max(.72,height/width*.85);
  const tumble=airborne||incoming?{
    roll:airborne?phase*phase*Math.PI*4:Math.sin(phase*4+index)*.18,
    tilt:airborne?Math.sin(phase*Math.PI*4)*.65:Math.sin(index)*.14,
    stretch:1,squash:1,
  }:memoryTumble(index,phase);
  return {z,speed:memorySpeed(index),incoming,contact:target.contact,airborne,arc,...tumble,
    scale:focal/z,x:(incoming?target.x:Math.cos(angle)*radius-cameraX*550)*focal/z,y:(incoming?target.y:Math.sin(angle)*radius*vertical-cameraY*360)*focal/z};
}
export function createMemoryTunnel(room){
  room.classList.add('memory-room--tunnel');
  const canvas=document.createElement('canvas');canvas.className='memory-tunnel';
  canvas.setAttribute('aria-hidden','true');room.prepend(canvas);
  const ctx=canvas.getContext('2d'),sources=new Map(),volumes=new Map();
  let last=performance.now(),travel=0,w=0,h=0,navBottom=112,impact=0,closePass=0;
  const grab=createMemoryGrab();let records=[],enabled=false,canMove=false,previousTravel=0;
  let tuning={count:36,speed:1};
  const items=Array.from({length:144},(_,index)=>({index,energy:0,hitX:0,hitY:0,previousZ:0,travelOffset:0,fling:null}));
  const finish=id=>{
    const held=id===undefined?grab.cancel():grab.release(id);if(!held)return;
    held.item.fling={...held,age:0};held.item.energy=1;
    room.dataset.tunnelDrag='released';
    try{room.releasePointerCapture(held.id);}catch{}
  };
  addEventListener('pointerdown',e=>{
    if(!enabled||!canMove||e.button!==0||e.target?.closest?.('a,button,input,textarea,select,summary,[role="button"],[data-memory-controls]'))return;
    const camera=(room.dataset.tunnelCamera||'0,0').split(',').map(Number);
    if(grab.begin(records,e.clientX,e.clientY,e.pointerId,camera)){
      e.preventDefault();room.dataset.tunnelDrag='held';
      try{room.setPointerCapture(e.pointerId);}catch{}
    }
  },{capture:true,passive:false});
  addEventListener('pointermove',e=>{grab.move(e.clientX,e.clientY,e.pointerId);},{passive:true});
  addEventListener('pointerup',e=>finish(e.pointerId),{passive:true});
  addEventListener('pointercancel',e=>finish(e.pointerId),{passive:true});
  room.addEventListener('lostpointercapture',e=>finish(e.pointerId));
  addEventListener('blur',()=>finish());
  return {setTuning(value){
    tuning=normalizeMemoryTuning({...tuning,...value});
    room.dataset.tunnelCount=String(tuning.count);room.dataset.tunnelSpeed=String(tuning.speed);
  },cancel(){finish();enabled=false;records=[];},register(name,source){if(TUNNEL_OBJECT_TYPES.includes(name)){sources.set(name,source);volumes.set(name,createPixelVolume(source));}},update(exit,px,py,pointerX,pointerY,pointerOn,reduced){
    const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;
    if(w!==innerWidth||h!==innerHeight){
      w=innerWidth;h=innerHeight;
      canvas.width=Math.ceil(w);canvas.height=Math.ceil(h);
      navBottom=document.querySelector?.('.whale-navigation')?.getBoundingClientRect?.()?.height??Math.min(112,h*.16);
    }
    // Stop the loop entirely when the opening has handed off to the maze.
    enabled=exit<1;canMove=!reduced;
    if(exit>=1){finish();records=[];return;}
    if(reduced)finish();
    if(!reduced)travel+=dt*(2300+exit*2500)*tuning.speed;
    const travelled=travel-previousTravel;previousTravel=travel;
    if(grab.active)grab.active.item.travelOffset-=travelled;
    room.dataset.tunnelTravel=travel.toFixed(1);
    room.dataset.tunnelSources=String(sources.size);
    const ratio=canvas.width/w;ctx.setTransform(ratio,0,0,ratio,0,0);
    ctx.clearRect(0,0,w,h);ctx.imageSmoothingEnabled=false;
    if(grab.active){[px,py]=grab.active.camera;}
    // Lateral camera drift adds parallax without rolling the title layer.
    const drift=reduced?0:travel*.00012;
    const cx=w*.5-px*35+Math.sin(drift)*w*.016,cy=h*.47-py*24+Math.sin(drift*.73)*h*.018;
    const focal=Math.min(w,h)*1.05;
    const steerX=reduced?0:px,steerY=reduced?0:py;
    const point=(x,y,z)=>[cx+(x-steerX*550)*focal/z,cy+(y-steerY*360)*focal/z];
    room.dataset.tunnelCamera=`${steerX.toFixed(2)},${steerY.toFixed(2)}`;
    impact*=Math.exp(-dt*9);closePass*=Math.exp(-dt*6);
    paintMosaicWalls(ctx,point,travel,w,h);
    // Fine radial filaments fade softly into the surrounding mosaic.
    ctx.globalCompositeOperation='screen';
    for(let i=0;i<320;i++){
      const z=80+wrap(i*21-travel*1.35,TUNNEL_DEPTH+500),angle=i*2.39996+z*.00009;
      const radius=620+hash(i+2)*1000,length=400+hash(i+19)*1050;
      const p1=point(Math.cos(angle)*radius,Math.sin(angle)*radius*.72,z);
      const p2=point(Math.cos(angle+.018)*radius,Math.sin(angle+.018)*radius*.72,z+length);
      const color=i%7===0?'#adc4dd':'#b5a0db';
      const gradient=ctx.createLinearGradient(...p2,...p1);
      if(gradient?.addColorStop){gradient.addColorStop(0,color+'00');gradient.addColorStop(.65,color+'a0');gradient.addColorStop(1,color+'d0');}
      ctx.strokeStyle=gradient||color;
      const light=Math.min(.72,.24+360/z),core=z<750?1.1:.65;
      ctx.beginPath();ctx.moveTo(...p1);ctx.lineTo(...p2);
      ctx.globalAlpha=light*.1;ctx.lineWidth=core+4;ctx.stroke();
      ctx.globalAlpha=light*.2;ctx.lineWidth=core+1.5;ctx.stroke();
      ctx.globalAlpha=light;ctx.lineWidth=core;ctx.stroke();
      if(i%4===0){ctx.globalAlpha*=.6;ctx.fillStyle='#b49ade';ctx.fillRect(p1[0]+4,p1[1],z<600?4:2,2);}
    }
    ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
    const visible=items.filter(item=>item.index<tuning.count||item===grab.active?.item||item.fling).map(item=>({...projectMemoryPass(item.index,travel+item.travelOffset,w,h,steerX,steerY),item})).sort((a,b)=>b.z-a.z);
    const candidates=[];
    for(const pass of visible){
      const source=sources.get(memoryType(pass.item.index));if(!source||pass.item.fling||grab.active?.item===pass.item)continue;
      const width=memorySize(pass.item.index)*Math.min(memoryMaxWidth(w,h,source.width/source.height),(pass.incoming?270:pass.airborne?150:260+hash(pass.item.index+5)*130)*pass.scale),height=width*source.height/source.width;
      const x=cx+pass.x,y=cy+pass.y;
      if(memoryPresence(x,y,width,height,w,h)*memoryEdgePresence(x,y,width,height,w,h,navBottom)<.2)continue;
      if(x+width<0||x-width>w||y+height<0||y-height>h)continue;
      const roll=pass.incoming?Math.sin(pass.z*.002+pass.item.index)*.24:pass.roll;
      candidates.push({index:pass.item.index,z:pass.z,...memoryScreenBounds(x,y,width,height,roll,pass.stretch,pass.tilt,pass.squash)});
    }
    const spaced=selectSpacedMemories(candidates);
    records=[];
    for(const pass of visible){
      const {item,z,scale}=pass;
      item.energy*=Math.exp(-dt*2.8);
      const encounter=!reduced&&!item.fling&&grab.active?.item!==item&&pass.incoming&&crossedMemory(item.previousZ,z);
      item.previousZ=z;
      const source=sources.get(memoryType(item.index));if(!source)continue;
      const size=memorySize(item.index),maxWidth=size*memoryMaxWidth(w,h,source.width/source.height);
      let width=Math.min(maxWidth,(pass.incoming?270:pass.airborne?150:260+hash(item.index+5)*130)*scale*size),height=width*source.height/source.width;
      let x=cx+pass.x,y=cy+pass.y;
      let roll=pass.incoming?Math.sin(z*.002+item.index)*.24:pass.roll,tilt=pass.tilt,stretch=pass.stretch,squash=pass.squash;
      const held=grab.active?.item===item?grab.active:null;
      if(held){({x,y,width,height,roll,tilt,stretch,squash}=held);item.energy=1;room.dataset.tunnelDragged=`${memoryType(item.index)}:${x.toFixed(0)},${y.toFixed(0)}`;}
      if(item.fling){
        const f=item.fling;f.age+=dt;
        if(f.age>.5){
          item.fling=null;item.travelOffset=(item.index*211.7-5900)/memorySpeed(item.index)-travel;
          item.previousZ=6020;continue;
        }
        const t=f.age,growth=1+t*1.6;
        width=Math.min(maxWidth,f.width*growth);height=width*source.height/source.width;
        x=f.x+(f.x-cx+(item.index%2?120:-120))*t*5;
        y=f.y+(f.y-cy-100)*t*5;roll=f.roll+t*(item.index%2?1:-1);tilt=f.tilt;stretch=f.stretch;squash=f.squash;
      }
      const presence=held?1:memoryPresence(x,y,width,height,w,h)*memoryEdgePresence(x,y,width,height,w,h,navBottom);
      if(encounter){
        room.dataset.tunnelEncounter=presence<.4||pass.contact?'quiet-pass':'dodged';
        if(presence>=.4&&!pass.contact)closePass=1;
      }
      const spacingTarget=held||item.fling||spaced.has(item.index)?1:0;
      if(item.spacing===undefined)item.spacing=spacingTarget;
      item.spacing+=(spacingTarget-item.spacing)*(1-Math.exp(-dt*(spacingTarget?7:16)));
      const alpha=(held||item.fling?1:item.spacing)*(item.fling?Math.max(0,1-item.fling.age/.5):held?held.alpha:Math.min(1,(TUNNEL_DEPTH+120-z)/850)*Math.min(1,z/140))*presence;
      if(alpha<.015||x+width<0||x-width>w||y+height<0||y-height>h)continue;
      const hit=!reduced&&alpha>.2&&pointerOn&&Math.abs(pointerX-x)<width*.5&&Math.abs(pointerY-y)<height*.5;
      if(hit)item.energy=1;
      ctx.save();ctx.translate(x,y);ctx.rotate(roll);
      records.push({item,x,y,width,height,roll,tilt,stretch,squash,alpha});
      ctx.globalAlpha=alpha*.9;
      paintPixelVolume(ctx,volumes.get(memoryType(item.index)),width,height,stretch,tilt,squash);
      ctx.transform(stretch,0,tilt,squash,0,0);
      if(memoryType(item.index)==='window'||memoryType(item.index)==='letter'){
        ctx.fillStyle='#aa9cb9';ctx.fillRect(-width*.5-4,-height*.5-4,width+8,height+13);
      }
      ctx.filter=`brightness(${.76+.24*Math.abs(stretch*squash)})`;
      ctx.drawImage(source,-width*.5,-height*.5,width,height);
      ctx.filter='none';
      // Existing cursor-local residue becomes attached to the passing image.
      if(hit){item.hitX=Math.max(0,Math.min(.8,(pointerX-x)/width+.4));item.hitY=Math.max(0,Math.min(.8,(pointerY-y)/height+.4));}
      if(item.energy>.04){
        for(let i=0;i<4;i++){
          const sy=Math.floor(source.height*(item.hitY+i*.045))%source.height;
          const sx=Math.floor(source.width*item.hitX),sw=Math.min(28,source.width-sx),sh=2;
          ctx.globalAlpha=item.energy*.8*alpha;ctx.filter=i%2?'hue-rotate(120deg) saturate(3)':'hue-rotate(280deg) saturate(3)';
          const dx=(sx/source.width-.5)*width+(i%2?1:-1)*width*.07;
          ctx.drawImage(source,sx,sy,sw,sh,dx,(sy/source.height-.5)*height,sw/source.width*width,Math.max(2,sh/source.height*height));
        }
      }
      ctx.restore();
    }
    ctx.globalAlpha=1;ctx.filter='none';
    paintSignalBreak(ctx,canvas,w,h,now,reduced);
    // A missed dodge briefly fractures the signal; it never blocks navigation.
    if(impact>.03){
      for(let i=0;i<12;i++){
        ctx.globalAlpha=impact*(.12+hash(i+31)*.25);
        ctx.fillStyle=i%3===0?'#a4dbed':'#c2a0e2';
        ctx.fillRect(hash(i+travel)*w,hash(i+8)*h,w*(.08+hash(i)*.3),3+hash(i+19)*17);
      }
    }
    if(closePass>.03){ctx.globalAlpha=closePass*.3;ctx.strokeStyle='#d9baff';ctx.lineWidth=3;ctx.strokeRect(3,3,w-6,h-6);}
    ctx.globalAlpha=1;
  }};
}
