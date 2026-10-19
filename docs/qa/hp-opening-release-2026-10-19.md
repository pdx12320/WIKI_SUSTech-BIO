# HP opening release verification · 2026-10-19

## Scope

Prepared from GitHub main at `72aedaf` in an isolated release checkout. The shared
working branch and other tasks' uncommitted changes were not replaced or staged.
The HP template adds only the opening include, stylesheet and script. Experimental
palette pages, old screenshots and other HP body changes are excluded.

## Confirmed behavior

- Original photograph enters downward as a curtain; the full question appears in white.
- Three solid clipped THIS rows use orange/purple/orange, wrap around the cup above
  the liquid, and enter downward in sequence. The final label includes the approved
  1.5-degree clockwise alignment adjustment and refined T-cap crops.
- Three precomputed SVG paths replace the earlier 120-part mesh. Entry uses
  320 ms motion and 100 ms stagger. The user confirmed the optimized local playback
  was fluid; this is user acceptance, not a measured browser frame-rate result.
- Arrow smoothly targets the standard content-page start (`#main-content`).
- Small attribution remains a single cream-colored line with a leading asterisk.
- Reduced motion renders the final composition without entry animation.

## Checks

- Full Python suite: 144 tests passed. The existing suite's lxml dependency was
  installed in a temporary test-only directory; project dependencies were unchanged.
- JavaScript syntax and `git diff --check`: passed.
- Full Frozen-Flask build to a task-specific temporary destination: passed.
- Strict build/media audit: 25 required routes passed, including CDN enforcement.
- Added HP integration checks cover the complete accessible question, short reading
  target, all three photo layers using the official CDN, and deterministic regeneration
  of exactly three curved paths with no runtime glyph clips or mesh instances.

## Photo evidence

User supplied the official upload URL:
https://static.igem.wiki/teams/6085/wiki/hp/banana-dna-original.avif

HTTP 200, image/avif, 42,937 bytes, 1440 × 960; dimensions match the supplied JPG.
RGB RMS compression difference from the original was below 1.14 on each 0–255 channel.

- Original JPG SHA-256: `52da07b331eb396dc92b9db243614e2ab51ecbfba45b626c11bd8ff320a0b037`
- CDN AVIF SHA-256: `7d68c241e8b2eb25f8bb0f789e6d2a1478a6f18291e824e14d7de0ea03a80a57`

Asset mapping and upload evidence record both the local original and the verified CDN.
No generated public output, historical design studies or unrelated local edits are included.
