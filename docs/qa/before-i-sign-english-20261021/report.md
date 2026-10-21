# Before I Sign — English illustrations on Inclusivity

21 October 2026. Local Wiki source updated; no commit, push or Wiki deployment performed.

## Delivered

Three 1280 × 720 English interface illustrations appear in `/inclusivity#before-i-sign`: the hesitant family conversation, revisitable clue sorting, and supported next-step choices. Each has an English caption, descriptive alternative text and a link to its full-size official image. User-supplied `static.igem.wiki` AVIF addresses are used directly. The page identifies the images as translated explanatory illustrations of the local Chinese prototype, not an English game release or a participant-session record. No playable game is embedded.

## Files changed in this illustration task

- `docs/human-practices/inclusivity.md`: one component stylesheet link and the Before I Sign section only. The concurrently added overview hero and its subsequently supplied CDN address were preserved.
- `static/human-practices/inclusivity-spectrum/before-i-sign.css`: dedicated, scoped figure styles.
- `static/before-i-sign/illustrations.html`: editable HTML/CSS source for the three English stills; uses the existing generated artwork and local Futura.
- `assets/human-practices/before-i-sign/before-i-sign-01-opening-en.jpg`
- `assets/human-practices/before-i-sign/before-i-sign-02-information-en.jpg`
- `assets/human-practices/before-i-sign/before-i-sign-03-choice-en.jpg`
- `assets/human-practices/before-i-sign/provenance.json`: sources, local hashes and upload addresses.
- `docs/qa/before-i-sign-english-20261021/`: this report, upload/browser verification records, desktop and mobile screenshots.

The earlier single-player source under `static/before-i-sign/` and planning materials under `docs/design/before-i-sign-20261021/` remain local. They were recovered individually from `.local-backups/primary-github-baseline-20261021-173823/untracked/` after the repository migration, without changing the adopted branch or restoring the older Home tree. The old storyboard entry now redirects to the local game; its outline records the implemented single-player status. The illustration-only request superseded the remaining game handoff work.

## Checks

- Browser decoded all three official AVIF images at 1280 × 720; `browser-image-verification.json` records their URLs and dimensions. This verifies loading/decoding, not byte identity with a converted upload. Direct network verification from the shell was unavailable; no HTTP-200 claim is made from that attempt.
- Desktop visual check at 1280 × 720; figures retain their 16:9 proportions and full captions.
- Mobile check at 390 × 844: document scroll width 390 px, no horizontal overflow, 16 px captions, images remain proportional; links work with keyboard focus. Temporary viewport override reset afterwards.
- Flask checks passed in both `local` and `igem` asset modes, at root and `/sustech`: three official images, full-size links, alternative text, captions, component stylesheet, overview hero and required licence retained.
- Existing `tests.test_wiki`: 25 passed; 1 failed for `/attributions`, whose template no longer uses the test’s exact `class="markdown-content"` string. That template and the test were unchanged by this task. No unrelated test or page was edited.
- Earlier game engine checks: 13,238 assertions passed after recovery, covering all six main endings, research branches, repairs, privacy, saves and editable puzzles. These are software checks, not evidence of user accessibility or clinical validity.
- `git diff --check` passed.

## Concurrent work and limits

Other tasks continue editing Home modules and the Inclusivity overview. This task used small edits in the game section and a new dedicated stylesheet; it did not modify shared integration files, remove another task’s lock or rebuild `public/`. Later concurrent writes remain possible. Artwork is AI-assisted; dialogue and characters are fictional. No target-user trial or medical review is claimed. The Wiki preview is local and the uploaded images are hosted officially; these source changes have not been pushed or published.
