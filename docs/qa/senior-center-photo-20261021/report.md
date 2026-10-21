# Senior-center photograph in Inclusivity 1.2

21 October 2026. Source change: `docs/human-practices/inclusivity.md` only, adding the user-supplied official AVIF image after the opening paragraph of section 1.2. The exact caption is retained: “Team members visited the senior center to gain firsthand understanding.”

The image links to its full-size original, includes alternative text and intrinsic 1280 × 1280 dimensions, and preserves its full square composition. Existing figure styles are reused, with a 36-rem maximum width. Previous manuscript edits, including the overview and game figures, are preserved.

Checks: Flask `/inclusivity` returned 200 with the exact caption and figure between sections 1.2 and 1.3; browser decoded the official image at 1280 × 1280; `git diff --check` passed. `preview.jpg` records the local page. No shared integration file, shared build, commit, push or deployment was changed. Other concurrent edits remain present.
