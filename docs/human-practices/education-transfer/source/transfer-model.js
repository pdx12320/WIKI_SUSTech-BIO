(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.BioSphereModel=api;})(typeof globalThis==='object'?globalThis:this,function(){
 'use strict';
 function formatScore(score){const [lo,hi]=score.range;return lo===hi?String(lo):`${lo}–${hi}`}
 function compareRange(source,target){
  const [s0,s1]=source.range,[t0,t1]=target.range;
  if(t0>s1)return 'The target has a higher reported depth in this domain.';
  if(t1<s0)return 'The source has a higher reported depth in this domain.';
  if(s0===s1&&t0===t1)return 'The reported depth is the same; this does not establish equivalent content or assessment.';
  return 'The reported ranges overlap; the available evidence does not establish a clear difference in depth.';
 }
 function compare(kb,source,target){
  if(!Object.hasOwn(kb.profiles,source)||!Object.hasOwn(kb.profiles,target))throw new Error('Choose a supported curriculum configuration.');
  if(source===target)throw new Error('Choose a different target configuration.');
  return kb.domains.map(domain=>({domain,source:domain.profiles[source],target:domain.profiles[target],curriculumNote:compareRange(domain.profiles[source].curriculum,domain.profiles[target].curriculum),examinationNote:compareRange(domain.profiles[source].examination,domain.profiles[target].examination)}));
 }
 function outcomes(domain,tier='all',query=''){
  const q=query.trim().toLowerCase();return domain.outcomes.filter(o=>(tier==='all'||o.tier===tier)&&(!q||o.text.toLowerCase().includes(q)));
 }
 function readRoute(kb,search){
  const params=new URLSearchParams(search),source=params.get('source'),target=params.get('target');
  return source!==target&&Object.hasOwn(kb.profiles,source)&&Object.hasOwn(kb.profiles,target)?{source,target}:null;
 }
 function routeUrl(kb,page,source,target){
  compare(kb,source,target);
  if(!['map','report'].includes(page))throw new Error('Unknown page.');
  return `education-transfer-${page}.html?${new URLSearchParams({source,target})}`;
 }
 return {formatScore,compareRange,compare,outcomes,readRoute,routeUrl};
});
