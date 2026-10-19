const hash=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};
const wrap=(v,n)=>(v%n+n)%n;
export function paintMosaicWalls(ctx,project,travel,w,h){
  const colors=['#77518f','#9b77b4','#5e557e','#7d6ca1','#61587b'];
  for(let layer=23;layer>=0;layer--){
    const z=160+wrap(layer*270-travel*.85,6480),far=z+245;
    const identity=layer+Math.floor(travel*.85/6480)*24;
    for(let face=0;face<4;face++)for(let cell=0;cell<8;cell++){
      const seed=identity*131+face*41+cell*17;
      if(hash(seed)<.47)continue;
      const horizontal=face>1,sign=face%2?1:-1,step=horizontal?240:165;
      const u=(cell-4)*step,gap=8+hash(seed+3)*26;
      const vertex=(v,depth)=>horizontal?project(v,sign*660,depth):project(sign*960,v,depth);
      const corners=[vertex(u+gap,z),vertex(u+step-gap,z),vertex(u+step-gap,far),vertex(u+gap,far)];
      if(corners.every(([x])=>x<0)||corners.every(([x])=>x>w)||corners.every(([,y])=>y<0)||corners.every(([,y])=>y>h))continue;
      ctx.globalAlpha=Math.min(.13,.035+75/z)*(.55+hash(seed+19)*.45);
      ctx.fillStyle=colors[Math.floor(hash(seed+11)*colors.length)];
      ctx.beginPath();corners.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill();
    }
  }
  ctx.globalAlpha=1;
}
export function paintSignalBreak(ctx,canvas,w,h,now,reduced){
  if(reduced)return;
  const phase=now%5200;
  if(!(phase<300||(phase>1600&&phase<1800)||(phase>3500&&phase<3720)))return;
  const tick=Math.floor(now/90),rx=canvas.width/w,ry=canvas.height/h;
  // Short local dislocations retain the scene luminance and leave readable gaps.
  for(let i=0;i<7;i++){
    const seed=tick*31+i*83,x=hash(seed)*w*.8,y=hash(seed+4)*h;
    const width=w*(.12+hash(seed+7)*.25),height=3+hash(seed+9)*h*.025;
    const jump=(hash(seed+11)-.5)*64;
    ctx.globalAlpha=.78;
    ctx.drawImage(canvas,x*rx,y*ry,width*rx,height*ry,x+jump,y,width,height);
    ctx.globalAlpha=.24;ctx.fillStyle=i%2?'#d89cc9':'#89bfd0';
    ctx.fillRect(x+jump,y+height,width,1.5);
  }
  for(let i=0;i<10;i++){
    const seed=tick*59+i*17;ctx.globalAlpha=.13+hash(seed+5)*.12;
    ctx.fillStyle=i%3===0?'#9fc6d5':i%2?'#b494c5':'#180d2a';
    ctx.fillRect(Math.floor(hash(seed)*w/12)*12,Math.floor(hash(seed+9)*h/10)*10,12+hash(seed+4)*55,6+hash(seed+8)*24);
  }
  ctx.globalAlpha=1;
}
