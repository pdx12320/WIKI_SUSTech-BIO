# Whale loading: cross-theme navigation — 2026-10-20

Prepared as an isolated PR against GitHub main. No production deployment is asserted.

## Behavior

- Home (dark) to public content (light), and content to Home: immediate native navigation with a destination whale cover. Destination starts loading immediately.
- Light to light: native navigation without replay, after the initial session visit.
- First visit still uses the whale on any public route. Reduced motion/history restoration bypass normal playback. Same-page anchors, modified clicks, external links, downloads, review routes remain native.
- Public layout no longer loads the white-hole controller or idle shader preparation. Isolated review routes retain their previous integration.
- Upper-left logo reuses `components/orca_wordmark.html` with namespaced SVG IDs. Caption is `LOADING . . .`.

## Changed files for this request

- `wiki/layout.html`: conditional legacy include only; other live layout edits preserved. Cooperative lock acquired/released.
- `wiki/components/entry_loading.html`: shared SVG wordmark and dots.
- `static/entry-loading/entry-loading.css`: wordmark dimensions.
- `static/entry-loading/boot.js`: cross-theme intent and native navigation.
- `static/entry-loading/page-warmup.js`: standalone Home base after removing legacy boot dependency.
- `static/entry-loading/README.md`: current route behavior.
- `tests/entry_loading.mjs`, `tests/test_entry_loading.py`: route direction, one-shot/stale intent, frozen prefix, anchor, modifier, reduced-motion, integration and unique-logo-ID checks.

Previous local performance changes in renderer, onetake guard and worker tests remain preserved.

## Verification

Passed: entry_loading.mjs, entry_loading_worker.mjs, entry_scene_budget.mjs, opening_warmup.mjs; two Python entry integration tests; JavaScript syntax; scoped diff whitespace check.

Browser automation unavailable during this check: browser plugin native dependency rejected by macOS code-signature validation. No new browser FPS or visual verification is claimed. Preview remains on port 8203.

## Follow-up: persistent first dot and full route audit

The first dot now stays visible throughout the 1.2-second cycle. Second and third dots appear at 400ms intervals, followed directly by the first-dot state. Caption width stays fixed. Changes: `static/entry-loading/entry-loading.css` and its README.

Expanded `tests/entry_loading.mjs` to exercise all 25 registered content destinations from Home, each destination back to Home, and every light-to-light pair. Tests pass, including explicit Home → Team intent and whale renderer initialization. Expanded `tests/test_entry_loading.py` to render every registered public route and assert exactly one whale integration and no white-hole resource URLs. Both integration tests pass. Scoped whitespace checks pass. No shared integration edits were needed for this follow-up.

## Isolated PR validation

Based on GitHub main `a81de50`. Only this task's 15 files are included; layout is a one-line conditional and onetake is the eight-line cover guard. Other live home/navigation/content changes were not copied.

- Four loading JavaScript suites, syntax and staged whitespace checks passed.
- Full Python discovery ran 161 tests: 160 passed; one legacy production asset-order assertion expected the removed white-hole script. That assertion now checks `asset-runtime.js` precedes `entry-loading/boot.js`. The complete 11-test asset module passed after this test-only correction; the other 160 tests were not repeated.
- Frozen-Flask build succeeded in a task-specific temporary output directory; build audit passed all 24 required routes and resource/link checks.
- No new media file, upload link or runtime dependency is required. The existing main test dependency lxml was installed in a temporary test directory only.
