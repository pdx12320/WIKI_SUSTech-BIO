"""Read-only Education migration audit; writes results beside this script."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
from collections import Counter
import json,re,hashlib,zipfile,subprocess,sys
sys.path.insert(0,str(Path(__file__).resolve().parents[3]))
from app import app
from wiki_content import load_markdown_content
ROOT=Path(__file__).resolve().parents[3]
class Inventory(HTMLParser):
 def __init__(self):super().__init__();self.ids=[];self.links=[];self.media=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  if tag=='a' and 'href' in a:self.links.append(a['href'])
  if tag in ('img','image'):
   self.media.extend([a[k] for k in ('src','href') if k in a])
 def handle_startendtag(self,tag,attrs):self.handle_starttag(tag,attrs)
old=subprocess.check_output(['git','show','f53d821:docs/human-practices/education.md'],cwd=ROOT).decode()
new=(ROOT/'docs/human-practices/education.md').read_text()
# Explicit old anchors in Markdown headings and raw HTML are both part of the contract.
old_ids=set(re.findall(r'\{#([^}]+)\}|\bid="([^"]+)"',old))
old_ids={a or b for a,b in old_ids}
content=load_markdown_content('human-practices/education.md')
client=app.test_client();response=client.get('/education');html=response.get_data(as_text=True)
inv=Inventory();inv.feed(html)
# The leading H1 is removed by the common renderer in both versions.
missing_ids=sorted(old_ids-set(inv.ids)-{'education'})
assert not missing_ids,missing_ids
assert not [k for k,v in Counter(inv.ids).items() if v>1]
assert len([i for i in content.toc if i['level']==2])==7
bad=[]
for url in sorted(set(inv.links+inv.media)):
 u=urlsplit(url)
 if u.scheme or u.netloc:continue
 if not u.path:
  if u.fragment and unquote(u.fragment) not in inv.ids:bad.append(url)
  continue
 if not u.path.startswith('/'):continue
 r=client.get(u.path)
 if r.status_code!=200:bad.append((url,r.status_code))
 if u.fragment and r.mimetype=='text/html':
  dest=Inventory();dest.feed(r.get_data(as_text=True))
  if unquote(u.fragment) not in dest.ids:bad.append((url,'missing target'))
 r.close()
assert not bad,bad
before=Inventory();before.feed(old)
# Raw figure assets and Markdown attachment/website URLs must survive migration.
old_urls=set(before.links+before.media+re.findall(r'\]\(([^)]+)\)',old))
# The duplicate standalone screenshot is intentionally retained only in the interview widget.
old_urls.discard('/assets/human-practices/images/li-jiaju-teacher-interview-high-resolution.webp')
lost=sorted(old_urls-set(inv.links+inv.media))
assert not lost,lost
captions=re.findall(r'<figcaption>\s*(?:Figure (\d+)\.|<span>(\d+)</span>)',html)
nums=[int(a or b) for a,b in captions];nums.insert(1,2) # Shadow-DOM teacher caption.
assert nums==list(range(1,45)),nums
sources=[
 ('docs/design/older-adults-textbook-v3/teacher-student/老年大学健康生活教材_学生版_统一字体版.docx','workbook-current-student-zh.docx'),
 ('docs/design/older-adults-textbook-v3/teacher-student/english/Healthy_Living_for_Older_Adults_Student_Edition.docx','workbook-current-student-en.docx'),
 ('docs/design/older-adults-textbook-v3/teacher-student/老年大学健康生活教材_教师讲义版_统一字体版.docx','workbook-current-teacher-zh.docx')]
files=[]
for src,name in sources:
 p=ROOT/'assets/human-practices/education'/name
 expected={r['path']:r['sha256'] for r in json.loads((Path(__file__).with_name('task-files.json')).read_text())}
 assert hashlib.sha256(p.read_bytes()).hexdigest()==expected[str(p.relative_to(ROOT))]
 if (ROOT/src).exists():assert p.read_bytes()==(ROOT/src).read_bytes()
 with zipfile.ZipFile(p) as z:assert z.testzip() is None
 files.append({'source':src,'download':str(p.relative_to(ROOT)),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
result={'route_status':response.status_code,'primary_chapters':[i for i in content.toc if i['level']==2],'legacy_ids_checked':len(old_ids-{'education'}),'missing_legacy_ids':missing_ids,'resource_urls_checked':len(set(inv.links+inv.media)),'lost_urls':lost,'local_link_failures':bad,'figure_sequence':nums,'editable_sources':files}
Path(__file__).with_name('audit.json').write_text(json.dumps(result,indent=2,ensure_ascii=False))
print(json.dumps({k:v for k,v in result.items() if k not in ['editable_sources','primary_chapters','figure_sequence']},indent=2))
