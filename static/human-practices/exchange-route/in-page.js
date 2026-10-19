/* The route is a visual overview, not a second sticky table of contents. */
(() => {
  const root = document.querySelector('.hp-route--in-page');
  if (!root) return;
  const nav = root.querySelector('.hp-route__nav');
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const stops = links.map(link => document.getElementById(link.hash.slice(1)));
  const track = nav.querySelector('.hp-route__track');
  const caption = nav.querySelector('.hp-route__caption');
  let pending = false;
  let active = 0;
  function describe(link) { caption.textContent = link.dataset.description; }
  function update() {
    pending = false;
    active = 0;
    stops.forEach((stop, i) => {
      if (stop && stop.getBoundingClientRect().top <= innerHeight * .4) active = i;
    });
    links.forEach((link, i) => {
      if (i === active) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    });
    const first = links[0].getBoundingClientRect();
    const current = links[active].getBoundingClientRect();
    nav.style.setProperty('--route-progress', `${current.left + current.width / 2 - first.left - first.width / 2}px`);
    if (!nav.matches(':hover') && !nav.contains(document.activeElement)) describe(links[active]);
  }
  function schedule() { if (!pending) { pending = true; requestAnimationFrame(update); } }
  links.forEach(link => {
    link.addEventListener('pointerenter', () => describe(link));
    link.addEventListener('focus', () => describe(link));
  });
  nav.addEventListener('pointerleave', () => describe(links[active]));
  nav.addEventListener('focusout', () => describe(links[active]));
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', schedule, {passive:true});
  root.addEventListener('load', schedule, true);
  update();
})();
