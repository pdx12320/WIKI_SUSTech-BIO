/* ORCA home — the opening television.
 *
 * The take opens already looking at a labyrinth (mazeShape in onetake.js), so
 * this file never draws anything itself. It only frames that shot, then zooms
 * the picture out of the set as the reader scrolls, which is the hand-off into
 * the brain chapter.
 *
 * Driven by --ot-p, the value onetake.js writes onto [data-ot] every frame.
 * Read here, never written, and no requestAnimationFrame of its own: if the
 * base take is hidden or reduced, this layer simply sits at its last frame.
 */
const root = document.querySelector('[data-ot]');
const set = document.querySelector('[data-ot-tv]');
const pic = document.querySelector('[data-ot-pic]');
const canvas = root?.querySelector('[data-ot-canvas]');

const reduceQuery = matchMedia('(prefers-reduced-motion: reduce)');
const small = matchMedia('(max-width: 760px)');

/* The window of the take the set lives in. It is gone before chapter 01
   ("The brain", which starts at 0.11) so the labyrinth is always the first
   thing inside the glass and the brain never is. */
const A = -0.06;   // set fully closed, labyrinth at rest inside it
const B = 0.045;   // picture has filled the viewport, casing has broken away

const FILL = 49;        // % of the viewport width the screen occupies at rest
const FILL_SMALL = 86;

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (t) => t * t * (3 - 2 * t);

let last = -1;
let lastFull = null;

/* Scale and centre the picture so the screen rect covers it exactly. Cover,
   not fit, so the glass is never letterboxed. */
function compose(p) {
  if (!pic) return;
  const w = innerWidth, h = innerHeight;
  const fill = small.matches ? FILL_SMALL : FILL;
  const hw = (w * fill) / 100;
  const hh = hw * 0.56;
  const t = smooth(clamp((p - A) / (B - A)));

  const restS = Math.max(hw / w, hh / h);
  const s = lerp(restS, 1, t);
  // Pan from the screen's centre — it is centred on the viewport already — to
  // the viewport centre. Both are the same point, so this only matters if the
  // hole is ever moved off-centre; kept explicit so that stays easy.
  const cx = lerp(w / 2, w / 2, t);
  const cy = lerp(h / 2, h / 2, t);
  const tx = w / 2 - cx * s;
  const ty = h / 2 - cy * s;

  pic.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${s.toFixed(4)})`;
  root.style.setProperty('--tv-full', t.toFixed(4));
}

function sync() {
  if (!root || !set) return;
  const p = parseFloat(root.style.getPropertyValue('--ot-p'));
  if (Number.isNaN(p)) return;
  if (Math.abs(p - last) < 0.0005) return;
  last = p;

  const t = smooth(clamp((p - A) / (B - A)));
  const full = t > 0.985;
  if (full !== lastFull) {
    lastFull = full;
    set.dataset.fullscreen = full ? '1' : '0';
    pic?.setAttribute('data-fullscreen', full ? '1' : '0');
  }
  // Flutter: the glass is live, and it settles as the set is left behind.
  const flutter = reduceQuery.matches ? 0 : 0.5 + 0.5 * Math.sin(performance.now() / 900);
  root.style.setProperty('--tv-p', t.toFixed(4));
  root.style.setProperty('--tv-a', (flutter * (1 - t)).toFixed(3));

  if (full) set.dataset.phase = 'off';
  else if (t > 0.7) set.dataset.phase = 'leaving';
  else set.dataset.phase = 'on';
  compose(p);
}

/* Keep the hole's height derived from its width so the screen holds a 16:9
   shape at any viewport, and let --tv-cw/-ct stay the only sizing knobs. */
function measure() {
  const cs = getComputedStyle(document.body);
  const cw = parseFloat(cs.getPropertyValue('--tv-cw'));
  const ct = parseFloat(cs.getPropertyValue('--tv-ct'));
  if (Number.isNaN(cw)) return;
  const hw = (innerWidth * cw) / 100;
  const hh = hw * 0.56;
  root.style.setProperty('--tv-hw', `${hw}px`);
  root.style.setProperty('--tv-hh', `${hh}px`);
  root.style.setProperty('--tv-top', `${((innerHeight - hh) / 2).toFixed(1)}px`);
  root.style.setProperty('--tv-left', `${((innerWidth - hw) / 2).toFixed(1)}px`);
  // --tv-ct is authored as a percentage of viewport height; re-derive it from
  // the measured rect so the casing and the hole can never drift apart.
  root.style.setProperty('--tv-ct', `${((innerHeight - hh) / 2).toFixed(1)}px`);
}

if (root && set && pic) {
  const kick = () => { measure(); last = -1; sync(); };
  new MutationObserver(() => sync()).observe(root, { attributes: true, attributeFilter: ['style'] });
  addEventListener('resize', kick, { passive: true });
  reduceQuery.addEventListener?.('change', kick);
  small.addEventListener?.('change', kick);
  kick();
}
