/* Geographic renderer retained and adapted from the user's August 2026 B version. */
// ===== EAST ASIA MAP (flat Mercator) =====
const NEIGHBOR_IDS=new Set(['410','408','496','643','704','116','418','524','356','050','104','764','608','458']);
const CHINA_IDS=new Set(['156']);
const FOCUS_IDS={japan:'392'};
const CALLOUTS={
  hongkong:{lon:114.17,lat:22.3,dx:92,dy:18,r:22},
  ial:{lon:114.17,lat:22.3,dx:-90,dy:68,r:22}
};
let mapFeatures={neighbors:[],china:[],redContext:[],japan:null};
(function loadMapFeatures(){
  try{
    const topo=window.BIOSCOPE_TOPOLOGY;
    if(!topo||!window.topojson||!window.d3)return;
    const all=topojson.feature(topo,topo.objects.countries).features;
    all.forEach(f=>{
      const id=String(f.id);
      if(CHINA_IDS.has(id))mapFeatures.china.push(f);
      else if(id==='158')mapFeatures.redContext.push(f);
      else if(id===FOCUS_IDS.japan)mapFeatures.japan=f;
      else if(NEIGHBOR_IDS.has(id))mapFeatures.neighbors.push(f);
    });
  }catch(e){console.warn('Map topology unavailable',e)}
})();

// ===== FLAT EAST ASIA MAP =====
const gC=document.getElementById('globe-c'),gX=gC.getContext('2d');
const gW2=document.getElementById('globe-wrap');
let gW,gH,cX,cY;
let cam={x:0,y:0,k:1};
let hoveredRegion=null;
let regionScreenPos={};
let regionHit={};
let projection=null,geoPath=null;

function rGlobe(){
  gW=gW2.clientWidth;gH=gW2.clientHeight;
  const dpr=devicePixelRatio||1;
  gC.width=gW*dpr;gC.height=gH*dpr;
  gC.style.width=gW+'px';gC.style.height=gH+'px';
  gX.setTransform(dpr,0,0,dpr,0,0);
  cX=gW/2;cY=gH/2;
}
rGlobe();addEventListener('resize',()=>{rGlobe();drawGlobe()});

function updateProjection(){
  if(!window.d3)return;
  const base=Math.min(gW,gH)*1.20;
  projection=d3.geoMercator().center([118,33]).scale(base*cam.k).translate([cX+cam.x,cY+cam.y]).clipExtent([[-40,-40],[gW+40,gH+40]]);
  geoPath=d3.geoPath(projection,gX);
}

function drawFeature(feat,fill,stroke,lw,glow){
  if(!feat||!geoPath)return;
  gX.beginPath();geoPath(feat);
  if(glow){gX.shadowColor=glow;gX.shadowBlur=0}
  gX.fillStyle=fill;gX.fill();gX.shadowBlur=0;
  gX.strokeStyle=stroke;gX.lineWidth=lw;gX.stroke();
}

function drawCallout(key,fill,stroke){
  const c=CALLOUTS[key];if(!projection)return;
  const p=projection([c.lon,c.lat]);if(!p)return;
  const compact=gW<600;
  const dx=compact&&key==='ial'?-70:c.dx;
  const dy=compact&&key==='ial'?38:c.dy;
  const ax=p[0],ay=p[1],bx=ax+dx,by=ay+dy,hov=hoveredRegion===key;
  const pulse=1;
  gX.beginPath();gX.moveTo(ax,ay);gX.lineTo(bx,by);
  gX.strokeStyle=hov?stroke:'rgba(248,250,252,.28)';gX.lineWidth=hov?1.6:1;gX.stroke();
  gX.beginPath();gX.arc(ax,ay,3.2,0,Math.PI*2);gX.fillStyle=stroke;gX.fill();
  const r=c.r*pulse*(hov?1.12:1);

  gX.beginPath();gX.arc(bx,by,r,0,Math.PI*2);
  gX.fillStyle=fill;gX.fill();gX.strokeStyle=stroke;gX.lineWidth=hov?2.2:1.4;gX.stroke();
  gX.beginPath();gX.arc(bx,by,4,0,Math.PI*2);gX.fillStyle='#fff';gX.fill();
  regionScreenPos[key]={px:bx,py:by,s:1};
  regionHit[key]={type:'circle',x:bx,y:by,r:r+10,pinX:ax,pinY:ay};
}

function drawMarker(px,py,hov){

  gX.beginPath();gX.arc(px,py,4,0,Math.PI*2);gX.fillStyle=hov?'#FF2D78':'#A855F7';gX.fill();
  gX.beginPath();gX.arc(px,py,1.8,0,Math.PI*2);gX.fillStyle='#fff';gX.fill();
}

function placeLabel(key,px,py,ox,oy){
  const on=px>8&&py>8&&px<gW-8&&py<gH-8;
  const lbl=document.getElementById('rl-'+key);
  if(!lbl)return;
  if(!on){lbl.classList.remove('vis');return}
  const width=lbl.offsetWidth||130,height=lbl.offsetHeight||40;
  lbl.style.left=Math.max(8,Math.min(gW-width-8,px+ox))+'px';
  lbl.style.top=Math.max(54,Math.min(gH-height-30,py+oy))+'px';
  lbl.classList.add('vis');lbl.classList.toggle('hi',hoveredRegion===key);
}

function drawGlobe(){
  gX.clearRect(0,0,gW,gH);

  updateProjection();
  regionScreenPos={};regionHit={};

  const ocean='#0b0616';
  gX.fillStyle=ocean;gX.fillRect(0,0,gW,gH);
  // Soft circular violet light sits behind the geographic features.
  const orbRadius=Math.min(gW,gH)*.48;
  for(const [x,y,scale] of [[gW*.22,gH*.28,1],[gW*.86,gH*.73,.8]]){
    const r=orbRadius*scale,light=gX.createRadialGradient(x-r*.18,y-r*.18,r*.06,x,y,r);
    light.addColorStop(0,'rgba(190,133,248,.13)');light.addColorStop(.65,'rgba(133,72,192,.08)');
    light.addColorStop(.84,'rgba(160,99,221,.10)');light.addColorStop(1,'rgba(133,72,192,0)');
    gX.fillStyle=light;gX.beginPath();gX.arc(x,y,r,0,Math.PI*2);gX.fill();
  }



  if(window.d3&&geoPath){
    gX.save();
    gX.strokeStyle='rgba(166,112,222,.15)';gX.lineWidth=.6;
    gX.beginPath();geoPath(d3.geoGraticule().extent([[70,10],[155,56]]).step([10,10])());gX.stroke();
    mapFeatures.neighbors.forEach(f=>drawFeature(f,'rgba(90,70,150,.16)','rgba(108,60,224,.18)',.7,null));
    // Geographic coloring only: no curriculum marker or target hit area.
    mapFeatures.redContext.forEach(f=>drawFeature(f,'rgba(239,68,68,.2)','rgba(239,68,68,.5)',1.3,null));
    const ch=hoveredRegion==='china';
    mapFeatures.china.forEach(f=>drawFeature(f,ch?'rgba(239,68,68,.38)':'rgba(239,68,68,.2)',ch?'rgba(239,68,68,.85)':'rgba(239,68,68,.5)',ch?2:1.3,ch?'rgba(239,68,68,.35)':null));
    const jh=hoveredRegion==='japan';
    if(mapFeatures.japan)drawFeature(mapFeatures.japan,jh?'rgba(99,102,241,.4)':'rgba(99,102,241,.22)',jh?'rgba(99,102,241,.9)':'rgba(99,102,241,.55)',jh?2:1.3,jh?'rgba(99,102,241,.35)':null);
    gX.restore();
  }

  drawCallout('hongkong',hoveredRegion==='hongkong'?'rgba(245,158,11,.42)':'rgba(245,158,11,.22)',hoveredRegion==='hongkong'?'#F59E0B':'rgba(245,158,11,.85)');
  drawCallout('ial',hoveredRegion==='ial'?'rgba(16,185,129,.42)':'rgba(16,185,129,.22)',hoveredRegion==='ial'?'#10B981':'rgba(16,185,129,.85)');

  const centers={china:[104,36],japan:[138,36]};
  Object.entries(centers).forEach(([key,ll])=>{
    if(!projection)return;
    const p=projection(ll);if(!p)return;
    regionScreenPos[key]={px:p[0],py:p[1],s:1};
    regionHit[key]={type:'feature',id:key};
    drawMarker(p[0],p[1],hoveredRegion===key);
    const ox=gW<600?(key==='china'?-64:-92):16;
    placeLabel(key,p[0],p[1],ox,-12);
  });
  placeLabel('hongkong',regionScreenPos.hongkong?.px||0,regionScreenPos.hongkong?.py||0,16,-10);
  placeLabel('ial',regionScreenPos.ial?.px||0,regionScreenPos.ial?.py||0,16,gW<600?-34:-10);


  drawSelectedRoute();
}

function getRegionAt(mx,my){
  const dist=(x,y)=>Math.hypot(mx-x,my-y);
  for(const key of ['hongkong','ial']){
    const h=regionHit[key];
    if(!h)continue;
    if(dist(h.x,h.y)<h.r||dist(h.pinX,h.pinY)<14)return key;
  }
  if(projection&&window.d3){
    const ll=projection.invert([mx,my]);
    if(ll){
      if(mapFeatures.japan&&d3.geoContains(mapFeatures.japan,ll))return 'japan';
      if(mapFeatures.china.some(f=>d3.geoContains(f,ll)))return 'china';
    }
  }
  let closest=null,minD=Infinity;
  for(const k of ['japan','china']){
    const p=regionScreenPos[k];if(!p)continue;
    const d=dist(p.px,p.py);
    if(d<36&&d<minD){minD=d;closest=k}
  }
  return closest;
}


let routeSelection=null;
function drawSelectedRoute(){
  if(!routeSelection)return;
  const a=regionScreenPos[routeSelection.source],b=regionScreenPos[routeSelection.target];
  if(!a||!b)return;
  const dx=b.px-a.px,dy=b.py-a.py,len=Math.hypot(dx,dy);
  if(len<1)return;
  const ux=dx/len,uy=dy/len,ex=b.px-ux*28,ey=b.py-uy*28;
  gX.save();gX.strokeStyle='#d9d3ff';gX.lineWidth=2;gX.setLineDash([7,6]);
  gX.beginPath();gX.moveTo(a.px+ux*14,a.py+uy*14);gX.lineTo(ex,ey);gX.stroke();gX.setLineDash([]);
  gX.fillStyle='#d9d3ff';gX.beginPath();gX.moveTo(ex,ey);gX.lineTo(ex-ux*10-uy*5,ey-uy*10+ux*5);gX.lineTo(ex-ux*10+uy*5,ey-uy*10-ux*5);gX.closePath();gX.fill();gX.restore();
}
window.BioSphereMap={
  hit:(x,y)=>getRegionAt(x,y),
  highlight:key=>{hoveredRegion=key;drawGlobe()},
  route:(source,target)=>{routeSelection=source&&target?{source,target}:null;drawGlobe()},
  reset:()=>{cam={x:0,y:0,k:1};drawGlobe()},
  zoom:factor=>{cam.k=Math.max(.7,Math.min(4,cam.k*factor));drawGlobe()},
  ready:()=>Boolean(projection&&mapFeatures.china.length&&mapFeatures.japan)
};
let gesture=null;
gC.addEventListener('pointerdown',e=>{
 if(e.button!==0)return;
 gesture={id:e.pointerId,x:e.clientX,y:e.clientY,px:e.clientX,py:e.clientY,moved:false};gC.setPointerCapture(e.pointerId);
});
gC.addEventListener('pointermove',e=>{
 if(!gesture||gesture.id!==e.pointerId)return;
 if(Math.hypot(e.clientX-gesture.x,e.clientY-gesture.y)>6)gesture.moved=true;
 if(gesture.moved){cam.x+=e.clientX-gesture.px;cam.y+=e.clientY-gesture.py;drawGlobe()}
 gesture.px=e.clientX;gesture.py=e.clientY;
});
gC.addEventListener('pointerup',e=>{
 if(!gesture||gesture.id!==e.pointerId)return;
 const moved=gesture.moved;gesture=null;
 if(!moved){const r=gC.getBoundingClientRect();const key=getRegionAt(e.clientX-r.left,e.clientY-r.top);if(key)gC.dispatchEvent(new CustomEvent('regionselect',{detail:key}))}
});
gC.addEventListener('pointercancel',()=>{gesture=null});
gC.addEventListener('wheel',e=>{
 if(!e.ctrlKey&&!e.metaKey)return; // Page scrolling remains available; zoom also has explicit buttons.
 e.preventDefault();const rect=gC.getBoundingClientRect(),mx=e.clientX-rect.left,my=e.clientY-rect.top;
 const k0=cam.k,k1=Math.max(.7,Math.min(4,cam.k*(e.deltaY<0?1.12:1/1.12)));
 cam.x=mx-cX-(mx-cX-cam.x)*(k1/k0);cam.y=my-cY-(my-cY-cam.y)*(k1/k0);cam.k=k1;drawGlobe();
},{passive:false});
// The original first draw precedes routeSelection initialization; perform it after setup.
drawGlobe();
