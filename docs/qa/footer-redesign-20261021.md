# ORCA footer redesign — 2026-10-21

The approved footer replaces the previous school footer on pages that already include the shared footer. Engineering retains its existing footer-free reader.

- Keep the approved ORCA vector letterforms, the team emblem, and the official transparent English horizontal university PNG.
- Restore the full project label: **On-target RNA Correction of APOE4 for Alzheimer’s Disease**. It stays on one line in smaller, left-aligned Georgia serif.
- Align the three identities on one horizontal centerline and the four desktop section headings on one line.
- Preserve the approved eight navigation destinations, the people/impact links, three labeled QR codes, all 29 community entries and their relationship labels, and the required license/source notice.
- Community logos scroll continuously, pausing for hover, focus, touch, dialogs, hidden/offscreen state, and reduced motion. Without JavaScript the original community group remains manually scrollable and QR images remain visible.
- Reuse the code-native ORCA vector inline, with footer-specific IDs to avoid navigation gradient/clip collisions. The official school PNG is byte-identical to the source recorded in its provenance JSON.

## Validation

The approved design was visually inspected in the actual Description preview at desktop width and at 390px; caption overflow was also checked at 320px. The final integrated template still needs a fresh browser observation because the browser connection became unavailable during promotion.

A complete run executed 190 Python tests: 188 passed and two existing main-branch failures were reproduced with the unmodified main-branch footer/layout (whitehole asset ordering and the Attributions markdown-content assertion). These failures are unrelated to this change and were not changed here.

Local static export completed. Its 13 existing Education/Human Practices audit issues exactly match an export with the unmodified main-branch footer/layout: the footer introduces no new local audit issues. All footer local images and navigation links returned 200 on Home, Description, Model and Results. Each has 29 original community entries and three QR codes; Engineering still omits the shared footer. JavaScript syntax and whitespace checks passed.

The English university PNG still needs an official iGEM upload URL before the production asset mapping and merge can be completed.
