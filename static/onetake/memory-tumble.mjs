const tau=Math.PI*2;
const edge=v=>Math.sign(v||1)*Math.max(.16,Math.abs(v));
// A rotating image plane: independent yaw, pitch and roll, including its reverse.
export function memoryTumble(index,phase){
  const direction=index%2?1:-1,seed=index*2.39996;
  const yaw=seed+phase*tau*(.35+(index%5)*.17)*direction;
  const pitch=seed*.71+phase*tau*(.28+(index%4)*.16)*(index%3?1:-1);
  return {
    roll:seed*.3+phase*tau*(.55+(index%6)*.14)*direction,
    stretch:edge(Math.cos(yaw)),squash:edge(Math.cos(pitch)),
    tilt:Math.sin(yaw)*Math.sin(pitch)*.38,
  };
}
