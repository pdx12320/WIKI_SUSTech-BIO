// Native anchor remains useful if the optional skip enhancement is unavailable.
export function mountHomeSkip(root,room){
 const link=room.querySelector('[data-memory-skip]');
 link?.addEventListener('click',event=>{
  if(event.button>0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const target=document.getElementById('ot-index-title');
  if(!target)return;
  event.preventDefault();
  if(location.hash!=='#ot-index-title')history.pushState(null,'','#ot-index-title');
  target.scrollIntoView({behavior:'instant',block:'start'});
  // Sync the animation clock to the destination instead of playing across it.
  root.dispatchEvent(new CustomEvent('ot:skip-story'));
  if(!target.hasAttribute('tabindex'))target.setAttribute('tabindex','-1');
  target.focus({preventScroll:true});
 });
}
