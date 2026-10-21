import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE);
const base=process.env.WIKI_BASE_URL||'http://127.0.0.1:8181';
const out=process.env.REFRESH_OUTPUT||'/private/tmp/orca-refresh';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const checks=[];
async function newPage(options){
 const page=await browser.newPage(options);
 // Idle destination warming is tested separately; do not multiply unrelated
 // image requests across the failure/refresh fixtures in this regression.
 await page.route('**/static/entry-loading/page-warmup.js',route=>route.abort('failed'));
 return page;
}
async function capture(page,name){
 const cdp=await page.context().newCDPSession(page);
 const result=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
 await writeFile(`${out}/${name}.png`,Buffer.from(result.data,'base64'));await cdp.detach();
}
try{
 if(process.env.REFRESH_ONLY!=='inner'){
 const slow=await newPage({viewport:{width:1280,height:800}});
 let release;const held=new Promise(resolve=>release=resolve);
 await slow.route('**/static/onetake/onetake.js',async route=>{await held;await route.continue();});
 await slow.goto(base,{waitUntil:'commit'});
 await slow.locator('[data-entry-loader]').waitFor({state:'visible'});
 await capture(slow,'white-whale-loading');
 await slow.waitForTimeout(14000);
 assert.equal(await slow.locator('html').getAttribute('data-entry-loading'),'active');
 assert.equal(await slow.locator('[data-ot]').getAttribute('data-home-startup'),null);
 checks.push('Slow modules retain the white whale beyond the old 12-second cutoff');
 release();await slow.locator('[data-entry-loader]').waitFor({state:'hidden',timeout:40000});
 assert.ok(await slow.locator('[data-ot].is-ready').count());
 checks.push(`Home revealed after readiness: ${await slow.locator('[data-ot]').getAttribute('class')}`);
 await capture(slow,'home-ready');await slow.close();
 for(const width of [1280,390]){
  const failed=await newPage({viewport:{width,height:844}});
  await failed.route('**/static/onetake/onetake.js',route=>route.abort('failed'));
  await failed.goto(base,{waitUntil:'domcontentloaded'});
  await failed.locator('[data-entry-loader]').waitFor({state:'hidden',timeout:10000});
  assert.ok(await failed.locator('[data-home-static-entry]').isVisible());
  assert.equal(await failed.locator('.ot-story').isVisible(),false);
  assert.equal(await failed.locator('.ot-hero-title').isVisible(),false);
  assert.ok(await failed.locator('.home-static-entry__orca').evaluate(img=>img.complete&&img.naturalWidth>0));
  const bounds=await failed.locator('[data-home-static-entry]').boundingBox();assert.ok(bounds.width<=width);
  await capture(failed,`illustrated-fallback-${width}`);
  checks.push(`Failed animation shows an illustrated entrance, no legacy text-only story, ${width}px`);await failed.close();
 }
 for(const options of [{javaScriptEnabled:false},{reducedMotion:'reduce'}]){
  const page=await newPage(options);await page.goto(base,{waitUntil:'domcontentloaded'});
  await page.locator('[data-entry-loader]').waitFor({state:'hidden',timeout:10000});
  assert.ok(await page.locator('[data-home-static-entry]').isVisible());
  assert.equal(await page.locator('.ot-hero-title').isVisible(),false);await page.close();
 }
 checks.push('No-JavaScript and reduced-motion entrances have illustrations without the legacy story');
 }
 const inner=await newPage({viewport:{width:1280,height:800}});
 await inner.addInitScript(()=>sessionStorage.setItem('orca.entry-seen.v1','1'));
 await inner.goto(base+'/team',{waitUntil:'load'});
 const image=inner.locator('main img').first();const imageURL=new URL(await image.getAttribute('src'),base).href;
 let releaseImage;const imageHeld=new Promise(resolve=>releaseImage=resolve);
 await inner.route(imageURL,async route=>{await imageHeld;await route.continue();});
 await inner.reload({waitUntil:'commit'});
 await inner.locator('[data-entry-loader]').waitFor({state:'visible'});
 await inner.waitForTimeout(1500);
 assert.equal(await inner.locator('html').getAttribute('data-entry-loading'),'active');
 const coverStyle=await inner.locator('[data-entry-loader]').evaluate(el=>({filter:getComputedStyle(el).filter,transform:getComputedStyle(el).transform}));
 assert.equal(coverStyle.filter,'none','Team opening blur must not affect the whale');
 assert.equal(coverStyle.transform,'none','Team opening transforms must not affect the whale');
 assert.equal(await inner.evaluate(()=>getComputedStyle(document.body,'::before').backgroundColor),'rgb(247, 248, 250)');
 await capture(inner,'inner-refresh-loading');
 releaseImage();await inner.locator('[data-entry-loader]').waitFor({state:'hidden',timeout:15000});
 assert.equal(new URL(inner.url()).pathname,'/team');
 checks.push('An already-visited inner page refresh replays the whale and waits for its eager image');await inner.close();
 await writeFile(`${out}/results.json`,JSON.stringify({checks},null,2));console.log(checks.join('\n'));
}finally{await browser.close();}
