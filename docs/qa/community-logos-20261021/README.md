# Community logos — 21 October 2026

Adds eight company name/logo pairs to the existing Community strip after RiboNext, without new categories. Guangzhou Ruibo is omitted because no logo was supplied. Procell uses its official website header mark. The two iGEM team marks are replaced with the originals used by the official 2026 SUSTech-MED and HKU-HongKong sites.

All eight company originals are preserved locally and mapped to verified uploads in the SUSTech iGEM CDN directory `community-20261021`. The new team marks use their confirmed original iGEM CDN URLs. Upload conversion preserved image dimensions and produced mean RGB differences below 0.5 on a 0–255 scale. The Elabscience source is PNG despite the kit's JPG extension; the local filename is corrected without changing its bytes.

The previous uploaded versions of display-manifest.json and manifest-part2.json describe outdated contents. Their old upload evidence is retained but is no longer treated as a current mapping. The footer renders the maintained local entries directly. Company logo fit uses a CSS class so it remains correct after CDN filename conversion.

Verification:
- Desktop and 390 px mobile previews: names, horizontal scrolling, no page overflow, and image enlargement checked.
- All ten changed logos load locally and use confirmed static.igem.wiki URLs in production.
- 190 regression tests: 188 pass; the same two Attributions/whitehole assertions fail on the unchanged main-branch baseline (fa0f993). See tests.json and baseline-tests.json.
- Production static freeze and 24-route/link audit pass. Strict CDN audit still reports eleven existing Attributions portrait/font mappings, identical to baseline. No new CDN issues remain. See build-comparison.json.
- git diff --check passes.

This change does not establish public deployment. Uploading assets and merging the source are separate actions from the team Wiki deployment.
