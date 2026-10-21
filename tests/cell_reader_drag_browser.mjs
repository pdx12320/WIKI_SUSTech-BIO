import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE);
const base=process.env.WIKI_BASE_URL||'http://127.0.0.1:8176';
const out=process.env.READER_OUTPUT||'/private/tmp/orca-reader-drag';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const checks=[];
try {
 for(const mobile of [false,true]){
  const page=await browser.newPage({viewport:{width:mobile?390:1280,height:844},hasTouch:mobile,isMobile:mobile,reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/description',{waitUntil:'domcontentloaded'});
  const handle=page.locator('[data-cell-reader-drag]');await handle.waitFor({state:'visible'});
  assert.equal(await page.locator('.cell-reader__tip, [data-cell-reader-top], .cell-reader__top-label').count(),0);
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(100);
  const box=await handle.boundingBox();
  const rail=await page.locator('.cell-reader__rail').boundingBox();
  const x=box.x+box.width/2,y=box.y+box.height/2;
  if(mobile){
   const cdp=await page.context().newCDPSession(page);
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
   for(let i=1;i<=8;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y+rail.height*.6*i/8}]});
   await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  }else{
   await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x,y+rail.height*.6,{steps:8});await page.mouse.up();
  }
  await page.waitForTimeout(150);
  const percent=Number(await handle.getAttribute('aria-valuenow'));
  assert.ok(percent>=55&&percent<=65,`drag to 60%: ${percent}`);
  const before=await page.evaluate(()=>scrollY);await handle.click();
  assert.ok(Math.abs(await page.evaluate(()=>scrollY)-before)<3,'Click preserves reading position');
  await handle.press('End');await page.waitForTimeout(100);assert.equal(await handle.getAttribute('aria-valuenow'),'100');
  await handle.press('Home');await page.waitForTimeout(100);assert.equal(await handle.getAttribute('aria-valuenow'),'0');
  await handle.press('PageDown');await page.waitForTimeout(100);assert.ok(Number(await handle.getAttribute('aria-valuenow'))>0);
  assert.equal(await page.locator('.cell-reader__dragging').count(),0);
  await page.screenshot({path:`${out}/reader-${mobile?'mobile':'desktop'}.png`});
  assert.deepEqual(errors,[]);checks.push(`${mobile?'touch':'mouse'} drag, progress, keyboard and no click jump`);
  await page.close();
 }
 await writeFile(`${out}/results.json`,JSON.stringify({checks},null,2));console.log(checks);
}finally{await browser.close();}
