# Design & Media Promotion

The Team menu links to `/design-communication`. Page copy lives in
`docs/team/design-communication.md`; its dedicated template, CSS and JavaScript
keep the four-part chapter index, grouped artwork and opening independent of
other pages.

## Media

All 35 figure images, four PDF downloads, two opening animations, the reduced-motion
still and the quote font use verified `static.igem.wiki` URLs. The manifest in
`docs/design/design-communication-sources/igem-upload-links.json` records 43
URLs with MIME types, sizes, hashes and successful HTTP checks. No third-party
runtime CDN or local media dependency is added.

Directories: `design/identity`, `design/applications`, `design/stories`; each remains
below 10 MB. The 35 images use 3.49 MB of AVIF rather than 31.4 MB of PNG/JPEG.
The four PDFs retain their original bytes, selectable text and page links.
Original editing assets and portable review bundles remain in the local project
archive; they are not duplicated in this source-only PR.

The opening preserves 7.5 seconds of mascot motion, an additional 0.8-second
hold and a slow title reveal. It plays on normal page entry, skips direct section
links, provides Skip/Replay controls, releases object URLs and restores focus/inert
state. A head bootstrap keeps the page blurred between the shared loading shield and media readiness; failed or stalled media restores the page. Reduced motion shows the static character on request. To accommodate the
platform's 60-frame GIF converter limit, the original GIFs were converted to
lossless animated WebP; duplicate frames were coalesced without changing visible
pixels or the 7.5-second timeline. `runtime-transcode.json` records the checks.

## Primary visual palette

The approved reference board under Our Visual System defines #FFDBDD, #C6CCF4,
#7375B2, #303D72 and #FB95A3. Dedicated Design/opening styles use these values
with neutral white and opacity-derived blue rules/secondary text. The board uses
the verified iGEM AVIF URL; captions now run from Figure 1 to Figure 19. Existing
CDN asset filenames remain stable and their current figure numbers are recorded
in figure-asset-map.json.

## Attribution

The Rams portrait caption retains Vitsœ credit, Wikimedia Commons source and
CC BY-SA 3.0 licensing. Pinyon Script uses SIL OFL 1.1; the licence and upstream
provenance are retained in `static/fonts/design/`. Supplied team artwork remains
credited through the project records. Existing social-media reach wording is
retained; the page does not infer clinical outcomes from activity photographs.

## Validation

Run the Python suite and `node tests/design_opening.mjs`. The release also checks a
fresh Frozen-Flask build and the existing CDN dependency audit in an isolated
output directory. Desktop/mobile preview covers opening controls, transparent
corner animation, the unboxed quote, 18 figure captions, PDFs and the bilingual
post previews. The footer and unrelated ongoing work are excluded from this PR.
