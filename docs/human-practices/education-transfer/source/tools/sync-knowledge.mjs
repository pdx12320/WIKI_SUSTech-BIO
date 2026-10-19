import {readFile,writeFile} from 'node:fs/promises';
const jsonPath=new URL('../education-transfer-knowledge.json',import.meta.url);
const data=JSON.parse(await readFile(jsonPath,'utf8'));
if(data.domains.length!==6||Object.keys(data.profiles).length!==4||data.domains.reduce((n,d)=>n+d.outcomes.length,0)!==76)throw new Error('Expected four configurations, six domains and 76 reference outcomes.');
await writeFile(new URL('../education-transfer-knowledge.js',import.meta.url),'/* Generated from education-transfer-knowledge.json. Run tools/sync-knowledge.mjs after editing JSON. */\nwindow.BIOSPHERE_KNOWLEDGE = '+JSON.stringify(data,null,2)+';\n');
console.log('Browser knowledge data synchronized.');
