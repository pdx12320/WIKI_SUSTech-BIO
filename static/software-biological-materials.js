/* Material-only treatment for the two delivery mechanism scenes.
 * Original procedural textures; no extra meshes, displacement or external assets.
 * Colors remain illustrative identifiers, not natural microscopy colors.
 */
import * as THREE from './vendor/three/three.module.js';

const PROFILES = {
  cytoplasm: {roughness:.80,specularIntensity:.13,ior:1.36,bumpScale:.0006,grain:.055,mottle:.065},
  membrane: {roughness:.56,specularIntensity:.27,ior:1.40,bumpScale:.0012,grain:.035,mottle:.035},
  nucleus: {roughness:.84,specularIntensity:.14,ior:1.38,bumpScale:.0018,grain:.075,mottle:.085},
  chromatin: {roughness:.88,specularIntensity:.11,ior:1.40,bumpScale:.0018,grain:.065,mottle:.055},
  protein: {roughness:.83,specularIntensity:.16,ior:1.42,bumpScale:.0016,grain:.090,mottle:.045},
  blood: {roughness:.49,specularIntensity:.26,ior:1.39,bumpScale:.0005,grain:.025,mottle:.035},
  organelle: {roughness:.68,specularIntensity:.22,ior:1.39,bumpScale:.0013,grain:.050,mottle:.065},
  matrix: {roughness:.92,specularIntensity:.10,ior:1.42,bumpScale:.0018,grain:.070,mottle:.070,fibres:true},
  rna: {roughness:.76,specularIntensity:.19,ior:1.41,bumpScale:.0006,grain:.030,mottle:.025},
  guide: {roughness:.90,specularIntensity:.08,ior:1.40,bumpScale:0,grain:0,mottle:0}
};
const ROLES = new Map();
function role(name, entries) {for(const [color,tint] of entries)ROLES.set(color,{name,tint});}
role('cytoplasm',[[0x469b9c,0x8da49e],[0x6fa79c,0x9cad9f]]);
role('membrane',[[0x4f9997,0x78978c],[0x8db9ad,0xb8c3ae],[0x399e9a,0x83a394],
  [0x408f89,0x74958a],[0x3c8d82,0x64867b],[0x88b9a9,0xa3b8a7],[0x84b3a3,0xa0b4a1],
  [0x509f94,0x96ad9b],[0x735093,0x8a748c],[0x496e69,0x617a70]]);
role('nucleus',[[0x9570b7,0xa38ca5],[0x987bb3,0xa38fa6],[0xbd9acf,0xc0afbd],[0x76548e,0x806880]]);
role('chromatin',[[0x735095,0x89718f],[0xb576aa,0xab8d9f],[0xc9a6ca,0xbba7b6],[0x9a7ca9,0xa28da7]]);
role('protein',[[0xc99034,0xb69a6d],[0xf3ce7a,0xcbb892],[0xc48d32,0xb29669],
  [0xd99a4e,0xbb8d6c],[0x9f6323,0x957452],[0x769796,0x81958a],[0xb4c0ae,0xb1b7a0],[0x617f7c,0x728478]]);
role('blood',[[0xb85775,0x9f414b]]);
role('organelle',[[0xae806e,0xa28072],[0x775a58,0x80665e],[0x789f97,0x8c9e8e],
  [0x72a39a,0x8b9f90],[0x8aafaa,0x9aada0],[0xbfa18c,0xb3a18a],
  [0xb69b79,0xac987b],[0x9b9a78,0x9e9f80],[0xb89783,0xaf9886],[0x8fa5b5,0x98a7a4]]);
role('matrix',[[0xc4b8a1,0xc0b6a1]]);
role('rna',[[0x278a84,0x487e73],[0x74b8ae,0x8cafa0],[0xc6b1cf,0xb8a8bb]]);
role('guide',[[0x82709d,0x9786a3],[0x509c90,0x78a092],[0x478f87,0x78a092],
  [0xb58a51,0xb39a76],[0xd39c4a,0xc0a276],[0xc9a05b,0xb9a076],[0x438e85,0x7d9e8c]]);

const textureCache=new Map();
function noise(ix,iy,seed) {
  let n=Math.imul(ix,374761393)^Math.imul(iy,668265263)^seed;
  n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967295;
}
function smoothNoise(x,y,period,seed) {
  const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy;
  const px=Array.isArray(period)?period[0]:period,py=Array.isArray(period)?period[1]:period;
  const a=fx*fx*(3-2*fx),b=fy*fy*(3-2*fy),h=(i,j)=>noise((i+px)%px,(j+py)%py,seed);
  return (1-b)*((1-a)*h(ix,iy)+a*h(ix+1,iy))+b*((1-a)*h(ix,iy+1)+a*h(ix+1,iy+1));
}
function texture(data,size,color=false) {
  const result=new THREE.DataTexture(data,size,size,THREE.RGBAFormat);
  result.wrapS=result.wrapT=THREE.RepeatWrapping;
  result.minFilter=THREE.LinearMipmapLinearFilter;result.magFilter=THREE.LinearFilter;
  result.generateMipmaps=true;result.repeat.set(2,2);result.anisotropy=2;
  if(color)result.colorSpace=THREE.SRGBColorSpace;
  result.needsUpdate=true;return result;
}
function textures(name) {
  if(textureCache.has(name))return textureCache.get(name);
  const p=PROFILES[name],size=128,color=new Uint8Array(size*size*4),height=color.slice(),rough=color.slice(),density=color.slice();
  const byte=x=>Math.round(Math.max(0,Math.min(1,x))*255);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++) {
    const u=x/size,v=y/size,i=(y*size+x)*4;
    const fine=smoothNoise(u*32,v*32,32,8917),broad=smoothNoise(u*5,v*5,5,3121);
    const fibre=p.fibres?smoothNoise(u*32,v*3,[32,3],7719):fine;
    const tone=1-p.mottle*(.55+.45*broad)-p.grain*.24*fine;
    for(let c=0;c<3;c++) {
      color[i+c]=byte(tone);height[i+c]=byte(.35+.40*fibre+.10*broad);
      rough[i+c]=byte(.88+.12*fine);density[i+c]=byte(.94+.06*broad);
    }
    color[i+3]=height[i+3]=rough[i+3]=density[i+3]=255;
  }
  const result={map:texture(color,size,true),bumpMap:texture(height,size),roughnessMap:texture(rough,size),alphaMap:texture(density,size)};
  textureCache.set(name,result);return result;
}

export function biologicalMaterial(color,extra={}) {
  const {name,tint}=ROLES.get(color)||{name:'protein',tint:color};
  const p=PROFILES[name],maps=textures(name);
  // Old uniform roughness values are superseded by each component's own surface.
  const {roughness:legacyRoughness,metalness:legacyMetalness,...state}=extra;
  const material=new THREE.MeshPhysicalMaterial({
    color:tint,roughness:p.roughness,specularIntensity:p.specularIntensity,ior:p.ior,
    sheen:0,...state,
    ...(name==='guide'?{}:{map:maps.map,roughnessMap:maps.roughnessMap}),
    ...(p.bumpScale?{bumpMap:maps.bumpMap,bumpScale:p.bumpScale}:{}),
    ...(state.transparent?{alphaMap:maps.alphaMap}:{}),
    // Keep natural tissue sheen broad; no wet varnish or metallic coating.
    clearcoat:0,metalness:0
  });
  material.userData.biologicalRole=name;material.userData.illustrativeColor=true;
  return material;
}
