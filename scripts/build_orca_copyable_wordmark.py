"""Build original four-glyph font and selectable SVGs from the approved outlines."""
from pathlib import Path
from xml.etree import ElementTree as ET
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.pens.transformPen import TransformPen
from fontTools.svgLib.path import parse_path
import base64,re,textwrap,html
ROOT=Path(__file__).resolve().parents[1]
NS={'s':'http://www.w3.org/2000/svg'}
source=ET.parse(ROOT/'static/brand/orca-mono.svg').getroot()
fb=FontBuilder(1000,isTTF=True);order=['.notdef','space','O','R','C','A'];fb.setupGlyphOrder(order)
glyphs={}
for name in order:
 pen=TTGlyphPen(None)
 if len(name)==1:
  group=source.find(f's:g[@data-letter="{name}"]',NS)
  for path in group.findall('s:path',NS):
   if path.get('class'):continue
   parse_path(path.get('d'),TransformPen(Cu2QuPen(pen,max_err=.5,reverse_direction=False),(10,0,0,-10,0,900)))
 glyphs[name]=pen.glyph()
fb.setupGlyf(glyphs)
for glyph in glyphs.values():glyph.recalcBounds(fb.font['glyf'])
fb.setupHorizontalMetrics({n:(920,getattr(glyphs[n],'xMin',0)) for n in order});fb.setupHorizontalHeader(ascent=900,descent=-100)
fb.setupCharacterMap({ord(c):c for c in 'ORCA'}|{32:'space'})
fb.setupNameTable({'familyName':'ORCA Mono Web','styleName':'Regular','uniqueFontIdentifier':'ORCAMonoWeb-Regular-20261020','fullName':'ORCA Mono Web Regular','psName':'ORCAMonoWeb-Regular','copyright':'Original ORCA project lettering. CC BY 4.0.'})
fb.setupOS2(sTypoAscender=900,sTypoDescender=-100,usWinAscent=900,usWinDescent=100,sxHeight=800,sCapHeight=800);fb.setupPost(isFixedPitch=1)
fb.save(ROOT/'static/brand/orca-mono.ttf');fb.font.flavor='woff2';fb.font.save(ROOT/'static/brand/orca-mono.woff2')
encoded=base64.b64encode((ROOT/'static/brand/orca-mono.woff2').read_bytes()).decode()
fontcss='text.orca-copyable-letters::selection{background:transparent}@font-face{font-family:ORCAMonoWeb;src:url(data:font/woff2;base64,'+encoded+') format("woff2")}text.orca-copyable-letters{font-family:ORCAMonoWeb;font-size:100px;font-weight:400;letter-spacing:0;user-select:text;-webkit-user-select:text;cursor:text}'
def mark(name,embedded=False):
 original=(ROOT/'static/brand/orca-mono.svg').read_text()
 start=original.index('<g data-letter="O"');end=original.index('</g>',original.index('class="orca-wordmark__sea-light"'))+4
 water=original[start:end]
 # Retain paint definitions and sea, not the old letter outlines.
 water=water.replace('<g data-letter="O" data-advance="92">','<g aria-hidden="true" pointer-events="none">')+'</g>'
 water=water.replace('orca-sea-0-1','orca-copy-'+name)
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 372 100" class="design-orca-selectable" aria-label="ORCA wordmark">'+('<style>'+fontcss+'</style><rect width="372" height="100" fill="#FFFFFF"/>' if embedded else '')+water+'<text class="orca-copyable-letters" x="0" y="90" fill="currentColor">ORCA</text><path aria-hidden="true" pointer-events="none" fill="#F58F9C" d="M257 41H269V53H257Z"/></svg>'
p=ROOT/'docs/team/design-communication.md';s=p.read_text()
for name in ['hero','lavender','navy']:
 pattern=r'<svg\b[^>]*>.*?</svg>'
 # Target the specific display div, preserving all surrounding page copy.
 if name=='hero':prefix='<div class="design-orca-wordmark__hero">'
 else:prefix=f'<div class="design-orca-wordmark__sample design-orca-wordmark__sample--{name}">'
 start=s.index(prefix)+len(prefix);m=re.match(pattern,s[start:],flags=re.S);assert m,name
 s=s[:start]+mark(name)+s[start+m.end():]
link='<div class="design-orca-wordmark__downloads"><a href="https://static.igem.wiki/teams/6085/wiki/design/identity/orca-wordmark-study.svg" download>Download SVG</a><a href="https://static.igem.wiki/teams/6085/wiki/design/identity/orca-mono.ttf" download>Download font</a></div>'
anchor='  <dl class="design-orca-wordmark__notes">';assert s.count(anchor)==1
if 'design-orca-wordmark__downloads' not in s:
 pos=s.index('</dl>',s.index(anchor))+len('</dl>');s=s[:pos]+'\n'+link+s[pos:]
p.write_text(s)
a=s.index('<figure class="design-orca-wordmark"');b=s.index('</figure>',a)+len('</figure>')
(ROOT/'docs/design/orca-mono/design-page-fragment.html').write_text(s[a:b]+'\n')
(ROOT/'static/brand/orca-mono-selectable.svg').write_text(mark('download',True).replace('class="design-orca-selectable"','class="design-orca-selectable" color="#171536"'))
notes=[('O · Eye patch','An eye patch above a purple sea, with an S-shaped reflection.'),('R · Swimming motion','A curved leg carries the movement of a swimming tail.'),('C · Precise editing','A coral point at the opening evokes precise RNA editing.'),('A · Dorsal fin','A swept dorsal-fin silhouette gives the letter its distinctive profile.')]
board='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 650"><style>'+fontcss+'</style><rect width="1000" height="650" fill="#FFFFFF"/>'
for name,x,y,w,color in [('board-hero',20,20,960,'#171536'),('board-lavender',52,344,210,'#171536'),('board-navy',552,344,210,'#FFFEFC')]:
 if name=='board-lavender':board+='<rect x="20" y="300" width="470" height="140" fill="#E9E8FF"/>'
 if name=='board-navy':board+='<rect x="510" y="300" width="470" height="140" fill="#19143D"/>'
 board+=mark(name).replace('viewBox=',f'x="{x}" y="{y}" width="{w}" height="{w*100/372}" color="{color}" viewBox=')
for i,(title,body) in enumerate(notes):
 x=20+i*245
 board+=f'<text x="{x}" y="490" font-family="Arial,sans-serif" font-size="17" fill="#171536">{html.escape(title)}</text>'
 for j,line in enumerate(textwrap.wrap(body,27)):
  board+=f'<text x="{x}" y="{524+j*24}" font-family="Arial,sans-serif" font-size="15" fill="#6B6880">{html.escape(line)}</text>'
(ROOT/'static/brand/orca-wordmark-study.svg').write_text(board+'</svg>')
print('Built selectable ORCA font, inline page lettering and two self-contained SVG exports.')
