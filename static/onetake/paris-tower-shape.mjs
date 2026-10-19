// Procedural particle interpretation of the Eiffel Tower, with four tapered
// legs, arches, platforms and lattice faces. Reference proportions:
// https://www.toureiffel.paris/en/the-monument/key-figures (330 m / 125 m).
// This is illustrative geometry, not a surveyed architectural model.
const unique = new Map();
function line(a,b) {
  const n=Math.max(1,Math.ceil(Math.hypot(...a.map((v,i)=>v-b[i]))/.008));
  for(let j=0;j<=n;j++) {
    const p=a.map((v,i)=>v+(b[i]-v)*j/n);
    unique.set(p.map(v=>Math.round(v*10000)).join(','),p);
  }
}
const levels=[[-.55,.2273],[-.45,.171],[-.3427,.121],[-.23,.087],[-.1318,.065],[0,.045],[.16,.030],[.31,.020],[.454,.012],[.50,.007]];
const face=(axis,x,y,z) => axis===0?[x,y,z]:[z,y,x];
// Four actual legs, including the inner edge of each steel column.
for(const sx of [-1,1]) for(const sz of [-1,1]) {
  for(let i=1;i<levels.length;i++) {
    const [ya,wa]=levels[i-1],[yb,wb]=levels[i];
    line([sx*wa,ya,sz*wa],[sx*wb,yb,sz*wb]);
    const ta=Math.max(.002,wa*.16),tb=Math.max(.002,wb*.16);
    line([sx*(wa-ta),ya,sz*(wa-ta)],[sx*(wb-tb),yb,sz*(wb-tb)]);
    // Cross braces in each lower leg, keeping the central arch opening clear.
    if(i<=2) {
      line([sx*wa,ya,sz*wa],[sx*(wb-tb),yb,sz*(wb-tb)]);
      line([sx*(wa-ta),ya,sz*(wa-ta)],[sx*wb,yb,sz*wb]);
    }
  }
  // Solid-looking foot pads, still made from individual particles.
  for(const dy of [0,.006]) {
    const w=.2273,y=-.55+dy,r=.017;
    line([sx*w-r,y,sz*w-r],[sx*w+r,y,sz*w-r]);
    line([sx*w-r,y,sz*w+r],[sx*w+r,y,sz*w+r]);
  }
}
// Dense X lattice on all four faces above the first platform.
for(let i=3;i<levels.length;i++) {
  const [ya,wa]=levels[i-1],[yb,wb]=levels[i];
  const subdivisions=Math.max(1,Math.ceil((yb-ya)/.065));
  for(let k=0;k<subdivisions;k++) {
    const a=k/subdivisions,b=(k+1)/subdivisions;
    const y0=ya+(yb-ya)*a,y1=ya+(yb-ya)*b,w0=wa+(wb-wa)*a,w1=wa+(wb-wa)*b;
    for(const axis of [0,1]) for(const side of [-1,1]) {
      line(face(axis,-w0,y0,side*w0),face(axis,w1,y1,side*w1));
      line(face(axis,w0,y0,side*w0),face(axis,-w1,y1,side*w1));
      line(face(axis,-w0,y0,side*w0),face(axis,w0,y0,side*w0));
    }
  }
}
// Four curved arch faces beneath the first floor.
for(const axis of [0,1]) for(const side of [-1,1]) {
  let previous;
  for(let i=0;i<=44;i++) {
    const x=-.17+.34*i/44,y=-.55+.17*Math.sqrt(Math.max(0,1-(x/.17)**2));
    const p=face(axis,x,y,side*.16);
    if(previous)line(previous,p);
    previous=p;
  }
}
// Observation decks: horizontal bands and railings at the three levels.
for(const [y,w] of [[-.3427,.137],[-.1318,.078],[.454,.026]]) {
  for(const dy of [-.009,0,.009,.021]) for(const axis of [0,1]) for(const side of [-1,1])
    line(face(axis,-w,y+dy,side*w),face(axis,w,y+dy,side*w));
  for(const axis of [0,1]) for(const side of [-1,1]) for(let j=0;j<=8;j++) {
    const x=-w+2*w*j/8;
    line(face(axis,x,y+.009,side*w),face(axis,x,y+.021,side*w));
  }
}
line([0,.50,0],[0,.65,0]);
line([-.007,.50,0],[0,.57,0]);line([.007,.50,0],[0,.57,0]);
const all=[...unique.values()];
const sample=(points,count)=>Array.from({length:Math.min(count,points.length)},(_,i)=>points[Math.floor(i*points.length/Math.min(count,points.length))]);
export const TOWER_POINTS=sample(all,1600);
// Small background towers need fewer samples than the large first tower.
export const FAR_TOWER_POINTS=sample(TOWER_POINTS,360);
export const CITY_DOTS=TOWER_POINTS.length;
export const FAR_CITY_DOTS=FAR_TOWER_POINTS.length;
