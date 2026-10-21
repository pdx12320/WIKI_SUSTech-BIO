const ease=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
export const AUTO_DOCK_TIMING=Object.freeze({settle:.4,puf:1.4,gap:.25,apobec:1.4,hold:.35});
export const AUTO_DOCK_DURATION=Object.values(AUTO_DOCK_TIMING).reduce((a,b)=>a+b,0);
export function autoDockFrame(seconds){
 const t=Math.max(0,seconds),a=AUTO_DOCK_TIMING;
 const pufEnd=a.settle+a.puf,apobecStart=pufEnd+a.gap,apobecEnd=apobecStart+a.apobec;
 return {autoDock:true,edit:0,fix:0,stage:t<a.settle?'docking-start':t<apobecStart?'dock-puf':t<apobecEnd?'dock-apobec':'dock-complete',
  dock:{pod:ease((t-a.settle)/a.puf),cetus:ease((t-apobecStart)/a.apobec)}};
}
