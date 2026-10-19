# Team page update — 2026-10-20

Prepared from current GitHub main in an isolated checkout. The shared source checkout, branch, staged index and unrelated work were preserved.

## Behavior

- Four iGEM-hosted AVIF collages use 56% owner-colored washes, joined colored outlines and fixed rounded title lettering.
- Images decode before the puzzle appears; failures expose retry instead of empty photo panels. Photo and outline move together.
- Click, scroll, swipe or keyboard opens the puzzle; waiting does not. The separate PKG action retains loading, two image cycles and the completion animation.
- Four tilted pieces remain visible at the corners, with the latest larger visible areas. The roster is blurred immediately behind them. Team letters enter earlier.
- Five mascot poses flank the title; member extraction links scroll to and briefly enlarge/wiggle the corresponding card.
- Existing member folder filters remain available. Cards omit corner numbers and keep leader badges clear of faces.
- User-confirmed portraits, framing, quotes and Poet/Fashion tags are included. Min Zhang remains Secondary PI, matching the official roster.
- The campus photograph fills the scroll-driven closing banner.

## Verification

Six Team JavaScript suites cover compilation, filters, extraction links, mascots, rotated corner geometry and atomic image readiness. All 149 Python tests passed. Frozen-Flask build and the build/link audit passed for all 24 required routes. git diff --check passed. The latest approved browser screenshot is retained in team-more-corners-20261020.png.

## Media hosting

Puzzle collages, PKG frames and the new Min Zhang / Zefeng Wang portraits use iGEM CDN URLs. Some existing portraits and fonts, the new mascots, Fuxing Zeng's selected portrait and campus photograph still use repository-local files. This PR publishes GitHub source; it does not claim a completed iGEM GitLab deployment or relax the existing strict CDN audit.
