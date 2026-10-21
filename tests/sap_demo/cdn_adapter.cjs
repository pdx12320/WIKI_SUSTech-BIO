// Reproduce production: uploaded resources are deliberately absent from Pages.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../../static/sap-demo');
const adapter = process.argv[2] || path.resolve(root, '../sap-demo-cdn.js');
const expectFailure = process.argv.includes('--expect-missing-overview');
const mapping = JSON.parse(fs.readFileSync(path.resolve(root, '../sap-demo-cdn.js'), 'utf8').match(/const mapping = (\{[\s\S]*?\});/)[1]);
const base = 'https://2026.igem.wiki/sustech/static/sap-demo/';
const reverse = new Map(Object.entries(mapping).map(([name, url]) => [url, name]));
const calls = [], storage = new Map(), ready = [];
const downloadLink = {href: base + 'downloads/RP02_Target_Reporter_Construction_by_Golden_Gate_Assembly.pdf'};
const context = {
  URL, Request, Response, structuredClone, console, queueMicrotask, setTimeout,
  crypto: require('node:crypto').webcrypto,
  location: {origin: 'https://2026.igem.wiki', href: base + 'index.html#design'},
  document: {baseURI: base + 'index.html', body: {}, querySelectorAll() {return [downloadLink];}, addEventListener(name, fn) {if (name === 'DOMContentLoaded') ready.push(fn);}},
  MutationObserver: class {observe() {}},
  sessionStorage: {getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, value)},
  wf: {}, notice() {}, designRefresh() {}, bindDesigner() {}, bindWorkflow() {}, bind() {}, render() {},
  state: {population: 'reporter', mode: 'research'}, api() {}, download() {}, exportResults() {}
};
context.window = {addEventListener() {}, fetch: async (input, options) => {
  const url = new URL(input instanceof Request ? input.url : input, base);
  calls.push(url.href);
  const remoteName = reverse.get(url.href);
  if (remoteName) return new Response(fs.readFileSync(path.join(root, remoteName)));
  const name = url.href.startsWith(base) ? url.pathname.slice(new URL(base).pathname.length) : null;
  if (name && !Object.hasOwn(mapping, name) && fs.existsSync(path.join(root, name))) {
    return new Response(fs.readFileSync(path.join(root, name)));
  }
  return new Response('Missing from Pages', {status: 404});
}};
vm.createContext(context);
vm.runInContext(fs.readFileSync(adapter, 'utf8'), context);
ready.forEach(fn => fn());
const hostedFetch = context.window.fetch;
vm.runInContext(fs.readFileSync(path.join(root, 'demo.js'), 'utf8'), context);

(async () => {
  if (expectFailure) {
    await assert.rejects(context.api('/api/overview'), /Example resource unavailable: overview.json/);
    console.log('REPRODUCED: original production adapter requests missing local overview.json.');
    return;
  }
  const api = context.api;
  assert.equal(downloadLink.href, mapping['downloads/RP02_Target_Reporter_Construction_by_Golden_Gate_Assembly.pdf']);
  assert.equal((await api('/api/overview')).samples.length, 32);
  assert.equal((await api('/api/validate')).ok, true);
  await api('/api/experiment-create', {name: 'Browser hosting verification'});
  await api('/api/experiment-example', {stage: 'mock_upload'});
  assert.equal((await api('/api/experiment-layer0')).Theta.controls.length, 2);
  await api('/api/experiment-confirm-theta');
  await api('/api/experiment-example', {stage: 'sample_upload'});
  const result = await api('/api/experiment-compute');
  assert.equal(result.result.samples[0].RAS.n_selected, 32207);
  assert.equal((await context.window.fetch('/api/experiment-export')).status, 200);
  for (const name of Object.keys(mapping)) {
    assert.equal((await hostedFetch(new URL(name, base))).status, 200, name);
  }
  assert.equal((await hostedFetch(new URL('data/overview.json?v=verification', base))).status, 200);
  assert.equal((await hostedFetch(new Request(base + 'data/overview.json'))).status, 200);
  assert.ok(calls.filter(url => url.startsWith(base)).every(url => !Object.hasOwn(mapping, url.slice(base.length))));
  console.log(`PASS: ${Object.keys(mapping).length} uploaded resources, URL/Request inputs, overview, snapshot integrity, staged analysis and report export under /sustech/.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
