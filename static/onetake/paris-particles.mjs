// Existing Aβ vertices become one city; the shared camera pulls back to reveal
// the surrounding city groups. No independent overlay or replacement cloud.
import { TOWER_POINTS, CITY_DOTS, FAR_TOWER_POINTS, FAR_CITY_DOTS } from './paris-tower-shape.mjs';
const clamp = v => Math.max(0, Math.min(1, v));
const smooth = v => { const t = clamp(v); return t * t * (3 - 2 * t); };
const smoother = v => { const t = clamp(v); return t*t*t*(t*(t*6-15)+10); };
export function particlePhase(take) {
  return {
    form: smooth((take - .737) / .015),
    depart: smooth((take - .783) / .021),
    opacity: smooth((take - .737) / .015) * (1 - smooth((take - .789) / .016)),
    cities: 1 + 26 * smooth((take - .760) / .011),
    zoom: smoother((take - .758) / .013),
    cameraMix: smooth((take - .738) / .014) * (1 - smooth((take - .782) / .025)),
    backdrop: 1 - .95 * smooth((take - .738) / .014) * (1 - smooth((take - .790) / .020)),
  };
}
export function createParisParticles(THREE, scene, root, anchorPosition, anchorLook) {
  if (!root.querySelector('[data-burden-paris]')) return { update() {}, camera() {}, backdrop() { return 1; } };
  const amyloid = scene.getObjectByName('extracellular-amyloid');
  const label = root.querySelector('[data-bio-label="amyloid"]');
  // Centre first, then expand outwards as the lens retreats.
  const cells = Array.from({length:27}, (_,i) => ({x:i%9-4,y:1-Math.floor(i/9)}))
    .sort((a,b) => a.x*a.x+a.y*a.y-b.x*b.x-b.y*b.y);
  const hash = i => { const n=Math.sin(i*127.1+311.7)*43758.5453; return n-Math.floor(n); };
  const positionFor = (c,d) => {
    const p=(c===0 ? TOWER_POINTS : FAR_TOWER_POINTS)[d];
    return [cells[c].x+p[0],cells[c].y*1.5+p[1],p[2]+(c===0 ? 0 : Math.sin(c*1.7)*.45)];
  };
  // The first city is the existing amyloid object, retaining all its vertices.
  // Remaining cities use the same tower silhouette; final tower has reduced brightness.
  const count = 26*FAR_CITY_DOTS;
  const target=new Float32Array(count*3), cloud=new Float32Array(count*3), city=new Float32Array(count);
  for(let i=0;i<count;i++) {
    const c=1+Math.floor(i/FAR_CITY_DOTS),d=i%FAR_CITY_DOTS;
    target.set(positionFor(c,d),i*3);city[i]=c;
    cloud.set([(hash(i+10)-.5)*15,(hash(i+20)-.5)*10,(hash(i+30)-.5)*10],i*3);
  }
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.BufferAttribute(target,3));
  geometry.setAttribute('aCloud',new THREE.BufferAttribute(cloud,3));
  geometry.setAttribute('aCity',new THREE.BufferAttribute(city,1));
  const uniforms={uDepart:{value:0},uOpacity:{value:0},uCities:{value:1},uPixelRatio:{value:1},uPointSize:{value:3.3}};
  const material=new THREE.ShaderMaterial({uniforms,transparent:true,depthWrite:false,depthTest:true,blending:THREE.AdditiveBlending,
    vertexShader:`
      attribute vec3 aCloud; attribute float aCity;
      uniform float uDepart,uCities,uPixelRatio,uPointSize;
      varying float vAlpha;
      void main(){
        vec3 p=position+(aCloud*.7+vec3(-5.,0.,-5.))*uDepart;
        vec4 mv=modelViewMatrix*vec4(p,1.);
        gl_Position=projectionMatrix*mv;
        gl_PointSize=clamp(uPointSize*uPixelRatio*12./max(1.,-mv.z),1.,8.*uPixelRatio);
        vAlpha=clamp(uCities-aCity,0.,1.)*mix(1.,.72,step(25.5,aCity));
      }`,
    fragmentShader:`
      uniform float uOpacity; varying float vAlpha;
      void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;
        gl_FragColor=vec4(vec3(1.,.4156863,.3333333)*1.2,exp(-r*r*4.5)*vAlpha*uOpacity);}
    `});
  const points=new THREE.Points(geometry,material);points.name='paris-population-world-particles';points.frustumCulled=false;
  const group=new THREE.Group();group.add(points);scene.add(group);
  const anchor=new THREE.PerspectiveCamera(38,1,.1,200);
  const forward=new THREE.Vector3(),up=new THREE.Vector3(),screenOffset=new THREE.Vector3(),cameraPosition=new THREE.Vector3(),cameraLook=new THREE.Vector3();
  let aspect=0;
  const sourceCount=amyloid?.geometry.attributes.position.count || 0;
  const matrixPositions=new Float32Array(sourceCount*3);
  if(amyloid) amyloid.geometry.setAttribute('aParis',new THREE.BufferAttribute(matrixPositions,3));
  function place(){
    aspect=innerWidth/innerHeight;
    anchor.position.copy(anchorPosition).sub(anchorLook).multiplyScalar(Math.max(1,1.15/aspect)).add(anchorLook);
    anchor.lookAt(anchorLook);anchor.updateMatrixWorld();
    const frameH=24*Math.tan(19*Math.PI/180),frameW=frameH*aspect,mobile=innerWidth<=760;
    const right=new THREE.Vector3(1,0,0).applyQuaternion(anchor.quaternion);
    up.set(0,1,0).applyQuaternion(anchor.quaternion);
    forward.set(0,0,-1).applyQuaternion(anchor.quaternion);
    screenOffset.copy(right).multiplyScalar(mobile?0:frameW*.20).addScaledVector(up,mobile?-frameH*.20:0);
    group.position.copy(anchor.position).addScaledVector(forward,12).add(screenOffset);
    group.quaternion.copy(anchor.quaternion);group.rotateY(-.17);
    group.scale.setScalar(frameW*(mobile ? .80 : .40)/8.8);group.updateMatrixWorld(true);
    const v=new THREE.Vector3();
    for(let i=0;i<sourceCount;i++) {
      // Same tower sites, with subpixel spread instead of deleting vertices.
      const p=positionFor(0,Math.floor(i*CITY_DOTS/sourceCount));
      v.set(p[0]+(hash(i)-.5)*.003,p[1]+(hash(i+1)-.5)*.003,p[2]).applyMatrix4(group.matrixWorld);
      matrixPositions.set(v.toArray(),i*3);
    }
    if(amyloid) amyloid.geometry.attributes.aParis.needsUpdate=true;
    uniforms.uPixelRatio.value=Math.min(devicePixelRatio||1,mobile?1.5:1.75);
    uniforms.uPointSize.value=mobile?2.4:3.3;
  }
  place();root.classList.add('has-paris-particles');
  return {
    backdrop(take){return particlePhase(take).backdrop;},
    camera(take,position,look){
      if(Math.abs(innerWidth/innerHeight-aspect)>.001)place();
      const phase=particlePhase(take);
      // Frame the original tower at more than half the viewport height,
      // then retreat to the unchanged 27-city view around that same tower.
      const heightFraction=innerWidth<=760 ? .54 : .72;
      const closeDistance=group.scale.x*1.2/(2*Math.tan(19*Math.PI/180)*heightFraction)*1.055;
      const distance=closeDistance*Math.exp(Math.log(12/closeDistance)*phase.zoom);
      cameraPosition.copy(group.position).addScaledVector(forward,-distance).addScaledVector(screenOffset,-distance/12);
      if(innerWidth>760) cameraPosition.addScaledVector(up,distance*2*Math.tan(19*Math.PI/180)*.055*(1-phase.zoom));
      cameraLook.copy(cameraPosition).addScaledVector(forward,12);
      position.lerp(cameraPosition,phase.cameraMix);look.lerp(cameraLook,phase.cameraMix);
    },
    update(take){
      if(Math.abs(innerWidth/innerHeight-aspect)>.001)place();
      const phase=particlePhase(take),isStatic=root.classList.contains('ot--static');
      group.visible=phase.opacity>.001&&!isStatic;
      uniforms.uDepart.value=phase.depart;uniforms.uOpacity.value=phase.opacity*210/FAR_CITY_DOTS;uniforms.uCities.value=phase.cities;
      if(amyloid){
        const u=amyloid.material.uniforms;
        u.uParisMorph.value=phase.form;
        const originalOpacity=u.uOpacity.value;
        // Blend the existing cloud to a density-normalized orange tower.
        u.uOpacity.value=originalOpacity*(1-phase.form)+(320/sourceCount)*(1.15+2*(1-phase.zoom))*phase.form*(1-phase.depart);
        u.uSize.value=2.1+(uniforms.uPointSize.value-2.1)*phase.form;
        amyloid.visible=!isStatic&&u.uOpacity.value>.00001;
        if(label?.style&&phase.form>0)label.style.opacity=String((1-phase.form)*Number(label.style.opacity||0));
      }
    },
  };
}
