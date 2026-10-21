// An orthogonal ORCA route is carved into the maze's real passage graph.
// The same route is drawn by the ending; no text outline is overlaid on walls.
const W=43,H=27,GLYPH_ROW_OFFSET=4,DEFAULT_WIDTH=14.6,DEFAULT_HEIGHT=9.3;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function random(seed){let s=seed>>>0;return()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};}
const edgeKey=(a,b)=>a<b?`${a}:${b}`:`${b}:${a}`;

// Reuse the old opening's silhouette as a union of its actual maze cells.
// A finer grid can then carry ORCA without keeping the rectangular corners.
function legacyBrainOutline(originalMaze){
  const nav=originalMaze?.navigation;
  let cells=nav?.adj&&nav?.point?[...nav.adj.keys()].map(key=>nav.point(key)):[];
  const spacing=nav?.spacing||.62;
  if(!cells.length){
    cells=[];
    for(let y=0;y<15;y++)for(let x=0;x<23;x++){
      const p=[(x+.5-23/2)*.62,(y+.5-15/2)*.62];
      if((p[0]/7.1)**2+(p[1]/4.5)**2<1)cells.push(p);
    }
  }
  const half=spacing/2+.005;
  return {contains:(x,y)=>cells.some(p=>Math.abs(x-p[0])<=half&&Math.abs(y-p[1])<=half),
    sourceBounds:{left:Math.min(...cells.map(p=>p[0]))-spacing/2,right:Math.max(...cells.map(p=>p[0]))+spacing/2,
      bottom:.2+Math.min(...cells.map(p=>p[1]))-spacing/2,top:.2+Math.max(...cells.map(p=>p[1]))+spacing/2},
    sourceCellCount:cells.length};
}

// Match local regions while preserving every source particle's index. The
// original shape arrays are never changed or substituted during this match.
function localCorrespondence(source,target,count){
  if(!source||source.length<count*3)return target;
  const a=Array.from({length:count},(_,i)=>i),b=a.slice(),out=new Float32Array(count*3);
  function partition(lo,hi,depth){
    const axis=depth%2;
    const sort=(ids,data)=>{const sorted=ids.slice(lo,hi).sort((i,j)=>data[i*3+axis]-data[j*3+axis]);for(let k=lo;k<hi;k++)ids[k]=sorted[k-lo];};
    sort(a,source);sort(b,target);
    if(hi-lo>48){const mid=(lo+hi)>>1;partition(lo,mid,depth+1);partition(mid,hi,depth+1);}
    else for(let i=lo;i<hi;i++)out.set(target.subarray(b[i]*3,b[i]*3+3),a[i]*3);
  }
  partition(0,count,0);return out;
}

export function createMemoryOrcaMaze(originalMaze,{count=originalMaze?.meta?.length||4096,seed=112,width=DEFAULT_WIDTH,height=DEFAULT_HEIGHT}={}){
  count=Math.max(1,Math.floor(count));
  const sx=width/W,sy=height/H,rnd=random(seed);
  const id=(x,y)=>y*W+x,cell=id=>[id%W,Math.floor(id/W)];
  const point=key=>{const [x,y]=cell(key);return [(x+.5-W/2)*sx,(H/2-y-.5)*sy];};
  const bowl=originalMaze?.navigation?.bowl||(()=>0);
  const outline=legacyBrainOutline(originalMaze);
  const inside=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&outline.contains(...point(id(x,y)));
  const adj=new Map(),open=new Set();
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(inside(x,y))adj.set(id(x,y),[]);
  function link(a,b){const key=edgeKey(a,b);if(open.has(key))return;open.add(key);adj.get(a).push(b);adj.get(b).push(a);}
  const ids=[],emphasis=[],semantics=[],glyphs=[];
  function append(waypoints,weight,kind,letter=null){
    waypoints=waypoints.map(([x,y])=>[x,y+GLYPH_ROW_OFFSET]);
    const start=Math.max(0,ids.length-1);
    for(let k=0;k<waypoints.length;k++){
      const [x,y]=waypoints[k];
      if(k===0){
        if(!ids.length){ids.push(id(x,y));emphasis.push(weight);}
        else if(ids.at(-1)!==id(x,y))throw new Error('ORCA route sections must share an endpoint.');
        if(kind==='glyph')emphasis[emphasis.length-1]=1;
        continue;
      }
      const [px,py]=waypoints[k-1];
      if(px!==x&&py!==y)throw new Error('ORCA maze routes must be orthogonal.');
      const dx=Math.sign(x-px),dy=Math.sign(y-py),steps=Math.abs(x-px)+Math.abs(y-py);
      for(let t=1;t<=steps;t++){
        const key=id(px+dx*t,py+dy*t);
        if(!adj.has(key))throw new Error('The ORCA route must stay inside the original brain silhouette.');
        link(ids.at(-1),key);ids.push(key);emphasis.push(weight);
      }
    }
    const section={kind,letter,startIndex:start,endIndex:ids.length-1};semantics.push(section);
    if(kind==='glyph')glyphs.push({...section,letter});
  }
  // Seven-column, eleven-row block letters. Connections alternate above and
  // below the word. Only the R leg uses a square staircase, never a diagonal.
  append([[0,9],[3,9],[3,4]],.18,'entry');
  append([[3,4],[9,4],[9,14],[3,14],[3,4],[9,4]],1,'glyph','O');
  append([[9,4],[13,4]],.18,'connector');
  append([[13,4],[19,4],[19,9],[13,9],[13,4],[13,14],[13,9],
    [14,9],[14,10],[15,10],[15,11],[16,11],[16,12],[17,12],[17,13],[18,13],[18,14],[19,14]],1,'glyph','R');
  append([[19,14],[21,14],[21,16],[31,16],[31,14],[29,14]],.18,'connector');
  append([[29,14],[23,14],[23,4],[29,4]],1,'glyph','C');
  append([[29,4],[33,4]],.18,'connector');
  append([[33,4],[33,14],[33,9],[39,9],[39,4],[33,4],[39,4],[39,14]],1,'glyph','A');
  append([[39,14],[39,9],[42,9]],.18,'exit');

  // Grow side passages from the carved route. They form real branches and
  // dead ends without introducing new shortcuts through a letter's strokes.
  const visited=new Set(ids),frontier=[];
  const neighbours=key=>{const [x,y]=cell(key);return [[x-1,y],[x+1,y],[x,y-1],[x,y+1]].filter(([a,b])=>inside(a,b)).map(([a,b])=>id(a,b));};
  function extend(key){for(const next of neighbours(key))if(!visited.has(next))frontier.push([key,next]);}
  for(const key of visited)extend(key);
  while(frontier.length){
    const index=Math.floor(rnd()*frontier.length),[from,to]=frontier[index];frontier[index]=frontier.at(-1);frontier.pop();
    if(visited.has(to))continue;link(from,to);visited.add(to);extend(to);
  }

  const walls=[];
  const wall=(x0,y0,x1,y1)=>walls.push([x0,y0,x1,y1]);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    if(!inside(x,y))continue;
    const key=id(x,y),x0=(x-W/2)*sx,x1=x0+sx,y0=(H/2-y)*sy,y1=y0-sy;
    if(!inside(x-1,y)&&key!==ids[0])wall(x0,y0,x0,y1);
    if(!inside(x,y-1))wall(x0,y0,x1,y0);
    if(!inside(x+1,y)){if(key!==ids.at(-1))wall(x1,y0,x1,y1);}
    else if(!open.has(edgeKey(key,id(x+1,y))))wall(x1,y0,x1,y1);
    if(!inside(x,y+1)||!open.has(edgeKey(key,id(x,y+1))))wall(x0,y1,x1,y1);
  }
  const points=ids.map(key=>{const [x,y]=point(key);return [x,y+.2,bowl(x,y)+.075];}),distance=[0];
  for(let i=1;i<points.length;i++)distance.push(distance[i-1]+Math.hypot(...points[i].map((v,j)=>v-points[i-1][j])));
  const length=distance.at(-1);
  for(const glyph of glyphs){
    glyph.from=distance[glyph.startIndex]/length;glyph.to=distance[glyph.endIndex]/length;
    const local=points.slice(glyph.startIndex,glyph.endIndex+1);
    glyph.bounds={left:Math.min(...local.map(p=>p[0])),right:Math.max(...local.map(p=>p[0])),bottom:Math.min(...local.map(p=>p[1])),top:Math.max(...local.map(p=>p[1]))};
  }
  const route={ids,points,distance,length,emphasis,semantics,glyphRanges:glyphs};
  const navigation={adj,path:ids,point,spacing:(sx+sy)/2,bowl,endingRoute:route,width:W,height:H,spacingX:sx,spacingY:sy,glyphRowOffset:GLYPH_ROW_OFFSET,inside};
  const cumulative=[0];
  for(const segment of walls)cumulative.push(cumulative.at(-1)+Math.hypot(segment[2]-segment[0],segment[3]-segment[1]));
  const total=cumulative.at(-1),sampled=new Float32Array(count*3);
  for(let i=0;i<count;i++){
    const at=(i+rnd())/count*total;let lo=0,hi=walls.length-1;
    while(lo<hi){const mid=(lo+hi)>>1;if(cumulative[mid+1]<at)lo=mid+1;else hi=mid;}
    const g=walls[lo],t=clamp((at-cumulative[lo])/(cumulative[lo+1]-cumulative[lo]),0,1);
    const x=g[0]+(g[2]-g[0])*t+(rnd()-.5)*.012,y=g[1]+(g[3]-g[1])*t+(rnd()-.5)*.012;
    sampled.set([x,y+.2,bowl(x,y)+(rnd()-.5)*.025],i*3);
  }
  return {pos:localCorrespondence(originalMaze?.pos,sampled,count),meta:new Float32Array(count).fill(-1),navigation,route,walls,glyphs,
    bounds:{left:-width/2,right:width/2,bottom:.2-height/2,top:.2+height/2,width,height},
    outline:{kind:'original-memory-maze',...outline},source:'original brain-silhouette passage graph with a continuous ORCA route'};
}

export function sampleMemoryOrcaEmphasis(route,progress){
  const at=clamp(progress,0,1)*route.length;let i=1;
  while(i<route.distance.length-1&&route.distance[i]<at)i++;
  const t=clamp((at-route.distance[i-1])/Math.max(1e-8,route.distance[i]-route.distance[i-1]),0,1);
  return route.emphasis[i-1]+(route.emphasis[i]-route.emphasis[i-1])*t;
}

export function memoryOrcaRouteSvg(shape){
  const {left,top,width,height}=shape.bounds,scale=65,pad=22;
  const xy=(x,y)=>[(x-left)*scale+pad,(top-y)*scale+pad];
  const path=shape.route.points.map(([x,y],i)=>`${i?'L':'M'}${xy(x,y).map(v=>v.toFixed(2)).join(' ')}`).join('');
  const wallPaths=shape.walls.map(([x0,y0,x1,y1])=>`M${xy(x0,y0+.2).join(' ')}L${xy(x1,y1+.2).join(' ')}`).join('');
  const glyphPaths=shape.glyphs.map(g=>{const points=shape.route.points.slice(g.startIndex,g.endIndex+1);return `<path d="${points.map(([x,y],i)=>`${i?'L':'M'}${xy(x,y).join(' ')}`).join('')}"/>`;}).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width*scale+pad*2} ${height*scale+pad*2}" role="img" aria-label="Orthogonal ORCA route inside the original brain-shaped memory maze"><rect width="100%" height="100%" fill="#07101f"/><path d="${wallPaths}" fill="none" stroke="#8294bc" stroke-width=".8" opacity=".55"/><path d="${path}" fill="none" stroke="#ffcc88" stroke-width="1.8" opacity=".2"/><g fill="none" stroke="#ffcc88" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${glyphPaths}</g></svg>`;
}
