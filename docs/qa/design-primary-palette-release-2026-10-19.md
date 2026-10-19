# Design primary palette — release verification

The user approved the layout and requested removal of “supplied by the team” from the caption. The final caption is “Figure 2. ORCA’s primary visual palette.”

The supplied five brand colors are #FFDBDD, #C6CCF4, #7375B2, #303D72 and #FB95A3. The dedicated Design/opening styles use these values with neutral white and opacity-derived blue rules/secondary text. Shared site styles are unchanged.

The original JPG is preserved in the local project archive as assets/images/design-communication/identity/visual-system-primary-colour-palette.jpg (39,476 bytes). iGEM uploaded it as https://static.igem.wiki/teams/6085/wiki/design/identity/visual-system-primary-colour-palette.avif (17,291 bytes, 1276×1198, SHA-256 6e75ef9d4af34b1029e50f806099189b944a7cd57174c243f2f7ac302cdda588). HTTP 200 and image/avif were verified by downloading and decoding the file. Both image and full-size link now use the official URL. All 43 media/font dependencies are recorded, and each Design server folder remains below 10 MB.

The page now has 35 images and 19 sequential figure captions. Existing official asset filenames remain stable; figure-asset-map.json records the new caption numbering. The compact board/key layout is the approved preview. At 390 px the preview had scroll width 390 and stacked the image above a two-column key; the viewport was restored. Final browser preview confirmed the hosted image decoded at 1276 px, exact five computed swatch colors, blue body text rgb(48, 61, 114), and the final caption. The hosted screenshot accompanies this note.

Checks: all 141 Python tests passed; node tests/design_opening.mjs passed; a fresh Frozen-Flask build in /tmp/orca-design-palette-release-20261019 and its existing CDN audit passed. Git diff whitespace check passed. Validation was performed on upstream/main 9272523 plus this scoped palette change.

Changed delivery files:
- docs/team/design-communication.md
- docs/team/design-communication-README.md
- static/design-communication.css
- static/design-opening.css
- docs/design/design-communication-sources/figure-asset-map.json
- docs/design/design-communication-sources/igem-upload-links.json
- tests/test_design_communication.py
- docs/qa/design-primary-palette-hosted-2026-10-19.png
- docs/qa/design-primary-palette-release-2026-10-19.md

The imported JPG and earlier layout-review screenshots remain preserved locally, outside this source-only PR. No footer, home, shared navigation or unrelated page source is changed.
