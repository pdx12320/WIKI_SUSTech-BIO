# Design & Media Promotion release verification

Base: upstream/main at 763e79b. Work is isolated from the shared development checkout and includes only the new Design page, scoped presentation modules, Team route/navigation integration, verified asset records, font licence and tests. No home, footer or other active task source is copied.

- Python: all 140 tests passed, including 4 new Design route/media checks. Validation used the existing Python 3.13/lxml runtime with the shared environment's pure Python Markdown dependencies; no dependency file changed.
- `node tests/design_opening.mjs`: autoplay/replay, fresh decoding, 0.8-second hold, slow reveal, reduced motion, Escape/skip, focus/inert restoration and failed-loading recovery passed.
- Fresh Frozen-Flask build in /tmp/orca-design-release-20261019; existing build and CDN audit passed (25 required routes, plus the new Design output). No generated public/ output is committed.
- 42 page-specific media/font URLs returned HTTP 200. 34 AVIF figures and 4 PDF documents verified; PDFs byte-identical, PDF page fragments preserved. Two lossless animated WebP tracks retain all visible source pixels and the 7.5-second timeline, plus static reduced-motion image and OFL script font; runtime CORS headers are valid.
- Browser on release worktree port 8249: 34/34 figures loaded; complete unboxed script quotation and right-side portrait, all 18 captions at 14 px. At 390×844, document scroll width is 390, quote background is transparent, and figures remain loaded. Viewport restored.
- Opening played from the hosted WebP files and returned to the page with normal controls. Normal entry, section navigation and Replay retain their established behaviour.
- Desktop/mobile screenshots accompany this record. `git diff --check` passed. Final user preview was opened before PR creation.

The 34 images total 3,470,587 bytes versus 31,401,006 bytes of original PNG/JPEG assets (approximately 89% less). Each of design/identity, design/applications and design/stories remains below 10 MB including the extra runtime assets. Original editing media and prior local bundles remain preserved in the shared project archive; this PR adds source and official asset references only.

## Loading-to-opening handoff correction

A synchronous head bootstrap installs an 18 px blur cover before the first paint, below the shared loading shield. The opening controller then shows the real blur mask before awaiting hosted media, replacing the head cover in the same JavaScript task. There is no uncovered asynchronous gap. Fetch/decode failures and a 10-second preparation timeout restore page interaction; a separate watchdog releases the head cover if the deferred controller fails. Hash links and reduced-motion entry retain their exceptions. VM checks cover the pre-await state, stalled fetch and recovery, alongside a route check for the non-deferred head script. Browser reload confirmed the head script and visible 18 px mask; the handoff screenshot is included. Shared loading code is unchanged.
