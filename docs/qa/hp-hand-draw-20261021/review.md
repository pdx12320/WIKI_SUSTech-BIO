# HP Figure 1 drawing playback — 21 October 2026

The original supplied raster remains the artwork and accessible linked image. An HP-only SVG mask reveals it with a pencil following alternating lower-left/upper-right passes. It plays once in about 26 seconds; Pause/Resume, Show full figure and Replay drawing are keyboard-accessible. Reduced motion, print, failed image/style loading or failed initialization retain the static original. The existing animated 3E cycle remains below the three model definitions.

Twenty named drawing parts include complete semantic groups. Each person/group illustration and every caption line share a single region. The previous Children and Public participants rectangles missed the top/left of their headings; all regions have now been checked against the 1685×1000 original. A completed region is displayed intact, followed by a 180ms settling interval before the next part. Active hatching is clipped to its region. There is also a final whole-image reveal, but it is not needed to repair missing lettering.

Verification:

- 185 existing tests passed. Both module syntax checks and source whitespace checks passed.
- `check_coverage.py`, run from the repository root with the available Pillow/NumPy/SciPy, checks the original dark/color ink (minimum RGB channel <180) against the completed regions and sampled curved strokes. All 178,274 ink pixels are covered; none are outside the plan. This geometric check supplements visual review; it is not a patient or scientific measurement.
- Desktop actual playback paused at 85.4%: all 17 preceding parts, including the complete Children illustration, title and workshop caption, had opacity 1 before the Public participants part. Pause held its progress across tool calls; Resume completed all 20 parts and the full mask reached opacity 1.
- Mobile 390px: first playback, skip, replay, keyboard pause and full figure verified. A stale visibility condition after viewport changes was fixed by refreshing the visible bounds on replay/resume. Final replay advanced to 20% and paused; full figure completed all 20 parts. Document width stayed 390px. The original 3E cycle remains below the definitions. No console errors were observed.
- Production freeze into a task-specific destination and strict CDN/media audit passed for 24 routes. A clean build exposed a pre-existing relative survey-data link that was not registered with Frozen-Flask; the HP link and its HP figure generator now use the recognized asset form. The JSON is emitted and the final frozen page retains the relative deployment-safe link. No shared build code was changed.
- Screenshots capture the completed Children group while Public participants is being drawn, mobile playback and the final complete image.

Product files: hand-draw.mjs, hand-draw.css and overview-page.mjs under static/human-practices/overview/. The HP survey-data link and its generator also receive that one-path build fix. No new media upload, page or global stylesheet is required. The separate placement commit also changes HP Markdown and overview-page.css. Other tasks' primary-checkout changes are preserved.
