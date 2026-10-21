# ORCA footer redesign — 2026-10-21

The approved footer replaces the previous school footer on pages that already include the shared footer. Engineering retains its existing footer-free reader.

- Keep the approved ORCA vector letterforms, the team emblem, and the official transparent English horizontal university PNG.
- Restore the full project label: **On-target RNA Correction of APOE4 for Alzheimer’s Disease**. It stays on one line in smaller, left-aligned Georgia serif.
- Align the three identities on one horizontal centerline and the four desktop section headings on one line.
- Preserve the approved eight navigation destinations, the people/impact links, three labeled QR codes, all 29 community entries and their relationship labels, and the required license/source notice.
- Community logos scroll continuously, pausing for hover, focus, touch, dialogs, hidden/offscreen state, and reduced motion. Without JavaScript the original community group remains manually scrollable and QR images remain visible.
- Reuse the code-native ORCA vector inline, with footer-specific IDs to avoid navigation gradient/clip collisions. The official school PNG is byte-identical to the source recorded in its provenance JSON.

## Validation

The approved design was visually inspected in the actual Description preview at desktop width and at 390px; caption overflow was also checked at 320px. The integrated template was then inspected at desktop width and at 390px. All four desktop headings share the same top position, the mobile page and caption have no horizontal overflow, and footer images load. The WeChat preview opens, Escape closes it, and focus returns to its trigger. Screenshots are recorded in the adjacent footer-redesign-20261021 directory.

A complete run executed 190 Python tests: 188 passed and two existing main-branch failures were reproduced with the unmodified main-branch footer/layout (whitehole asset ordering and the Attributions markdown-content assertion). These failures are unrelated to this change and were not changed here.

Local static export completed. Its 13 existing Education/Human Practices audit issues exactly match an export with the unmodified main-branch footer/layout: the footer introduces no new local audit issues. All footer local images and navigation links returned 200 on Home, Description, Model and Results. Each has 29 original community entries and three QR codes; Engineering still omits the shared footer. JavaScript syntax and whitespace checks passed.

The user-provided university upload is `https://static.igem.wiki/teams/6085/wiki/wiki-new/download-5.avif`. HTTP 200 decoding confirms 433 × 86 RGBA with transparent pixels; the original PNG stays unchanged. Both source and uploaded hashes are recorded in the provenance JSON and upload evidence. The explicit mapping is limited to this asset.

Production freeze completed. All footer image sources on Home, Description, Model, Results and 404 use the iGEM CDN, including the new school mark. The image-preview handler now reads the rendered image source, so WeChat enlargement also uses its mapped CDN URL. The production browser confirms the school image loads at natural width 433 and the enlarged WeChat image loads from the iGEM CDN.

The production audit has 12 existing issues (Attributions portrait/font assets and the Home one-c lettering font still lack mappings), identical to the unmodified-footer baseline. This change adds no production audit issues. These existing site-wide mapping issues remain outside the approved footer scope; public deployment is not claimed.
