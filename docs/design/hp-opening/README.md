# Human Practices photographic opening

The HP page opens with a downward photographic curtain and the complete question,
“What can we do with THIS once we have extracted it?” Text is white; three clipped
THIS rows use orange/purple/orange and wrap around the cup above the liquid.
A rounded arrow smoothly moves to the standard HP content below the photograph.

The lettering uses three precomputed SVG outline paths. No runtime triangle mesh,
font decoding for the cup print, or per-glyph clipping is needed. Each row slides
down for 320 ms, with 100 ms stagger. Reduced motion displays the final composition.
The original photo and foreground use the same viewBox/crop at narrow widths.

## Sources and regeneration

- `assets/human-practices/opening/banana-dna-original.jpg`: supplied original (1440 × 960).
- Official CDN: https://static.igem.wiki/teams/6085/wiki/hp/banana-dna-original.avif
- `wiki/components/human-practices/opening.html`: layered photo and copy.
- `wiki/components/human-practices/cup_print.html`: generated curved outlines.
- `static/human-practices/opening/opening.css` and `opening.js`: isolated styling and entry controller.
- `this-glyph-outlines.json`: cached Futura Bold contours, not an embedded font.

Regenerate the cup component using `python scripts/build_hp_cup_projection.py`.
It uses only the Python standard library and reproduces the checked-in component.
The optional `scripts/extract_hp_cup_glyphs.py` requires fontTools and macOS Futura;
run it only to change the source lettering. No new runtime dependencies are added.

The photograph is unchanged. The final foreground clip and lettering are native
SVG/CSS. Early image-generation studies and palette previews are local design
material and are not part of this release.
