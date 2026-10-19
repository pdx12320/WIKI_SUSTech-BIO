import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1218,height:772}});const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`${process.env.WIKI_BASE_URL||'http://127.0.0.1:8919'}/engineering#cetus`,{waitUntil:'networkidle'});
 for(const [group,selector,count] of [['fundamental-research','.compass-needle',1],['control','circle',3],['measure','.sonar-arc',3]]){
  const tile=page.locator(`[data-diagram-group="${group}"]`);
  await tile.hover();await page.waitForTimeout(250);
  assert.equal(await tile.evaluate(e=>e.getAnimations({subtree:true}).filter(a=>a.effect.getTiming().duration===1000).length),count);
  assert.notEqual(await tile.locator(selector).first().evaluate(e=>getComputedStyle(e).transform),'none');
  assert.equal(await tile.locator('svg').evaluate(e=>getComputedStyle(e).transform),'none');
  // A click immediately after hover must not restart the gesture.
  const times=await tile.evaluate(e=>{const a=e.getAnimations({subtree:true}).find(a=>a.effect.getTiming().duration===1000);const before=a.startTime;e.click();return [before,a.startTime];});
  assert.equal(times[0],times[1]);
  await page.waitForTimeout(1200);
  assert.equal(await tile.evaluate(e=>e.getAnimations({subtree:true}).filter(a=>a.effect.getTiming().duration===1000).length),0);
  assert.equal(await tile.locator(selector).first().evaluate(e=>getComputedStyle(e).transform),'none');
 }
 for(const [group,selector,count,property,rest] of [['edit','.edit-piece-top',2,'transform','none'],['deliver','.diagram-symbol > path',1,'transform','none'],['model','circle',12,'stroke-width','2px'],['functional-validation','.validation-check',1,'stroke-dashoffset','0px']]){
  const tile=page.locator(`[data-diagram-group="${group}"]`);
  await tile.hover();await page.waitForTimeout(350);
  assert.equal(await tile.evaluate(e=>e.getAnimations({subtree:true}).filter(a=>a.effect.getTiming().duration===1000).length),count);
  assert.notEqual(await tile.locator(selector).first().evaluate((e,p)=>getComputedStyle(e).getPropertyValue(p),property),rest);
  await page.screenshot({path:`work/nav-motion/icon-${group}-animated.png`});
  await page.waitForTimeout(1300);
  assert.equal(await tile.evaluate(e=>e.getAnimations({subtree:true}).filter(a=>a.effect.getTiming().duration===1000).length),0);
  assert.equal(await tile.locator(selector).first().evaluate((e,p)=>getComputedStyle(e).getPropertyValue(p),property),rest);
 }
 await page.mouse.move(650,400);await page.waitForTimeout(1400);
 await page.locator('.tile-fundamental-research').focus();await page.keyboard.press('Tab');
 await page.locator('.tile-control').focus();await page.waitForTimeout(150);
 assert.ok(await page.locator('.tile-control').evaluate(e=>e.getAnimations({subtree:true}).some(a=>a.effect.getTiming().duration===1000)));
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(50);
 assert.equal(await page.locator('.project-diagram').evaluate(e=>e.getAnimations({subtree:true}).filter(a=>a.effect.getTiming().duration===1000).length),0);
 await page.locator('.tile-measure').click();
 assert.equal(await page.locator('.tile-measure').evaluate(e=>e.getAnimations({subtree:true}).filter(a=>a.effect.getTiming().duration===1000).length),0);
 assert.deepEqual(errors,[]);
 console.log('PASS: all seven gestures, fixed outer geometry, single playback, return to rest, keyboard focus, reduced-motion cancellation and navigation.');
}finally{await browser.close();}
