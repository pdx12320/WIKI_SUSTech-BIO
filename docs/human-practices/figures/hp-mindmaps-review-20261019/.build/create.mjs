import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Presentation, PresentationFile} from '@oai/artifact-tool';
const build=path.dirname(fileURLToPath(import.meta.url));
const root=path.dirname(build), out=path.join(root,'output');
const SKILL='/Users/kevinliao/.codex/plugins/cache/openai-primary-runtime/presentations/26.1017.11052/skills/presentations';
const PY='/Users/kevinliao/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3';
const C={paper:'#FFFEFC',ink:'#171536',indigo:'#2E267C',purple:'#5D5AD7',lavender:'#9D9CF4',pale:'#E9E8FF',coral:'#F58F9C',muted:'#6B6880',line:'#D9D7E5'};
const p=Presentation.create({slideSize:{width:1280,height:720}});
function text(slide,name,content,x,y,w,h,size=25,color=C.ink,font='Futura',align='left') {
 const sh=slide.shapes.add({geometry:'textbox',name,position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 sh.text=content;sh.text.style={typeface:font,fontSize:size,color,alignment:align};sh.text.insets=0;return sh;
}
function make({title,hub,branches,stem,notes}) {
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,'Diagram title',title,64,40,1152,70,46,C.indigo,'Georgia');
 const center=s.shapes.add({geometry:'ellipse',name:'Central topic',position:{left:508,top:274,width:264,height:190},fill:C.pale,line:{fill:C.lavender,width:1.7}});
 center.text.style={typeface:'Futura',fontSize:29};
 // Separate editable text lets the hub's background and its wording be changed independently.
 text(s,'Central topic text',hub,531,323,218,100,29,C.indigo,'Georgia','center');
 const boxes=[{x:65,y:176,side:'left',col:C.indigo},{x:872,y:176,side:'right',col:C.purple},{x:65,y:476,side:'left',col:C.purple},{x:872,y:476,side:'right',col:C.indigo}];
 branches.forEach((b,i)=>{
  const q=boxes[i], label=text(s,'Branch '+(i+1),b.name,q.x,q.y,343,40,29,q.col,'Futura');
  const conn=s.shapes.connect(center,label,{kind:'curved',fromSide:q.side,toSide:q.side==='left'?'right':'left',line:{style:'solid',fill:i===2?C.coral:C.lavender,width:2.3}});
  conn.sendToBack();
  const rule=s.shapes.add({geometry:'line',name:'Branch underline '+(i+1),position:{left:q.x,top:q.y+45,width:343,height:0},fill:'none',line:{fill:q.col,width:1.4}});
  b.leaves.forEach((leaf,j)=>text(s,`Branch ${i+1} detail ${j+1}`,leaf,q.x,q.y+62+j*39,343,34,23,C.muted));
 });
 s.speakerNotes.text=notes;
 return {slide:s,stem};
}
const slides=[make({title:'Caregivers’ perspective',hub:'Care that fits\ndaily life',stem:'01-caregivers-perspective',branches:[
 {name:'Time to care',leaves:['Busy frontline schedules','Coordinate staff interviews']},
 {name:'Trust and choice',leaves:['Trust shapes advice','Willingness to take part varies']},
 {name:'A gentle start',leaves:['Group activities first','One-to-one contact later']},
 {name:'Planning together',leaves:['Share questions in advance','Adapt to health and availability']}
],notes:'Sources: Figure 10, assets/human-practices/images/shahe-volunteer-activity-coordination-notes.png; Figure 22, assets/human-practices/images/shahe-needs-assessment-and-workbook-feedback.png. These are synthesized team interview/fieldwork summaries, not verbatim quotations or population-wide findings. Time constraints and staff coordination: Figure 10 staff interview panel and Figure 22 care difficulties panel. Trust and participation: Figure 10 willingness panel, Figure 22 trust and health-related participation panel. Group before individual, advance questions and adapting to health: Figure 10. Caregiver viewpoint is an editorial grouping of those source points. The first source also suggests about two days between visits; this operational detail is omitted to keep the main map short.'}),
make({title:'Feedback from older learners',hub:'A handbook\nthey can use',stem:'02-older-learners-feedback',branches:[
 {name:'Easier to read',leaves:['Larger type','More pictures, less text']},
 {name:'Room to write',leaves:['Space for personal notes','Everyday health questions']},
 {name:'Familiar formats',leaves:['Short videos on familiar apps','Voice interaction for AI tools']},
 {name:'Affordable to produce',leaves:['First edition over budget','Simpler illustrated pages']}
],notes:'Source: Figure 22, assets/human-practices/images/shahe-needs-assessment-and-workbook-feedback.png, especially older-adult information habits, workbook changes and AI use. Larger type summarizes the reported problem of small print. More pictures, fewer words, space for notes and production budget come directly from the workbook panel. Everyday health questions reflect health-knowledge needs and note-taking in that panel, also described in docs/human-practices/human-practices.md. Familiar short-video platforms and primarily voice-based AI interactions come from the same source. The source is a Shahe Elderly Service Center fieldwork summary; it does not establish that the institution is an elderly university. “Older learners” avoids changing the institution’s identity. These are feedback and design directions, not demonstrated educational outcomes.'})];
for(const {slide,stem} of slides){
 const png=await p.export({slide,format:'png',scale:2});await fs.writeFile(path.join(out,stem+'.png'),new Uint8Array(await png.arrayBuffer()));
 const layout=await slide.export({format:'layout'});await fs.writeFile(path.join(build,stem+'.layout.json'),await layout.text());
}
const candidate=path.join(build,'candidate.pptx');await(await PresentationFile.exportPptx(p)).save(candidate);
const {finalizePresentation}=await import(path.join(SKILL,'container_tools/artifact_tool_utils.mjs'));
const result=await finalizePresentation({workspaceDir:root,candidatePath:candidate,finalPath:path.join(out,'HP-mindmaps-editable-v2.pptx'),pythonExecutable:PY,
 integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),
 explicitTotalSlideCount:2,requiredNativeTableOwnerSlides:[],requiredNativeChartOwnerSlides:[],
 layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit'],
 fontPolicy:{basis:'design',families:['Futura','Georgia']},verifyArtifactToolImport:true,
 receiptPath:path.join(build,'validation-v2.json')});
console.log(JSON.stringify(result));
