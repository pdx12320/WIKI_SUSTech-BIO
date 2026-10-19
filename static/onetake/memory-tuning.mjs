const defaults={count:36,speed:1},key='orca-memory-preview-tuning-v1';
export function normalizeMemoryTuning(value={}){
  const finite=(v,fallback)=>typeof v==='number'&&Number.isFinite(v)?v:fallback;
  return {count:Math.round(Math.max(0,Math.min(96,finite(value?.count,36)))),
    speed:Math.round(Math.max(0,Math.min(3,finite(value?.speed,1)))*100)/100};
}
export function createMemoryTuning(tunnel){
  const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('./memory-tuning.css',import.meta.url).href;document.head.append(css);
  let value={...defaults};try{value=normalizeMemoryTuning(JSON.parse(localStorage.getItem(key))??defaults);}catch{}
  const panel=document.createElement('details');panel.className='memory-tuning';panel.dataset.memoryControls='';panel.open=true;
  panel.innerHTML=`<summary>画面调节 <span>预览</span></summary><div class="memory-tuning__body"><label for="memory-object-count">物件数量 <output for="memory-object-count"></output></label><input id="memory-object-count" type="range" min="0" max="96" step="1" aria-label="物件数量"><label for="memory-object-speed">掠过速度 <output for="memory-object-speed"></output></label><input id="memory-object-speed" type="range" min="0" max="3" step="0.05" aria-label="掠过速度"><p>实时生效 · 速度为 0 时暂停流动</p></div>`;
  const count=panel.querySelector('#memory-object-count'),speed=panel.querySelector('#memory-object-speed');
  const countOut=panel.querySelector('output[for="memory-object-count"]'),speedOut=panel.querySelector('output[for="memory-object-speed"]');
  const apply=()=>{
    count.value=String(value.count);speed.value=String(value.speed);
    countOut.textContent=String(value.count);speedOut.textContent=`${value.speed.toFixed(2)}×`;
    tunnel.setTuning(value);try{localStorage.setItem(key,JSON.stringify(value));}catch{}
  };
  panel.addEventListener('input',()=>{value=normalizeMemoryTuning({count:Number(count.value),speed:Number(speed.value)});apply();});
  document.body.append(panel);apply();
  return {update(visible){panel.hidden=!visible;}};
}
