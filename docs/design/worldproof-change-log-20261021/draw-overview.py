from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from xml.sax.saxutils import escape
import base64
import json

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
OUT = ROOT / 'assets/human-practices/worldproof-demo'
OUT.mkdir(parents=True, exist_ok=True)
STYLE = Path('/Users/kevinliao/.codex/skills/orca-wiki-style')
C = json.loads((STYLE / 'references/style-tokens.json').read_text())['colors']
FONTS = {
    'body': STYLE / 'assets/fonts/futura/futurawin.ttf',
    'bold': STYLE / 'assets/fonts/futura/futurawinb.otf',
    'title': STYLE / 'assets/fonts/georgia/georgiab.ttf',
}
data = json.loads((HERE / 'curated.json').read_text())
W, S = 1200, 2
measure = ImageDraw.Draw(Image.new('RGB', (2, 2)))

def font(size, kind='body'):
    return ImageFont.truetype(str(FONTS[kind]), size * S)

def wrap(text, size, width, kind='body'):
    lines, current = [], ''
    for word in text.split():
        test = (current + ' ' + word).strip()
        if current and measure.textlength(test, font=font(size, kind)) > width * S:
            lines.append(current)
            current = word
        else:
            current = test
    if current:
        lines.append(current)
    return lines

rows = []
y = 225
for r in data['records']:
    a = wrap(r['overview'], 27, 495)
    b = wrap(r['constraint'], 27, 495)
    h = 151 + max(len(a), len(b)) * 39 + 20
    rows.append((r, y, h, a, b))
    y += h + 20
H = y + 110
im = Image.new('RGB', (W*S, H*S), C['paper'])
draw = ImageDraw.Draw(im)
svg = []

def rect(x, y, w, h, fill):
    draw.rectangle((int(x*S), int(y*S), int((x+w)*S), int((y+h)*S)), fill=fill)
    svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill}"/>')

def circle(x, y, r, fill):
    draw.ellipse(((x-r)*S, (y-r)*S, (x+r)*S, (y+r)*S), fill=fill)
    svg.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}"/>')

def text(x, y, value, size, fill, kind='body'):
    draw.text((x*S, y*S), value, font=font(size, kind), fill=fill, anchor='lt')
    svg.append(f'<text x="{x}" y="{y}" dominant-baseline="text-before-edge" font-family="{kind}" font-size="{size}" fill="{fill}">{escape(value)}</text>')

text(64, 42, 'WORLDPROOF  /  DEMO COLLECTION', 22, C['indigo700'], 'bold')
text(64, 86, 'Five projects. Five design challenges.', 49, C['ink'], 'title')
text(64, 162, 'Project descriptions and assigned constraint scenarios', 27, C['muted'])
for index, (r, top, h, a, b) in enumerate(rows, 1):
    rect(40, top, W-80, h, C['lavender100'])
    text(64, top+28, 'TEAM ' + str(index), 22, C['indigo700'], 'bold')
    text(190, top+21, r['project'], 36, C['ink'], 'title')
    text(190, top+69, r['topic'], 23, C['muted'])
    text(64, top+113, 'PROJECT OVERVIEW', 21, C['indigo700'], 'bold')
    code = r['constraint_zh'].strip().split('｜')[0]
    circle(632, top+125, 5, C['coral400'])
    text(650, top+113, 'CONSTRAINT SCENARIO ' + code, 21, C['indigo700'], 'bold')
    for j, line in enumerate(a):
        text(64, top+151+j*39, line, 27, C['ink'])
    for j, line in enumerate(b):
        text(650, top+151+j*39, line, 27, C['ink'])
text(64, y+12, 'Team 1–5 are editorial labels in source order.', 21, C['muted'])
text(64, y+48, 'Source: five demo submissions. Constraint cards are hypothetical prompts.', 21, C['muted'])
im.save(OUT/'worldproof-five-demos-en.png', optimize=True)
faces=[]
for name, path in FONTS.items():
    fmt='truetype' if path.suffix=='.ttf' else 'opentype'
    mime='font/ttf' if path.suffix=='.ttf' else 'font/otf'
    faces.append(f"@font-face{{font-family:{name};src:url(data:{mime};base64,{base64.b64encode(path.read_bytes()).decode()}) format('{fmt}');}}")
(OUT/'worldproof-five-demos-en.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}"><style>{"".join(faces)}</style><rect width="100%" height="100%" fill="{C["paper"]}"/>'+''.join(svg)+'</svg>')
(HERE/'figure-layout.json').write_text(json.dumps({'width':W,'height':H,'raster_scale':S,'rows':len(rows),'body_size':27,'columns':[64,650]},indent=2)+'\n')
print(json.dumps({'png':str(OUT/'worldproof-five-demos-en.png'),'dimensions':[W*S,H*S],'rows':len(rows)}))
