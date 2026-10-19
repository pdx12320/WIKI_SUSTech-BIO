// Extruded alpha silhouettes preserve gaps in glasses, wheels and keys.
export function createPixelVolume(source){
  if(!source.getContext)return null;
  const side=document.createElement('canvas');side.width=source.width;side.height=source.height;
  const ctx=side.getContext('2d');ctx.drawImage(source,0,0);
  const pixels=ctx.getImageData(0,0,side.width,side.height);
  for(let i=0;i<pixels.data.length;i+=4){
    pixels.data[i]=Math.round((pixels.data[i]*.29+15)/24)*24;
    pixels.data[i+1]=Math.round((pixels.data[i+1]*.26+9)/24)*24;
    pixels.data[i+2]=Math.round((pixels.data[i+2]*.38+17)/24)*24;
  }
  ctx.putImageData(pixels,0,0);return side;
}
export function paintPixelVolume(ctx,side,width,height,stretch,tilt,squash,depth=.07){
  if(!side)return;
  const edgeX=Math.sqrt(Math.max(0,1-stretch*stretch)),edgeY=Math.sqrt(Math.max(0,1-squash*squash));
  // Offsets stay in camera space so thickness remains visible when edge-on.
  const dx=width*depth*(.35+edgeX)*(stretch<0?-1:1);
  const dy=height*depth*(.45+edgeY)*(squash<0?-1:1);
  for(let layer=4;layer>=1;layer--){
    ctx.save();ctx.transform(stretch,0,tilt,squash,dx*layer/4,dy*layer/4);
    ctx.drawImage(side,-width/2,-height/2,width,height);ctx.restore();
  }
}
