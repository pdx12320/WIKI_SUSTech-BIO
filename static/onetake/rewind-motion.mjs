// Accelerate through most of the reverse journey, then brake near CGC.
// The short landing has continuous velocity and zero exit acceleration.
export function breathingRewind(progress){
 const t=Math.max(0,Math.min(1,progress)),brake=.88;
 if(t<=brake)return t*t/brake;
 const u=(t-brake)/(1-brake);
 return brake+(1-brake)*(2*u-2*u*u*u+u*u*u*u);
}
