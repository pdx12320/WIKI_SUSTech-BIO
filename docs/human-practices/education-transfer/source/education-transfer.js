/* UI for the retained B map. No remote model, uploads or student predictions. */
(()=>{
 'use strict';
 const $=id=>document.getElementById(id),KB=window.BIOSPHERE_KNOWLEDGE,M=window.BioSphereModel,map=window.BioSphereMap,copy=window.BioSphereCopy;
 const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let source=null,target=null,dragSource=null,activeDomain=null;
 const ids=['china','hongkong','ial','japan'];
 const tiers={essential:'Essential',recommended:'Recommended',advanced:'Advanced / Enrichment'};
 const status=text=>{$('interaction-status').textContent=text};
 const citation=(ref,label)=>`<a class="source-link" href="${escape(KB.sources[ref.document].file)}#page=${ref.page}" target="_blank" rel="noopener">${escape(label||`${KB.sources[ref.document].title} · p. ${ref.page}${ref.column?`, column ${ref.column}`:''}`)} ↗</a>`;
 const savedRoute=M.readRoute(KB,location.search);
 if(document.body.dataset.page==='report'){
  $('evidence-button').addEventListener('click',showEvidence);
  document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.close)$(b.dataset.close).close();if(b.hasAttribute('data-evidence'))showEvidence();if(b.dataset.domainFocus)renderDomain(b.dataset.domainFocus)});
  if(savedRoute){
   source=savedRoute.source;target=savedRoute.target;renderComparison();
   document.title=`${KB.profiles[source].short} to ${KB.profiles[target].short} · BioSphere Report`;
   $('back-to-map').href=M.routeUrl(KB,'map',source,target);
   $('swap-route').hidden=false;
   $('swap-route').addEventListener('click',()=>location.assign(M.routeUrl(KB,'report',target,source)));
   $('comparison-content').addEventListener('input',e=>{if(e.target.dataset.search)renderOutcomes(e.target.dataset.search)});
   $('comparison-content').addEventListener('change',e=>{if(e.target.dataset.tier)renderOutcomes(e.target.dataset.tier)});
  }else{
   $('comparison-title').textContent='Choose a route on the map.';
   $('comparison-content').innerHTML='<p class="empty-state">This report needs two different, supported curriculum configurations. <a href="education-transfer-map.html">Return to the map to choose a route →</a></p>';
  }
  return;
 }
 const loading=window.BioSphereLoading.create({
  document,window,
  onCancel:()=>status('Report preparation cancelled. Your route is retained on the map.')
 });
 window.addEventListener('pagehide',()=>loading.cancel());
 window.addEventListener('pageshow',()=>{if($('transfer-loading').open)loading.cancel()});
 $('system-list').innerHTML=ids.map(key=>{const p=KB.profiles[key];return `<article class="ec" data-r="${key}" style="--color:${p.color}"><button class="source-button" draggable="true" data-source="${key}" aria-pressed="false" aria-label="Select ${escape(p.name)} as source"><span class="ec-name">${escape(copy.names[key])}</span><span class="ec-location">${escape(key==='japan'?'Combined study configuration':p.location)}</span></button></article>`}).join('');
 $('target-choice').innerHTML+=[...ids].map(id=>`<option value="${id}">${escape(KB.profiles[id].short)}</option>`).join('');
 function sync(){
  document.querySelectorAll('[data-source]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.source===source));b.closest('.ec').classList.toggle('is-selected',b.dataset.source===source)});
  document.querySelectorAll('[data-target]').forEach(b=>{
   const key=b.dataset.target,p=KB.profiles[key];b.classList.toggle('is-source',key===source);b.classList.toggle('is-target',key===target);
   b.setAttribute('aria-label',key===source?`${p.name}, current source. Choose a different target.`:`Compare ${source?KB.profiles[source].short:'selected source'} to ${p.name}`);
  });
  [...$('target-choice').options].forEach(o=>{o.disabled=Boolean(source&&o.value===source)});
  $('target-choice').value=target||'';$('compare-button').disabled=!source||!$('target-choice').value;
  $('view-comparison').hidden=!target;$('clear-route').hidden=!source;
  if(target)$('view-comparison').href=M.routeUrl(KB,'report',source,target);
  $('route-label').textContent=source?`${KB.profiles[source].short} → ${target?KB.profiles[target].short:'Choose a target'}`:'Select a source to begin.';
  map?.route(source,target);
  history.replaceState(null,'',target?M.routeUrl(KB,'map',source,target):'education-transfer-map.html');
 }
 function resetResult(){target=null}
 function selectSource(key){
  if(!Object.hasOwn(KB.profiles,key))return;
  if(source!==key){source=key;resetResult()}
  sync();status(`${KB.profiles[key].short} selected. Choose a target.`);
 }
 function chooseTarget(key){
  if(!source){status('Choose a source card first, then a target on the map.');return}
  if(key===source){status('Source and target are the same. Choose a different configuration.');return}
  if(!Object.hasOwn(KB.profiles,key)){status('Choose one of the four supported target configurations.');return}
  if(loading.active)return;
  target=key;sync();status(`Preparing report: ${KB.profiles[source].short} to ${KB.profiles[target].short}.`);
  const href=M.routeUrl(KB,'report',source,target);
  loading.start({source:KB.profiles[source].short,target:KB.profiles[target].short,onComplete:()=>location.assign(href)});
 }
 function renderComparison(){
  const route=M.compare(KB,source,target);
  $('comparison-title').textContent=`${KB.profiles[source].short} → ${KB.profiles[target].short}`;
  const differs=r=>['curriculum','examination'].some(k=>r.source[k].range.join()!==r.target[k].range.join());
  const count=route.filter(differs).length;
  const brief=count?`${count} of six domains have different reported score ranges. Select an area to see the context.`:'The reported score ranges match across all six domains. Select an area to compare the underlying content.';
  $('comparison-content').innerHTML=`<p class="report-brief">${escape(brief)}</p><p class="report-caveat">Preliminary team analysis · Scores describe curriculum depth, not student ability or transfer success.</p><div class="overview-table"><table><caption class="sr-only">Curriculum and examination depth across six domains. Select an area for context.</caption><thead><tr><th rowspan="2" scope="col">Area</th><th colspan="2" scope="colgroup">${escape(KB.profiles[source].short)} <span class="table-role">Source</span></th><th colspan="2" scope="colgroup">${escape(KB.profiles[target].short)} <span class="table-role">Target</span></th></tr><tr><th scope="col">Curriculum</th><th scope="col">Exam</th><th scope="col">Curriculum</th><th scope="col">Exam</th></tr></thead><tbody>${route.map(r=>`<tr class="domain-row" id="row-${r.domain.id}"><th scope="row"><button id="focus-${r.domain.id}" class="domain-choice" data-domain-focus="${r.domain.id}" aria-pressed="false" aria-controls="domain-focus">${escape(copy.domains[r.domain.id].name)} <span aria-hidden="true">↘</span></button></th><td>${M.formatScore(r.source.curriculum)}</td><td>${M.formatScore(r.source.examination)}</td><td>${M.formatScore(r.target.curriculum)}</td><td>${M.formatScore(r.target.examination)}</td></tr>`).join('')}</tbody></table></div><p class="score-key">0 Absent · 1 Essential · 2 Recommended · 3 Advanced / Enrichment. Ranges retain uncertainty and elective conditions.</p><section id="domain-focus" class="domain-focus" aria-labelledby="domain-focus-title"></section>`;
  renderDomain((route.find(differs)||route[0]).domain.id);
 }
 function renderDomain(id){
  const d=KB.domains.find(d=>d.id===id);if(!d)return;
  activeDomain=id;
  KB.domains.forEach(domain=>{$(`focus-${domain.id}`).setAttribute('aria-pressed',String(domain.id===id));$(`row-${domain.id}`).dataset.selected=String(domain.id===id)});
  const s=d.profiles[source],t=d.profiles[target],c=copy.domains[id];
  const same=type=>s[type].range.join()===t[type].range.join();
  const comparison=same('curriculum')&&same('examination')?'Matching score ranges do not establish equivalent content or assessment.':`${M.compareRange(s.curriculum,t.curriculum)} ${M.compareRange(s.examination,t.examination).replace('The ','For examinations, the ')}`;
  $('domain-focus').innerHTML=`<h2 id="domain-focus-title">${escape(c.name)}</h2><p class="domain-meaning">${escape(c.meaning)}</p><p class="domain-difference">${escape(comparison)}</p><div class="context-pair"><article><h3>${escape(KB.profiles[source].short)} <span>Source</span></h3><p>${escape(c[source])}</p></article><article><h3>${escape(KB.profiles[target].short)} <span>Target</span></h3><p>${escape(c[target])}</p></article></div><details class="support-notes"><summary>Read the original analysis</summary><div class="context-pair">${[source,target].map(key=>{const r=d.profiles[key];return `<article><h3>${escape(KB.profiles[key].short)}</h3><p>${escape(r.summary)}</p><p><b>Evidence:</b> ${escape(r.evidence)}</p><p><b>Team interpretation:</b> ${escape(r.comment)}</p><p>Reported curriculum score: ${escape(r.curriculum.reported)}. Examination score: ${escape(r.examination.reported)}.</p>${citation(r.source)}</article>`}).join('')}</div></details><details class="learning-reference"><summary>Explore learning goals <span>${d.outcomes.length} reference outcomes</span></summary><p class="learn-intro">A reference for further learning; individual coverage in either curriculum has not been verified.</p><div class="learning-tools"><label for="tier-${id}">Level<select id="tier-${id}" data-tier="${id}"><option value="all">All levels</option>${Object.entries(tiers).map(([key,label])=>`<option value="${key}">${label}</option>`).join('')}</select></label><label for="search-${id}">Find a concept<input id="search-${id}" data-search="${id}" type="search" placeholder="Search learning goals"></label></div><p class="outcome-count" id="count-${id}" role="status"></p><ul class="outcomes" id="outcomes-${id}"></ul>${citation({document:'framework',page:Number(id.slice(1))+6})}</details>`;
  renderOutcomes(id);
 }
 function renderOutcomes(id){const d=KB.domains.find(d=>d.id===id);if(id!==activeDomain)return;const list=M.outcomes(d,$(`tier-${id}`).value,$(`search-${id}`).value);$(`count-${id}`).textContent=`${list.length} reference outcomes`;$(`outcomes-${id}`).innerHTML=list.length?list.map(o=>`<li><span class="outcome-meta">${tiers[o.tier]}</span>${escape(o.text)}</li>`).join(''):'<li>No matching learning goals. Try another term or level.</li>'}
 function showEvidence(){
  $('evidence-content').innerHTML=`<p>Four curriculum configurations, compared by SUSTech-BIO, CUHK-HongKong-SBS and HG-Tokyo.</p><h3>Source documents</h3>${Object.values(KB.sources).map(s=>`<div class="source-entry"><a href="${escape(s.file)}#page=1" target="_blank" rel="noopener">${escape(s.title)} ↗</a><p>${escape(s.description)}</p></div>`).join('')}<h3>Reading the scores</h3><p>Curriculum scores describe what students are expected to learn. Examination scores describe what the reviewed assessments test. Both use the provisional framework’s 0–3 scale. Ranges and elective conditions are retained.</p><details class="method-detail"><summary>Scope and limitations</summary><ul>${KB.limitations.map(t=>`<li>${escape(t)}</li>`).join('')}</ul>${ids.map(key=>`<p><b>${escape(copy.names[key])}:</b> ${escape(KB.profiles[key].scope)}</p>`).join('')}<p>Locations identify study contexts. HKDSE and iAL are distinct Hong Kong configurations; Japan + AP remains one combined configuration.</p></details><details class="method-detail"><summary>Download data</summary><p>Download the structured evidence library, including source references and limitations.</p><a href="education-transfer-knowledge.json" download>Download evidence data (JSON) ↓</a></details>`;
  $('evidence-dialog').showModal();
 }
 document.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.source)selectSource(b.dataset.source);
  if(b.dataset.target)chooseTarget(b.dataset.target);
  if(b.dataset.close)$(b.dataset.close).close();
  if(b.hasAttribute('data-evidence'))showEvidence();
 });
 $('evidence-button').addEventListener('click',showEvidence);
 $('target-choice').addEventListener('change',()=>{$('compare-button').disabled=!source||!$('target-choice').value});
 $('compare-button').addEventListener('click',()=>chooseTarget($('target-choice').value));
 $('clear-route').addEventListener('click',()=>{source=null;resetResult();sync();status('Route cleared. Choose a source configuration.')});
 $('zoom-in').addEventListener('click',()=>map.zoom(1.2));$('zoom-out').addEventListener('click',()=>map.zoom(1/1.2));$('reset-view').addEventListener('click',()=>map.reset());
 const canvas=$('globe-c'),drop=$('drop-ind');
 function cleanupDrag(){dragSource=null;document.body.classList.remove('is-dragging');document.querySelectorAll('.ec').forEach(c=>c.classList.remove('dragging'));drop.style.display='none';map?.highlight(null)}
 document.querySelectorAll('[data-source]').forEach(b=>{
  b.addEventListener('dragstart',e=>{selectSource(b.dataset.source);dragSource=b.dataset.source;b.closest('.ec').classList.add('dragging');document.body.classList.add('is-dragging');e.dataTransfer.effectAllowed='copy';e.dataTransfer.setData('text/plain',dragSource);status(`Dragging ${KB.profiles[source].short}. Drop on a different map region or label.`)});
  b.addEventListener('dragend',cleanupDrag);
 });
 function keyAt(e){const r=canvas.getBoundingClientRect();return map?.hit(e.clientX-r.left,e.clientY-r.top)}
 function over(e,key){if(!dragSource)return;e.preventDefault();const valid=key&&key!==dragSource;e.dataTransfer.dropEffect=valid?'copy':'none';map?.highlight(valid?key:null);drop.style.display='block';drop.textContent=valid?`Release to compare ${KB.profiles[dragSource].short} → ${KB.profiles[key].short}`:key===dragSource?'Choose a different target.':'Move onto a highlighted region or curriculum label.'}
 function place(e,key){if(!dragSource)return;e.preventDefault();const held=dragSource;cleanupDrag();source=held;if(key)chooseTarget(key);else status('No target at this position. Drop on a region or label, or use the target control.')}
 canvas.addEventListener('dragover',e=>over(e,keyAt(e)));canvas.addEventListener('drop',e=>place(e,keyAt(e)));
 canvas.addEventListener('dragleave',()=>{drop.style.display='none';map?.highlight(null)});
 canvas.addEventListener('regionselect',e=>chooseTarget(e.detail));
 document.querySelectorAll('[data-target]').forEach(b=>{b.addEventListener('dragover',e=>over(e,b.dataset.target));b.addEventListener('drop',e=>place(e,b.dataset.target));b.addEventListener('dragleave',()=>{drop.style.display='none';map?.highlight(null)})});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!loading.active){cleanupDrag();status('Drag cancelled. Your source selection is retained.')}});
 if(savedRoute){source=savedRoute.source;target=savedRoute.target;status('Route restored. Choose another target or reopen the report.')}
 sync();
 if(!map?.ready()){status('Map data could not be loaded. Source cards and the target control remain available.');$('map-targets').hidden=true}
})();
