// Every star, thread and signal lives in the existing THREE.Scene and uses
// its camera, renderer and bloom. No canvas overlay, picture or boxed scene.
import {memoryConstellationState,memoryQuestionState} from './memory-constellation-state.mjs';
import {createMemoryQuestion} from './memory-question.mjs';
import {cellLayout} from './rna-cell-state.mjs';
import {cellCameraPose} from './cell-fpv-motion.mjs';
const hash=i=>{const n=Math.sin(i*127.1+311.7)*43758.5453;return n-Math.floor(n);};
const mix=(a,b,t)=>a+(b-a)*t;
const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
const centers=[[-9,1.0,-1.1],[-6.3,3.0,.7],[-3.9,-1.9,1.5],[-.7,1.5,-.5],
 [2.5,-.3,1.8],[4.8,2.9,-1.4],[7.6,.7,.6],[9,-2.6,-.5]];
export function memoryStarData(brainPositions,{small=false}={}){
 const anchors=[],edges=[];
 const per=small?13:19;
 for(let c=0;c<centers.length;c++)for(let k=0;k<per;k++){
  const id=c*per+k,angle=k*2.39996323+c*.7,r=Math.sqrt((k+.5)/per);
  const p=centers[c].map((v,j)=>v+(j===0?Math.cos(angle)*r*1.95:j===1?Math.sin(angle)*r*1.5:(hash(id+31)-.5)*2.8));
  const lost=(c===2||c===4)&&(k%4!==0)||c===1&&k%3===0;
  anchors.push({p,c,loss:lost?.18+hash(id+902)*.6:2,size:k===0?2.8:1.1+hash(id+70)});
 }
 for(let i=0;i<anchors.length;i++){
  const candidates=anchors.map((a,j)=>({j,d:Math.hypot(...a.p.map((v,k)=>v-anchors[i].p[k]))}))
   .filter(a=>a.j!==i&&anchors[a.j].c===anchors[i].c).sort((a,b)=>a.d-b.d).slice(0,2);
  for(const {j} of candidates)if(j>i)edges.push({a:i,b:j,bridge:false,cut:2});
 }
 // Selective bridges create a readable network with open negative space.
 for(const [a,b] of [[0,1],[0,2],[1,3],[2,3],[3,4],[3,5],[4,6],[5,6],[6,7],[4,7]])
  edges.push({a:a*per,b:b*per,bridge:true,cut:.12+hash(a*31+b)*.73});
 const count=small?3100:5600,position=new Float32Array(count*3),origin=new Float32Array(count*3);
 const info=new Float32Array(count*4),n=brainPositions.length/3;
 const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
 for(let i=0;i<n;i++)for(let j=0;j<3;j++){min[j]=Math.min(min[j],brainPositions[i*3+j]);max[j]=Math.max(max[j],brainPositions[i*3+j]);}
 const scale=5.0/(max[1]-min[1]);
 for(let i=0;i<count;i++){
  const a=anchors[i%anchors.length],core=i<anchors.length;
  const dust=i>=count*.82;
  const theta=hash(i+400)*Math.PI*2,r=hash(i+500)**1.7*(dust?3.2:.56);
  position.set(a.p.map((v,j)=>v+(j===0?Math.cos(theta)*r:j===1?Math.sin(theta)*r:(hash(i+601)-.5)*r*2)),i*3);
  const b=Math.floor(i*n/count)*3;
  origin.set([0,1,2].map(j=>(brainPositions[b+j]-(min[j]+max[j])/2)*scale),i*3);
  info.set([a.loss,core?a.size:mix(.45,1.05,hash(i+81)),hash(i+10),core?1:dust?.16:.46],i*4);
 }
 return {anchors,edges,position,origin,info};
}
export function memorySignalPoint(edge,anchors,u,disorient=0){
 const a=anchors[edge.a].p,b=anchors[edge.b].p;
 const bend=Math.sin(Math.PI*u)*(edge.bridge?.40:.14);
 const p=a.map((v,j)=>mix(v,b[j],u)+(j===1?bend:0));
 // A few signals stall, turn back and loop near the middle of their route.
 const loop=[mix(a[0],b[0],.53)+Math.cos(u*Math.PI*2)*.58,
  mix(a[1],b[1],.53)+Math.sin(u*Math.PI*2)*.38,
  mix(a[2],b[2],.53)+Math.sin(u*Math.PI*2)*.24];
 return p.map((v,j)=>mix(v,loop[j],disorient));
}
export function createMemoryConstellation(THREE,scene,root,{brain,small=false}={}){
 const el=root.querySelector('[data-memory-constellation]');
 if(!el)return null;
 const data=memoryStarData(brain.pos,{small}),group=new THREE.Group();
 const question=createMemoryQuestion(scene,root);
 const carriedRna=scene.getObjectByName('one-c-rna-particles');
 group.name='memory-constellation-space';scene.add(group);
 const uniform={uExpand:{value:0},uOpacity:{value:0},uLoss:{value:0},uDisconnect:{value:0},uTime:{value:0},uPR:{value:1},uRetreat:{value:0}};
 const starGeo=new THREE.BufferGeometry();
 starGeo.setAttribute('position',new THREE.BufferAttribute(data.position,3));
 starGeo.setAttribute('aBrain',new THREE.BufferAttribute(data.origin,3));
 starGeo.setAttribute('aInfo',new THREE.BufferAttribute(data.info,4));
 const stars=new THREE.Points(starGeo,new THREE.ShaderMaterial({uniforms:uniform,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
  vertexShader:`attribute vec3 aBrain;attribute vec4 aInfo;
   uniform float uExpand,uOpacity,uLoss,uTime,uPR,uRetreat;varying float vAlpha,vTone;
   void main(){vec3 p=mix(aBrain,position,uExpand);
    p.z+=sin(uTime*.17+aInfo.z*6.28)*.10*uExpand;
    float lost=smoothstep(aInfo.x-.10,aInfo.x+.10,uLoss)*uExpand;
    vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;
    gl_PointSize=clamp((1.9+aInfo.y*1.7)*uPR*17./max(1.,-mv.z),.65,7.*uPR);
    vAlpha=uOpacity*(1.-lost)*mix(.48,aInfo.w,uExpand)*(1.-uRetreat*.36);
    vTone=aInfo.z;}`,
  fragmentShader:`uniform float uExpand;varying float vAlpha,vTone;
   void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;
    vec3 violet=vec3(.616,.612,.957),ice=vec3(.914,.910,1.);
    vec3 col=mix(violet,ice,smoothstep(.28,.84,vTone));
    gl_FragColor=vec4(col,exp(-r*r*4.2)*vAlpha);}`}));
 stars.name='memory-constellation-stars';stars.frustumCulled=false;group.add(stars);
 const linePos=[],lineInfo=[];
 for(const e of data.edges){
  const segments=e.bridge?18:1,a=data.anchors[e.a],b=data.anchors[e.b];
  for(let j=0;j<segments;j++)for(const u of [j/segments,(j+1)/segments]){
   const p=memorySignalPoint(e,data.anchors,u,0);linePos.push(...p);
   lineInfo.push(Math.min(a.loss,b.loss),e.cut,e.bridge?1:0,u);
  }
 }
 const lineGeo=new THREE.BufferGeometry();lineGeo.setAttribute('position',new THREE.Float32BufferAttribute(linePos,3));
 lineGeo.setAttribute('aInfo',new THREE.Float32BufferAttribute(lineInfo,4));
 const lines=new THREE.LineSegments(lineGeo,new THREE.ShaderMaterial({uniforms:uniform,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
  vertexShader:`attribute vec4 aInfo;varying vec4 vInfo;void main(){vInfo=aInfo;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  fragmentShader:`uniform float uOpacity,uExpand,uLoss,uDisconnect;varying vec4 vInfo;
   void main(){float loss=1.-smoothstep(vInfo.x-.10,vInfo.x+.10,uLoss);
    float cut=smoothstep(vInfo.y-.10,vInfo.y+.10,uDisconnect);
    float broken=1.-cut*smoothstep(.25,.48,vInfo.w)*(1.-smoothstep(.52,.75,vInfo.w));
    float survive=mix(broken,1.-cut,smoothstep(.87,1.,uDisconnect));
    gl_FragColor=vec4(mix(vec3(.616,.612,.957),vec3(.62,.86,.79),vInfo.z*.65),
     uOpacity*smoothstep(.45,1.,uExpand)*loss*survive*mix(.11,.28,vInfo.z));}`}));
 lines.name='memory-constellation-threads';lines.frustumCulled=false;group.add(lines);
 const flowCount=small?20:32,tail=12,flowPos=new Float32Array(flowCount*tail*3),flowInfo=new Float32Array(flowCount*tail*3);
 for(let i=0;i<flowCount;i++)for(let j=0;j<tail;j++)flowInfo.set([j/tail,i%4===0?1:0,hash(i+7)],(i*tail+j)*3);
 const flowGeo=new THREE.BufferGeometry();flowGeo.setAttribute('position',new THREE.BufferAttribute(flowPos,3));flowGeo.setAttribute('aFlow',new THREE.BufferAttribute(flowInfo,3));
 const flowUniform={...uniform,uDisorient:{value:0}};
 const flow=new THREE.Points(flowGeo,new THREE.ShaderMaterial({uniforms:flowUniform,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
  vertexShader:`attribute vec3 aFlow;uniform float uPR,uOpacity,uExpand,uDisorient,uDisconnect;varying float vAlpha,vLost;
   void main(){vec4 mv=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mv;
    gl_PointSize=clamp(3.9*uPR*18./max(1.,-mv.z),1.,6.*uPR);
    vAlpha=(1.-aFlow.x)*uOpacity*smoothstep(.6,1.,uExpand)*(1.-uDisconnect*.64);vLost=aFlow.y*uDisorient;}`,
  fragmentShader:`varying float vAlpha,vLost;void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;
   gl_FragColor=vec4(mix(vec3(.62,.86,.79),vec3(.961,.561,.612),vLost),exp(-r*r*4.)*vAlpha);}`}));
 flow.name='memory-constellation-signals';flow.frustumCulled=false;group.add(flow);
 const labels=[...el.querySelectorAll('[data-memory-caption]')];
 const pos=new THREE.Vector3(),look=new THREE.Vector3(),orientation=new THREE.Matrix4(),up=new THREE.Vector3(0,1,0);
 let aspect=0;
 function place(ratio){
  aspect=ratio;group.position.fromArray(cellLayout(ratio).neuron);
  const incoming=cellCameraPose(.728,0,ratio);
  orientation.lookAt(new THREE.Vector3().fromArray(incoming.position),new THREE.Vector3().fromArray(incoming.look),up);
  group.quaternion.setFromRotationMatrix(orientation);
 }
 return {objects:{group,stars,lines,flow},
  camera(take,time,ratio,position,target,replay){
   const s=memoryConstellationState(take,replay);if(s.presence<=0)return;
   if(aspect!==ratio)place(ratio);
   // The same spatial graph becomes taller on portrait screens instead of
   // retreating so far that all its details disappear.
   group.scale.set(ratio<1?mix(1,.44,s.expand):1,ratio<1?mix(1,1.45,s.expand):1,1);
   const widthFit=ratio<1?Math.max(1.12,.70/ratio):Math.max(1,1.55/ratio);
   const distance=mix(12,22*widthFit,s.expand)+s.retreat*6*widthFit;
   pos.set(Math.sin(time*.12)*.18,s.expand*.8,distance).applyQuaternion(group.quaternion).add(group.position);
   look.set(0,s.expand*.2,0).applyQuaternion(group.quaternion).add(group.position);
   const blend=s.enter*(1-smooth((take-.752)/.004));
   position.lerp(pos,blend);target.lerp(look,blend);
  },
  backdrop(take,replay){return 1-memoryConstellationState(take,replay).presence;},
  update(take,time,camera,replay){
   question.update(take,replay);
   const s=memoryConstellationState(take,replay),active=s.presence>.0001&&!root.classList.contains('ot--static');
   group.visible=active;el.hidden=!active;
   root.style.setProperty('--memory-population-opacity',String(smooth((take-.7515)/.0025)*memoryQuestionState(take,replay).populationFade));
   if(!active){delete root.dataset.memoryConstellationStage;return;}
   // The intracellular RNA has a separate owner from the cellular objects;
   // its owner resets this opacity on every frame before this bridge runs.
   if(carriedRna?.material.uniforms.uOpacity)carriedRna.material.uniforms.uOpacity.value*=1-s.presence;
   if(aspect!==camera.aspect)place(camera.aspect);
   root.dataset.memoryConstellationStage=s.stage;
   uniform.uExpand.value=s.expand;uniform.uOpacity.value=s.presence;
   uniform.uLoss.value=s.loss;uniform.uDisconnect.value=s.disconnect;uniform.uTime.value=time;
   uniform.uPR.value=Math.min(globalThis.devicePixelRatio||1,small?1.5:1.75);uniform.uRetreat.value=s.retreat;
   flowUniform.uDisorient.value=s.disorient;
   const routeEdges=data.edges.filter(e=>e.bridge);
   for(let i=0;i<flowCount;i++){
    const e=routeEdges[i%routeEdges.length];
    for(let j=0;j<tail;j++){
     const u=((time*.11+hash(i+37)-j*.007)%1+1)%1;
     flowPos.set(memorySignalPoint(e,data.anchors,u,i%4===0?s.disorient:0),(i*tail+j)*3);
    }
   }
   flowGeo.attributes.position.needsUpdate=true;
   for(const node of labels){
    const a=Number(node.dataset.in),b=Number(node.dataset.out);
    const alpha=smooth((take-a)/.0008)*(1-smooth((take-b)/.0008));
    node.style.opacity=String(alpha);node.setAttribute('aria-hidden',String(alpha<.05));
   }
  },
  dispose(){question.dispose();group.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});scene.remove(group);}
 };
}
