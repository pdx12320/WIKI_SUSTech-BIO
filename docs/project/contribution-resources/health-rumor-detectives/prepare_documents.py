from pathlib import Path
from copy import deepcopy
from docx import Document
from docx.shared import Pt, RGBColor, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.text.paragraph import Paragraph
import hashlib,json
ROOT=Path(__file__).resolve().parents[4]
import argparse
args=argparse.ArgumentParser();args.add_argument('source');SOURCE=Path(args.parse_args().source)
OUT=ROOT/'assets/human-practices/attachments'
OUT.mkdir(parents=True,exist_ok=True)
# Translation keys refer to the original paragraph indices before the date is inserted.
EN={
0:'Health Rumor Detectives Science for Older Adults Activity Plan',
1:'1 Activity overview',
2:'Activity name: Health Rumor Detectives - Science for Older Adults',
3:'Session topic: How should I assess information about preventing dementia?',
4:'Initiator and organizer: SUSTech-BIO, the Southern University of Science and Technology iGEM team, ORCA project',
5:'Partner organization: Community organization or elderly service center',
6:'Intended participants: Older adults in the community',
7:'Target group size: 15-20 older adults',
8:'Duration: Approximately 40 minutes',
9:'Venue: A well-ventilated activity room with seating, preferably with projection equipment. If none is available, the team will bring a portable projector or audio equipment.',
10:'Nature of the activity: A public-interest science education session, free of charge throughout. No medical diagnosis or medication advice will be provided, and no medicines, health supplements or medical services will be promoted or sold.',
11:'2 Activity objectives',
12:'Help participants remember four questions for assessing health information: Who is saying this? Is there evidence? Are they trying to get me to spend money? Where does the claim come from?',
13:'Using common claims about preventing dementia, identify warning signs in four settings: lifestyle advice, health supplements, online publicity, and folk remedies or recommendations.',
14:'Encourage practical habits: question claims that sound too certain; recognize the Chinese “blue hat” health food logo while remembering that health supplements are not medicines; be more cautious when headlines are exaggerated; and, when unsure, consult a doctor at a recognized healthcare institution or community health center.',
15:'Distribute science education booklets and small gifts, collect simple feedback, and prepare photographs and an activity record for the center’s files.',
16:'3 Core teaching content',
17:'Use the four information-checking questions as the main thread. Give one or two everyday examples for each type of claim, and allow participants to interrupt with questions at any time.',
19:'Examples for discussion: “Reverse dementia in three courses of treatment”; “Recommended by experts and cures every illness”; and “Take this and you will not need to go to hospital.” Ask participants to identify the problems and offer a small gift for a correct answer.',
20:'4 Session schedule approximately 40 minutes',
22:'5 Materials and staffing',
23:'The team will prepare presentation slides, a portable projector or audio equipment if the center has no projector, science education booklets, small gifts, take-home gifts such as fruit or eggs if permitted by the center, a sign-in sheet, feedback forms, pens, and photography equipment.',
24:'Suggested allocation of responsibilities',
26:'The center is asked to help with three things: recruit 15-20 older adults; provide a well-ventilated venue with seats and, preferably, projection equipment, although this is not essential; and assign one staff member to provide on-site support on the day.',
27:'6 Recruitment and publicity',
28:'Suggested recruitment message',
29:'We are SUSTech-BIO, the Southern University of Science and Technology iGEM team working on the ORCA project. We are offering a free public-interest science class on “How should I assess information about preventing dementia?” In approximately 40 minutes, we will introduce four questions for checking information, with science education booklets and small gifts. The session is entirely free. We do not sell products, diagnose conditions or prescribe medicines. We welcome a group of 15-20 older adults.',
30:'7 Preparation timeline and on-site delivery',
31:'Seven days before: Confirm the venue, participant numbers, projection and audio equipment, and whether take-home gifts are permitted.',
32:'Three days before: Confirm recruitment numbers; prepare the slides, booklets, gifts and feedback forms; and check participants’ allergies and dietary restrictions with the center.',
33:'One day before: Send a reminder of the time and venue, and check all equipment and materials.',
34:'Arrive 30-40 minutes early on the day: Set up the room, test the projector and audio equipment, and prepare sign-in materials.',
35:'After the session: Distribute feedback forms, organize photographs, and provide the center with a brief activity report for its records.',
36:'8 Risk management and compliance',
37:'This is a science education activity only. It does not provide medical diagnosis or medication advice. Participants should follow their doctor’s advice about their health.',
38:'Do not recommend particular medicines or health supplement brands, and do not promote or sell products.',
39:'The session is free throughout, with no charges to participants.',
40:'Check allergies and dietary restrictions with the center in advance when preparing take-home gifts.',
41:'Obtain consent from participants and the center before taking photographs. Do not collect unnecessary personal information.',
42:'If a participant asks about an individual medical condition, use a consistent response: “You need to ask a doctor or your community health center about that. Today we are only discussing how to assess information.”',
43:'Use the interactive activities to offer practical reminders rather than create fear. Use plain language and show respect for older participants.',
44:'9 Evaluation and record keeping',
45:'Process indicators: A target of 15-20 sign-ins; the number of participants taking part in discussions; and the quantities of booklets and small gifts distributed.',
46:'Feedback topics: Whether the session was understandable; whether participants remember the four questions; satisfaction with the activity; and topics they would like to hear about next.',
47:'Records to retain: Sign-in sheets, feedback forms, photographs and a brief activity summary. Organize these after the activity and provide them to the center.',
48:'10 Budget',
49:'SUSTech-BIO will cover the costs of science education booklets, small gifts, take-home gifts, printed materials, and portable projection or audio equipment. No fees will be charged to older participants, and the activity does not involve medical product promotion. Specific amounts will be approved internally by the team.'}
TABLES=[
[
['Setting','Common claims or sales language','Points to check'],
['Lifestyle','Claims that exercise, diet, sleep or social activity “guarantee you will not develop dementia” or can “reverse” it.','These may reduce risk but cannot guarantee that dementia will not occur. Be cautious about absolute promises.'],
['Health supplements','“Recommended by experts”; “treats or cures”; “works after a few courses.”','Recognize the Chinese “blue hat” health food logo. Health supplements are not medicines. Claims on packaging to “treat” or “cure” may constitute improper advertising.'],
['Online publicity','Sensational headlines; “cures every illness”; “recommended by experts.”','Be especially cautious about exaggerated headlines. Check the author and sources, and whether the content is education or a sales pitch.'],
['Folk remedies and recommendations','Remedies from unknown sources, or a friend’s recommendation of a “miracle cure.”','Do not accept these uncritically. If unsure, ask a doctor at a hospital or community health center. Ask one more question: “What is the source?”']
],
[
['Time','Stage','Content'],
['0-5 min','Welcome and warm-up','Introduce the team. Ask what claims about “preventing dementia” participants have seen on television or their phones. Collect examples to use during the session.'],
['5-11 min','Setting 1\nLifestyle','Exercise, social activity, diet and sleep may reduce risk but cannot guarantee prevention. Be wary of claims to “reverse” or “cure” dementia.'],
['11-18 min','Setting 2\nHealth supplements','Recognize the Chinese “blue hat” health food logo. Health supplements are not medicines. Packaging claims to “treat” or “cure” may constitute unlawful advertising.'],
['18-25 min','Setting 3\nOnline publicity','Sensational headlines, “cures every illness” and “recommended by experts” are common tactics. Check whether the message is education or a sales pitch.'],
['25-30 min','Setting 4\nFolk remedies and medical advice','Do not trust remedies from unknown sources. Seek advice from recognized healthcare institutions and doctors. Ask: “What is the source?”'],
['30-36 min','Rumor detective activity','Show two or three typical promotional claims. Ask participants to identify the problems, with small gifts for correct answers.'],
['36-40 min','Review and closing','Repeat the four information-checking questions. Distribute booklets and small gifts, and invite participants to complete a simple feedback form.']
],
[
['Role','Responsibilities'],
['Main speaker','Teach the four settings, manage the pace, and respond to questions.'],
['Host and interaction facilitator','Collect examples at the start, lead the rumor detective activity, and distribute gifts.'],
['Sign-in and room support','Manage sign-in, help participants find seats, maintain order, and assist with feedback forms.'],
['Photography and documentation','Take photographs and record the activity, subject to participant consent and confirmation from the center.'],
['Materials coordinator','Check and arrange booklets, gifts, take-home gifts, and projection and audio equipment.']
]]
def replace_text(p,text):
 if p.runs:
  label_only=len(p.runs)>1 and p.runs[0].text.endswith(('：',':')) and ': ' in text
  if label_only:
   label,body=text.split(': ',1);p.runs[0].text=label+': ';p.runs[1].text=body
   for run in p.runs[2:]:run.text=''
  else:
   p.runs[0].text=text
   for run in p.runs[1:]:run.text=''
 else:p.add_run(text)

def date_after(p,text):
 node=OxmlElement('w:p');p._p.addnext(node);q=Paragraph(node,p._parent);q.style='Normal';q.add_run(text);return q
source=Document(SOURCE)
for lang in ['zh','en']:
 d=Document(SOURCE)
 if lang=='en':
  for i,p in enumerate(d.paragraphs):
   if p.text:assert i in EN,i
   if i in EN:replace_text(p,EN[i])
  for table,rows in zip(d.tables,TABLES):
   assert len(table.rows)==len(rows)
   for row,texts in zip(table.rows,rows):
    assert len(row.cells)==len(texts)
    for cell,text in zip(row.cells,texts):
     replace_text(cell.paragraphs[0],text)
     for p in cell.paragraphs[1:]:replace_text(p,'')
 date_after(d.paragraphs[2], '活动时间：2026年7月2日与2026年10月7日' if lang=='zh' else 'Activity dates: July 2, 2026 and October 7, 2026')
 if lang=='en':
  for p in d.paragraphs:
   for r in p.runs:
    r.font.name='Arial';r.font.size=Pt(20 if p.style.name=='Title' else 14 if p.style.name.startswith('Heading') else 11)
  for t in d.tables:
   for row in t.rows:
    for cell in row.cells:
     for p in cell.paragraphs:
      for r in p.runs:r.font.name='Arial';r.font.size=Pt(10)
 if lang=='zh':
  for style in d.styles:
   if style.type==1:
    style.font.name='Arial Unicode MS'
    style.element.get_or_add_rPr().get_or_add_rFonts().set(qn('w:eastAsia'),'Arial Unicode MS')
  paragraphs=list(d.paragraphs)+[p for t in d.tables for row in t.rows for cell in row.cells for p in cell.paragraphs]
  for p in paragraphs:
   for r in p.runs:
    if p.style.name=='Title':r.font.size=Pt(14)
    r.font.name='Arial Unicode MS';r._r.get_or_add_rPr().get_or_add_rFonts().set(qn('w:eastAsia'),'Arial Unicode MS')
 else:
  for p in d.paragraphs:
   if p.style.name!='Title':p.alignment=WD_ALIGN_PARAGRAPH.LEFT
  for t,widths in zip(d.tables,[[3.2,5.6,7.2],[2.2,4.3,9.5],[3.8,12.2]]):
   t.autofit=False
   for column,width in zip(t.columns,widths):column.width=Cm(width)
   for row in t.rows:
    for cell,width in zip(row.cells,widths):
     cell.width=Cm(width)
     for p in cell.paragraphs:p.alignment=WD_ALIGN_PARAGRAPH.LEFT
 # Keep original dimensions and table structure. Prevent rows from splitting mid-entry.
 for t in d.tables:
  for i,row in enumerate(t.rows):
   pr=row._tr.get_or_add_trPr();pr.append(OxmlElement('w:cantSplit'))
   if i==0:pr.append(OxmlElement('w:tblHeader'))
 for p in d.paragraphs:
  if p.style.name=='Title' or p.style.name.startswith('Heading'):
   for r in p.runs:r.font.color.rgb=RGBColor(0,0,0)
 d.core_properties.author='SUSTech-BIO';d.core_properties.last_modified_by='SUSTech-BIO'
 d.save(OUT/f'health-rumor-detectives-activity-plan-{lang}.docx')
 # Ensure the Chinese copy differs in text only by the requested date paragraph.
 if lang=='zh':
  assert [p.text for p in d.paragraphs if not p.text.startswith('活动时间：')]==[p.text for p in source.paragraphs]
  assert [[c.text for row in t.rows for c in row.cells] for t in d.tables]==[[c.text for row in t.rows for c in row.cells] for t in source.tables]
meta={'source_sha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'dates':['2026-07-02','2026-10-07'],'paragraphs_translated':len(EN),'tables_translated':len(TABLES)}
(Path(__file__).parent/'provenance.json').write_text(json.dumps(meta,indent=2)+'\n')
print('Prepared both DOCX files; Chinese text and tables preserved, with requested activity dates.')
