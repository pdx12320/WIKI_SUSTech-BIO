export const SNOW_WIDTH=160,SNOW_HEIGHT=100;
const hash=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};
const mix=(a,b,t)=>a+(b-a)*t;
const colors=[[231,98,147],[239,171,78],[204,215,96],[83,203,155],[76,184,223],[126,112,226],[209,102,211]];
export function paintCoarseSnow(data,now,reception){
  const beat=Math.floor(now/460),tick=Math.floor(now/95),band=Math.floor(now/80)%120-10;
  const burst=now%2400<640?.72:.28;
  for(let y=0;y<SNOW_HEIGHT;y++)for(let x=0;x<SNOW_WIDTH;x++){
    const i=(y*SNOW_WIDTH+x)*4,row=Math.floor(y/7),cell=Math.floor(x/9),fragment=row+beat*29;
    const origin=Math.floor(hash(fragment)*142),width=6+Math.floor(hash(fragment+19)*18);
    const colored=x>=origin&&x<origin+width&&y%7<2+hash(fragment+41)*4&&hash(fragment+61)>.2;
    const column=Math.floor((x-origin)/3),color=colored?colors[(column+row)%7]:null;
    const faultCenter=band+Math.floor(hash(cell+beat*7)*46)-23;
    const tear=Math.abs(y-faultCenter)<1+hash(cell+9)*2?(28+hash(cell+beat)*60)*(1-reception):0;
    // Fine snow is now visibly pixel-sized; larger cells drop out independently.
    const block=hash(Math.floor(x/4)+Math.floor(y/3)*41+tick*173);
    const grain=hash(x+y*SNOW_WIDTH+tick*17011);
    const v=(grain>.78?210:grain<.3?12:grain*155)+(block>.88?70:block<.13?-40:0);
    const strength=color?burst*(.6+grain*.5)*(1-reception):0;
    // Strengthen pale snow cells without lifting the dark purple gaps.
    const highlight=1+Math.max(0,Math.min(1,(v-150)/60))*.24;
    const level=Math.max(0,Math.min(255,v*highlight))*(1-reception*.68);
    data[i]=mix(level*.85+tear,color?.[0]??0,strength);
    data[i+1]=mix(level*.68+tear,color?.[1]??0,strength);
    data[i+2]=mix(level+tear,color?.[2]??0,strength);
    data[i+3]=255;
  }
}
