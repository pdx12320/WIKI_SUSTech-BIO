import {mountHomeSkip} from './home-skip.mjs';
import {openingWordmark} from './orca-opening-wordmark.mjs';
import {createFullscreenMemoryFaults} from './fullscreen-memory-faults.mjs';
import {EXTRA_MEMORIES} from './memory-life-objects.mjs';
import { createMemoryTunnel } from './memory-tunnel.mjs';

// Decorative memory fragments: one story entrance, no per-image navigation.
const svg = (body, box='0 0 260 200') => `<svg viewBox="${box}" fill="none" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
const windowScene = svg(`<defs><linearGradient id="memory-dusk" x2="1" y2="1"><stop stop-color="#d7b5a5"/><stop offset=".52" stop-color="#8f87a8"/><stop offset="1" stop-color="#353655"/></linearGradient></defs><rect width="260" height="200" fill="#312b40"/><rect x="40" y="12" width="180" height="169" fill="url(#memory-dusk)"/><path d="M40 126Q77 72 111 106T220 86V181H40Z" fill="#424858"/><path d="M40 144Q97 119 130 139T220 117V181H40Z" fill="#293646"/><path d="M130 12V181M40 93H220" stroke="#232639" stroke-width="7"/><path d="M12 0Q50 35 31 118L20 200H0V0M248 0Q210 35 229 118L240 200H260V0" fill="#b6a9bb"/><path d="M15 8L22 105M244 8L237 105" stroke="#e2ced1" opacity=".4"/><path d="M40 185H225" stroke="#dbb6a4" stroke-width="8"/><ellipse cx="172" cy="174" rx="22" ry="7" fill="#272538"/><path d="M163 170V142Q180 133 180 153V170Z" fill="#9a858d"/>`);
const clock = svg(`<circle cx="130" cy="100" r="88" fill="#302b3c" stroke="#a6a0bd" stroke-width="5"/><circle cx="130" cy="100" r="78" fill="#e5dccd"/><g stroke="#5a5364" stroke-width="2">${Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return `<path d="M${130+Math.sin(a)*65} ${100-Math.cos(a)*65}l${Math.sin(a)*7} ${-Math.cos(a)*7}"/>`}).join('')}</g><path d="M130 100L97 73M130 100L161 54" stroke="#393447" stroke-width="4" stroke-linecap="round"/><circle cx="130" cy="100" r="5" fill="#a4677c"/><text x="130" y="142" text-anchor="middle" fill="#94899b" font-size="9" letter-spacing="2">A MOMENT</text>`);
const brainPath='M128 27C108 10 78 21 71 40C40 32 24 55 31 76C7 89 15 120 34 127C24 152 48 174 71 168C84 192 113 183 128 169C143 187 171 186 184 167C215 180 238 153 225 131C253 113 242 84 224 75C233 50 210 30 187 40C171 16 144 13 128 27Z';
const brain = svg(`<defs><clipPath id="memory-brain"><path d="${brainPath}"/></clipPath></defs><g clip-path="url(#memory-brain)">${Array.from({length:370},(_,i)=>{const x=(i*79.31)%260,y=(i*43.37)%200;return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${i%5===0?1.5:.7}" fill="${i%6===0?'#f5b1c1':'#b8c9ff'}" opacity="${.35+i%4*.17}"/>`}).join('')}</g><path d="${brainPath}" fill="#9d9cf4" fill-opacity=".12" stroke="#c7ceff" stroke-width="3" opacity=".9"/><path d="M128 30Q112 65 129 90T126 171M71 41Q96 66 70 82T75 128Q50 138 68 163M185 42Q154 59 181 85T178 123Q205 141 184 165M39 84Q70 109 40 124M221 83Q188 107 222 127" stroke="#c5d0ff" stroke-width="2.5" opacity=".85"/>`);
const neuron=svg(`<g stroke="#b7b7f4" stroke-width="2" stroke-linecap="round"><path d="M124 98L84 59L49 52M85 60L79 23M120 97L145 46L181 31M145 47L141 13M131 107L188 104L222 75M188 104L225 130M123 112L97 154L58 169M97 154L109 187M115 101L56 109L21 84M57 109L21 137M132 115L156 156L196 178M156 156L153 187"/></g><path d="M111 87Q133 69 144 95L142 117Q122 135 106 114Z" fill="#9d9cf4" fill-opacity=".25" stroke="#e1c5ee"/><circle cx="126" cy="104" r="8" fill="#f58f9c"/>${[[49,52],[79,23],[181,31],[141,13],[222,75],[225,130],[58,169],[109,187],[21,84],[21,137],[196,178],[153,187]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3" fill="#d6b6df"/>`).join('')}`);
const rna=svg(`<path d="M12 114C55 18 94 182 141 87S211 51 249 105" stroke="#b3bbea" stroke-width="3"/>${Array.from({length:21},(_,i)=>{const x=15+i*11,y=100+Math.sin(i*.6)*29;return `<path d="M${x} ${y}l2 -17" stroke="${['#9d9cf4','#f58f9c','#9ccbc3','#e2ce95'][i%4]}" stroke-width="5" stroke-linecap="round"/>`}).join('')}<text x="130" y="170" text-anchor="middle" fill="#ddd5ef" font-size="12" letter-spacing="4">APOE4 RNA</text>`);
const editing=svg(`<path d="M35 95Q90 135 220 91" stroke="#a8c7e0" stroke-width="2"/>${Array.from({length:28},(_,i)=>{const a=i*2.4,r=8+Math.sqrt(i)*5;return `<circle cx="${82+Math.cos(a)*r}" cy="${82+Math.sin(a)*r*.65}" r="5" fill="#a6a0df" fill-opacity=".65" stroke="#d1c7f6" stroke-width=".4"/>`}).join('')}${Array.from({length:16},(_,i)=>`<circle cx="${169+Math.cos(i*2.4)*Math.sqrt(i)*6}" cy="${81+Math.sin(i*2.4)*Math.sqrt(i)*5}" r="5" fill="#edacb5" fill-opacity=".7"/>`).join('')}<text x="83" y="138" text-anchor="middle" fill="#c9c1eb" font-size="11">PUF</text><text x="175" y="138" text-anchor="middle" fill="#edbac9" font-size="11">APOBEC</text><text x="130" y="181" text-anchor="middle" fill="#e9e8ff" font-family="Georgia" font-size="28">C → U</text>`);
const tape=svg(`<rect x="13" y="40" width="234" height="130" rx="9" fill="#42364c" stroke="#9e8ca8" stroke-width="3"/><rect x="30" y="54" width="200" height="47" rx="3" fill="#d1b9bf"/><path d="M39 68H170M39 78H190" stroke="#7c647c" stroke-width="2"/><circle cx="79" cy="119" r="24" stroke="#aa9bad" stroke-width="7"/><circle cx="181" cy="119" r="24" stroke="#aa9bad" stroke-width="7"/><path d="M103 119H157M82 152H177" stroke="#aa9bad" stroke-width="3"/><text x="221" y="85" text-anchor="end" font-size="15" fill="#493953">A</text>`);

const glasses=svg(`<g stroke-linecap="round" stroke-linejoin="round"><path d="M26 85L12 43L48 30M230 85L247 45L215 28" stroke="#9f8baf" stroke-width="7"/><rect x="26" y="73" width="85" height="65" rx="22" fill="#9d9cf4" fill-opacity=".1" stroke="#e1c9bd" stroke-width="8"/><rect x="147" y="73" width="85" height="65" rx="22" fill="#9d9cf4" fill-opacity=".1" stroke="#e1c9bd" stroke-width="8"/><path d="M111 92Q129 81 147 92" stroke="#d1b2a9" stroke-width="7"/><path d="M43 89L72 88M166 89L194 88" stroke="#eee2df" stroke-width="4" opacity=".65"/></g>`);
const cane=svg(`<path d="M162 34Q130 10 107 35Q98 45 112 52Q128 59 141 52L119 176" stroke="#64465e" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/><path d="M157 32Q126 15 111 35M137 61L118 166" stroke="#c7a392" stroke-width="7" stroke-linecap="round"/><path d="M112 170L128 173L125 188L107 184Z" fill="#b5a5bd"/><path d="M114 176L121 178" stroke="#e5ced6" stroke-width="2"/>`);
const wheelchair=svg(`<g stroke-linecap="round" stroke-linejoin="round"><circle cx="87" cy="131" r="46" stroke="#bcb4d7" stroke-width="8"/><circle cx="87" cy="131" r="5" fill="#ddd2e4"/><path d="M87 88V174M44 131H130M56 100L117 162M57 161L116 101" stroke="#9d9cf4" stroke-width="2"/><circle cx="199" cy="172" r="13" fill="#333048" stroke="#d0c2d6" stroke-width="5"/><path d="M101 45L112 116H170L187 164H213M111 108L89 132M170 116L151 159H108M100 45L82 44M123 77H173" stroke="#b4abc9" stroke-width="7"/><path d="M103 56L111 103M115 114H169" stroke="#8e73ac" stroke-width="15"/><path d="M112 114H168" stroke="#c2a9d2" stroke-width="5"/></g>`);

export function createMemoryRoom(root) {
  const room=document.createElement('section');
  room.className='memory-room';room.setAttribute('aria-label','ORCA — memory and RNA editing');
  const photo=new URL('./memory-handwritten-cards.png',import.meta.url).href;
  const items=[
    ['window',windowScene,'The familiar world',-10,1.25],
    ['brain',brain,'Memory',8,.8],
    ['clock',clock,'A moment in time',-13,1.4],
    ['letter',`<img src="${photo}" alt="" width="1080" height="810">`,'Words we keep',9,1.05],
    ['neuron',neuron,'Connections',-7,1.3],
    ['rna',rna,'',-9,.55],
    ['editing',editing,'',8,1.1],
    ['tape',tape,'',12,.65],
    ['glasses',glasses,'',-7,.9],
    ['cane',cane,'',12,1.1],
    ['wheelchair',wheelchair,'',-8,1.2],
    ...EXTRA_MEMORIES,
  ];
  room.innerHTML=`<div class="memory-room__haze" aria-hidden="true"></div><div class="memory-room__objects" aria-hidden="true">${items.map(([name,art,caption,angle,depth])=>`<figure class="memory-object memory-object--${name}" style="--tilt:${angle}deg;--depth:${depth}"><div class="memory-object__art">${art}</div>${caption?`<figcaption>${caption}</figcaption>`:''}</figure>`).join('')}</div><div class="memory-room__intro"><p class="memory-room__eyebrow">SUSTech · iGEM 2026</p><p class="memory-room__title">${openingWordmark}<span>On-target RNA Correction of APOE4</span></p><a class="memory-room__skip" data-memory-skip href="#ot-index-title">Skip to Explore the project <span aria-hidden="true">↗</span></a><p class="memory-room__scroll">MOVE TO EXPLORE · DRAG TO CATCH · ↓ SCROLL TO ENTER</p></div>`;
  root.append(room);
  mountHomeSkip(root,room);
  const echo=room.querySelector('.memory-room__objects').cloneNode(true);
  echo.classList.add('memory-room__echo');echo.setAttribute('aria-hidden','true');room.append(echo);
  const tunnel=createMemoryTunnel(room);
  const fullscreenFaults=createFullscreenMemoryFaults();
  tunnel.setTuning({count:141,speed:1.2});
  const surfaces=[];
  // Rasterize every source at the same coarse resolution and quantized palette.
  for (const art of room.querySelectorAll('.memory-room__objects:not(.memory-room__echo) .memory-object__art')) {
    const source=art.firstElementChild;
    const isSvg=source.tagName.toLowerCase()==='svg';
    const img=isSvg ? new Image() : source;
    const rasterize=()=>{
      const canvas=document.createElement('canvas');
      canvas.width=48;canvas.height=isSvg?37:36;
      const context=canvas.getContext('2d');
      context.imageSmoothingEnabled=false;
      context.drawImage(img,0,0,canvas.width,canvas.height);
      const pixels=context.getImageData(0,0,canvas.width,canvas.height);
      for(let i=0;i<pixels.data.length;i+=4){
        for(let c=0;c<3;c++) pixels.data[i+c]=Math.round(pixels.data[i+c]/48)*48;
        pixels.data[i+3]=pixels.data[i+3]>110?255:0;
      }
      context.putImageData(pixels,0,0);art.replaceChildren(canvas);
      const name=art.parentElement.classList[1].replace('memory-object--','');
      tunnel.register(name,canvas);
      const copy=echo.querySelector(`.${art.parentElement.classList[1]} .memory-object__art`);
      if(copy){const twin=canvas.cloneNode();twin.getContext('2d').drawImage(canvas,0,0);copy.replaceChildren(twin);}
      if (['brain','neuron','rna','editing'].some(name=>art.parentElement.classList.contains(`memory-object--${name}`))) {
        for(let depth=1;depth<=3;depth++){
          const side=canvas.cloneNode();side.getContext('2d').drawImage(canvas,0,0);
          side.className='memory-object__volume';side.style.setProperty('--voxel-step',String(depth));
          art.prepend(side);
        }
      }
      const residue=canvas.cloneNode();residue.className='memory-object__hover-residue';
      art.append(residue);
      surfaces.push({art,source:canvas,canvas:residue,ctx:residue.getContext('2d'),energy:0,x:canvas.width/2,y:canvas.height/2});
      if(isSvg) URL.revokeObjectURL(img.src);
    };
    if(isSvg){img.onload=rasterize;img.src=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(source)],{type:'image/svg+xml'}));}
    else if(img.complete&&img.naturalWidth)rasterize();else img.addEventListener('load',rasterize,{once:true});
  }
  let mx=0,my=0,px=0,py=0,pointerX=-1,pointerY=-1,pointerOn=false,lastResidue=0;
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const follow=e=>{if(e.target?.closest?.('[data-memory-controls]'))return;pointerX=e.clientX;pointerY=e.clientY;pointerOn=true;mx=(e.clientX/innerWidth-.5)*2;my=(e.clientY/innerHeight-.5)*2;};
  addEventListener('pointermove',follow,{passive:true});
  addEventListener('pointerdown',follow,{passive:true});
  addEventListener('pointerup',e=>{if(e.pointerType==='touch')pointerOn=false;},{passive:true});
  addEventListener('pointercancel',()=>{pointerOn=false;},{passive:true});
  addEventListener('pointerout',e=>{if(!e.relatedTarget){mx=my=0;pointerOn=false;}},{passive:true});
  let active=true;
  return {update(p,reception){
    const exit=Math.min(1,Math.max(0,(p+.18)/.075));
    const visible=exit<1;
    if (visible!==active){active=visible;room.hidden=!visible;room.inert=!visible;}
    if(!visible){pointerOn=false;tunnel.cancel();fullscreenFaults.update(1,motion.matches);return;}
    const ease=exit*exit*(3-2*exit);
    px+=(mx-px)*.05;py+=(my-py)*.05;
    room.style.setProperty('--memory-exit',ease.toFixed(4));
    room.style.setProperty('--memory-reception',reception.toFixed(4));
    room.style.setProperty('--memory-x',`${motion.matches?0:px*16}px`);
    room.style.setProperty('--memory-y',`${motion.matches?0:py*11}px`);
    room.style.setProperty('--memory-rx',`${motion.matches?0:-py*2}deg`);
    room.style.setProperty('--memory-ry',`${motion.matches?0:px*3}deg`);
    const tick=performance.now()%3100;
    const glitch=motion.matches?0:tick<150?-13:tick>290&&tick<430?17:tick>620&&tick<720?-8:0;
    room.style.setProperty('--memory-glitch',String(glitch));
    room.style.setProperty('--memory-ghost',glitch?'.7':'0');
    const now=performance.now();
    tunnel.update(ease,px,py,pointerX,pointerY,pointerOn,motion.matches);
    fullscreenFaults.update(ease,motion.matches);
    if(!tunnel&&now-lastResidue>55){
      const dt=Math.min(.25,(now-lastResidue)/1000);lastResidue=now;
      const bounds=surfaces.map(s=>s.art.getBoundingClientRect());
      surfaces.forEach((surface,index)=>{
        const box=bounds[index],ctx=surface.ctx,w=surface.canvas.width,h=surface.canvas.height;
        const hit=pointerOn && box.width>0 && pointerX>=box.left && pointerX<=box.right && pointerY>=box.top && pointerY<=box.bottom;
        surface.energy=hit?1:surface.energy*Math.exp(-dt*2.8);
        surface.art.parentElement.classList.toggle('is-memory-disturbed',surface.energy>.08);
        surface.art.style.setProperty('--hover-energy',surface.energy.toFixed(3));
        surface.art.style.setProperty('--hover-jolt',motion.matches?'0px':`${hit?(Math.floor(Math.random()*5)-2):0}px`);
        ctx.filter='none';ctx.globalCompositeOperation='destination-out';
        ctx.fillStyle=`rgba(0,0,0,${1-Math.exp(-dt*3.4)})`;ctx.fillRect(0,0,w,h);
        ctx.globalCompositeOperation='source-over';
        if(hit){
          surface.x=(pointerX-box.left)/box.width*w;surface.y=(pointerY-box.top)/box.height*h;
          const count=motion.matches?1:6;
          for(let i=0;i<count;i++){
            const sx=Math.max(0,Math.min(w-3,Math.floor(surface.x-15+Math.random()*28)));
            const sy=Math.max(0,Math.min(h-2,Math.floor(surface.y-13+Math.random()*26)));
            const sw=Math.min(w-sx,6+Math.floor(Math.random()*16)),sh=Math.min(h-sy,1+Math.floor(Math.random()*4));
            const offset=motion.matches?0:(i%2?-1:1)*(4+Math.floor(Math.random()*9));
            ctx.globalAlpha=.9;ctx.filter=i%2?'hue-rotate(125deg) saturate(3) brightness(1.8)':'hue-rotate(295deg) saturate(3) brightness(1.6)';
            ctx.drawImage(surface.source,sx,sy,sw,sh,sx+offset,sy,sw,sh);
            ctx.filter='none';ctx.globalAlpha=.45;
            ctx.fillStyle=i%2?'#72e7ee':'#f58fbd';ctx.fillRect(sx+offset,sy+sh,sw,1);
          }
        }
        ctx.globalAlpha=1;ctx.filter='none';
        if(surface.energy<.01)ctx.clearRect(0,0,w,h);
      });
    }
  }};
}
