/** Read the unchanged mesh payload from our self-contained GLB upload. */
export function unpackModelGLB(buffer) {
  const view = new DataView(buffer);
  if (buffer.byteLength < 28 || view.getUint32(0, true) !== 0x46546c67 ||
      view.getUint32(4, true) !== 2 || view.getUint32(8, true) !== buffer.byteLength) {
    throw new Error('Invalid model GLB header');
  }
  const jsonLength = view.getUint32(12, true);
  const binHeader = 20 + jsonLength;
  if (jsonLength % 4 || binHeader + 8 > buffer.byteLength ||
      view.getUint32(16, true) !== 0x4e4f534a) throw new Error('Invalid model JSON chunk');
  const model = JSON.parse(new TextDecoder().decode(new Uint8Array(buffer, 20, jsonLength)));
  const size = model.buffers?.[0]?.byteLength;
  const binLength = view.getUint32(binHeader, true);
  if (model.buffers?.length !== 1 || model.buffers[0].uri ||
      !Number.isInteger(size) || size <= 0 || size > binLength || binLength - size > 3 ||
      view.getUint32(binHeader + 4, true) !== 0x004e4942 ||
      binHeader + 8 + binLength !== buffer.byteLength) throw new Error('Invalid model binary chunk');
  return buffer.slice(binHeader + 8, binHeader + 8 + size);
}

export async function loadModelBuffer(localURL, glbURL) {
  // The resolver is injected only in iGEM mode. Local previews keep their
  // original BIN files and require no network access to the upload CDN.
  const useGLB = typeof globalThis.wikiAssetURL === 'function';
  const url = useGLB ? globalThis.wikiAssetURL(String(glbURL)) : localURL;
  const response = await fetch(url, {credentials: 'same-origin'});
  if (!response.ok) throw new Error(`Model geometry request failed (${response.status})`);
  const buffer = await response.arrayBuffer();
  return useGLB ? unpackModelGLB(buffer) : buffer;
}
