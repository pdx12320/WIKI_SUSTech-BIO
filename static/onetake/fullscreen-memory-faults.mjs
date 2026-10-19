const hash=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};
export function fullscreenFaultPhase(elapsed){
  const phase=elapsed%4600;
  if(phase>=900&&phase<1250)return {active:true,t:(phase-900)/350};
  if(phase>=2700&&phase<2930)return {active:true,t:(phase-2700)/230};
  return {active:false,t:0};
}
export function createFullscreenMemoryFaults(){
  const layer=document.createElement('div'),canvas=document.createElement('canvas');
  layer.className='memory-fullscreen-faults';layer.setAttribute('aria-hidden','true');
  Object.assign(layer.style,{position:'fixed',inset:'0',zIndex:'2147483000',pointerEvents:'none',overflow:'hidden'});
  Object.assign(canvas.style,{position:'absolute',inset:'0',width:'100%',height:'100%',imageRendering:'pixelated',pointerEvents:'none'});
  const tears=Array.from({length:3},()=>{
    const tear=document.createElement('div');
    Object.assign(tear.style,{position:'absolute',pointerEvents:'none',backdropFilter:'hue-rotate(65deg) saturate(2.4) contrast(1.3)',borderTop:'1px solid #b2d7e680',borderBottom:'1px solid #db9bca70'});
    return tear;
  });
  layer.append(canvas,...tears);layer.hidden=true;document.body.append(layer);
  const ctx=canvas.getContext('2d'),epoch=performance.now();let last=-Infinity,w=0,h=0;
  return {update(exit,reduced){
    const now=performance.now(),phase=fullscreenFaultPhase(now-epoch);
    const active=exit<1&&!reduced&&phase.active;
    layer.hidden=!active;layer.dataset.state=active?'sweep':'clear';
    layer.style.opacity=String(Math.max(0,1-exit));
    if(!active)return;
    if(w!==innerWidth||h!==innerHeight){w=innerWidth;h=innerHeight;canvas.width=Math.ceil(w/3);canvas.height=Math.ceil(h/3);}
    if(now-last<40)return;last=now;
    const tick=Math.floor((now-epoch)/55),ratio=canvas.width/w;
    ctx.setTransform(ratio,0,0,canvas.height/h,0,0);ctx.clearRect(0,0,w,h);
    const sweep=phase.t*(h+100)-50;
    // One tear always crosses the navigation; the others sweep over the story.
    [30+phase.t*65,sweep,h*.46+(hash(tick)-.5)*70].forEach((y,i)=>{
      const x=(hash(tick+i*19)-.2)*w*.3,width=w*(.55+hash(tick+i+1)*.45);
      const height=i===0?6+hash(tick+1)*12:4+hash(tick+i)*20;
      Object.assign(tears[i].style,{left:`${x}px`,top:`${y}px`,width:`${width}px`,height:`${height}px`});
      ctx.globalAlpha=.18;ctx.fillStyle=i%2?'#b3a0db':'#9ccbd9';ctx.fillRect(x,y,width,height);
      for(let shard=0;shard<8;shard++){
        const seed=tick*61+i*17+shard*7,sx=x+hash(seed)*width;
        ctx.globalAlpha=.25+hash(seed+4)*.24;
        ctx.fillStyle=shard%3===0?'#172038':shard%2?'#bca1d5':'#91c2d2';
        ctx.fillRect(sx,y+(hash(seed+2)-.5)*15,8+hash(seed+8)*100,2+hash(seed+10)*13);
      }
    });
    ctx.globalAlpha=1;
  }};
}
