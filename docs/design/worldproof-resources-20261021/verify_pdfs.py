"""Check every source text block, page bounds and render every PDF page."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ImageDraw
from pypdf import PdfReader
import pdfplumber
import subprocess
import json
import build_pdfs as typesetter

ROOT = Path(__file__).resolve().parents[3]
QA = ROOT / 'docs/qa/worldproof-resources-20261021'
TMP = Path('/private/tmp/worldproof-pdf-render-20261021')
QA.mkdir(parents=True, exist_ok=True)
TMP.mkdir(exist_ok=True)

def norm(text):
    return ''.join(c.casefold() for c in typesetter.clean(text) if c.isalnum())

def blocks(node):
    result=[]
    for child in node.children:
        if not isinstance(child,typesetter.Node): continue
        if child.tag in ('p','h1','h2','h3','h4','td','th') or child.tag=='li' and not typesetter.descendants(child,'li'):
            if norm(child.text()): result.append(child.text())
        else: result.extend(blocks(child))
    return result

def check(pdf):
    source=pdf.with_suffix('.md')
    html=subprocess.run(['pandoc','-f','markdown+raw_html','-t','html',str(source)],capture_output=True,text=True,check=True).stdout
    expected=blocks(typesetter.Parser(html).root)
    reader=PdfReader(pdf)
    body=[]
    for page in reader.pages:
        lines=(page.extract_text() or '').splitlines()
        lines=[line for line in lines if line.strip()!='SUSTech-BIO  /  WORLDPROOF']
        # The page callback draws its footer before the source text; preserve the source motto.
        for i in range(len(lines)):
            if lines[i].strip()=='Build it. Break it. Fix it.':
                lines.pop(i)
                break
        lines=[line for line in lines if not line.strip().isdigit()]
        body.append('\n'.join(lines))
    text=norm('\n'.join(body))
    missing=[block for block in expected if norm(block) not in text]
    outside=[]
    with pdfplumber.open(pdf) as document:
        for pi,page in enumerate(document.pages,1):
            for char in page.chars:
                if char['x0']<25 or char['x1']>page.width-25 or char['top']<15 or char['bottom']>page.height-15:
                    outside.append((pi,char['text']))
    return {'file':pdf.name,'pages':len(reader.pages),'source_blocks':len(expected),'missing_blocks':missing,'outside_safe_page_bounds':outside}

def render(pdf):
    for old in TMP.glob(pdf.stem+'-*.png'): old.unlink()
    subprocess.run(['pdftoppm','-r','60','-png',str(pdf),str(TMP/pdf.stem)],capture_output=True,check=True)
    pages=sorted(TMP.glob(pdf.stem+'-*.png'))
    tw,th,cols=280,420,3
    sheet=Image.new('RGB',(cols*tw,((len(pages)+cols-1)//cols)*th),'#E9E8FF')
    draw=ImageDraw.Draw(sheet)
    for i,page in enumerate(pages):
        image=Image.open(page).convert('RGB')
        image.thumbnail((tw-12,th-28))
        sheet.paste(image,((i%cols)*tw+(tw-image.width)//2,(i//cols)*th+23))
        draw.text(((i%cols)*tw+8,(i//cols)*th+5),str(i+1),fill='#171536')
    output=QA/(pdf.stem+'-contact.jpg')
    sheet.save(output,quality=86)
    return {'pdf':pdf.name,'pages':len(pages),'contact_sheet':str(output.relative_to(ROOT))}

if __name__=='__main__':
    pdfs=sorted((ROOT/'assets/human-practices/worldproof-resources').glob('*.pdf'))
    results=[check(pdf) for pdf in pdfs]
    (QA/'pdf-text-checks.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
    for result in results:
        print(result['file'],result['pages'],'pages;',len(result['missing_blocks']),'missing;',len(result['outside_safe_page_bounds']),'outside')
    assert all(not r['missing_blocks'] and not r['outside_safe_page_bounds'] for r in results)
    with ThreadPoolExecutor(max_workers=3) as pool: records=list(pool.map(render,pdfs))
    (QA/'rendered-pages.json').write_text(json.dumps(records,indent=2)+'\n')
    print('Every final PDF page rendered.')
