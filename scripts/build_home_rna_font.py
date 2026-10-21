"""Extend the project's original ORCA C with matching G/U for RNA labels.

The brand font is intentionally unchanged. This small derived font contains
only space/C/G/U. Its G and U follow the C's 80-unit cap height, 18-unit
strokes, rounded bowls, diagonal cut and 92-unit advance.
Run with a development Python that has fontTools and Brotli installed.
"""
from pathlib import Path
import argparse
from fontTools.ttLib import TTFont
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools import subset


def build(source, destination):
    font = TTFont(source)
    original_c = font['glyf']['C'].getCoordinates(font['glyf'])[0][:]

    def glyph(commands):
        raw = TTGlyphPen(None)
        pen = Cu2QuPen(raw, max_err=0.5, reverse_direction=False)
        for op, points in commands:
            coords = [(x * 10, (90 - y) * 10) for x, y in points]
            getattr(pen, op)(*coords)
        return raw.glyph()

    g = [('moveTo', [(84, 23)]), ('lineTo', [(71, 36)]),
         ('curveTo', [(66, 30), (59, 27), (49, 27)]),
         ('curveTo', [(34, 27), (28, 35), (28, 50)]),
         ('curveTo', [(28, 65), (34, 73), (49, 73)]),
         ('curveTo', [(58, 73), (64, 71), (69, 67)]),
         ('lineTo', [(69, 57)]), ('lineTo', [(51, 57)]),
         ('lineTo', [(51, 42)]), ('lineTo', [(86, 42)]),
         ('lineTo', [(86, 77)]),
         ('curveTo', [(77, 86), (65, 90), (48, 90)]),
         ('curveTo', [(22, 90), (10, 76), (10, 50)]),
         ('curveTo', [(10, 24), (22, 10), (48, 10)]),
         ('curveTo', [(65, 10), (76, 14), (84, 23)]), ('closePath', [])]
    u = [('moveTo', [(12, 10)]), ('lineTo', [(30, 10)]),
         ('lineTo', [(30, 59)]),
         ('curveTo', [(30, 69), (36, 74), (48, 74)]),
         ('curveTo', [(60, 74), (66, 69), (66, 59)]),
         ('lineTo', [(66, 10)]), ('lineTo', [(84, 10)]),
         ('lineTo', [(84, 60)]),
         ('curveTo', [(84, 81), (72, 90), (48, 90)]),
         ('curveTo', [(24, 90), (12, 81), (12, 60)]), ('closePath', [])]
    order = list(font.getGlyphOrder())
    for name, commands, bearing in [('G', g, 100), ('U', u, 120)]:
        font['glyf'][name] = glyph(commands)
        font['hmtx'][name] = (920, bearing)
        order.append(name)
    font.setGlyphOrder(order)
    for table in font['cmap'].tables:
        if table.isUnicode():
            table.cmap.update({ord('G'): 'G', ord('U'): 'U'})
    for platform, encoding, language in [(3, 1, 0x409), (1, 0, 0)]:
        for name_id, value in [(1, 'ORCA RNA'), (4, 'ORCA RNA Regular'),
                               (6, 'ORCARNA-Regular')]:
            font['name'].setName(value, name_id, platform, encoding, language)
    subsetter = subset.Subsetter()
    subsetter.populate(text=' CGU')
    subsetter.subset(font)
    font.flavor = 'woff2'
    destination = Path(destination)
    destination.parent.mkdir(parents=True, exist_ok=True)
    font.save(destination)
    result = TTFont(destination)
    assert result['glyf']['C'].getCoordinates(result['glyf'])[0][:] == original_c
    assert all(ord(letter) in result.getBestCmap() for letter in 'CGU')
    assert len({result['hmtx'][letter][0] for letter in 'CGU'}) == 1
    print('Built ORCA RNA: original C preserved, matching G/U, equal advances.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--source', default='static/brand/orca-mono.ttf')
    parser.add_argument('--out', default='static/onetake/one-c-lettering.woff2')
    args = parser.parse_args()
    build(args.source, args.out)
