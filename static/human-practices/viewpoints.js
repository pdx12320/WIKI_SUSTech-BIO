/* Native details retain click/keyboard access when JavaScript is unavailable. */
(() => {
  const voices = [...document.querySelectorAll('.hp-manuscript .hp-voice')];
  const states = new Map();
  for (const voice of voices) {
    const trigger = voice.querySelector('summary');
    const state = { pinned: false, timer: null };
    states.set(voice, state);
    const setOpen = open => {
      clearTimeout(state.timer);
      voice.open = open;
      trigger.setAttribute('aria-expanded', String(open));
    };
    state.close = () => { state.pinned = false; setOpen(false); };
    trigger.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'touch') setOpen(true);
    });
    voice.addEventListener('pointerleave', () => {
      state.timer = setTimeout(() => {
        if (!state.pinned && !voice.matches(':focus-within')) setOpen(false);
      }, 150);
    });
    voice.addEventListener('focusin', () => setOpen(true));
    voice.addEventListener('focusout', event => {
      if (!voice.contains(event.relatedTarget) && !state.pinned) setOpen(false);
    });
    trigger.addEventListener('click', event => {
      event.preventDefault();
      state.pinned = !state.pinned;
      setOpen(state.pinned);
    });
    voice.querySelector('.hp-voice__close').addEventListener('click', () => {
      trigger.focus();
      state.close();
    });
    voice.addEventListener('toggle', () => trigger.setAttribute('aria-expanded', String(voice.open)));
  }
  document.addEventListener('pointerdown', event => {
    for (const [voice, state] of states) if (!voice.contains(event.target)) state.close();
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    for (const [voice, state] of states) if (voice.open) {
      if (voice.contains(document.activeElement)) voice.querySelector('summary').focus();
      state.close();
    }
  });
  let printState;
  addEventListener('beforeprint', () => {
    printState = voices.map(voice => voice.open);
    voices.forEach(voice => { voice.open = true; });
  });
  addEventListener('afterprint', () => {
    voices.forEach((voice, index) => { voice.open = printState?.[index] ?? false; });
  });
})();
