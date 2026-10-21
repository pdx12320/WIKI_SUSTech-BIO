import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {createMemoryOrcaMaze,sampleMemoryOrcaEmphasis,memoryOrcaRouteSvg} from './memory-orca-maze.mjs';

const source=readFileSync(new URL('./onetake.js',import.meta.url),'utf8');
const helpers=source.slice(source.indexOf('const clamp ='),source.indexOf('function astrocyteShape'));
const sorting=source.slice(source.indexOf('function sortShape'),source.indexOf('/* Shaders'));
const legacy=runInNewContext(`const small=true;${helpers}\n${sorting}\nsortShape(mazeShape(4096),4096);`);
const original=Array.from(legacy.pos),shape=createMemoryOrcaMaze(legacy),route=shape.route,nav=shape.navigation;
assert.equal(shape.pos.length,legacy.pos.length);assert.equal(shape.meta.length,legacy.meta.length);
assert.deepEqual(Array.from(legacy.pos),original,'the original maze arrays remain untouched');
assert.equal(nav.endingRoute,route);assert.equal(nav.bowl,legacy.navigation.bowl);
assert.equal(shape.bounds.width,14.6);assert.equal(shape.bounds.height,9.3);
assert.equal(shape.outline.kind,'original-memory-maze');assert.equal(shape.outline.sourceCellCount,legacy.navigation.adj.size);
assert(!nav.adj.has(0)&&!nav.adj.has(nav.width-1),'rectangular top corners are cut away');
assert(nav.adj.size<nav.width*nav.height*.85,'the wall layout follows the original rounded brain silhouette');
for(const key of nav.adj.keys())assert(shape.outline.contains(...nav.point(key)),'new maze cells stay inside the actual legacy outline');
assert.equal(route.points.length,route.ids.length);assert.equal(route.points.length,route.emphasis.length);assert.equal(route.points.length,route.distance.length);
assert.equal(route.length,route.distance.at(-1));assert(route.length>60);
assert(Math.abs(route.points[0][0]+21*14.6/43)<1e-8&&Math.abs(route.points.at(-1)[0]-21*14.6/43)<1e-8,'left/right exits keep the previous anchor spacing');
assert.equal(route.points[0][1],.2);assert.equal(route.points.at(-1)[1],.2);
assert.deepEqual(shape.glyphs.map(g=>g.letter),['O','R','C','A']);
for(let i=1;i<route.ids.length;i++){
 const a=route.ids[i-1],b=route.ids[i];assert(nav.adj.get(a).includes(b),'every gold step is an actual open maze passage');
 const p=route.points[i-1],q=route.points[i];assert(Math.abs(p[0]-q[0])<1e-8||Math.abs(p[1]-q[1])<1e-8,'no diagonal connectors cut through walls or glyphs');
 assert(route.distance[i]>route.distance[i-1]);
 // Check all actual wall segments, not only passage graph membership.
 for(const [x0,y0,x1,y1]of shape.walls){
  const py=p[1]-.2,qy=q[1]-.2;
  if(Math.abs(p[0]-q[0])<1e-8&&Math.abs(y0-y1)<1e-8){
   assert(!(p[0]>Math.min(x0,x1)+1e-8&&p[0]<Math.max(x0,x1)-1e-8&&y0>Math.min(py,qy)+1e-8&&y0<Math.max(py,qy)-1e-8),'vertical gold step crosses no horizontal wall');
  }else if(Math.abs(py-qy)<1e-8&&Math.abs(x0-x1)<1e-8){
   assert(!(py>Math.min(y0,y1)+1e-8&&py<Math.max(y0,y1)-1e-8&&x0>Math.min(p[0],q[0])+1e-8&&x0<Math.max(p[0],q[0])-1e-8),'horizontal gold step crosses no vertical wall');
  }
 }
}
const reached=new Set([route.ids[0]]),queue=[route.ids[0]];
for(let i=0;i<queue.length;i++)for(const next of nav.adj.get(queue[i]))if(!reached.has(next)){reached.add(next);queue.push(next);}
assert.equal(reached.size,nav.adj.size,'all side passages join the same real maze');
assert([...nav.adj.values()].filter(v=>v.length===1).length>100,'the layout retains branch dead ends');
assert(shape.walls.length>800,'the brain silhouette keeps a complex maze rather than four isolated letter outlines');
for(let k=0;k<shape.glyphs.length;k++){
 const g=shape.glyphs[k],vertices=new Set(route.ids.slice(g.startIndex,g.endIndex+1)),x0=[3,13,23,33][k];
 const has=(x,y)=>vertices.has((y+nav.glyphRowOffset)*nav.width+x);
 for(let y=4;y<=14;y++)assert(has(x0,y),`${g.letter} retains a full left stroke`);
 for(let x=x0;x<=x0+6;x++)assert(has(x,4),`${g.letter} retains its square top stroke`);
 if(g.letter==='O'){for(let y=4;y<=14;y++)assert(has(x0+6,y));for(let x=x0;x<=x0+6;x++)assert(has(x,14));assert(!has(x0+3,9),'O has a genuine open counter');}
 if(g.letter==='C')assert(!has(x0+6,9),'C stays visibly open at the right');
 if(g.letter==='A')for(let x=x0;x<=x0+6;x++)assert(has(x,9),'A retains a crossbar');
 if(g.letter==='R'){assert(has(x0+3,12));assert(!has(x0+6,12),'R has a stepped leg rather than a rectangular lower bowl');}
 assert(g.from<g.to&&g.to<=1);assert(route.emphasis.slice(g.startIndex,g.endIndex+1).every(v=>v===1));
 for(let i=g.startIndex;i<=g.endIndex;i++){
  const key=route.ids[i],x=key%nav.width,y=Math.floor(key/nav.width)-nav.glyphRowOffset;
  const oldX=(x+.5-43/2)*14.6/43,oldY=(19/2-y-.5)*6.46/19+.2;
  assert(Math.abs(route.points[i][0]-oldX)<1e-8&&Math.abs(route.points[i][1]-oldY)<.03,'the golden ORCA glyph stays in its original position and shape');
 }
}
assert(route.emphasis.some(v=>v===.18),'connections can remain quieter than the letters');
assert.equal(sampleMemoryOrcaEmphasis(route,-1),route.emphasis[0]);assert.equal(sampleMemoryOrcaEmphasis(route,2),route.emphasis.at(-1));
for(let i=0;i<shape.pos.length;i+=3){
 assert(Number.isFinite(shape.pos[i]));assert(shape.pos[i]>=shape.bounds.left-.01&&shape.pos[i]<=shape.bounds.right+.01);
 assert(shape.pos[i+1]>=shape.bounds.bottom-.01&&shape.pos[i+1]<=shape.bounds.top+.01);
 assert(Math.abs(shape.pos[i+2]-nav.bowl(shape.pos[i],shape.pos[i+1]-.2))<.014,'wall particles preserve the original depth bowl');
}
const repeated=createMemoryOrcaMaze(legacy);assert.deepEqual(shape.pos,repeated.pos);assert.deepEqual(route,repeated.route,'same seed keeps particle targets and route stable');
const svg=memoryOrcaRouteSvg(shape);assert(svg.includes('<svg'));assert(!svg.includes('<text'),'readable ORCA comes from real passage strokes, not overlaid font glyphs');
console.log(`Passed ${shape.pos.length/3} conserved particle indices, original brain silhouette (${nav.adj.size} cells), ${route.ids.length} continuous orthogonal route points, ${shape.walls.length} real maze walls, wall intersection checks, unchanged ORCA glyph topology/position, deterministic branches and retained depth bowl.`);
