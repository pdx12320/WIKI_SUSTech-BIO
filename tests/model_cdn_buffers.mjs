import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { unpackModelGLB, loadModelBuffer } from '../static/model-buffer.mjs';

const paths = [
  'static/human-practices/model-viewers/data/meshes/brain',
  'static/human-practices/model-viewers/data/meshes/cell',
  'static/assets/software/body-3d-adult/body-surface',
];
const array = bytes => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
for (const path of paths) {
  const glb = await readFile(new URL('../' + path + '.glb', import.meta.url));
  const original = await readFile(new URL('../' + path + '.bin', import.meta.url));
  assert.deepEqual(Buffer.from(unpackModelGLB(array(glb))), original);
  delete globalThis.wikiAssetURL;
  globalThis.fetch = async url => {
    assert.equal(String(url), path + '.bin');
    return new Response(original);
  };
  assert.deepEqual(Buffer.from(await loadModelBuffer(path + '.bin', path + '.glb')), original);
  globalThis.wikiAssetURL = url => 'https://static.igem.wiki/' + url;
  globalThis.fetch = async url => {
    assert.equal(String(url), 'https://static.igem.wiki/' + path + '.glb');
    return new Response(glb);
  };
  assert.deepEqual(Buffer.from(await loadModelBuffer(path + '.bin', path + '.glb')), original);
  const invalid = array(glb);
  new DataView(invalid).setUint32(8, 0, true);
  assert.throws(() => unpackModelGLB(invalid), /Invalid model GLB header/);
  assert.throws(() => unpackModelGLB(array(glb.subarray(0, 24))), /Invalid model GLB header/);
}
globalThis.fetch = async () => new Response('', {status: 404});
await assert.rejects(loadModelBuffer('missing.bin', 'missing.glb'), /404/);
delete globalThis.wikiAssetURL;
console.log('PASS: all 3 GLB payloads byte-identical; local/CDN loading, corrupt files and HTTP errors checked.');
