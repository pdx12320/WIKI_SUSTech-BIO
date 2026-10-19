(() => {
  const map = document.querySelector('.engineering-map--stacked');
  if (!map) return;
  const project = document.getElementById('engineering-project-overview');
  const mindmap = document.getElementById('engineering-mindmap');
  // Contain the complete artwork: stop scaling when either edge meets the viewport.
  project.querySelector('.engineering-project-overview-art').setAttribute('preserveAspectRatio', 'xMidYMid meet');
  const gate = new window.ORCAChapterBoundary();
  const wheels = new window.ORCAWheelGestures();
  const hint = document.createElement('div');
  hint.className = 'engineering-view-hint';
  hint.setAttribute('role', 'status');
  hint.hidden = true;
  map.append(hint);
  let active = 'project';
  let expiration;
  let touchY;
  let touchGesture = 0;
  let keyGesture = 0;
  let consumedGesture;
  // Browser focus restoration must never scroll the clipped scene container.
  map.addEventListener('scroll', () => { if (map.scrollTop) map.scrollTop = 0; }, { passive: true });

  function clearHint() {
    clearTimeout(expiration);
    hint.hidden = true;
    gate.clear();
  }
  function refreshMindmap() {
    if (active === 'mindmap') document.dispatchEvent(new CustomEvent('engineering:map-select', { detail: {} }));
  }
  mindmap.addEventListener('transitionend', refreshMindmap);
  mindmap.addEventListener('scroll', refreshMindmap, { passive: true });
  function showView(next, focus = true) {
    active = next;
    clearHint();
    map.dataset.overviewSection = next;
    project.inert = next !== 'project';
    mindmap.inert = next !== 'mindmap';
    // No scroll offset can expose the adjacent scene, including focus scrolling.
    map.scrollTop = 0;
    if (next === 'mindmap') mindmap.scrollTop = 0;
    if (focus) (next === 'project' ? project : mindmap).focus({ preventScroll: true });
    requestAnimationFrame(refreshMindmap);
  }
  function atBoundary(direction) {
    return active === 'project' ? direction > 0 : direction < 0 && mindmap.scrollTop <= 1;
  }
  function navigate(direction, distance, gesture) {
    if (gesture === consumedGesture) return;
    const next = active === 'project' ? 'mindmap' : 'project';
    const result = gate.input({ direction, distance, gesture, chapter: next, edge: true, threshold: 24 });
    if (result.action === 'turn') {
      consumedGesture = gesture;
      showView(next);
    } else if (result.action === 'hint') {
      hint.textContent = next === 'mindmap' ? 'Scroll again to open the mind map ↓' : 'Scroll again to return to the overview ↑';
      hint.hidden = false;
      clearTimeout(expiration);
      expiration = setTimeout(clearHint, 2500);
    }
  }
  map.addEventListener('wheel', event => {
    if (event.ctrlKey || map.hidden || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? map.clientHeight : 1);
    const gesture = wheels.next(delta, performance.now());
    if (gesture === consumedGesture) { event.preventDefault(); return; }
    if (!atBoundary(Math.sign(delta))) {
      clearHint();
      if (active === 'project') event.preventDefault();
      return;
    }
    event.preventDefault();
    if (Math.abs(delta) >= 2) navigate(Math.sign(delta), Math.abs(delta), gesture);
  }, { passive: false });
  map.addEventListener('touchstart', event => {
    touchY = event.touches.length === 1 ? event.touches[0].clientY : null;
    touchGesture++;
  }, { passive: true });
  map.addEventListener('touchmove', event => {
    if (touchY == null || event.touches.length !== 1) return;
    const y = event.touches[0].clientY;
    const delta = touchY - y;
    const gesture = `touch-${touchGesture}`;
    if (gesture === consumedGesture) { event.preventDefault(); return; }
    if (!atBoundary(Math.sign(delta))) { clearHint(); touchY = y; return; }
    event.preventDefault();
    if (Math.abs(delta) < 24) return;
    touchY = y;
    navigate(Math.sign(delta), Math.abs(delta), gesture);
  }, { passive: false });
  map.addEventListener('keydown', event => {
    if (event.key === 'Escape') { clearHint(); return; }
    if (!['PageDown', 'PageUp'].includes(event.key) || event.target.closest('input,textarea,select')) return;
    const direction = event.key === 'PageDown' ? 1 : -1;
    if (!atBoundary(direction)) return;
    event.preventDefault();
    if (!event.repeat) navigate(direction, 40, `key-${++keyGesture}`);
  });
  map.addEventListener('click', event => {
    const button = event.target.closest('[data-overview-scroll]');
    if (!button) return;
    consumedGesture = null;
    showView(button.dataset.overviewScroll === mindmap.id ? 'mindmap' : 'project');
  });
  showView('project', false);
})();
