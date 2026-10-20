from pathlib import Path
import argparse, hashlib, json
from docx import Document
from docx.shared import Pt, RGBColor
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
args=argparse.ArgumentParser();args.add_argument('source');src=Path(args.parse_args().source)
root=Path(__file__).resolve().parents[4];out=root/'assets/human-practices/attachments';out.mkdir(parents=True,exist_ok=True)
EN={
0:'SUSTech BIO and Shokz',
1:'Industry University Research Cooperation Proposal for Emerging Biology and Sports Health',
2:'Proposing team  SUSTech-BIO, Southern University of Science and Technology    Proposed partner  Shokz',
3:'Discussion draft    March 2026',
4:'Through the iGBA industry-university-research forum and Human Practices (HP) activities, we propose working with Shokz to co-design wearable use scenarios for universities. The team would first build a local minimum viable product (MVP) for interactive headphones, test the reminder experience and willingness to use it, and then discuss demonstration units, technical support and further cooperation based on the demonstration results. Development progress and this proposal would be shared with Instructor Tang at the end of October.',
5:'1 Project background and basis for cooperation',
6:'This year, SUSTech-BIO\u2019s HP work focuses on emerging biology and broader health and wellbeing. Last year, the team discussed its business plan (BP) with BGI executives and its marketing team. This year, we plan to continue organizing the iGBA industry-university-research forum with teams from more than 20 universities in Guangdong, Hong Kong and Macao, addressing STEM education and public health science communication alongside research exchange.',
7:'Shokz sports headphones could provide a concrete platform for this work. University students and staff could contribute to scenario design, prototype testing and feedback on spoken prompts during exercise, reminders during prolonged desk work, and health education audio. Students in biomedical science, engineering and design could also jointly consider sensor data, reminder methods and user experience.',
8:'Cooperation would be based on demonstrable scenarios and feedback that can be collected and reviewed. The forum would organize exchange and product experiences; HP activities would support science communication and needs gathering; and the development group would turn suitable needs into lightweight prototypes.',
9:'2 Cooperation objectives',
10:'1. Enable university students and staff in Guangdong, Hong Kong and Macao to explore Shokz products through practical experiences in sports health and campus innovation scenarios.',
11:'2. Produce reusable scenario scripts, science communication materials and user feedback to inform later activities and development.',
12:'3. Complete at least one local prototype to assess whether reminders are timely or disruptive, and whether participants would be willing to keep using it.',
13:'4. Gather third- and fourth-year students\u2019 interest in internships and, if Shokz has relevant needs, discuss available positions and application requirements.',
15:'3 Proposed cooperation activities',
16:'1 iGBA industry university research forum',
17:'Set up a sports health and wearables experience area at the forum. Use team-developed scenario scripts to present product experiences and prototype demonstrations. Discussions would focus on use, design reasoning and practical limitations.',
18:'1. Experience area: Arrange headphone listening, spoken-reminder trials and scenario introductions. Location, opening hours and demonstration-unit arrangements would be determined with the forum plan.',
19:'2. Themed workshop: Suggest a 30-45 minute session on campus applications of open-source AI and bone-conduction headphones. The team would introduce open-source approaches and prototypes, and invite Shokz to discuss product formats and suitable use scenarios.',
20:'3. University student testers: Recruit 10-20 students from participating university teams to submit experience feedback within 2-4 weeks after the forum.',
21:'4. Brand recognition: Discuss acknowledgments at the forum, credit on materials and signage for the experience area. Specific arrangements would follow a mutually confirmed list of benefits and commitments.',
22:'To be confirmed: Forum date and venue, booth format, Shokz participants, and support through demonstration units, gifts and brand materials.',
23:'2 Human Practices activities and health science communication',
24:'In campus or community science communication activities, arrange 1-2 headphone experience sessions and produce 2-3 short educational items. Possible topics include open-ear exercise experiences and precautions, how to use desk-work reminders, and how to interpret wearable data. The team would review the content before publication.',
25:'Collect participants\u2019 views on reminder frequency, audio length and wearing comfort. After the forum and HP activities, combine the findings into a University Biomedical Innovators Wearable Scenario Feedback Brief to help both sides decide which scenarios merit further development.',
26:'3 Campus communication and student co creation',
27:'Students responsible for campus communication would coordinate tester recruitment, on-site documentation and publication. Before and after the forum, the team proposes producing 2-3 illustrated posts or short videos explaining how scenarios work, how students can participate, and issues identified during prototype testing. Educational content and event communication can be planned together to avoid duplicating production.',
28:'If team capacity permits, create an open-source project homepage or documentation page covering local setup, verified functions and known limitations. The team would determine what to publish and when. References to the Shokz name, logo, product materials or cooperation relationship must be confirmed before publication.',
30:'4 Interactive headphone MVP development',
31:'The team would first build a local prototype to check whether data input, rule evaluation and headphone playback work together. The first version would demonstrate at least one of the scenarios below; work on other scenarios would depend on development progress.',
33:'1 Technical approach',
34:'The prototype would use a local model or rules engine, a mobile demonstration application and headphone audio output. The device used to collect posture data, the input method and accuracy must be specified during development. Features requiring headphone-specific functions or interfaces would be assessed after relevant documentation becomes available.',
35:'The first version would prioritize checking whether the workflow runs, whether trigger conditions are reasonable, and users\u2019 subjective feedback. Posture data would be processed locally, with no sensitive data uploaded. Audio prompts would be used only for lifestyle reminders and science education.',
36:'2 Development milestones',
37:'1. End of April: Summarize completed work, current issues and the scope of the next month\u2019s demonstration, and share these with Instructor Tang together with the scenario scripts and proposal.',
38:'2. May: Complete a local demonstration of at least one scenario and prepare a one-page technical note specifying data sources, implementation, operating conditions and known limitations.',
39:'3. After a feasible demonstration: Use demonstration results and user feedback to discuss demonstration units, interface documentation and the need for further cooperation with Shokz.',
40:'3 Technical support and internship coordination',
41:'Ask Shokz about available development units, technical interface documentation, brand-use guidelines and a contact person. In parallel, collect third- and fourth-year students\u2019 interest in internships. Positions, requirements and arrangements would depend on Shokz\u2019s actual needs and would not be treated as secured resources.',
43:'5 Implementation plan',
44:'The schedule below is preliminary. Once the forum date is confirmed, adjust advance publicity, recruitment and on-site delivery accordingly.',
46:'6 Responsibilities and resources',
48:'When discussing resources, specify the number of demonstration units and borrowing arrangements, materials production, cost responsibilities and authorization to use brand materials. Demonstration units, gifts, financial support and other commitments all require written confirmation by both sides.',
50:'7 Expected outputs and evaluation',
51:'The following targets are proposed for implementation after confirmation by the team and Shokz. Evaluation would focus on scenario experience, content quality and prototype feasibility; no sales-conversion target would be set.',
53:'8 Implementation boundaries',
54:'1. Health claims: Present products as consumer electronics for lifestyle use. Educational content and reminders must not provide diagnosis, replace medical advice, or claim to treat, cure or prevent disease.',
55:'2. Data handling: Run the MVP locally without uploading sensitive data. Anonymize experience questionnaires and present only aggregate findings in the feedback brief.',
56:'3. Public communication: Describe AI capabilities and prototype performance according to actual validation results. Confirm publishable content once the prototype is ready for demonstration. Brand logos and descriptions of cooperation require confirmation by both sides.',
57:'4. Progress and commitments: Report development progress and the proposal at the end of October without promising mass production. Forum benefits, demonstration units, materials and financial support all require written confirmation.',
58:'9 Month end update and items to confirm',
59:'For the month-end update, submit three pages: one on MVP progress, covering completed work, current issues and the next month\u2019s demonstration plan; one listing scenarios, inputs, triggers and experience boundaries; and one specifying cooperation needs, including forum benefits, demonstration units, communication and internship coordination.',
60:'Key items to confirm are the forum date and booth arrangements; priority scenarios and responsibilities for the first version; support through demonstration units and technical documentation; brand use and content review; and students\u2019 internship interests and coordination channels. After confirmation, the team would update the execution schedule and cooperation confirmation form.'}
TABLES=[
[['Scenario to test','First version implementation','Main observations'],['Neck posture reminders during dry-lab work','Use local posture data and rules to track how long the user keeps their head lowered, then play a tone or spoken prompt when preset conditions are met.','Reminder timing, false triggers and disruption.'],['Health education audio','Select an educational topic on the phone and play short, team-reviewed audio through headphones.','Ease of operation, suitable audio length and clarity of content.'],['Lightweight exercise posture feedback','Use rules to trigger simple spoken feedback based on available local posture data.','Data usability, timely feedback and participant understanding.']],
[['Timing','Main tasks','Outputs or items to confirm'],['End of October','Share development progress and the cooperation proposal with Instructor Tang.','MVP progress, scenario list and cooperation boundaries.'],['November','Develop the local MVP; discuss forum benefits, demonstration units and public messaging.','Local demonstration v0 and cooperation confirmation form.'],['December','Arrange advance publicity, tester recruitment and content production around the forum schedule.','Recruitment list and 2-3 content items.'],['During the forum','Run the experience area, workshop and student tester activities.','On-site feedback, activity records and photographs.'],['2-4 weeks after the forum','Collect feedback, prepare the brief and review the activities.','Scenario feedback brief and follow-up recommendations.'],['After a feasible demonstration','Discuss the next stage of development and support with Shokz.','Decision on continued cooperation and specific support.']],
[['Participant','Suggested responsibilities'],['SUSTech-BIO core team','Forum organization and university liaison, HP content, prototype development, science content review and feedback analysis.'],['Campus communication students','Recruitment posts, illustrated content or short videos, on-site documentation and student tester community management.'],['Shokz  To be confirmed','Demonstration units and brand materials, product-scenario advice, technical support and internship information; confirmation of forum benefits.'],['Academic supervisors and Instructor Tang','Review the cooperation direction and guide external communication and relevant content review.']],
[['Area','Proposed target'],['University participation','Contact and recruit teams from more than 20 universities in Guangdong, Hong Kong and Macao, and record actual participation and on-site experience.'],['User feedback','Recruit 10-20 student testers and collect at least 10 valid responses.'],['Scenarios and content','Produce 3-5 scenario scripts, 2-3 educational items and one scenario feedback brief.'],['Prototype validation','Run one local MVP and demonstrate at least one neck-posture reminder or health education audio scenario.'],['Follow-up decision','Produce one next-stage recommendation specifying whether to continue, priority scenarios and required support.']]]
for lang in ['zh','en']:
 d=Document(src)
 if lang=='en':
  assert {i for i,p in enumerate(d.paragraphs) if p.text}==set(EN)
  for i,text in EN.items():d.paragraphs[i].text=text
  for p in d.paragraphs:
   p.paragraph_format.page_break_before=False
   p.paragraph_format.line_spacing=1.15
   p.paragraph_format.space_after=Pt(7)
   for br in list(p._p.iter(qn('w:br'))):
    if br.get(qn('w:type'))=='page':br.getparent().remove(br)
  for t,rows in zip(d.tables,TABLES):
   assert len(t.rows)==len(rows)
   for row,values in zip(t.rows,rows):
    for c,text in zip(row.cells,values):c.text=text
 font='Arial Unicode MS' if lang=='zh' else 'Arial'
 for style in d.styles:
  if style.type==1:
   style.font.name=font
   style.element.get_or_add_rPr().get_or_add_rFonts().set(qn('w:eastAsia'),font)
 for p in list(d.paragraphs)+[p for t in d.tables for row in t.rows for c in row.cells for p in c.paragraphs]:
  is_table=p._p.getparent().tag==qn('w:tc')
  for r in p.runs:
   r.font.name=font;r._r.get_or_add_rPr().get_or_add_rFonts().set(qn('w:eastAsia'),font)
   r.font.color.rgb=RGBColor(0,0,0)
   if lang=='en':r.font.size=Pt(10 if is_table else 19 if p.style.name=='Title' else 12 if p.style.name=='Subtitle' else 14 if p.style.name.startswith('Heading') else 11)
  if p.style.name.startswith('Heading'):p.paragraph_format.keep_with_next=True
 for t in d.tables:
  for i,row in enumerate(t.rows):
   pr=row._tr.get_or_add_trPr();pr.append(OxmlElement('w:cantSplit'))
   if i==0:
    pr.append(OxmlElement('w:tblHeader'))
    for c in row.cells:
     for p in c.paragraphs:
      for r in p.runs:r.bold=True
 d.core_properties.author='SUSTech-BIO';d.core_properties.last_modified_by='SUSTech-BIO'
 d.save(out/f'shokz-industry-university-cooperation-proposal-{lang}.docx')
 if lang=='zh':
  original=Document(src)
  assert [p.text for p in d.paragraphs]==[p.text for p in original.paragraphs]
  assert [[c.text for row in t.rows for c in row.cells] for t in d.tables]==[[c.text for row in t.rows for c in row.cells] for t in original.tables]
(Path(__file__).parent/'provenance.json').write_text(json.dumps({'source_sha256':hashlib.sha256(src.read_bytes()).hexdigest(),'translated_paragraphs':len(EN),'tables':4,'dates':'Preserved exactly as in source; March, April/May and October/November/December references remain.','status':'Proposal and suggested targets, not an executed partnership'},indent=2)+'\n')
print('Both DOCX editions prepared; Chinese text and tables unchanged.')
