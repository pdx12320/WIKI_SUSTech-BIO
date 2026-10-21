// Keep the public form's native presentation without loading the teams app.
const host = document.getElementById('official-attributions');
const root = host?.shadowRoot;
if (root) {
  const toggles = [...root.querySelectorAll('button[aria-controls]')];
  function update() {
    for (const button of toggles) {
      const text = root.getElementById(button.getAttribute('aria-controls'));
      if (!text) continue;
      const expanded = button.getAttribute('aria-expanded') === 'true';
      const limit = parseFloat(getComputedStyle(text).lineHeight) * 3;
      text.style.maxHeight = expanded ? `${text.scrollHeight}px` : `${limit}px`;
      button.hidden = text.scrollHeight <= limit + 1;
    }
  }
  for (const button of toggles) {
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(expanded));
      button.setAttribute('aria-label', expanded ? 'Show less' : 'Show more');
      button.querySelector('span').textContent = expanded ? 'Read less' : 'Read more';
      button.querySelector('svg').style.transform = expanded ? 'rotate(180deg)' : '';
      update();
    });
  }
  const sections = [...root.querySelectorAll('section[id]')];
  for (const button of root.querySelectorAll('button:not([aria-controls])')) {
    const target = sections.find(section => section.querySelector('h3')?.textContent === button.textContent.trim());
    if (target) button.addEventListener('click', () => {
      const nav = document.querySelector('nav');
      window.scrollBy({top: target.getBoundingClientRect().top - (nav?.getBoundingClientRect().bottom || 120) - 24, behavior: 'smooth'});
    });
  }
  new ResizeObserver(update).observe(host);
  document.fonts.ready.then(update);
}
