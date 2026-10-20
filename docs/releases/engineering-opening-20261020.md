# Engineering opening · 2026-10-20

`/engineering` opens on the approved chapter cover and waits for a click or tap before revealing the existing interactive map. The cover reuses the DBTL component with its own noninteractive SVG IDs and the Engineering mascot head crop. “An Odyssey to ORCA” uses Libre Baskerville Italic in #7375B2 with a continuous soft reveal. It has no typewriter cursor, extra explanatory text or category footer.

Direct chapter links and history restoration bypass the cover. Replay restores it. Keyboard activation, mobile taps, reduced motion and the no-JavaScript reader fallback remain available. The opening stops the shared generic loading cover from playing as a second arrival.

## Validation

- 162 Python tests passed on the integrated current-main source.
- `tests/engineering_opening_browser.cjs` passed: persistent cover, click/tap and keyboard entry, original reader DBTL links, replay, direct links, mind-map switch, mobile bounds, reduced motion and no-JavaScript fallback. No page errors.
- Production-mode Frozen-Flask export completed. Standard build audit passed for 24 required routes with local asset dependencies present.
- Diagnostic reachable-media audit visited 301 documents and found no missing files; exactly one media file remains local: `static/fonts/headers/LibreBaskerville-Italic.ttf`.
- The unmodified strict CDN auditor encounters a pre-existing `ENAMETOOLONG` error while scanning a minified PDF.js literal. The diagnostic scan ignored only these invalid filename candidates; this does not count as a passing strict CDN audit.
- `git diff --check` passed.

## Media and publication boundary

The existing Engineering mascot is already mapped to iGEM's CDN. Libre Baskerville is committed with its SIL Open Font License and source/hash provenance. Its CDN upload is still pending: the current official upload page returned HTTP 403 for the active account. No CDN URL was invented and no validation policy was weakened. GitHub merge does not establish public iGEM deployment.

Upload the font under its fingerprinted filename, then import the returned official URL with `scripts/import_asset_uploads.py` and regenerate `asset_mapping.csv` before publishing:

`static--fonts--headers--librebaskerville-italic--22a7e0fa0e.ttf`

Font and color comparison pages and intermediate QA outputs are kept in the local design workspace and are excluded from this release.
