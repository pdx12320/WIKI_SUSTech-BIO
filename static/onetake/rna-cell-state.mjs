// A conceptual scale transition, not a reconstruction of measured cell data.
const clamp=x=>Math.max(0,Math.min(1,x));
export const ease=x=>{x=clamp(x);return x*x*(3-2*x);};
export const INTRO_FADE=.33,INTRO_END=.37;
export function cellLayout(aspect=1.6){
 const phone=aspect<1;
 return phone?{astro:[-.8,2.7,.65],neuron:[.8,-3,-.9],rna:[-.95,2.6,.77],protein:[-.4,2.95,.77],focus:[0,.8,.5],scale:.68,rnaScale:.105,camera:[.35,.3,19.5]}:
  {astro:[-4.3,.15,.8],neuron:[4.6,-.1,-1.1],rna:[-4.55,-.2,.98],protein:[-3.75,.4,1.05],focus:[-.6,-1.25,.5],scale:1,rnaScale:.075,camera:[.6,.75,22.5]};
}
export function rnaCellState(take){
 const t=Number.isFinite(take)?take:-1;
 return {question:ease((t-.783)/.014)*(1-ease((t-.815)/.012)),opacity:ease((t-.325)/.05)*(1-ease((t-.737)/.015)),zoom:ease((t-.32)/.13),
  protein:ease((t-.435)/.028),transport:ease((t-.525)/.095),
  stage:t<.435?'inside':t<.525?'translation':t<.635?'transport':t<.655?'questions':'flight',
  backdrop:ease((t-.737)/.015)};
}
export function rnaInCell(take,aspect=1.6){
 const {zoom}=rnaCellState(take),layout=cellLayout(aspect);
 return {position:layout.rna.map(v=>v*zoom),scale:1+(layout.rnaScale-1)*zoom};
}
// Fixed path; only a small number of apoE-associated lipid particles travel.
export function lipidPath(u,aspect=1.6){
 const l=cellLayout(aspect),t=clamp(u),end=l.neuron.map((v,i)=>v+[-1.6*l.scale,.45*l.scale,.4][i]);
 return l.protein.map((v,i)=>v+(end[i]-v)*t+(i===2?Math.sin(t*Math.PI)*.7:0));
}
