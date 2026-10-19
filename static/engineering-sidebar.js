(() => {
 const ws=document.querySelector('[data-engineering-workspace]');if(!ws)return;
 const nav=ws.querySelector('[data-project-diagram]'),wheel=ws.querySelector('[data-dbtl-wheel]');
 const tuner=ws.querySelector('[data-engineering-cycles]');
 function revealVerticalCycle(){
  const viewport=tuner.querySelector('.cycle-tuner-viewport'),active=tuner.querySelector('[aria-current]');
  if(!viewport||!active)return;
  const top=active.offsetTop,bottom=top+active.offsetHeight;
  if(top<viewport.scrollTop||bottom>viewport.scrollTop+viewport.clientHeight)viewport.scrollTo({top:top-(viewport.clientHeight-active.offsetHeight)/2,behavior:'instant'});
 }
 tuner.addEventListener('keydown',event=>{
  if(!['ArrowUp','ArrowDown'].includes(event.key)||event.altKey||event.ctrlKey||event.metaKey)return;
  const links=[...tuner.querySelectorAll('[data-engineering-cycle]')],index=links.indexOf(event.target.closest('[data-engineering-cycle]'));
  if(index<0)return;event.preventDefault();
  const target=links[index+(event.key==='ArrowDown'?1:-1)];if(target){target.click();target.focus({preventScroll:true});}
 });
 new MutationObserver(()=>requestAnimationFrame(revealVerticalCycle)).observe(tuner,{subtree:true,childList:true,attributes:true,attributeFilter:['aria-current']});
 addEventListener('resize',()=>requestAnimationFrame(revealVerticalCycle));
 const rows=[['fundamental-research','Fundamental Research','fundamental-research'],['edit','Edit','edit'],['control','Control','gfa'],['deliver','Deliver','deliver'],['measure','Measure','measure'],['model','Model','model-rna-seq'],['functional-validation','Functional Validation','functional-validation']];
 const branches={
  edit:[['pod','POD','pod'],['cetus','CETUS','cetus'],['integrated-orca','Integrated ORCA','integrated-orca']],
  control:[['gfa','GFA','gfa'],['mre','MRE','mre'],['aso','ASO','aso'],['cre-loxp','Cre–loxP','cre-loxp']],
  model:[['model-rna-seq','Landscape','model-rna-seq'],['model-puf','Recognition','model-puf'],['model-apobec','Catalysis','model-apobec'],['model-lamar','LAMAR','model-lamar'],['model-whole-body','Delivery','model-whole-body']],
  'functional-validation':[['functional-validation-cycle-01','Experiment I','experiment-01'],['functional-validation-cycle-02','Experiment II','experiment-02'],['functional-validation-cycle-03','Experiment III','experiment-03']]
 };
 const modelTitles={'model-rna-seq':'Transcriptomic Landscape','model-puf':'Recognition Code','model-apobec':'Catalytic Design','model-lamar':'LAMAR','model-whole-body':'Delivery Dynamics'};
 const titles={'experiment-01':'Electroporation','experiment-02':'Lipid droplets','experiment-03':'Aβ42 handling'};
 const abstractIcons={"fundamental-research": "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"diagram-symbol\" data-icon-choice=\"compass-centered\" viewBox=\"0 0 64 64\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"32\" cy=\"32\" r=\"24\"/><path d=\"M32 12v3M52 32h-3M32 52v-3M12 32h3\"/><g class=\"compass-needle\"><path d=\"m42 18-6 18-14 10 6-18Z\"/><path d=\"m42 18-14 10 8 8Z\" fill=\"currentColor\" stroke=\"none\"/></g></svg>", "edit": "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"diagram-symbol\" data-icon-choice=\"ED2\" viewBox=\"0 0 64 64\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M8 19h15M8 45h15M41 19h15M41 45h15M11 19v26M53 19v26\"/><g class=\"edit-piece-top\"><rect xmlns=\"http://www.w3.org/2000/svg\" x=\"24\" y=\"12\" width=\"16\" height=\"15\" rx=\"3\" fill=\"none\"/><path d=\"M34 17h-5v5h5\"/></g><g class=\"edit-piece-bottom\"><rect xmlns=\"http://www.w3.org/2000/svg\" x=\"24\" y=\"37\" width=\"16\" height=\"15\" rx=\"3\" fill=\"none\"/><path d=\"M29 42v5h6v-5\"/></g><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M45 29v7l4-4M19 35v-7l-4 4\"/></svg>", "control": "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"diagram-symbol\" data-icon-choice=\"CT1\" viewBox=\"0 0 64 64\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M9 16h46M9 32h46M9 48h46\"/><circle xmlns=\"http://www.w3.org/2000/svg\" cx=\"22\" cy=\"16\" r=\"5\" fill=\"var(--icon-paper)\"/><circle xmlns=\"http://www.w3.org/2000/svg\" cx=\"43\" cy=\"32\" r=\"5\" fill=\"var(--icon-paper)\"/><circle xmlns=\"http://www.w3.org/2000/svg\" cx=\"28\" cy=\"48\" r=\"5\" fill=\"var(--icon-paper)\"/></svg>", "model": "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"diagram-symbol\" data-icon-choice=\"MD1\" viewBox=\"0 0 64 64\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M12 19L32 9\"/><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M32 9L51 24\"/><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M12 19L22 42\"/><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M32 9L22 42\"/><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M51 24L22 42\"/><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M51 24L47 52\"/><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M22 42L47 52\"/><circle xmlns=\"http://www.w3.org/2000/svg\" cx=\"12\" cy=\"19\" r=\"3.7\" fill=\"var(--icon-paper)\"/><circle xmlns=\"http://www.w3.org/2000/svg\" cx=\"32\" cy=\"9\" r=\"3.7\" fill=\"var(--icon-paper)\"/><circle xmlns=\"http://www.w3.org/2000/svg\" cx=\"51\" cy=\"24\" r=\"3.7\" fill=\"var(--icon-paper)\"/><circle xmlns=\"http://www.w3.org/2000/svg\" cx=\"22\" cy=\"42\" r=\"3.7\" fill=\"var(--icon-paper)\"/><circle xmlns=\"http://www.w3.org/2000/svg\" cx=\"47\" cy=\"52\" r=\"3.7\" fill=\"var(--icon-paper)\"/></svg>", "functional-validation": "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"diagram-symbol\" data-icon-choice=\"FV1\" viewBox=\"0 0 64 64\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M12 18C22 5 44 8 52 24s-1 31-19 31S1 34 12 18Z\" fill=\"none\"/><circle xmlns=\"http://www.w3.org/2000/svg\" cx=\"25\" cy=\"29\" r=\"7\"/><circle xmlns=\"http://www.w3.org/2000/svg\" cx=\"47\" cy=\"47\" r=\"12\" fill=\"var(--icon-paper)\"/><path xmlns=\"http://www.w3.org/2000/svg\" class=\"validation-check\" pathLength=\"1\" d=\"m41 47 4 4 8-9\"/></svg>", "deliver": "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"diagram-symbol\" data-icon-choice=\"existing-icosahedron\" viewBox=\"0 0 64 64\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M32 7 53 21 54 44 33 57 10 44 10 22Z M32 7 23 23 10 22 M32 7 53 21 23 23 29 44 10 44 M23 23 10 44 M53 21 29 44 54 44 M29 44 33 57 M10 44 33 57\"/></svg>", "measure": "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"diagram-symbol\" data-icon-choice=\"sonar-three-arcs\" viewBox=\"0 0 64 64\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"32\" cy=\"32\" r=\"3\" fill=\"currentColor\" stroke=\"none\"/><path class=\"sonar-arc sonar-arc-1\" d=\"M30.264 22.152a10 10 0 1 1 -1.684 19.245\"/><path class=\"sonar-arc sonar-arc-2\" d=\"M47.975 37.814a17 17 0 1 1 -26.902 -18.837\"/><path class=\"sonar-arc sonar-arc-3\" d=\"M13.615 47.427a24 24 0 1 1 42.020 -19.594\"/></svg>"};
 const branchIcons={"pod": "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"branch-symbol\" data-icon-choice=\"pod\" viewBox=\"0 0 64 64\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"8\" y=\"18\" width=\"5\" height=\"20\" rx=\"2.5\"/><rect x=\"16\" y=\"18\" width=\"5\" height=\"20\" rx=\"2.5\"/><rect x=\"24\" y=\"18\" width=\"5\" height=\"20\" rx=\"2.5\"/><rect x=\"32\" y=\"18\" width=\"5\" height=\"20\" rx=\"2.5\"/><rect x=\"40\" y=\"18\" width=\"5\" height=\"20\" rx=\"2.5\"/><rect x=\"48\" y=\"18\" width=\"5\" height=\"20\" rx=\"2.5\"/><path d=\"M7 46c9-6 15 6 24 0s16 6 26 0\"/></svg>", "cetus": "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"branch-symbol\" data-icon-choice=\"cetus-clean\" viewBox=\"0 0 64 64\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path class=\"cetus-body\" d=\"M43 34c7-3 10-8 8-14-2-7-9-9-15-7-5-5-13-4-17 1-7 0-11 5-10 11-4 6-1 13 6 15 6 4 13 2 17-3\"/><path class=\"cetus-pocket\" d=\"M32 37c-4-2-5-7-2-10s8-3 11 0\"/><path class=\"cetus-rna\" d=\"M10 51c7-7 14 7 22 0s15 7 22 0\"/></svg>", "integrated-orca": "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"branch-symbol\" data-icon-choice=\"integrated-orca\" viewBox=\"0 0 64 64\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"7\" y=\"19\" width=\"4\" height=\"16\" rx=\"2\"/><rect x=\"14\" y=\"19\" width=\"4\" height=\"16\" rx=\"2\"/><rect x=\"21\" y=\"19\" width=\"4\" height=\"16\" rx=\"2\"/><rect x=\"28\" y=\"19\" width=\"4\" height=\"16\" rx=\"2\"/><path d=\"M39 18c8-7 19 2 17 11 2 10-11 16-18 7-8-2-8-15 1-18Z\"/><path d=\"M7 46c9-6 15 6 24 0s16 6 26 0\"/></svg>", "gfa": "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"branch-symbol\" data-icon-choice=\"gfa\" viewBox=\"0 0 64 64\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M7 35h50M19 35V19h23m-5-5 5 5-5 5\"/><rect x=\"29\" y=\"29\" width=\"17\" height=\"12\" rx=\"3\"/></svg>", "mre": "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"branch-symbol\" data-icon-choice=\"mre\" viewBox=\"0 0 64 64\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M7 22h49M7 42h49\"/><path d=\"M21 22v13\"/><rect x=\"18\" y=\"35\" width=\"6\" height=\"10\" rx=\"2\"/><path d=\"M33 22v13\"/><rect x=\"30\" y=\"35\" width=\"6\" height=\"10\" rx=\"2\"/><path d=\"M45 22v13\"/><rect x=\"42\" y=\"35\" width=\"6\" height=\"10\" rx=\"2\"/></svg>", "aso": "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"branch-symbol\" data-icon-choice=\"aso\" viewBox=\"0 0 64 64\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M7 21h49M7 44h49\"/><path d=\"M17 21v23\"/><path d=\"M27 21v23\"/><path d=\"M37 21v23\"/><path d=\"M47 21v23\"/><rect x=\"12\" y=\"15\" width=\"29\" height=\"12\" rx=\"3\"/></svg>", "cre-loxp": "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"branch-symbol\" data-icon-choice=\"cre-loxp\" viewBox=\"0 0 64 64\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M7 19h50M7 45h50M17 19l7-6v12ZM41 19l7-6v12ZM26 45l7-6v12ZM31 27v8m-4-4 4 4 4-4\"/></svg>", "model-rna-seq": "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"branch-symbol\" data-icon-choice=\"model-rna-seq\" viewBox=\"0 0 64 64\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M9 12v40M9 52h46M18 17h14M18 26h30M18 35h21M18 44h34\"/></svg>", "model-puf": "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"branch-symbol\" data-icon-choice=\"model-puf\" viewBox=\"0 0 64 64\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"8\" y=\"18\" width=\"5\" height=\"20\" rx=\"2.5\"/><rect x=\"16\" y=\"18\" width=\"5\" height=\"20\" rx=\"2.5\"/><rect x=\"24\" y=\"18\" width=\"5\" height=\"20\" rx=\"2.5\"/><rect x=\"32\" y=\"18\" width=\"5\" height=\"20\" rx=\"2.5\"/><rect x=\"40\" y=\"18\" width=\"5\" height=\"20\" rx=\"2.5\"/><rect x=\"48\" y=\"18\" width=\"5\" height=\"20\" rx=\"2.5\"/></svg>", "model-apobec": "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"branch-symbol\" data-icon-choice=\"model-apobec\" viewBox=\"0 0 64 64\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M15 19c6-12 17-6 21-2 10-5 20 3 18 13 5 11-8 22-18 17-11 7-25-1-24-11-8-5-5-14 3-17Z\"/></svg>", "model-lamar": "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"branch-symbol\" data-icon-choice=\"model-lamar\" viewBox=\"0 0 64 64\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M12 19L32 9\"/><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M32 9L51 24\"/><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M12 19L22 42\"/><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M32 9L22 42\"/><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M51 24L22 42\"/><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M51 24L47 52\"/><path xmlns=\"http://www.w3.org/2000/svg\" d=\"M22 42L47 52\"/><circle xmlns=\"http://www.w3.org/2000/svg\" cx=\"12\" cy=\"19\" r=\"3.7\" fill=\"var(--icon-paper)\"/><circle xmlns=\"http://www.w3.org/2000/svg\" cx=\"32\" cy=\"9\" r=\"3.7\" fill=\"var(--icon-paper)\"/><circle xmlns=\"http://www.w3.org/2000/svg\" cx=\"51\" cy=\"24\" r=\"3.7\" fill=\"var(--icon-paper)\"/><circle xmlns=\"http://www.w3.org/2000/svg\" cx=\"22\" cy=\"42\" r=\"3.7\" fill=\"var(--icon-paper)\"/><circle xmlns=\"http://www.w3.org/2000/svg\" cx=\"47\" cy=\"52\" r=\"3.7\" fill=\"var(--icon-paper)\"/></svg>", "model-whole-body": "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"branch-symbol\" data-icon-choice=\"model-whole-body\" viewBox=\"0 0 64 64\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"24\" y=\"8\" width=\"16\" height=\"12\" rx=\"3\"/><rect x=\"7\" y=\"42\" width=\"17\" height=\"13\" rx=\"3\"/><rect x=\"40\" y=\"42\" width=\"17\" height=\"13\" rx=\"3\"/><path d=\"M32 20v12H15v10M32 32h16v10\"/></svg>", "experiment-01": "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"branch-symbol\" data-icon-choice=\"experiment-01\" viewBox=\"0 0 64 64\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"9\" y=\"12\" width=\"46\" height=\"41\" rx=\"5\"/><rect x=\"16\" y=\"19\" width=\"32\" height=\"19\" rx=\"2\"/><path d=\"m33 20-8 10h9l-5 8M17 46h9\"/><circle cx=\"44\" cy=\"46\" r=\"2\"/></svg>", "experiment-02": "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"branch-symbol\" data-icon-choice=\"experiment-02\" viewBox=\"0 0 64 64\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M13 18C23 7 43 10 51 25s0 28-18 28S3 33 13 18Z\"/><circle cx=\"25\" cy=\"29\" r=\"6\"/><circle cx=\"41\" cy=\"26\" r=\"3\"/><circle cx=\"39\" cy=\"40\" r=\"4\"/><circle cx=\"20\" cy=\"41\" r=\"2.5\"/></svg>", "experiment-03": "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"branch-symbol\" data-icon-choice=\"experiment-03\" viewBox=\"0 0 64 64\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"8\" y=\"11\" width=\"48\" height=\"43\" rx=\"5\"/><circle cx=\"19\" cy=\"22\" r=\"2.8\"/><circle cx=\"19\" cy=\"33\" r=\"2.8\"/><circle cx=\"19\" cy=\"44\" r=\"2.8\"/><circle cx=\"32\" cy=\"22\" r=\"2.8\"/><circle cx=\"32\" cy=\"33\" r=\"2.8\"/><circle cx=\"32\" cy=\"44\" r=\"2.8\"/><circle cx=\"45\" cy=\"22\" r=\"2.8\"/><circle cx=\"45\" cy=\"33\" r=\"2.8\"/><circle cx=\"45\" cy=\"44\" r=\"2.8\"/></svg>"};
 let renderedGroup='';
 const groupFor=part=>window.ORCAEngineering.groups.find(g=>g.parts.some(p=>p.id===part))?.id||'edit';
 const tile=id=>{const row=rows.find(r=>r[0]===id),caption={measure:'SONAR',deliver:'AAV9',model:'PUFFER'}[id];return `<a class="diagram-tile tile-${id}" data-diagram-group="${id}" data-overview-target="${row[2]}" href="#${row[2]}" aria-label="${row[1]}" ${branches[id]?'aria-expanded="false"':''}><span class="diagram-label"><span class="diagram-tab">${row[1]}</span>${caption?`<small>${caption}</small>`:''}</span>${abstractIcons[id]}</a>`;};
 function branch(group){if(!branches[group])return '';return `<div class="diagram-branch branch-${group}" aria-label="${rows.find(r=>r[0]===group)[1]} modules">${branches[group].map(([id,label,img])=>`<a data-diagram-part="${id}" data-overview-target="${id}" href="#${id}" title="${modelTitles[id]||label}" aria-label="${modelTitles[id]||label}${titles[img]?', '+titles[img]:''}"><span class="branch-label"><span>${label}</span>${titles[img]?`<small>${titles[img]}</small>`:''}</span>${branchIcons[img]}</a>`).join('')}</div>`;}
 function render(group){
  const module=id=>`<div class="diagram-module">${tile(id)}${branches[id]?`<div class="diagram-reveal" data-branch-group="${id}"><div class="diagram-reveal-inner">${branch(id)}</div></div>`:''}</div>`;
  nav.innerHTML=module('fundamental-research')+'<section class="diagram-platform" aria-label="Platform Development"><div class="diagram-stack">'+['edit','control','deliver','measure','model'].map(module).join('')+'</div></section>'+module('functional-validation');
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{ws.classList.remove('engineering-nav-open');ws.querySelector('.engineering-nav-toggle').setAttribute('aria-expanded','false');}));
  nav.querySelectorAll('.diagram-branch').forEach(branch=>{
   const marker=document.createElement('span');marker.className='diagram-selection-marker';marker.setAttribute('aria-hidden','true');branch.append(marker);
  });
  bindIconMotion();
  renderedGroup=group;
 }
 function sync(){
  const part=wheel.dataset.part||'pod',cycle=wheel.dataset.cycle||'',group=groupFor(part);
  const initial=!renderedGroup;
  if(initial)render(group);
  nav.querySelectorAll('[data-branch-group]').forEach(panel=>{
   const open=panel.dataset.branchGroup===group;
   // Keep nodes mounted so height transitions and keyboard focus survive selection.
   if(!open&&panel.contains(document.activeElement))panel.closest('.diagram-module').querySelector('.diagram-tile').focus({preventScroll:true});
   panel.inert=!open;panel.setAttribute('aria-hidden',String(!open));panel.classList.toggle('is-open',open);
  });
  renderedGroup=group;
  nav.querySelectorAll('[data-diagram-group]').forEach(a=>{const active=a.dataset.diagramGroup===group;a.classList.toggle('is-active',active);if(active)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');if(a.hasAttribute('aria-expanded'))a.setAttribute('aria-expanded',String(active));});
  nav.querySelectorAll('[data-diagram-part]').forEach(a=>{
   const active=a.dataset.diagramPart===(group==='functional-validation'?cycle:part);
   a.classList.toggle('is-current',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
  });
  ws.classList.toggle('engineering-fv',group==='functional-validation');
  ws.dataset.sidebarGroup=group;
  requestAnimationFrame(()=>{positionMarkers();if(initial)requestAnimationFrame(()=>nav.classList.add('motion-ready'));});

 }
 // One-shot icon gestures; hover, focus and click share a cooldown.
 const reducedIconMotion=matchMedia('(prefers-reduced-motion: reduce)');
 const iconAnimations=new Set();
 reducedIconMotion.addEventListener('change',()=>{
  if(reducedIconMotion.matches){iconAnimations.forEach(animation=>animation.cancel());iconAnimations.clear();}
 });
 function bindIconMotion(){
  const gestures={
   'fundamental-research':[['.compass-needle','rotate(30deg)',0]],
   control:[['circle:nth-of-type(1)','translateX(13px)',0],['circle:nth-of-type(2)','translateX(-13px)',40],['circle:nth-of-type(3)','translateX(11px)',80]],
   edit:[['.edit-piece-top','translateY(4px)',0],['.edit-piece-bottom','translateY(-4px)',0]],
   deliver:[['.diagram-symbol > path','rotate(30deg)',0]],
   model:[
    ...Array.from({length:5},(_,i)=>[`circle:nth-of-type(${i+1})`,[{fill:'var(--icon-paper)',strokeWidth:2,offset:0},{fill:'#bd8a9c',strokeWidth:3.5,offset:.42},{fill:'var(--icon-paper)',strokeWidth:2,offset:1}],i*40]),
    ...Array.from({length:7},(_,i)=>[`path:nth-of-type(${i+1})`,[{stroke:'currentColor',strokeWidth:2,offset:0},{stroke:'#5d5ad7',strokeWidth:3,offset:.5},{stroke:'currentColor',strokeWidth:2,offset:1}],80])
   ],
   'functional-validation':[['.validation-check',[{strokeDasharray:'1',strokeDashoffset:1,opacity:0,offset:0},{strokeDasharray:'1',strokeDashoffset:1,opacity:1,offset:.12},{strokeDasharray:'1',strokeDashoffset:0,opacity:1,offset:.75},{strokeDasharray:'1',strokeDashoffset:0,opacity:1,offset:1}],0]],
   measure:[['.sonar-arc-1','rotate(50deg)',0],['.sonar-arc-2','rotate(-35deg)',40],['.sonar-arc-3','rotate(40deg)',80]]
  };
  Object.entries(gestures).forEach(([group,parts])=>{
   const tile=nav.querySelector(`[data-diagram-group="${group}"]`);
   tile.classList.add('has-icon-gesture');
   let lastPlayed=-Infinity,hoverTimer;
   const play=()=>{
    clearTimeout(hoverTimer);
    if(reducedIconMotion.matches||performance.now()-lastPlayed<1300)return;
    lastPlayed=performance.now();
    parts.forEach(([selector,transform,delay])=>{
     const target=tile.querySelector(selector);
     const frames=Array.isArray(transform)?transform:[{transform:'none',offset:0},{transform,offset:.42},{transform:'none',offset:1}];
     const animation=target.animate(frames,{duration:1000,delay,easing:'cubic-bezier(.4,0,.2,1)'});
     iconAnimations.add(animation);
     animation.finished.catch(()=>{}).finally(()=>iconAnimations.delete(animation));
    });
   };
   tile.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')hoverTimer=setTimeout(play,80);});
   tile.addEventListener('pointerleave',()=>clearTimeout(hoverTimer));
   tile.addEventListener('focus',()=>{if(tile.matches(':focus-visible'))play();});
   tile.addEventListener('click',play);
  });
 }
 function positionMarkers(){
  nav.querySelectorAll('.diagram-branch').forEach(branch=>{
   const active=branch.querySelector('.is-current'),marker=branch.querySelector('.diagram-selection-marker');
   if(!active||!branch.getBoundingClientRect().width){marker.style.opacity='0';return;}
   marker.style.transform=`translate(${active.offsetLeft+(active.offsetWidth-18)/2}px, ${active.offsetTop+active.offsetHeight-1}px)`;
   marker.style.opacity='1';
  });
 }
 new ResizeObserver(positionMarkers).observe(nav);
 // The original workspace owns chapters, cycle selection, mascot portraits and DBTL rotation.
 new MutationObserver(sync).observe(wheel,{attributes:true,attributeFilter:['data-part','data-cycle']});
 document.addEventListener('engineering:map-select',sync);
 const toggle=ws.querySelector('.engineering-nav-toggle');toggle.onclick=()=>{const open=ws.classList.toggle('engineering-nav-open');toggle.setAttribute('aria-expanded',String(open));};
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){ws.classList.remove('engineering-nav-open');toggle.setAttribute('aria-expanded','false');}});
 sync();
})();
