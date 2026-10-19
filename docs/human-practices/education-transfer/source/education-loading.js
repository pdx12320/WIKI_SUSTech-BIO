/* Restores the original B loading treatment, with functional DNA motion and cancellable navigation. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.BioSphereLoading=api;})(typeof globalThis==='object'?globalThis:this,function(){
 'use strict';
 function create({document,window,onCancel=()=>{}}){
  const $=id=>document.getElementById(id),dialog=$('transfer-loading'),steps=[...$('loading-steps').querySelectorAll('.ld-s')];
  let active=false,timer=null,complete=null,previousFocus=null,index=0;
  const clearTimer=()=>{if(timer!==null){window.clearTimeout(timer);timer=null}};
  function renderStep(current){
   steps.forEach((step,i)=>{step.classList.toggle('active',i===current);step.classList.toggle('done',i<current);step.querySelector('.ld-ck').textContent=i<current?'✓':''});
   $('loading-bar').style.width=`${Math.min(current,steps.length)/steps.length*100}%`;
   $('loading-status').textContent=current<steps.length?steps[current].textContent:'Report ready. Opening the analysis page.';
  }
  function finish(){
   if(!active)return;
   clearTimer();renderStep(steps.length);active=false;
   const callback=complete;complete=null;dialog.close();if(callback)callback();
  }
  function cancel(){
   if(!active)return false;
   clearTimer();active=false;complete=null;dialog.close();previousFocus?.focus?.({preventScroll:true});onCancel();return true;
  }
  function advance(){
   if(!active)return;
   index++;renderStep(index);
   timer=window.setTimeout(index>=steps.length?finish:advance,index>=steps.length?250:600);
  }
  function dna(){
   const wrap=$('dna-w');wrap.replaceChildren();
   for(let row=0;row<10;row++){
    const rung=document.createElement('span');rung.className='dna-rung';rung.style.top=`${row*7+11}px`;rung.style.animationDelay=`${-row*.18}s`;wrap.appendChild(rung);
    for(let strand=0;strand<2;strand++){
     const dot=document.createElement('span');dot.className=`dna-n ${strand?'dna-back':'dna-front'}`;dot.style.top=`${row*7+8}px`;dot.style.animationDelay=`${-row*.18}s`;wrap.appendChild(dot);
    }
   }
  }
  function start({source,target,onComplete}){
   if(active)return false;
   previousFocus=document.activeElement;complete=onComplete;index=0;dna();
   $('loading-route').textContent=`${source} → ${target}`;
   renderStep(0);dialog.showModal();active=true;
   const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
   timer=window.setTimeout(reduced?finish:advance,reduced?80:600);
   return true;
  }
  $('cancel-loading').addEventListener('click',cancel);$('skip-loading').addEventListener('click',finish);
  dialog.addEventListener('cancel',e=>{e.preventDefault();cancel()});
  return {start,cancel,get active(){return active}};
 }
 return {create};
});
