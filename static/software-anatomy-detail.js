/* Original illustrative anatomy. Nominal proportions, not patient imaging.
 * BBB organization: https://pubmed.ncbi.nlm.nih.gov/33681208/
 * All details are presentation geometry; delivery states are unchanged. */
import * as THREE from './vendor/three/three.module.js';
import { anatomyPoint } from './software-body-proportions.js';

export const tissue = (color, extra = {}) => new THREE.MeshPhysicalMaterial({
  color, roughness: .87, metalness: 0, specularIntensity: .18,
  clearcoat: 0, sheen: 0, ...extra
});
const bell = (x, center, width) => Math.exp(-(((x-center)/width)**2));

export function refineBodySurface(geometry) {
  const p=geometry.attributes.position, colors=[];
  const base=new THREE.Color(0xc6a797), warm=new THREE.Color(0xb88d80);
  for(let i=0;i<p.count;i++) {
    let x=p.getX(i), y=p.getY(i), z=p.getZ(i);
    // Frontal features are continuous displacements of the existing surface.
    const front=THREE.MathUtils.smoothstep(z,.035,.075), ax=Math.abs(x);
    const sockets=bell(ax,.030,.015)*bell(y,1.653,.012);
    const brow=bell(ax,.031,.025)*bell(y,1.667,.008);
    const cheek=bell(ax,.042,.021)*bell(y,1.620,.017);
    z+=front*(-.008*sockets+.004*brow+.004*cheek);
    z-=front*.003*bell(x,0,.026)*bell(y,1.591,.0035);
    // Clavicles, sternum, costal margin, navel and kneecaps remain understated.
    z+=front*.004*bell(ax,.083,.060)*bell(y,1.366-.11*ax,.009);
    z-=front*.003*bell(x,0,.014)*bell(y,1.274,.085);
    z+=front*.002*bell(ax,.072,.056)*bell(y,1.258,.047);
    z-=front*.0025*bell(ax,.09,.045)*bell(y,1.156+.30*ax,.010);
    z-=front*.0045*bell(x,0,.009)*bell(y,1.035,.009);
    z+=front*.004*bell(ax,.096,.027)*bell(y,.522,.024);
    const neck=bell(y,1.455,.047)*bell(x,0,.085);
    x*=1+.16*neck;
    z=-.006+(z+.006)*(1+.10*neck);
    p.setXYZ(i,...anatomyPoint([x,y,z]));
    const warmth=Math.min(.25,.16*sockets+.10*bell(y,1.62,.055)+.06*bell(y,.52,.04));
    const color=base.clone().lerp(warm,warmth);colors.push(color.r,color.g,color.b);
  }
  geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
  geometry.computeVertexNormals();geometry.computeBoundingSphere();
}

export function cellContour(t,scale=1) {
  const r=1+.045*Math.sin(3*t+.4)+.022*Math.cos(5*t-.7);
  return [1.28*Math.cos(t)*r*scale,.79*Math.sin(t)*r*scale,0];
}

export function organicCellGeometry() {
  const geo=new THREE.SphereGeometry(1,72,44,Math.PI,Math.PI),p=geo.attributes.position;
  for(let i=0;i<p.count;i++) {
    const x=p.getX(i),y=p.getY(i),z=p.getZ(i),t=Math.atan2(y,x);
    const r=1+.045*Math.sin(3*t+.4)+.022*Math.cos(5*t-.7);
    p.setXYZ(i,x*1.28*r,y*.79*r,z*.69*(1+.025*Math.sin(4*t)));
  }
  geo.computeVertexNormals();return geo;
}

export function addCellDetail(g,sphere,tube,materialFactory=tissue) {
  const er=materialFactory(0x789f97),golgi=materialFactory(0xbfa18c),ribosome=materialFactory(0x617f7c);
  sphere(g,[-.57,.21,.12],[.095,.085,.065],materialFactory(0x76548e),32);
  // Folded chromatin distributed inside the nucleus, behind the teaching helix.
  for(let k=0;k<4;k++) {
    const points=[];
    for(let j=0;j<=38;j++) {
      const t=j/38*Math.PI*2;
      points.push([-.48+Math.cos(t)*(.20+.025*Math.sin(t*3+k)),.14+Math.sin(t)*(.23-k*.023),-.18+k*.043+.035*Math.sin(t*4+k)]);
    }
    tube(g,points,.007,materialFactory(0x9a7ca9),48);
  }
  // Rough ER cisternae wrap the nucleus; small ribosomes sit on their surface.
  for(let k=0;k<4;k++) {
    const points=[];
    for(let j=0;j<=25;j++) {
      const t=1.95+j/25*2.9,rx=.43+k*.055,ry=.37+k*.045;
      points.push([-.48+Math.cos(t)*rx,.14+Math.sin(t)*ry,-.18+k*.025]);
    }
    tube(g,points,.018,er,40);
    for(let j=2;j<24;j+=4) sphere(g,[points[j][0],points[j][1],points[j][2]+.02],[.012,.012,.009],ribosome,8);
  }
  // A curved, flattened stack distinguishes Golgi cisternae from ER tubules.
  for(let k=0;k<5;k++) {
    const points=[];
    for(let j=0;j<=22;j++) {const t=j/22;points.push([.18+t*(.40-k*.035),-.08-k*.041+.07*Math.sin(t*Math.PI),-.19-k*.008]);}
    const cisterna=tube(g,points,.021,golgi,36).mesh;
    // Tubes have rounded rims; their vertical separation exposes the stack.
    cisterna.scale.z=.55;
  }
  for(let k=0;k<5;k++) sphere(g,[.68+.045*Math.sin(k*2),-.16-k*.05,-.14],[.022,.019,.018],golgi,12);
  sphere(g,[.91,-.31,-.10],[.060,.052,.047],materialFactory(0xb69b79),24);
  sphere(g,[.65,.45,-.17],[.045,.041,.038],materialFactory(0x9b9a78),20);
  // Deterministic cytoplasmic granules, kept away from the RNA foreground.
  for(let k=0;k<25;k++) {
    const t=k*2.39996,r=.6+.20*Math.sin(k*1.7),x=Math.cos(t)*1.13*r,y=Math.sin(t)*.65*r;
    if(x<-.14&&y>-.24)continue;
    sphere(g,[x,y,-.30],[.009,.009,.009],ribosome,8);
  }
}

export function addBarrierDetail(g,sphere,tube,materialFactory=tissue) {
  const basal=materialFactory(0xc4b8a1,{transparent:true,opacity:.44,depthWrite:false});
  const junction=materialFactory(0x496e69),foot=materialFactory(0x8fa5b5),pericyte=materialFactory(0xb89783);
  // Abluminal basement membrane is outside the endothelial transport face.
  for(let k=0;k<9;k++) {
    const y=-.57+k*.145,points=[];
    for(let j=0;j<=16;j++) {const z=-.31+j/16*.62;points.push([.60+.009*Math.sin(j*.8+k),y+.012*Math.sin(j+k),z]);}
    tube(g,points,.009,basal,24);
  }
  // Cell-cell junctions are seams at the edges, not pores through the wall.
  [-1,1].forEach(sign=>{
    const points=[];for(let j=0;j<=25;j++){const t=j/25;points.push([-.51+t*1.05,sign*(.575+.015*Math.sin(t*9)),-.27]);}
    tube(g,points,.012,junction,36);
  });
  sphere(g,[.66,-.35,-.22],[.055,.15,.08],pericyte,28);
  [-1,1].forEach(sign=>tube(g,[[.66,-.35,-.22],[.65,-.35+sign*.15,-.23],[.63,-.35+sign*.23,-.12]],.018,pericyte,28));
  // Astrocyte endfeet touch the outer basal layer, leaving the transit path clear.
  [[.34,-.20],[-.46,.16],[.47,.19]].forEach(([y,z],i)=>{
    sphere(g,[.69,y,z],[.068,.13,.10],foot,24);
    tube(g,[[.70,y,z],[.87,y+(i-1)*.10,z-.03],[1.04,y+(i-1)*.15,z-.06]],.025,foot,28);
  });
}
