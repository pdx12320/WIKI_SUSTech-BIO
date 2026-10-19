"""One-time font outline extraction; runtime SVG generation uses the saved JSON.
Run with a Python environment containing fontTools. No font file is embedded.
"""
import json
from pathlib import Path
from fontTools.ttLib import TTCollection
from fontTools.pens.basePen import BasePen

ROOT = Path(__file__).resolve().parents[1]
font = TTCollection('/System/Library/Fonts/Supplemental/Futura.ttc').fonts[2]
glyphs = font.getGlyphSet()
scale = 100 / font['head'].unitsPerEm

class FlattenPen(BasePen):
    def __init__(self):
        super().__init__(glyphs)
        self.contours = []
        self.current = []
    def _moveTo(self, point):
        self.current = [point]
    def _lineTo(self, point):
        self.current.append(point)
    def _curveToOne(self, p1, p2, p3):
        p0 = self._getCurrentPoint()
        for i in range(1, 33):
            t=i/32; q=1-t
            self.current.append(tuple(q*q*q*p0[k]+3*q*q*t*p1[k]+3*q*t*t*p2[k]+t*t*t*p3[k] for k in (0,1)))
    def _qCurveToOne(self, p1, p2):
        p0=self._getCurrentPoint()
        for i in range(1, 33):
            t=i/32; q=1-t
            self.current.append(tuple(q*q*p0[k]+2*q*t*p1[k]+t*t*p2[k] for k in (0,1)))
    def _closePath(self):
        if self.current: self.contours.append(self.current)
    def _endPath(self):
        self._closePath()

outlines=[]
x=0
for character in 'THIS':
    name=font.getBestCmap()[ord(character)]
    pen=FlattenPen()
    glyphs[name].draw(pen)
    outlines.extend([[(x+px*scale, -py*scale) for px,py in contour] for contour in pen.contours])
    x+=font['hmtx'][name][0]*scale-6.5
# SVG textLength applies to the advance of all four glyphs, excluding a trailing gap.
width=x+6.5
outlines=[[[round(px*270/width,5),round(py,5)] for px,py in contour] for contour in outlines]
data={'font':'Futura Bold','font_size':100,'text':'THIS','text_length':270,'contours':outlines}
(ROOT/'docs/design/hp-opening/this-glyph-outlines.json').write_text(json.dumps(data,separators=(',',':'))+'\n')
print('Saved reproducible glyph outlines without embedding a font.')
