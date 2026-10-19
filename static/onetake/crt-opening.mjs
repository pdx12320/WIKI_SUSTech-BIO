import {SNOW_WIDTH,SNOW_HEIGHT,paintCoarseSnow} from './crt-coarse-noise.mjs';
import { createMemoryRoom } from './memory-room.mjs';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = v => v * v * (3 - 2 * v);
const mix = (a, b, t) => a + (b - a) * t;

export function createCrtOpening(root) {
  const picture = root.querySelector('[data-crt-picture]');
  if (!picture) return null;
  const anchor = root.querySelector('[data-crt-anchor]');
  const set = root.querySelector('[data-crt-set]');
  const stage = picture.querySelector('.ot-stage');
  const purple = new URLSearchParams(location.search).get('review') !== 'crt-legacy';
  root.classList.toggle('ot-crt-preview', purple);
  const memoryRoom = purple ? createMemoryRoom(root) : null;
  const snow = purple ? document.createElement('canvas') : null;
  let noiseContext, noiseImage, lastNoise = 0;
  const tuningEpoch = performance.now();
  if (snow) {
    snow.className = 'ot-crt-snow'; snow.width = SNOW_WIDTH; snow.height = SNOW_HEIGHT;
    picture.append(snow); noiseContext = snow.getContext('2d');
    noiseImage = noiseContext.createImageData(SNOW_WIDTH, SNOW_HEIGHT);
  }
  let base, mount, rect, lastZoom = -1;
  const resize = () => {
    base = anchor.getBoundingClientRect();
    mount = root.querySelector('[data-crt-mount]').getBoundingClientRect();
    lastZoom = -1;
  };
  resize();
  addEventListener('resize', resize, { passive: true });
  const update = p => {
    const zoom = purple ? 1 : smooth(clamp((p + 0.184) / 0.039));
    const signal = smooth(clamp(purple ? (p + 0.142) / 0.035 : (p + 0.18) / 0.027));
    // A slow attempt at reception: settle, almost resolve, then lose the picture.
    const receptionTime = ((performance.now()-tuningEpoch)/1000)%8.6;
    const reception = purple && signal<.05
      ? smooth(clamp((receptionTime-3.0)/.65)) * (1-smooth(clamp((receptionTime-4.05)/.6))) : 0;
    if (purple) {
      root.style.setProperty('--crt-reception', reception.toFixed(4));
      root.dataset.crtReception = reception>.8 ? 'locked' : reception>.05 ? 'tuning' : 'snow';
      memoryRoom?.update(p,reception);
    }
    if (snow) {
      snow.style.opacity = String((1-signal)*mix(.68,.12,reception));
      const now = performance.now();
      if (signal < 1 && now-lastNoise > 65) {
        lastNoise = now;
        paintCoarseSnow(noiseImage.data,now,reception);
        noiseContext.putImageData(noiseImage,0,0);
      }
    }
    if (zoom !== lastZoom) {
      lastZoom = zoom;
      rect = { x: mix(base.x, 0, zoom), y: mix(base.y, 0, zoom),
        width: mix(base.width, innerWidth, zoom), height: mix(base.height, innerHeight, zoom) };
      Object.assign(picture.style, { left: `${rect.x}px`, top: `${rect.y}px`, width: `${rect.width}px`, height: `${rect.height}px`, borderRadius: `${mix(base.width * 0.063, 0, zoom)}px / ${mix(base.height * 0.078, 0, zoom)}px` });
      stage.style.transform = `scale(${rect.width / innerWidth}, ${rect.height / innerHeight})`;
      const kx = rect.width / base.width, ky = rect.height / base.height;
      const tx = rect.x - base.x + (base.x - mount.x) * (1 - kx);
      const ty = rect.y - base.y + (base.y - mount.y) * (1 - ky);
      set.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${kx}, ${ky})`;
      root.style.setProperty('--crt-shell', (1 - smooth(clamp((zoom - 0.66) / 0.3))).toFixed(4));
      root.style.setProperty('--crt-glass', (1 - zoom).toFixed(4));
      root.style.setProperty('--crt-title', (purple ? signal : smooth(clamp((zoom - 0.76) / 0.24))).toFixed(4));
      root.dataset.crtPhase = zoom === 1 ? 'maze' : zoom === 0 ? 'television' : 'entering';
    }
    if (purple) root.style.setProperty('--crt-title', signal.toFixed(4));
    return mix(signal,.82,reception);
  };
  const pointer = (x, y) => ({
    x: ((x - rect.x) / rect.width) * 2 - 1,
    y: 1 - ((y - rect.y) / rect.height) * 2,
    inside: x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height,
  });
  update(-0.19);
  return { update, pointer };
}
