import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE);
const base=process.env.WIKI_BASE_URL||'http://127.0.0.1:8176';
const out=process.env.STARTUP_OUTPUT||'/private/tmp/orca-startup';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const checks=[];
try {
 for (const width of [1280,390]) {
  const page=await browser.newPage({viewport:{width,height:844}});
  await page.addInitScript(()=>sessionStorage.setItem('orca.entry-seen.v1','1'));
  let release;const held=new Promise(resolve=>release=resolve);
  await page.route('**/static/onetake/onetake.js',async route=>{await held;await route.continue();});
  await page.goto(base,{waitUntil:'commit'});
  const cover=page.locator('[data-entry-loader]');await cover.waitFor({state:'visible'});
  await page.waitForTimeout(5000);
  assert.equal(await page.locator('[data-home-startup-surface]').count(),0,'No replacement cover');
  assert.ok(await cover.isVisible(),'Original cover stays visible beyond the old 3.2s cutoff');
  assert.equal(await page.locator('html').getAttribute('data-entry-loading'),'active');
  await page.screenshot({path:`${out}/original-cover-${width}.png`});
  release();await page.locator('[data-ot].is-ready').waitFor({timeout:20000});
  await cover.waitFor({state:'hidden'});
  assert.ok(await page.locator('.memory-room').isVisible()||await page.locator('[data-ot].ot--static').count()>0);
  checks.push(`original cover survives delayed modules and repeat visit, ${width}px`);
  console.log(checks.at(-1));await page.close();
 }
 const delayed=await browser.newPage();
 let release;const held=new Promise(resolve=>release=resolve);
 await delayed.route('**/static/onetake/onetake.js',async route=>{await held;await route.continue();});
 await delayed.goto(base,{waitUntil:'commit'});
 await delayed.locator('[data-ot].ot--static.is-ready').waitFor({timeout:20000});
 release();await delayed.waitForLoadState('domcontentloaded');
 assert.equal(await delayed.locator('[data-ot]').getAttribute('data-home-startup'),'fallback');
 await delayed.locator('[data-entry-loader]').waitFor({state:'hidden'});
 checks.push('stalled module falls back to reading, late arrival cannot restart');await delayed.close();
 const normal=await browser.newPage({viewport:{width:1280,height:800}});
 const errors=[];normal.on('pageerror',error=>errors.push(error.message));
 await normal.addInitScript(()=>{window.startupTasks=[];new PerformanceObserver(list=>window.startupTasks.push(...list.getEntries().map(e=>({start:e.startTime,duration:e.duration})))).observe({type:'longtask',buffered:true});});
 const cdp=await normal.context().newCDPSession(normal);await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 await normal.goto(base,{waitUntil:'commit'});
 await normal.locator('[data-ot].is-ready:not(.ot--static)').waitFor({timeout:30000});
 await normal.locator('[data-entry-loader]').waitFor({state:'hidden'});
 assert.ok(await normal.locator('.memory-room').isVisible());
 const performanceResult=await normal.evaluate(()=>({tasks:window.startupTasks,readyMs:performance.now()}));
 await normal.screenshot({path:`${out}/ready-desktop.png`});
 assert.deepEqual(errors,[]);checks.push('original animated opening under 4x CPU throttling');
 console.log(JSON.stringify({longestTaskMs:Math.max(...performanceResult.tasks.map(t=>t.duration)),readyMs:performanceResult.readyMs}));
 await normal.close();
 const failed=await browser.newPage();
 await failed.route('**/static/onetake/onetake.js',r=>r.abort('failed'));
 await failed.goto(base,{waitUntil:'domcontentloaded'});
 await failed.locator('[data-ot].ot--static.is-ready').waitFor();
 await failed.locator('[data-entry-loader]').waitFor({state:'hidden'});
 checks.push('failed module reveals readable fallback');await failed.close();
 for(const options of [{javaScriptEnabled:false},{reducedMotion:'reduce'}]){
  const page=await browser.newPage(options);await page.goto(base,{waitUntil:'domcontentloaded'});
  await page.locator('[data-crt-mount]').waitFor({state:'hidden'});
  assert.ok(await page.locator('.ot-hero-title').isVisible());await page.close();
 }
 checks.push('no JavaScript and reduced-motion reading fallbacks');
 await writeFile(`${out}/results.json`,JSON.stringify({checks,performance:performanceResult},null,2));
 console.log(checks);
}finally{await browser.close();}
