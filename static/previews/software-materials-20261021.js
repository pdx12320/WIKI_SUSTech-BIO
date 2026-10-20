/* Inspection controls only; the actual scenes/materials are the live Wiki modules. */
import { mountMechanisms } from '../software-delivery-mechanisms-3d.js';

const root=document.querySelector('[data-material-preview]');
const play=root.querySelector('[data-body-play]');
const scrub=root.querySelector('[data-preview-progress]');
const percent=root.querySelector('[data-preview-percent]');
const status=root.querySelector('[data-preview-status]');
let stage=2,phase=0,playing=false,previous=0,raf=0;

function progress(){
  scrub.value=String(Math.round(phase*1000));percent.textContent=`${Math.round(phase*100)}%`;
  root.dispatchEvent(new CustomEvent('body:progress',{detail:{stage,phase,flowPhase:phase}}));
}
function stop(){
  playing=false;cancelAnimationFrame(raf);raf=0;previous=0;
  play.setAttribute('aria-pressed','false');play.textContent='播放';
}
function tick(now){
  if(!playing)return;
  if(previous)phase=(phase+Math.min(now-previous,100)/10000)%1;
  previous=now;progress();raf=requestAnimationFrame(tick);
}
play.addEventListener('click',()=>{
  if(playing){stop();return;}
  playing=true;previous=0;play.setAttribute('aria-pressed','true');play.textContent='暂停';raf=requestAnimationFrame(tick);
});
root.querySelectorAll('[data-preview-stage]').forEach(button=>button.addEventListener('click',()=>{
  stop();stage=Number(button.dataset.previewStage);phase=0;root.dataset.bodyCurrentStage=String(stage);
  root.querySelectorAll('[data-preview-stage]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  root.dispatchEvent(new CustomEvent('body:stage',{detail:{stage}}));progress();
}));
scrub.addEventListener('input',()=>{stop();phase=Number(scrub.value)/1000;progress();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
try {
  await mountMechanisms(root);play.disabled=false;progress();
  status.textContent='当前实际材质与原有模型 · 演示进度不代表生理时间';
} catch(error) {
  status.textContent='三维预览未能加载，请刷新页面并确认浏览器允许 WebGL。';
  root.dataset.previewError=String(error?.message||error);
}
