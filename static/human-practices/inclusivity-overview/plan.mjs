import { lettering } from './lettering.mjs';

function shade(name, region, width = 22) {
  const {x, y, width: w, height: h} = region;
  const step = width * .65 * Math.SQRT2;
  let d = '', row = 0;
  for (let diagonal = 0; diagonal <= w + h + step; diagonal += step) {
    const sum = x + y + Math.min(diagonal, w + h);
    const left = Math.max(x, sum - (y + h));
    const right = Math.min(x + w, sum - y);
    if (right <= left) continue;
    const a = [left, sum - left], b = [right, sum - right];
    const from = row % 2 ? b : a, to = row % 2 ? a : b;
    d += `${row ? ' L' : 'M'}${from[0]},${from[1]} L${to[0]},${to[1]}`;
    row++;
  }
  return {name, d, width, region};
}

export function inclusivityDrawingPlan() {
  // One continuous pass covers the illustration. Only the actual lettering strokes
  // are withheld, so there are no rectangular holes around people or labels.
  const artwork = shade('The complete illustration', {x: 0, y: 0, width: 1280, height: 666}, 28);
  artwork.excludePaths = lettering.map(item => item.d);
  artwork.letterBackdrop = true;
  return [artwork, ...lettering.map(item => shade(item.name, item.region, 19))];
}
