/* Original adult display proportions, in nominal metres. Reference dimensions:
 * https://www.nasa.gov/reference/appendix-e-vol-2/
 * These are coherent artistic targets, not a fitted person or population mean.
 * One continuous map keeps surface, organs, vessels and animation curves aligned.
 */
const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
const bell=(x,c,w)=>Math.exp(-(((x-c)/w)**2));

function profile(x,knots,values) {
  let i=0;while(i<knots.length-2&&x>knots[i+1])i++;
  const h=knots[i+1]-knots[i],t=Math.max(0,Math.min(1,(x-knots[i])/h));
  // Harmonic secant slopes keep a monotone landmark map monotone.
  const sec=j=>(values[j+1]-values[j])/(knots[j+1]-knots[j]);
  const slope=j=>j===0?sec(0):j===knots.length-1?sec(j-1):sec(j-1)*sec(j)<=0?0:2/(1/sec(j-1)+1/sec(j));
  return (2*t*t*t-3*t*t+1)*values[i]+(t*t*t-2*t*t+t)*h*slope(i)+(-2*t*t*t+3*t*t)*values[i+1]+(t*t*t-t*t)*h*slope(i+1);
}

const bodyY=[0,.085,.155,.519,.775,.89,1.055,1.25,1.354,1.425,1.55,1.758,1.82];
const adultY=[0,.085,.195,.490,.810,.920,1.080,1.310,1.430,1.475,1.550,1.770,1.832];
const armY=[.65,.74,.83,.913,1.116,1.25,1.354,1.45];
const adultArmY=[.600,.685,.778,.865,1.125,1.300,1.430,1.485];
const armInset=[.075,.075,.070,.066,.039,.022,.012,0];

export const anatomyHeight=y=>profile(y,bodyY,adultY);

export function anatomyPoint([x,y,z]) {
  const ax=Math.abs(x),sign=Math.sign(x);
  const arm=smooth(.160,.240,ax)*(1-smooth(1.39,1.46,y));
  let px=x,py=anatomyHeight(y),pz=z;
  // Relaxed slight abduction: retain a visible gap, bring wrists toward thighs.
  px-=sign*profile(y,armY,armInset)*arm;
  py+=(profile(y,armY,adultArmY)-py)*arm;
  py+=.016*bell(y,1.417,.055)*bell(ax,.075,.070)*(1-arm);
  const torso=(1-arm)*(1-smooth(1.43,1.53,y));
  const width=1+.065*bell(y,1.055,.12)+.035*bell(y,.88,.10)-.035*bell(y,1.36,.11);
  px*=1+(width-1)*torso;
  // Calf volume comes from the source mesh; retain its fuller gastrocnemius.
  const foot=1-smooth(.085,.17,y);
  pz=.01+(pz-.01)*(1+.09*foot);
  // Broad, rounded cranial vault; the brain and cranial vessels share this map.
  const cranial=smooth(1.58,1.65,y);
  px*=1+.025*cranial;pz=-.005+(pz+.005)*(1+.025*cranial);
  return [px,py,pz];
}

export function anatomyScale(position,scale) {
  return scale.map((radius,axis)=>{
    const low=[...position],high=[...position];low[axis]-=radius;high[axis]+=radius;
    return Math.abs(anatomyPoint(high)[axis]-anatomyPoint(low)[axis])/2;
  });
}
