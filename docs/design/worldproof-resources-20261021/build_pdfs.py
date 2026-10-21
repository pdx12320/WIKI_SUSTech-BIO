"""Typeset the six paired organizer documents without changing their text."""
from pathlib import Path
from html.parser import HTMLParser
from xml.sax.saxutils import escape
import hashlib
import json
import re
import subprocess

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[3]
OUT = ROOT / 'assets/human-practices/worldproof-resources'
HERE = Path(__file__).resolve().parent
FONTS = Path('/Users/kevinliao/.codex/skills/orca-wiki-style/assets/fonts')
pdfmetrics.registerFont(TTFont('Futura', str(FONTS / 'futura/futurawin.ttf')))
pdfmetrics.registerFont(TTFont('GeorgiaBold', str(FONTS / 'georgia/georgiab.ttf')))
pdfmetrics.registerFont(TTFont('CJK', '/Library/Fonts/Arial Unicode.ttf'))
INK, INDIGO, MUTED, LAVENDER, LINE = [colors.HexColor(c) for c in ('#171536','#2E267C','#6B6880','#E9E8FF','#D9D7E5')]
PAGE_W, PAGE_H = A4
WIDTH = PAGE_W - 92

class Node:
    def __init__(self, tag='root', attrs=None):
        self.tag, self.attrs, self.children = tag, dict(attrs or []), []
    def text(self):
        return ''.join(c if isinstance(c, str) else c.text() for c in self.children)

class Parser(HTMLParser):
    def __init__(self, data):
        super().__init__()
        self.root = Node()
        self.stack = [self.root]
        self.feed(data)
    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs)
        self.stack[-1].children.append(node)
        if tag not in {'br','hr','img','meta','link','input','col','wbr'}:
            self.stack.append(node)
    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1, 0, -1):
            if self.stack[i].tag == tag:
                self.stack = self.stack[:i]
                break
    def handle_data(self, text):
        self.stack[-1].children.append(text)

def clean(text):
    return re.sub(r'[\u2010-\u2015]', '-', text).replace('\u00a0', ' ')

def inline(node, lang):
    if isinstance(node, str):
        text = escape(clean(node))
        if lang == 'en':
            text = re.sub(r'([\u3400-\u9fff]+)', r'<font name="CJK">\1</font>', text)
        return text
    text = ''.join(inline(c, lang) for c in node.children)
    if node.tag == 'br': return '<br/>'
    if node.tag in ('strong','b'): return f'<font color="#2E267C">{text}</font>'
    if node.tag in ('code','em','i'): return text
    if node.tag == 'a' and node.attrs.get('href','').startswith(('https://','http://')):
        return '<link href="'+escape(node.attrs['href'], {'"':'&quot;'})+'" color="#2E267C">'+text+'</link>'
    return text

def styles(lang):
    font = 'CJK' if lang == 'zh' else 'Futura'
    heading = 'CJK' if lang == 'zh' else 'GeorgiaBold'
    base = ParagraphStyle('body', fontName=font, fontSize=10.4, leading=15, textColor=INK,
                          spaceAfter=6, wordWrap='CJK' if lang == 'zh' else None, allowWidows=0, allowOrphans=0)
    result = {'p':base}
    for tag, size, leading, before, after in [('h1',23,29,0,17),('h2',15,21,13,8),('h3',12,18,10,6),('h4',11,16,9,5)]:
        result[tag] = ParagraphStyle(tag, parent=base, fontName=heading, fontSize=size, leading=leading,
                                    textColor=INDIGO, spaceBefore=before, spaceAfter=after, keepWithNext=True)
    result['cell'] = ParagraphStyle('cell',parent=base,fontSize=8.3,leading=11.9,spaceAfter=0)
    result['th'] = ParagraphStyle('th',parent=result['cell'],textColor=INDIGO)
    result['list'] = ParagraphStyle('list',parent=base,leftIndent=13,firstLineIndent=-13,spaceAfter=3)
    return result

def descendants(node, tag):
    found=[]
    for child in node.children:
        if not isinstance(child, Node): continue
        if child.tag == tag: found.append(child)
        else: found.extend(descendants(child,tag))
    return found

def make_table(node, lang, st, scorecard):
    rows, spans, occupied = [], [], set()
    for ri, row in enumerate(descendants(node,'tr')):
        cells = [c for c in row.children if isinstance(c, Node) and c.tag in ('td','th')]
        data=[]; ci=0
        for cell in cells:
            while (ri,ci) in occupied:
                data.append(''); ci+=1
            col_span, row_span = int(cell.attrs.get('colspan',1)), int(cell.attrs.get('rowspan',1))
            data.append(Paragraph(inline(cell,lang), st['th' if cell.tag == 'th' else 'cell']))
            for extra in range(1,col_span): data.append('')
            if col_span>1 or row_span>1:
                spans.append(('SPAN',(ci,ri),(ci+col_span-1,ri+row_span-1)))
                for rr in range(ri,ri+row_span):
                    for cc in range(ci,ci+col_span):
                        if (rr,cc)!=(ri,ci): occupied.add((rr,cc))
            ci+=col_span
        rows.append(data)
    columns=max(map(len,rows))
    rows=[r+['']*(columns-len(r)) for r in rows]
    if columns==6: weights=[.14,.28,.13,.13,.17,.15]
    elif columns==3: weights=[.17,.42,.41] if scorecard else [.19,.4,.41]
    elif columns==2: weights=[.22,.78]
    else: weights=[1/columns]*columns
    table=Table(rows,colWidths=[WIDTH*w for w in weights],repeatRows=1,hAlign='LEFT')
    commands=[('VALIGN',(0,0),(-1,-1),'TOP'),('BACKGROUND',(0,0),(-1,0),LAVENDER),
              ('LINEBELOW',(0,0),(-1,0),.7,INDIGO),('LINEBELOW',(0,1),(-1,-1),.3,LINE),
              ('LEFTPADDING',(0,0),(-1,-1),6),('RIGHTPADDING',(0,0),(-1,-1),6),
              ('TOPPADDING',(0,0),(-1,-1),5 if columns==6 else 6),
              ('BOTTOMPADDING',(0,0),(-1,-1),5 if columns==6 else 6)]
    table.setStyle(TableStyle(commands+spans))
    return table

def flow(node, lang, st, scorecard):
    result=[]
    for child in node.children:
        if not isinstance(child,Node):
            if child.strip(): result.append(Paragraph(inline(child,lang),st['p']))
            continue
        tag=child.tag
        if tag in ('h1','h2','h3','h4','p'):
            result.append(Paragraph(inline(child,lang),st[tag]))
        elif tag in ('ul','ol'):
            number=0
            for item in child.children:
                if not isinstance(item,Node) or item.tag!='li': continue
                number+=1
                prefix=str(number)+'. ' if tag=='ol' else '- '
                nested=[c for c in item.children if isinstance(c,Node) and c.tag in ('ul','ol')]
                top=Node(); top.children=[c for c in item.children if c not in nested]
                result.append(Paragraph(prefix+inline(top,lang),st['list']))
                for sub in nested:
                    wrapper=Node();wrapper.children=[sub]
                    result.extend(flow(wrapper,lang,st,scorecard))
        elif tag=='table':
            result.extend([Spacer(1,5),make_table(child,lang,st,scorecard),Spacer(1,10)])
        elif tag=='hr': result.append(Spacer(1,10))
        elif tag=='div' and 'break-before' in child.attrs.get('style',''):
            result.append(PageBreak())
        else: result.extend(flow(child,lang,st,scorecard))
    return result

def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont('Futura',8)
    canvas.setFillColor(MUTED)
    canvas.drawString(46, PAGE_H-29, 'SUSTech-BIO  /  WORLDPROOF')
    canvas.drawString(46, 28, 'Build it. Break it. Fix it.')
    canvas.drawRightString(PAGE_W-46,28,str(doc.page))
    canvas.restoreState()

def build():
    manifest=[]
    for name in ('judging-guideline','judging-scorecard','scenarios-and-constraints'):
        for lang in ('en','zh'):
            source=OUT/f'worldproof-{name}-{lang}.md'
            html=subprocess.run(['pandoc','-f','markdown+raw_html','-t','html',str(source)],capture_output=True,text=True,check=True).stdout
            parser=Parser(html)
            output=source.with_suffix('.pdf')
            document=SimpleDocTemplate(str(output),pagesize=A4,rightMargin=46,leftMargin=46,topMargin=52,bottomMargin=46,
                                      title=parser.root.text().split('\n')[0].strip() or 'WORLDPROOF',author='SUSTech-BIO')
            document.build(flow(parser.root,lang,styles(lang),name=='judging-scorecard'),onFirstPage=footer,onLaterPages=footer)
            reader=PdfReader(output)
            texts=[p.extract_text() or '' for p in reader.pages]
            assert all(t.strip() for t in texts), output
            manifest.append({'source':str(source.relative_to(ROOT)),'pdf':str(output.relative_to(ROOT)),
                             'source_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),
                             'pdf_sha256':hashlib.sha256(output.read_bytes()).hexdigest(),
                             'pages':len(reader.pages),'text_characters':sum(map(len,texts))})
            print(output.name, len(reader.pages),'pages')
    (HERE/'pdf-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')

if __name__=='__main__': build()
