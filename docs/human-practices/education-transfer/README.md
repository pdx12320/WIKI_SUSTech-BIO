# Education transfer: original B project handoff

The original editable project is retained locally; the project sources needed for the Wiki are archived alongside this record.
Entry: `education-transfer-map.html`.

`source/` is an exact review snapshot of the revised original B project, retained in the shared Wiki as required by the workspace instructions. It is not an independently redesigned replacement or a production Wiki integration. Edit the original project first and refresh this snapshot deliberately. No shared Wiki route, template, stylesheet, dependency, branch or stash was changed by this task.

`local-project-manifest.json` records the original pre-edit SHA-256, backup location and revised original file hashes. The backup is `education-transfer-map.before-20261019.html` beside the original entry. A second recovery copy is retained under `.local-backups/education-transfer-b-20261019/`.

## Changes

The selected B map's local topology, Mercator renderer and region hit testing are retained. The UI is English, with restrained dark styling, a larger map workspace, explicit source/target state, a route arrow, map zoom/reset, keyboard/tap controls and drag/drop feedback. The restored original B-style DNA loading now leads to a separate analysis page, `education-transfer-report.html`, containing all results. Back to map and reverse-route links preserve the selected route. Interviews are not repeated here.

The four evidence configurations are mainland China/Gaokao, HKDSE, Pearson Edexcel iAL, and the combined Japanese high school + AP configuration. HKDSE and iAL both use Hong Kong map callouts; the old unsupported Macau configuration and iAP labels were removed. Map geography is background context and does not assert curriculum coverage across all displayed territory.

The data preserves 24 configuration/domain records and 76 reference outcomes with PDF pages, report columns and level labels. Curriculum and examination scores remain separate 0–3 ordinal values/ranges. Original unsupported compatibility/ability metrics and transfer predictions were removed. The original ZIP and previously discussed JSON export were not located; the library was reconstructed from the two existing local team PDFs.

## Actual verification, 2026-10-19

- Original-directory `tools/check.mjs`: passed all 12 directed comparisons, reversed-route symmetry, same/unknown input rejection, range comparisons, all 76 reference outcomes, search/level filters and JSON/browser data parity.
- Retained map code with real local D3/topology and a recording canvas stub: geographic hits for all four targets at 358, 640 and 1000 px, route drawing, zoom/reset, tap selection and pan suppression passed. An initial narrow-screen framing issue was found and fixed.
- JavaScript syntax, English UI scan, unique HTML IDs, local resource paths, original backup hash and both PDF hashes passed.
- Original-directory HTTP preview on `127.0.0.1:8769`: entry, all scripts/styles, JSON and both source PDFs returned HTTP 200.
- No browser screenshots or real-browser drag/drop, keyboard, touch or layout verification completed. The browser plugin failed on a local component signature, and the available browser rejected file-protocol navigation. No browser-policy workaround was attempted.

The preview serves the original project directory. To restart it, follow `source/README-education-transfer.md`. No deployment, domain registration, push or merge was performed. The existing Wiki had extensive concurrent local changes before this task; those changes were preserved, and this task's repository writes are isolated to this new documentation/source directory and its own ignored backup folder.

## Loading and separate report revision, 2026-10-19

Restored the original B loading treatment from the preserved HTML: violet/pink DNA particles, rotating gradient frame, step indicators and progress bar. The DNA strands now animate with opposing phases. Step labels describe preparing evidence records, not predicting student ability. Normal duration is approximately 3.25 seconds. Open report now skips the animation; Back to map and Escape cancel without late navigation. Reduced motion uses an 80 ms handoff.

The map has no report section. All six-domain comparison content, outcome filters and sources render on the independent report URL. Route parameters support direct links, refresh, reverse reports, and returning to the map with the source/target retained. The report page does not load the map or loading scripts. Missing/invalid route parameters display a return-to-map prompt.

Actual changed original files in this revision: `education-transfer-map.html`, `education-transfer.js`, `education-transfer.css`, `transfer-model.js`, `README-education-transfer.md`, `tools/check.mjs`; added `education-transfer-report.html`, `education-loading.js`, and `tools/check-pages.mjs`. Only matching review snapshots and this handoff/manifest were updated inside the Wiki. Geography, source documents and knowledge data were unchanged.

Validation: original-directory checks passed all earlier model/geography checks plus the loading lifecycle, duplicate-start protection, cancellation/Escape/skip/restart/reduced-motion timing, and all 12 route reports with no map/loader globals. Tests verify back/reverse links, filters and page markup separation. The map, report URL and updated resources return HTTP 200 on the existing local preview. These are code/DOM-fixture checks; real-browser appearance and loading timing remain unverified because of the previously recorded browser-tool restrictions.

## Reading hierarchy revision, 2026-10-19

The report now uses one route heading, one six-domain comparison table and one selected-domain explanation. Short English display paraphrases are separated from the original source excerpts in `education-copy.js`. Original analysis and learning-goal panels are closed by default, and sources/scoring/scope are consolidated in a single dialog. The map has one operation instruction, shorter source names, no repeated section numbers, and a collapsed alternative target control. Team attribution is consolidated in the footer. Scores, ranges, source records, Japan/AP scope, the 76 learning goals, loading and separate-page navigation were preserved.

Changed original files: `education-transfer-map.html`, `education-transfer-report.html`, `education-transfer.js`, `education-transfer.css`, `README-education-transfer.md`, `tools/check-pages.mjs`; added `education-copy.js`. Original file hashes were checked before each write, and the pre-edit files remain in `.local-backups/education-transfer-b-hierarchy-20261019/before/`. This revision did not modify shared Wiki integration files.

Verification: all original model, topology and loading lifecycle checks passed. Updated report checks cover all 12 routes, changing the single selected domain, outcome filtering, default-closed evidence/learning panels, and back/reverse links. Static checks confirm one primary heading per page, unique IDs and English UI. HTTP health checks verify the map, report and updated resources. Browser visual verification remains subject to the previously recorded tool restrictions; no new screenshot is claimed.

## Typography revision, 2026-10-19

Changed the original `education-transfer.css` and `education-map.js` only. Replaced scattered small font declarations with shared role sizes: 14 px supporting text, 16 px reading text, 20/24 px heading tiers and 32–38 px page titles. Mobile typography uses the same readable role sizes. Controls, references, table labels, learning goals and loading text were enlarged. Tables retain horizontal overflow instead of shrinking labels. Form inputs use 16 px and touch controls have at least 42 px height. Compact map-label offsets were adjusted to accommodate larger text; the canvas attribution is now 14 px with stronger contrast.

The pre-edit files are preserved in `.local-backups/education-transfer-b-type-20261019/before/`. Source snapshots and hashes match the original project. Existing geography/model/loading/report checks passed after the change. Visual layout at actual browser widths remains unverified under the previously recorded browser restrictions; no new screenshot is claimed.

## Rounded monospace headings, 2026-10-19

Updated original `education-transfer.css` and added `fonts/sono/Sono-variable.ttf`, `OFL.txt` and `SOURCE.json`. The font is Sono by Tyler Finck, from the official Google Fonts source distribution (https://github.com/google/fonts/tree/main/ofl/sono), with project https://github.com/sursly/sono. It is served locally under the SIL Open Font License. Heading selectors cover page/section/dialog headings, curriculum names, domain choices, map labels and support-panel titles. CSS explicitly fixes the MONO axis to 1 and uses weight 650. Body text retains the existing reading font and readable role sizes; mobile heading wrapping is accommodated.

The TrueType header and variable-axis records were verified: MONO supports 0–1 and defaults to 1; weight supports 200–800. Local preview checks passed for the actual font, license and active heading stylesheet. Browser font rendering and exact wrapping have not been visually verified. The pre-edit stylesheet is preserved in `.local-backups/education-transfer-b-rounded-20261019/before.css`. Other site logic and source data were unchanged.

## Taiwan map fill, 2026-10-19

Updated only original `education-map.js`: feature 158 uses the same red base fill and outline as the mainland, in a separate geographic context layer. No curriculum label, marker or transfer hit area is added. Existing checks passed; a direct real-topology check confirms the red layer assignment, absent marker and null transfer hit over Taiwan. The repository source snapshot and manifest were refreshed. Pre-edit source is retained under `.local-backups/education-transfer-b-taiwan-20261019/`.

## Red Taiwan preview follow-up, 2026-10-19

The user screenshot still showed the previous purple fill. The local preview HTML and script were confirmed to match the revised disk files, so a stale browser asset remains a plausible explanation rather than a directly observed fact. Updated only `education-transfer-map.html` to reference `education-map.js?v=700561c9eba8`, a hash of the current map source. A fresh HTTP entry was verified to request the versioned script. A renderer-call check confirmed feature 158 is drawn exactly once with red fill and outline, with no floating curriculum marker or transfer hit area. Actual screenshot confirmation remains pending. Pre-edit HTML is retained in `.local-backups/education-transfer-b-map-cache-20261019/`.

## Black-violet background revision, 2026-10-19

Updated original `education-transfer.css`, `education-map.js`, `education-transfer-map.html` and `education-transfer-report.html`. The page uses near-black violet surfaces, restrained static purple light and a faint grid; the canvas ocean/background now matches. Typography, reading hierarchy and the red Taiwan context layer are retained. Both entry pages reference content-versioned styles, and the map script version was refreshed. Existing model/geography/loading/report checks and local HTTP resource checks passed. Exact appearance remains unverified in a real browser under the previously recorded tool restrictions. Pre-edit files are retained in `.local-backups/education-transfer-b-blackpurple-20261019/before/`.

## Frosted circular light, 2026-10-19

Updated original `education-transfer.css`, `education-map.js`, `education-transfer-map.html` and `education-transfer-report.html`. Both pages have three static purple circles with softly visible rims, blur and a frosted surface beneath all content. Decorative layers are aria-hidden and ignore pointer events. Two matching circular light fields are drawn behind the map geography. Mobile circle sizes are reduced; reading text, targets, red Taiwan fill and report behavior are retained. Resource versions were refreshed. Existing checks and HTTP resource checks passed; no real-browser visual verification is claimed. Pre-edit files remain in `.local-backups/education-transfer-b-frosted-20261019/before/`.

## Map annotations cleanup, 2026-10-19

Changed only original `education-map.js` and `education-transfer-map.html`. Removed the canvas “East Asia · Natural Earth / Mercator” text and moved “Locations identify study contexts, not curriculum boundaries.” from below the map into the page footer. The script content version was refreshed. Static placement checks and existing functional checks passed. Pre-edit files remain in `.local-backups/education-transfer-b-map-notes-20261019/before/`.

## Three-team footer logos, 2026-10-19

Changed original `education-transfer.css`, `education-transfer-map.html` and `education-transfer-report.html`; added three local logo files and `assets/collaboration/provenance.json`. Existing Wiki assets were reused for SUSTech-BIO, CUHK-HongKong-SBS and HG-Tokyo, in that order, with English captions. Images have equal visual slots, retain artwork/colors and fit without distortion. SUSTech and HG-Tokyo use proportionally reduced WebP copies; the CUHK AVIF is copied unchanged. Provenance records source and derivative hashes. The footer scope statement remains below the marks. Static checks verify three named local images on each page; HTTP resource checks passed. Browser layout remains unverified under the previously recorded restrictions. Backups remain in `.local-backups/education-transfer-b-footer-logos-20261019/before/`.
