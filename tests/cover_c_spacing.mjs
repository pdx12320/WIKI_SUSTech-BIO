import assert from 'node:assert/strict';
import * as THREE from '../static/vendor/three/three.module.js';
import {oneCState,codonNeighboursOpacity} from '../static/onetake/one-c-context.mjs';
import {oneCCameraPose,createOneCParticles} from '../static/onetake/one-c-particles.mjs';
import {coverCRectAt} from '../static/onetake/cover-c-bridge.mjs';
for(const [w,h] of [[390,844],[708,646],[1440,900]]){
 globalThis.innerWidth=w;globalThis.innerHeight=h;
 const small=w<=760,scene=new THREE.Scene(),view=createOneCParticles(THREE,scene,{small}),camera=new THREE.PerspectiveCamera(38,w/h,.1,200);
 const brand=small?.86*w:Math.min(1040,.74*w),cover={left:(w-brand)/2+brand*194/372,top:h*.3+40+brand*10/372,width:brand*75/372,height:brand*80/372};
 let visible=0;
 for(let take=.035;take<=.3;take+=.001){
  const state=oneCState(take),pose=oneCCameraPose(take,0,w/h);camera.position.fromArray(pose.position);camera.lookAt(new THREE.Vector3().fromArray(pose.look));camera.updateMatrixWorld();view.update(take,0,.016,false,null);
  const anchors=view.labels(camera,w,h),rect=coverCRectAt(cover,anchors[0],state.context),opacity=codonNeighboursOpacity(state.context,anchors,rect);
  if(opacity>.01){visible++;assert(anchors[1].x-.36*anchors[1].size>rect.left+rect.width+4);assert(anchors[2].x-.36*anchors[2].size>anchors[1].x+.4*anchors[1].size+4);}
 }
 assert(visible>100,`the neighboring G/C remain visible through most of the readable codon at ${w}px`);console.log(`${w}px: ${visible} visible sampled frames with no overlapping ink bounds.`);
}
