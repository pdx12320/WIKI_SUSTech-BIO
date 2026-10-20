# ORCA Mono

Approved custom four-letter monospace wordmark with a 92-unit advance. The O contains a purple gradient sea and a tapered white S-shaped reflection; the A uses the approved raised balance without a whale tail.

The editable master is `static/brand/orca-mono.svg`; `wiki/components/orca_wordmark.html` supplies the existing navigation entry with light/dark inherited ink. `static/previews/orca-mono-wordmark.html` shows the letterform study.

`static/onetake/orca-opening-wordmark.mjs` reuses the approved outlines with unique IDs for the opening fault layers. `orca-opening-wordmark.css` sets a 74vw opening up to 1040px (86vw on small screens), places supporting text below and adds intermittent 5.7-second slice/color faults. Reduced motion disables the effect; hidden rooms pause it. No external fonts or asset requests are required.

`home-large-wordmark.png` records the opening layout. Original vectors authored for this project using the ORCA indigo/lavender/coral palette.

Validation: 145 Python checks passed; memory tunnel and full-screen fault checks passed; JavaScript syntax and diff whitespace checks passed. The final opening was visually checked alongside the current sea-glass navigation.

## Selectable Design-page exhibit (2026-10-20)

The identity section on `/design-communication#orca-wordmark-design` uses three inline SVGs with actual `ORCA` text. `static/design-orca-wordmark.css` supplies the original four-glyph font. Explanations remain normal HTML text; the hero is pure white, followed by lavender and navy examples.

`static/brand/orca-wordmark-study.svg` is a self-contained, selectable vector board with an embedded font. `orca-mono-selectable.svg` contains the standalone lettering. `orca-mono.ttf` supports reuse in design applications. Source: `scripts/build_orca_copyable_wordmark.py` (optional authoring dependencies: fonttools and brotli; no runtime dependency). `design-page-fragment.html` mirrors the reusable page section.
