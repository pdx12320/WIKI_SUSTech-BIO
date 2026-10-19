// WIKI_BASE_URL=http://127.0.0.1:8941 PLAYWRIGHT_MODULE=/path/to/playwright node tests/engineering_model_overview_browser.mjs
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base=process.env.WIKI_BASE_URL || 'http://127.0.0.1:8941';
const browser=await chromium.launch({channel:'chrome',headless:true,chromiumSandbox:true});
const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
async function panel(id){
 await page.waitForFunction(id=>document.querySelector('[data-engineering-workspace]').dataset.engineeringActivePanel===id,id);
 assert.equal(await page.locator('.engineering-part-panel:visible').count(),1);
}
try {
 await page.goto(`${base}/engineering`,{waitUntil:'networkidle'});
 const fundamental=page.locator('.engineering-project-overview-art [data-overview-target="fundamental-research"]');
 await fundamental.focus();
 assert.equal(await fundamental.evaluate(e=>getComputedStyle(e).outlineStyle),'none');
 assert.equal(await fundamental.locator('rect').getAttribute('rx'),'24');
 assert.notEqual(await fundamental.locator('rect').evaluate(e=>getComputedStyle(e).stroke),'none');
 // The large artwork target must open the shared overview, not its first child.
 await page.locator('.engineering-project-overview-art [data-overview-target="model"]').click({position:{x:35,y:18}});
 await panel('model');
 assert.equal(new URL(page.url()).hash,'#model');
 assert.equal(await page.locator('#dry-dbtl-overview').isVisible(),true);
 assert.equal(await page.locator('#model-rna-seq-overview').isVisible(),false);
 assert.equal(await page.locator('[data-engineering-cycles]').isVisible(),false);
 assert.equal(await page.locator('.dbtl-directory').isVisible(),false);
 for(const id of ['model-rna-seq','model-puf','model-apobec','model-lamar','model-whole-body']){
  await page.locator(`[data-diagram-part="${id}"]`).click();
  await panel(id);
  assert.equal(await page.locator(`#${id}-overview`).isVisible(),true);
  assert.equal(await page.locator('#dry-dbtl-overview').isVisible(),false);
  assert.equal(await page.locator('.dbtl-directory').isVisible(),true);
  await page.locator('[data-engineering-cycle="02"]').click();
  assert.equal(new URL(page.url()).hash,`#${id}-cycle-02`);
  await page.locator('[data-diagram-group="model"]').click();
  await panel('model');
 }
 await page.reload({waitUntil:'networkidle'});await panel('model');
 await page.locator('[data-engineering-overview-back]').click();
 await page.locator('[data-overview-scroll="engineering-mindmap"]').click();
 await page.locator('[data-engineering-group="model"]').click();await panel('model');
 await page.goBack();
 assert.equal(await page.locator('[data-engineering-map]').isVisible(),true);
 await page.goForward();await panel('model');
 await page.goto(`${base}/engineering#dry-dbtl-overview`,{waitUntil:'networkidle'});await panel('model');
 await page.goto(`${base}/engineering#program`,{waitUntil:'networkidle'});await panel('model');
 await page.goto(`${base}/engineering#model-cycle-02`,{waitUntil:'networkidle'});await panel('model-rna-seq');
 // Retain the separate module route and mobile sidebar behavior.
 await page.setViewportSize({width:390,height:844});
 await page.goto(`${base}/engineering#model-puf`,{waitUntil:'networkidle'});await panel('model-puf');
 await page.locator('.engineering-nav-toggle').click();
 await page.locator('[data-diagram-group="model"]').click();await panel('model');
 assert.equal(await page.locator('.engineering-nav-toggle').getAttribute('aria-expanded'),'false');
 assert.deepEqual(errors,[]);
 console.log('PASS: artwork, sidebar, mind map, direct/legacy links, history, reload, five submodules, cycles and mobile Model overview navigation.');
} finally {await browser.close();}
