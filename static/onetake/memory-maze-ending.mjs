import { findMazePath } from './maze-navigation.mjs';
import { createMemoryOrcaMaze } from './memory-orca-maze.mjs';

// The matched cortex keeps its particles while its passages resolve into ORCA.
// It is a metaphor about molecular information and shared lives, not a cure.
const clamp = v => Math.max(0, Math.min(1, v));
const ease = v => { v = clamp(v); return v*v*(3-2*v); };
const mix = (a,b,t) => a+(b-a)*t;
const interval = (v,a,b) => ease((v-a)/(b-a));
export const MEMORY_MAZE_RANGE = Object.freeze({ start:.972, end:1 });

export function memoryMazeState(take,{ reduced=false, small=false }={}) {
  const p=clamp((take-MEMORY_MAZE_RANGE.start)/(MEMORY_MAZE_RANGE.end-MEMORY_MAZE_RANGE.start));
  const morph=interval(p,.05,.26), travel=interval(p,.30,.61);
  const straighten=interval(p,.66,.80), letters=interval(p,.84,.96);
  return { progress:p, opacity:interval(p,0,.035), morph, travel, straighten,
    mazeOpacity:1-interval(p,.63,.77), anchor:interval(p,.27,.30),
    destination:interval(travel,.96,1), arrow:interval(straighten,.20,.80),
    letters:reduced?1:letters, phrase:interval(letters,.66,1), from:interval(letters,0,.25),
    simplified:small||reduced,
    phase:p<.05?'brain':p<.30?'maze':p<.66?'path':p<.84?'straightening':p<.965?'lettering':'final',
  };
}

// Entering the settled maze is the only trigger. Scroll remains free; the
// route finishes in scene time before later glyph changes catch up gently.
export function createMemoryMazeTravel({duration=3,arrivalHold=.32}={}) {
  let started=false,elapsed=0,display=0,lastTime=null;
  const reset=(progress,time)=>{started=false;elapsed=0;display=progress;lastTime=time;};
  return {
    update(progress,time,{reduced=false}={}) {
      const raw=clamp(progress),dt=lastTime===null?0:Math.max(0,time-lastTime);lastTime=time;
      if(raw<.30-1e-7){reset(raw,time);return {progress:raw,pending:false,travel:0,arrivalAge:-1};}
      if(reduced){reset(raw,time);display=Math.max(raw,.61);return {progress:display,pending:false,travel:1,arrivalAge:-1};}
      if(!started){started=true;elapsed=0;display=.30;}
      else elapsed+=dt;
      if(elapsed<duration){display=.30+.31*ease(elapsed/duration);}
      else if(elapsed<duration+arrivalHold){display=.61;}
      else {
        const goal=Math.max(raw,.61);
        display=mix(display,goal,1-Math.exp(-dt*5));
        if(Math.abs(goal-display)<.0001)display=goal;
      }
      return {progress:display,pending:elapsed<duration+arrivalHold||display<raw-.0001,
        travel:interval(display,.30,.61),arrivalAge:elapsed>=duration?elapsed-duration:-1};
    },
    reset(){reset(0,null);},
  };
}

// The random opening wander is deliberately not reused: this route must
// actually reach the opposite exit through the original open passages.
export function memoryMazeRoute(navigation) {
  if(navigation.endingRoute)return navigation.endingRoute;
  const {adj,point,bowl}=navigation;
  const cells=[...adj.keys()];
  if(!cells.length) throw new Error('The memory maze has no open passages.');
  const select=sign=>cells.reduce((best,id)=>{
    const a=point(id), b=point(best);
    return sign*a[0]>sign*b[0]+1e-7 || (Math.abs(a[0]-b[0])<1e-7 && Math.abs(a[1])<Math.abs(b[1]))?id:best;
  },cells[0]);
  const ids=findMazePath(adj,select(-1),select(1));
  if(ids.length<2) throw new Error('The two memory-maze exits are not connected.');
  const points=ids.map(id=>{const [x,y]=point(id);return [x,y+.2,bowl(x,y)+.075];});
  const distance=[0];
  for(let i=1;i<points.length;i++) distance.push(distance[i-1]+Math.hypot(...points[i].map((v,j)=>v-points[i-1][j])));
  return {ids,points,distance,length:distance.at(-1)};
}

export function sampleMemoryRoute(route,progress) {
  const at=clamp(progress)*route.length;
  let lo=1,hi=route.distance.length-1;
  while(lo<hi){const mid=(lo+hi)>>1;if(route.distance[mid]<at)lo=mid+1;else hi=mid;}
  const i=lo;
  const t=(at-route.distance[i-1])/Math.max(1e-8,route.distance[i]-route.distance[i-1]);
  return route.points[i-1].map((v,j)=>mix(v,route.points[i][j],t));
}

// The final little tail is outside the maze, rather than stopping at its wall.
export function extendMemoryMazeExit(route,length=.55) {
  const last=route.points.at(-1),end=[last[0]+length,last[1],last[2]];
  return {...route,mazeExit:last.slice(),points:[...route.points,end],
    emphasis:[...(route.emphasis||route.points.map(()=>1)),1],
    distance:[...route.distance,route.length+length],length:route.length+length};
}

export function memoryMazeArrivalPop(age,{reduced=false}={}) {
  const visible=!reduced&&age>=0&&age<.85;
  return {visible,spread:ease(age/.42),opacity:visible?interval(age,0,.045)*(1-interval(age,.24,.85)):0};
}

function routeEmphasis(route,progress) {
  if(!route.emphasis)return 1;
  const at=clamp(progress)*route.length;
  let lo=1,hi=route.distance.length-1;
  while(lo<hi){const mid=(lo+hi)>>1;if(route.distance[mid]<at)lo=mid+1;else hi=mid;}
  const t=(at-route.distance[lo-1])/Math.max(1e-8,route.distance[lo]-route.distance[lo-1]);
  return mix(route.emphasis[lo-1]??1,route.emphasis[lo]??1,t);
}

export function memoryPathPoint(route,t,straighten) {
  const p=sampleMemoryRoute(route,t);
  return p.map((v,j)=>mix(v,[mix(-1.9,1.9,t),.8,.2][j],straighten));
}

const vertex=`attribute vec3 aMaze;attribute float aShade,aSeed;
uniform float uMorph,uRot,uOpacity,uTime,uPR,uMotion;varying vec3 vColor;varying float vAlpha;
void main(){float c=cos(uRot),s=sin(uRot);vec3 brain=vec3(c*position.x+s*position.z,position.y,-s*position.x+c*position.z);
 vec3 p=mix(brain,aMaze,uMorph);p.z+=sin(uTime*.6+aSeed*23.)*.018*uMotion;
 vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;
 gl_PointSize=clamp((1.2+aSeed*.8)*uPR*14./max(1.,-mv.z),.8*uPR,3.*uPR);
 vColor=mix(mix(vec3(.10,.22,.72),vec3(.62,.82,1.),aShade),vec3(.36,.47,.86),uMorph);
 vAlpha=uOpacity*mix(.32+.5*aShade,.38,uMorph);}`;
const fragment=`varying vec3 vColor;varying float vAlpha;void main(){float d=length(gl_PointCoord-.5);float a=1.-smoothstep(.04,.5,d);if(a*vAlpha<.01)discard;gl_FragColor=vec4(vColor,a*a*vAlpha);}`;
const routeVertex=`attribute float aAlong,aEmphasis;uniform float uTravel,uOpacity,uPR,uStraighten;varying float vAlpha;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mv;float head=exp(-pow((aAlong-uTravel)*80.,2.));gl_PointSize=(1.35+head*1.6)*uPR;vAlpha=uOpacity*(.42+head*.5)*mix(aEmphasis,1.,uStraighten)*(1.-smoothstep(uTravel,uTravel+.003,aAlong));}`;
const routeFragment=`varying float vAlpha;void main(){float a=1.-smoothstep(.02,.5,length(gl_PointCoord-.5));if(a*vAlpha<.01)discard;gl_FragColor=vec4(vec3(1.,.79,.62),a*a*vAlpha);}`;
const routeLineFragment=`varying float vAlpha;void main(){if(vAlpha<.005)discard;gl_FragColor=vec4(vec3(1.,.75,.43),min(.85,vAlpha*1.45));}`;

const NS='http://www.w3.org/2000/svg';
function svgNode(tag,attrs={},parent){const el=document.createElementNS(NS,tag);for(const [k,v]of Object.entries(attrs))el.setAttribute(k,String(v));parent?.append(el);return el;}
function overlay(host) {
  const svg=svgNode('svg',{'aria-hidden':'true',class:'memory-maze-ending__type'},host);
  const text=(label,cls)=>{const el=svgNode('text',{'text-anchor':'middle','dominant-baseline':'central',class:cls},svg);el.textContent=label;return el;};
  const c=text('C','memory-maze-ending__c'),u=text('U','memory-maze-ending__u');
  const lowerC=text('C','memory-maze-ending__c'),lowerU=text('U','memory-maze-ending__u');
  const from=text('From',''),o=text('o',''),s=text('s','memory-maze-ending__u');
  const bar=svgNode('path',{class:'memory-maze-ending__morph-stroke'},svg);
  const head=svgNode('path',{class:'memory-maze-ending__morph-stroke'},svg);
  const pop=svgNode('g',{class:'memory-maze-ending__arrival','data-memory-maze-pop':''},svg);
  const rays=Array.from({length:12},()=>svgNode('path',{},pop));
  const ring=svgNode('circle',{r:0},pop);
  return {svg,c,u,lowerC,lowerU,from,o,s,bar,head,pop,rays,ring};
}

export function createMemoryMazeEnding(THREE,scene,root,{maze,brain,small=false}={}) {
  const host=root.querySelector('[data-memory-maze-ending]');
  const noop={enabled:false,camera(){},update(){},skipToProject(){},backdrop(){return 1;},dispose(){}};
  if(!host||!maze?.navigation||!brain?.pos)return noop;
  root.classList.add('has-memory-maze-ending');
  const layout=createMemoryOrcaMaze(maze),route=extendMemoryMazeExit(memoryMazeRoute(layout.navigation)),ui=overlay(host);
  const group=new THREE.Group();group.name='home-memory-maze-ending';group.visible=false;scene.add(group);
  const geometry=new THREE.BufferGeometry(),count=Math.min(maze.meta.length,brain.meta.length);
  geometry.setAttribute('position',new THREE.BufferAttribute(brain.pos.slice(0,count*3),3));
  geometry.setAttribute('aMaze',new THREE.BufferAttribute(layout.pos.slice(0,count*3),3));
  geometry.setAttribute('aShade',new THREE.BufferAttribute(brain.meta.slice(0,count),1));
  geometry.setAttribute('aSeed',new THREE.BufferAttribute(Float32Array.from({length:count},(_,i)=>(Math.sin(i*127.1)*43758.5)%1*.5+.5),1));
  const uniforms={uMorph:{value:0},uRot:{value:0},uOpacity:{value:0},uTime:{value:0},uPR:{value:1},uMotion:{value:1}};
  const material=new THREE.ShaderMaterial({uniforms,vertexShader:vertex,fragmentShader:fragment,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
  const subject=new THREE.Points(geometry,material);subject.frustumCulled=false;subject.name='ending-original-brain-maze';group.add(subject);
  const samples=small?1000:1800,pathGeometry=new THREE.BufferGeometry();
  pathGeometry.setAttribute('position',new THREE.BufferAttribute(new Float32Array(samples*3),3));
  pathGeometry.setAttribute('aAlong',new THREE.BufferAttribute(Float32Array.from({length:samples},(_,i)=>i/(samples-1)),1));
  pathGeometry.setAttribute('aEmphasis',new THREE.BufferAttribute(Float32Array.from({length:samples},(_,i)=>routeEmphasis(route,i/(samples-1))),1));
  const pathUniforms={uTravel:{value:0},uOpacity:{value:0},uPR:{value:1},uStraighten:{value:0}};
  // The same samples form a connected one-pixel stroke beneath the sparks.
  // A subpixel point mask alone left dark gaps along the long maze route.
  const lineMaterial=new THREE.ShaderMaterial({uniforms:pathUniforms,vertexShader:routeVertex,fragmentShader:routeLineFragment,transparent:true,depthWrite:false,depthTest:false,blending:THREE.AdditiveBlending});
  const routeLine=new THREE.Line(pathGeometry,lineMaterial);routeLine.frustumCulled=false;routeLine.name='ending-continuous-memory-route';group.add(routeLine);
  const pathMaterial=new THREE.ShaderMaterial({uniforms:pathUniforms,vertexShader:routeVertex,fragmentShader:routeFragment,transparent:true,depthWrite:false,depthTest:false,blending:THREE.AdditiveBlending});
  const path=new THREE.Points(pathGeometry,pathMaterial);path.frustumCulled=false;path.name='ending-route-becomes-arrow';group.add(path);
  const arrowGeometry=new THREE.BufferGeometry();arrowGeometry.setAttribute('position',new THREE.BufferAttribute(new Float32Array(9),3));
  const arrowMaterial=new THREE.LineBasicMaterial({color:0xffd9ba,transparent:true,opacity:0,depthTest:false});
  const arrow=new THREE.Line(arrowGeometry,arrowMaterial);arrow.frustumCulled=false;group.add(arrow);
  const projection=new THREE.Vector3(),targetCamera=new THREE.Vector3(),targetLook=new THREE.Vector3();
  const anchorGap=small?1.6:1.1;
  const entrance=route.points[0].map((v,j)=>v+(j===0?-anchorGap:0)),exit=route.mazeExit.map((v,j)=>v+(j===0?anchorGap:0));
  let lastStraight=-1;const autoTravel=createMemoryMazeTravel({duration:small?4.2:4.8,arrivalHold:1.05});
  let finalSince=null,complete=false,skipped=globalThis.location?.hash==='#ot-index-title';
  function skipToProject(){
    skipped=true;complete=true;
    root.classList.toggle('is-memory-maze-complete',true);
    root.classList.toggle('is-memory-maze-past',true);
    group.visible=false;host.classList.toggle('is-on',false);
    host.style.setProperty('--memory-maze-opacity',0);
  }
  function camera(take,time,aspect,position,look,replay){
    if((replay&&replay.phase!=='return')||take<MEMORY_MAZE_RANGE.start-.003)return;
    const blend=interval(take,MEMORY_MAZE_RANGE.start-.003,MEMORY_MAZE_RANGE.start);
    targetLook.set(0,.2,0);targetCamera.set(0,.2,aspect<1?30/aspect:18.3);
    position.lerp(targetCamera,blend);look.lerp(targetLook,blend);
  }
  function update(take,time,camera,motion=1,width=1440,height=900,replay=null,scrollProgress=take,endingScreens=0){
    const raw=memoryMazeState(take,{small,reduced:!motion}),active=(!replay||replay.phase==='return')&&take>=MEMORY_MAZE_RANGE.start;
    if(!active)autoTravel.reset();
    const automatic=autoTravel.update(active?raw.progress:0,time,{reduced:!motion});
    const displayTake=MEMORY_MAZE_RANGE.start+(MEMORY_MAZE_RANGE.end-MEMORY_MAZE_RANGE.start)*automatic.progress;
    const state=memoryMazeState(displayTake,{small,reduced:!motion});
    host.dataset.memoryMazeTravel=state.travel.toFixed(4);host.dataset.memoryMazePending=String(active&&automatic.pending);
    if(raw.progress<.30&&!skipped){finalSince=null;complete=false;}
    if(skipped&&scrollProgress<.99){skipped=false;complete=false;finalSince=null;}
    if(active&&state.phase==='final'&&!automatic.pending){
      if(finalSince===null)finalSince=time;
      if(time-finalSince>=.65)complete=true;
    }else if(!complete)finalSince=null;
    const unlocked=skipped||complete||!motion;
    root.classList.toggle('is-memory-maze-complete',unlocked);
    // The final phrase owns 1.2 viewport heights after the story before fading.
    const exitOpacity=skipped?0:unlocked?1-interval(endingScreens,1.2,1.7):1;
    root.classList.toggle('is-memory-maze-past',skipped||(unlocked&&endingScreens>=1.7));
    group.visible=active&&state.opacity*exitOpacity>.001;host.classList.toggle('is-on',active&&exitOpacity>.001);host.style.setProperty('--memory-maze-opacity',active?state.opacity*exitOpacity:0);host.dataset.memoryMazePhase=state.phase;
    if(!active)return;
    const pr=Math.min(globalThis.devicePixelRatio||1,small?1.5:2);
    uniforms.uMorph.value=state.morph;uniforms.uRot.value=.3+Math.sin(time*.12)*.4;
    uniforms.uOpacity.value=state.opacity*state.mazeOpacity*exitOpacity;uniforms.uTime.value=time;uniforms.uPR.value=pr;uniforms.uMotion.value=motion;
    if(lastStraight!==state.straighten){
      const positions=pathGeometry.attributes.position.array;
      for(let i=0;i<samples;i++)positions.set(memoryPathPoint(route,i/(samples-1),state.straighten),i*3);
      pathGeometry.attributes.position.needsUpdate=true;lastStraight=state.straighten;
    }
    pathUniforms.uTravel.value=state.travel;pathUniforms.uOpacity.value=state.anchor*.9*exitOpacity;pathUniforms.uPR.value=pr;pathUniforms.uStraighten.value=state.straighten;
    const end=memoryPathPoint(route,1,state.straighten),size=.22*state.arrow;
    arrowGeometry.attributes.position.array.set([end[0]-size,end[1]+size,end[2],...end,end[0]-size,end[1]-size,end[2]]);arrowGeometry.attributes.position.needsUpdate=true;arrowMaterial.opacity=state.arrow*.9*exitOpacity;
    const project=p=>{projection.fromArray(p).project(camera);return [(projection.x*.5+.5)*width,(-projection.y*.5+.5)*height];};
    const pop=memoryMazeArrivalPop(automatic.arrivalAge,{reduced:!motion});
    const popAt=project(route.points.at(-1)),popSize=small?17:25;
    ui.pop.setAttribute('transform',`translate(${popAt[0]},${popAt[1]})`);
    ui.pop.style.opacity=pop.opacity*(1-state.straighten)*exitOpacity;
    host.dataset.memoryMazePop=String(pop.visible&&state.straighten===0);
    ui.rays.forEach((ray,i)=>{
      const angle=i*Math.PI/6+.12,inner=popSize*(.12+.56*pop.spread),outer=inner+popSize*(i%3===0?.29:.18)*(1-pop.spread*.25);
      ray.setAttribute('d',`M${Math.cos(angle)*inner},${Math.sin(angle)*inner}L${Math.cos(angle)*outer},${Math.sin(angle)*outer}`);
    });
    ui.ring.setAttribute('r',popSize*(.12+.72*pop.spread));ui.ring.style.opacity=(1-pop.spread)*.5;
    const left=project(entrance.map((v,j)=>mix(v,[-3.15,.8,.2][j],state.straighten)));
    const right=project(exit.map((v,j)=>mix(v,[3.15,.8,.2][j],state.straighten)));
    const topY=(left[1]+right[1])/2,center=width*.5;
    const font=Math.min(small?68:88,width*(small?.15:.065)),lowerFont=font*.62,lowerY=topY+font*1.48;
    ui.svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
    const place=(el,p,size,opacity)=>{el.setAttribute('x',p[0]);el.setAttribute('y',p[1]);el.setAttribute('font-size',size);el.style.opacity=opacity;};
    place(ui.c,left,font,state.anchor);place(ui.u,right,font,state.destination);
    const offsets={from:-2.5,c:-.50,t:.82,o:1.48,u:2.5,s:3.14};
    place(ui.lowerC,[mix(left[0],center+offsets.c*lowerFont,state.letters),mix(left[1],lowerY,state.letters)],mix(font,lowerFont,state.letters),state.letters);
    place(ui.lowerU,[mix(right[0],center+offsets.u*lowerFont,state.letters),mix(right[1],lowerY,state.letters)],mix(font,lowerFont,state.letters),state.letters);
    place(ui.from,[center+offsets.from*lowerFont,lowerY],lowerFont,state.from);
    place(ui.o,[center+offsets.o*lowerFont,lowerY],lowerFont,state.phrase);
    place(ui.s,[center+offsets.s*lowerFont,lowerY],lowerFont,state.phrase);
    // A second impression grows from the upper arrow; its head is the very
    // same cubic topology all the way down to the lower t's stem and hook.
    const rightTip=project(end),leftTip=project(memoryPathPoint(route,0,state.straighten));
    const headStart=[rightTip[0]-9,rightTip[1]-9,rightTip[0]-6,rightTip[1]-6,rightTip[0]-3,rightTip[1]-3,rightTip[0],rightTip[1],rightTip[0]-3,rightTip[1]+3,rightTip[0]-6,rightTip[1]+6,rightTip[0]-9,rightTip[1]+9];
    const tx=center+offsets.t*lowerFont,ty=lowerY;
    const headEnd=[tx,ty-lowerFont*.45,tx,ty-lowerFont*.12,tx,ty+lowerFont*.1,tx,ty+lowerFont*.24,tx,ty+lowerFont*.4,tx+lowerFont*.15,ty+lowerFont*.4,tx+lowerFont*.23,ty+lowerFont*.25];
    const coords=headStart.map((v,i)=>mix(v,headEnd[i],state.letters));
    ui.head.setAttribute('d',`M${coords[0]},${coords[1]}C${coords.slice(2,8).join(',')}C${coords.slice(8).join(',')}`);
    ui.bar.setAttribute('d',`M${mix(leftTip[0],tx-lowerFont*.22,state.letters)},${mix(leftTip[1],ty-lowerFont*.14,state.letters)}L${mix(rightTip[0],tx+lowerFont*.23,state.letters)},${mix(rightTip[1],ty-lowerFont*.14,state.letters)}`);
    ui.bar.style.opacity=ui.head.style.opacity=state.letters;ui.bar.style.strokeWidth=ui.head.style.strokeWidth=String(mix(2,Math.max(2,lowerFont*.06),state.letters));
  }
  return {enabled:true,layout,route,group,camera,update,skipToProject,backdrop:(take,replay)=>replay&&replay.phase!=='return'?1:1-memoryMazeState(take,{small}).opacity,
    dispose(){scene.remove(group);geometry.dispose();material.dispose();pathGeometry.dispose();pathMaterial.dispose();lineMaterial.dispose();arrowGeometry.dispose();arrowMaterial.dispose();ui.svg.remove();}};
}
