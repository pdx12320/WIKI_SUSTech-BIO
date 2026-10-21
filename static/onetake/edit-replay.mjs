import {breathingRewind} from './rewind-motion.mjs';
import {AUTO_DOCK_DURATION,autoDockFrame} from './auto-docking.mjs';
// Scroll remains the story clock. This one, interruptible replay returns to
// the actual C position, holds the molecular edit, then enters the project.
export const REPLAY_TIMING = Object.freeze({ question: 2.4, rewind: 3.2, target: 1.1, edit: 8.5, return: 3.0 });
export const HOME_REPLAY_TIMING = Object.freeze({ ...REPLAY_TIMING, question: 3.0, rewind: REPLAY_TIMING.rewind, edit: REPLAY_TIMING.edit / 2 });
export const CELL_REPLAY_TIMING = Object.freeze({ ...HOME_REPLAY_TIMING, rewind: 5.6 });
const clamp = x => Math.max(0, Math.min(1, x));
const ease = x => { x = clamp(x); return x * x * (3 - 2 * x); };
export const CONFIRMED_EDIT_TIMING = Object.freeze({ confirm: .8, highlight: 1, convert: 2.7, hold: 2 });
export const CONFIRMED_EDIT_DURATION = Object.values(CONFIRMED_EDIT_TIMING).reduce((a,b) => a+b,0);
export function confirmedEditFrame(seconds) {
  let t = Math.max(0,seconds);
  for (const [stage,duration] of Object.entries(CONFIRMED_EDIT_TIMING)) {
    if (t < duration) {
      const progress = clamp(t/duration);
      const fix = stage === 'convert' ? ease(progress) : stage === 'hold' ? 1 : 0;
      return { stage, fix, pulse: stage === 'highlight' ? Math.sin(Math.PI*progress) : 0,
        edit: stage === 'convert' ? .12+.48*progress : stage === 'hold' ? 1 : 0 };
    }
    t -= duration;
  }
  return { stage:'hold',fix:1,pulse:0,edit:1 };
}

export function replayFrame(seconds, { timing = REPLAY_TIMING, questionFrom = .803, rewindMotion = ease, rewindTo = .55, contextual = false } = {}) {
  let t = Math.max(0, seconds);
  if (t < timing.question) return { phase: 'question', take: questionFrom + (.803 - questionFrom) * ease(t / Math.min(timing.question, 1.2)) };
  t -= timing.question;
  if (t < timing.rewind) return { phase: 'rewind', take: .803 - (.803-rewindTo) * rewindMotion(t / timing.rewind) };
  t -= timing.rewind;
  if (t < timing.target) return { phase: 'target', take: .55, edit: 0, ...(contextual?{contextTake:rewindTo,contextHandoff:ease(t/timing.target)}:{}) };
  t -= timing.target;
  if (t < timing.edit) return { phase: 'edit', take: .55, edit: clamp(t / timing.edit) };
  t -= timing.edit;
  if (t < timing.return) {
    const blend = ease(t / timing.return);
    return { phase: 'return', take: .89 + .065 * blend, cameraBlend: blend, edit: 1 };
  }
  return { phase: 'done', take: .955 };
}

export function createEditReplay({ root, story, toProgress, enabled, autoStart = globalThis.location?.hash !== '#ot-index-title', scrollReturn = root.hasAttribute?.('data-edit-scroll-return') || false, autoEdit = root.hasAttribute?.('data-edit-auto-confirm') || false }) {
  const autoDock = root.hasAttribute?.('data-edit-auto-dock') || false;
  const cellContext=root.querySelector('[data-rna-cell]')?.hasAttribute?.('data-rna-cell')||false;
  const rewindMotion = autoDock ? breathingRewind : ease;
  const skip = root.querySelector('[data-edit-skip]');
  const startButton = root.querySelector('[data-edit-start]');
  const status = autoEdit ? root.querySelector('[data-edit-status]') : null;
  let statusStage = '';
  const showStatus = stage => {
    if (!autoEdit || stage === statusStage) return;
    statusStage = stage;
    if (stage) root.dataset.editStage = stage;
    else delete root.dataset.editStage;
    if (!status) return;
    status.hidden = !stage;
    status.textContent = ({confirm:'Both modules are in place.',highlight:'Target C identified — playing automatically.',
      convert:'Editing automatically — no dragging needed.',hold:'Edit complete — APOE3 RNA.',
      return:'Edit complete. Scroll down to continue.',
      'docking-start':'Modules are moving into position.', 'dock-puf':'PUF binds the target RNA.',
      'dock-apobec':'APOBEC moves beside the target C.', 'dock-complete':'Both modules are in place.'})[stage] || '';
  };
  let played = false, active = false, elapsed = 0, previous = -1, phase = '', ready = false, editingStarted = false;
  let session = 0, returning = false, returnHintDismissed = false, liveFrame = null;
  const dismissReturnHint = () => {
    if (active && phase === 'return') { returnHintDismissed = true; showStatus(''); }
  };
  // Native scroll also covers scrollbar dragging and assistive input.
  let lastScrollY = window.scrollY || 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY || 0;
    if (Math.abs(y - lastScrollY) > .5) dismissReturnHint();
    lastScrollY = y;
  }, { passive: true });
  const quickRewind = root.hasAttribute?.('data-edit-quick-rewind') || false;
  const timing = cellContext ? CELL_REPLAY_TIMING : quickRewind ? HOME_REPLAY_TIMING : REPLAY_TIMING;
  const editDuration = autoEdit ? CONFIRMED_EDIT_DURATION : timing.edit;
  let questionFrom = .803;
  const placementStart = timing.question + timing.rewind + timing.target;
  const editStart = placementStart + (autoDock ? AUTO_DOCK_DURATION : 0);
  const scrollToTake = take => {
    const rect = story.getBoundingClientRect();
    // The journey version adds an opening before the shared biology story.
    const top = (rect.top ?? 0) + (window.scrollY || 0);
    window.scrollTo({ top: top + toProgress(take) * Math.max(1, rect.height - innerHeight), behavior: 'instant' });
  };
  const start = (at = 0) => {
    if (!enabled) return;
    active = played = true;
    elapsed = at; ready = editingStarted = returning = returnHintDismissed = false;
    phase = at ? 'target' : 'question';
    liveFrame = null;
    showStatus('');
    root.dataset.editSession = String(++session);
    if (skip) skip.hidden = false;
    if (startButton) startButton.hidden = true;
  };
  const finish = () => {
    active = false;
    delete root.dataset.editReplay;
    showStatus('');
    if (skip) skip.hidden = true;
  };
  const interrupt = () => {
    if (!active) return;
    if (cellContext && liveFrame) scrollToTake(liveFrame.contextTake ?? liveFrame.take);
    finish();
  };
  const beginEdit = () => { editingStarted = true; elapsed = editStart; };
  startButton?.addEventListener('click', () => start(timing.question + timing.rewind));
  window.addEventListener('wheel', event => {
    if (!active) return;
    if (scrollReturn && phase === 'return') { dismissReturnHint(); return; }
    if (phase === 'placement') {
      event.preventDefault();
      if (!autoEdit && ready && event.deltaY > 0) beginEdit();
    } else if (['edit','docking'].includes(phase) || (['question','rewind','target','return'].includes(phase) && event.deltaY >= 0)) event.preventDefault();
    else interrupt();
  }, { passive: false });
  let touchY = 0;
  window.addEventListener('touchstart', event => { touchY = event.touches[0]?.clientY || 0; }, { passive: true });
  window.addEventListener('touchmove', event => {
    if (!active || event.target.closest?.('[data-bio-handle], [data-bio-hit]')) return;
    if (scrollReturn && phase === 'return') { dismissReturnHint(); return; }
    if (['placement','edit','docking'].includes(phase)) {
      event.preventDefault();
      if (!autoEdit && phase === 'placement' && ready && touchY-(event.touches[0]?.clientY || touchY)>20) beginEdit();
    } else if (['question','rewind','target','return'].includes(phase)) {
      // A continuing downward swipe must not cancel the return to the RNA.
      event.preventDefault();
      if (touchY-(event.touches[0]?.clientY ?? touchY) < -20) interrupt();
    } else interrupt();
  }, { passive: false });
  window.addEventListener('keydown', event => {
    if (!active) return;
    if (scrollReturn && phase === 'return' && event.key !== 'Escape') {
      if (['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(event.key)) dismissReturnHint();
      return;
    }
    if (!autoEdit && phase === 'placement' && ready && ['ArrowDown','PageDown',' '].includes(event.key)) { event.preventDefault(); beginEdit(); }
    else if (autoEdit && phase === 'placement' && ['ArrowDown','PageDown',' '].includes(event.key)) event.preventDefault();
    else if (['edit','docking','question','rewind','target','return'].includes(phase) && ['ArrowDown','PageDown',' '].includes(event.key)) event.preventDefault();
    else if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Escape'].includes(event.key)) interrupt();
  });
  skip?.addEventListener('click', () => {
    if (!enabled) return;
    if (scrollReturn) {
      // Skip the timed replay, then hold the completed UGC edit until the
      // reader scrolls. Reuse the normal scroll-controlled return below.
      active = played = editingStarted = true;
      elapsed = editStart + editDuration;
      returning = false;
      phase = 'return';
      if (skip) skip.hidden = true;
      return;
    }
    scrollToTake(.955);
    finish();
  });
  return {
    skipToProject() { played = true; finish(); },
    setReady(value) {
      if (autoDock) return;
      ready = value;
      if (autoEdit && active && phase === 'placement' && ready && !editingStarted) beginEdit();
    },
    update(take, dt) {
      if (enabled && autoStart && !played && previous < .797 && take >= .797 && take < .94) {
        // Continue from the live camera position instead of snapping to .803.
        questionFrom = quickRewind ? take : .803;
        start();
      }
      previous = take;
      if (startButton) startButton.hidden = !enabled || active || !((take >= .495 && take <= .605) || take >= .784);
      if (!active) return null;
      // A background tab must not skip the readable edit when it resumes.
      elapsed += Math.min(dt, .05);
      if (autoDock && !editingStarted && elapsed >= editStart) editingStarted = true;
      if (scrollReturn && editingStarted && elapsed >= editStart + editDuration) {
        // Hold the completed edit. Rebase the document once without moving
        // the camera; from here the reader's scroll is the only clock.
        const entering = !returning;
        if (entering) { returning = true; returnHintDismissed = false; scrollToTake(.89); lastScrollY = window.scrollY || 0; }
        if (!entering && take < .888) { finish(); return null; }
        const amount = entering ? 0 : clamp((take - .89) / .065);
        phase = 'return';
        if (amount > .0001) returnHintDismissed = true;
        showStatus(returnHintDismissed ? '' : 'return');
        root.dataset.editReplay = phase;
        if (skip) skip.hidden = true;
        const frame = { phase, take: .89 + .065 * amount, cameraBlend: ease(amount), edit: 1,
          ...(autoEdit ? {autoEdit:true,fix:1,pulse:0} : {}) };
        if (amount >= 1) finish();
        liveFrame = frame;
        return frame;
      }
      let frame = replayFrame(elapsed, { timing, questionFrom, rewindMotion, rewindTo:cellContext?.26:.55, contextual:cellContext });
      if (autoDock && !editingStarted && elapsed >= placementStart) {
        frame = {phase:'docking',take:.55,...autoDockFrame(elapsed-placementStart)};
        showStatus(frame.stage);
      }
      if (autoEdit && editingStarted) {
        const seconds = elapsed-editStart;
        frame = seconds < editDuration
          ? {phase:'edit',take:.55,autoEdit:true,...confirmedEditFrame(seconds)}
          : replayFrame(placementStart+timing.edit+seconds-editDuration, { timing, questionFrom, rewindMotion, rewindTo:cellContext?.26:.55, contextual:cellContext });
        showStatus(frame.stage || 'return');
      }
      if (!autoDock && !editingStarted && elapsed >= editStart) {
        elapsed = editStart;
        frame = { phase: 'placement', take: .55, edit: 0 };
      }
      phase = frame.phase;
      root.dataset.editReplay = frame.phase;
      // The camera pulls back from edited UGC; the document goes straight to
      // the project instead of crossing the original CGC and AD chapters again.
      // Moving the document thousands of pixels each frame can displace fixed
      // compositor layers during a fast rewind. The cell take moves the camera
      // while the document stays put, then rebases once for native scrolling.
      if (!cellContext || ['return','done'].includes(frame.phase))
        scrollToTake(frame.phase === 'return' ? .955 : frame.take);
      liveFrame = frame;
      if (frame.phase === 'done') finish();
      return frame;
    },
  };
}
