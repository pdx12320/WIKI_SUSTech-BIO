/* Reading remains available without JavaScript; this only tracks the route. */
(() => {
  const root = document.querySelector('.hp-route');
  if (!root) return;
  const nav = root.querySelector('.hp-route__nav');
  const stops = [...root.querySelectorAll('.hp-route__stop')];
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  let pending = false;
  function update() {
    pending = false;
    const threshold = window.innerHeight * 0.4;
    let index = 0;
    stops.forEach((stop, i) => { if (stop.getBoundingClientRect().top <= threshold) index = i; });
    links.forEach((link, i) => {
      if (i === index) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    });
    // Use the actual node positions so the marker reaches every stop exactly.
    const track = nav.querySelector('.hp-route__track');
    if (track.offsetHeight) {
      const active = links[index].parentElement;
      const nodeY = active.offsetTop - track.offsetTop + 8;
      nav.style.setProperty('--route-progress', `${Math.max(0, Math.min(track.offsetHeight, nodeY))}px`);
    }
  }
  function schedule() { if (!pending) { pending = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  root.addEventListener('load', schedule, true);
  update();
})();
