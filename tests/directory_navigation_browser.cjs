// WIKI_BASE_URL=http://127.0.0.1:8788 PLAYWRIGHT_MODULE=/path/to/playwright node tests/directory_navigation_browser.cjs
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const fs=require('fs');const assert=require('assert/strict');
const base=process.env.WIKI_BASE_URL||'http://127.0.0.1:8788';const output=process.env.DIRECTORY_QA_OUTPUT||'work/anchor-navigation-20261021';
(async()=>{fs.mkdirSync(output,{recursive:true});const browser=await chromium.launch({channel:'chrome',headless:true});const report=[];const errors=[];
async function run(route,width=1456,reducedMotion='no-preference'){
 const p=await browser.newPage({viewport:{width,height:900},reducedMotion});p.setDefaultTimeout(12000);p.on('pageerror',e=>errors.push({route,error:e.message}));
 await p.goto(base+'/'+route,{waitUntil:'domcontentloaded'});await p.evaluate(()=>Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,3000))]));
 // The native official form has its own navigation instead of a reading directory.
 if(route==='attributions'&&await p.locator('#official-attributions').count()){
  assert.ok(await p.locator('#official-attributions section[id]').count(),'Official attributions form renders');
  console.log('PASS attributions official form smoke');await p.close();return;
 }
 const model=await p.locator('.model-sidebar').count();const selector=model?'.model-sidebar [data-module-link]':width<=760?'.content-mobile-directory [data-content-major]':'.content-directory [data-content-major]:visible';
 await p.locator('.content-reading,.model-reading').evaluate(e=>scrollTo({top:scrollY+e.getBoundingClientRect().top-20,behavior:'instant'}));
 await p.waitForTimeout(350);
 const count=await p.locator(selector).count();assert.ok(count,route+' has directory links');
 const wet=route==='contribution'?await p.locator(selector).evaluateAll(es=>es.findIndex(e=>e.hash==='#wet-resources')):-1;
 const indices=[...new Set([...(wet>=0?[wet]:[]),Math.floor(count/2),count-1,0])];
 for(const index of indices){
  if(width<=760&&!model)await p.locator('.content-mobile-directory > summary').click();
  const link=p.locator(selector).nth(index);const id=await link.evaluate(e=>e.dataset.module||e.hash.slice(1));
  await link.click();await p.waitForFunction(()=>!document.querySelector('.is-content-navigating,.is-model-navigating,.is-reading-navigating'));
  await p.waitForTimeout(450);
  // A page can finish loading after a quick directory click.
  await p.evaluate(()=>dispatchEvent(new PageTransitionEvent('pageshow')));
  const state=await p.evaluate(id=>{const api=globalThis.ORCAReadingAnchors,target=document.getElementById(id);const max=Math.max(0,document.documentElement.scrollHeight-innerHeight);return {id,hash:location.hash,headingTop:api.top(target),offset:api.offset(),error:scrollY-api.destination(target),atBottom:Math.abs(scrollY-max)<2,active:[...document.querySelectorAll('.content-directory a[aria-current],.model-sidebar [aria-current]')].map(e=>e.hash||'#'+e.dataset.module)}},id);
  assert.ok(Math.abs(state.error)<3,route+' alignment '+JSON.stringify(state));
  assert.ok(state.active.includes('#'+id),route+' selection '+JSON.stringify(state));
  report.push({route,width,reducedMotion,...state});
  if(route==='contribution'&&id==='wet-resources'&&width===1456)await p.screenshot({path:output+'/fixed-wet-resources.png'});
 }
 // Returning through history uses the same destination as a directory click.
 if(!model){await p.goBack();await p.waitForTimeout(1900);const error=await p.evaluate(()=>{const t=document.getElementById(location.hash.slice(1));return t?scrollY-ORCAReadingAnchors.destination(t):0});assert.ok(Math.abs(error)<3,route+' history alignment '+error);}
 console.log('PASS '+route+' '+width+' '+reducedMotion);await p.close();
}
const selected=process.env.DIRECTORY_QA_ROUTES?.split(',');
for(const group of [['description','results'],['contribution','future'],['measurement','education'],['inclusivity','human-practices'],['model','software'],['attributions','safety-and-security']])await Promise.all(group.filter(route=>!selected||selected.includes(route)).map(route=>run(route)));
await Promise.all([run('contribution',390,'reduce'),run('description',390),run('software',390,'reduce')]);
assert.deepEqual(errors,[]);fs.writeFileSync(output+'/regression.json',JSON.stringify({report,errors},null,2));await browser.close();console.log('PASS: '+report.length+' directory jumps across ordinary pages, Model/Software, mobile, reduced motion and browser history.');
})().catch(e=>{console.error(e);process.exit(1)});
