import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../static/team-opening-layout.js', import.meta.url), 'utf8');
const directions = ['nw', 'ne', 'sw', 'se'];
const angles = [-7, 6, 5, -6];
// Conservative bounds include the protruding tabs, not just each rectangle.
const bounds = [
  { x: 2, y: 2, width: 662, height: 462 },
  { x: 600, y: 2, width: 598, height: 398 },
  { x: 2, y: 400, width: 598, height: 398 },
  { x: 536, y: 336, width: 662, height: 462 },
];
for (const [width, height] of [[390, 844], [844, 390], [768, 1024], [1440, 900], [2560, 1080]]) {
  const properties = new Map();
  const pieces = directions.map((direction, index) => ({
    classList: { contains: name => name === `team-opening__piece--${direction}` },
    getBBox: () => bounds[index], angle: angles[index],
  }));
  const puzzle = {
    getBoundingClientRect: () => ({ width, height, top: 0, left: 0 }),
    viewBox: { baseVal: { x: 0, y: 0, width: 1200, height: 800 } },
    querySelectorAll: () => pieces,
  };
  const opening = {
    dataset: {}, isConnected: true,
    style: { setProperty: (name, value) => properties.set(name, value) },
    getBoundingClientRect: () => ({ width, height, top: 0, left: 0 }),
    querySelector: selector => selector === '.team-opening__puzzle' ? puzzle : {},
  };
  vm.runInNewContext(source, {
    document: { querySelector: () => opening },
    window: { addEventListener() {} }, AbortController,
    getComputedStyle: piece => ({ getPropertyValue: () => `${piece.angle}deg` }),
    requestAnimationFrame() {}, cancelAnimationFrame() {},
  });
  directions.forEach((direction, index) => {
    const left = direction.endsWith('w'), upper = direction.startsWith('n');
    const ox = width * (left ? .25 : .75), oy = height * (upper ? .25 : .75);
    const dx = parseFloat(properties.get(`--opening-exit-${direction}-x`)) / 100 * width;
    const dy = parseFloat(properties.get(`--opening-exit-${direction}-y`)) / 100 * height;
    const angle = angles[index] * Math.PI / 180;
    const box = bounds[index];
    // Apply the actual HTML transform in physical pixels independently of SVG.
    const corners = [box.x, box.x + box.width].flatMap(x =>
      [box.y, box.y + box.height].map(y => {
        const px = x / 1200 * width - ox, py = y / 800 * height - oy;
        return {
          x: ox + dx + .92 * (px * Math.cos(angle) - py * Math.sin(angle)),
          y: oy + dy + .92 * (px * Math.sin(angle) + py * Math.cos(angle)),
        };
      }));
    const xs = corners.map(point => point.x), ys = corners.map(point => point.y);
    const innerX = left ? Math.max(...xs) : Math.min(...xs);
    const innerY = upper ? Math.max(...ys) : Math.min(...ys);
    assert.ok(Math.abs(innerX - width * (left ? .28 : .72)) < .01,
      `${direction} must remain visible at its horizontal corner at ${width}×${height}`);
    assert.ok(Math.abs(innerY - height * (upper ? .25 : .75)) < .01,
      `${direction} must remain visible at its vertical corner at ${width}×${height}`);
    assert.ok(left ? Math.min(...xs) < 0 : Math.max(...xs) > width);
    assert.ok(upper ? Math.min(...ys) < 0 : Math.max(...ys) > height);

  });
}
console.log('Puzzle corners: four tilted pieces stay partly visible and leave the center clear on phone, landscape, tablet and desktop.');
