# Fixed-logo first-entry loading

The shared layout includes `entry_loading_head.html` and `entry_loading.html`
for public Home/content routes. First entry in a browsing session shows the
letter whale, including direct content URLs. Home is the dark page; public
content routes are light. Cross-theme links record a short-lived destination
intent and navigate immediately, so destination resources initialize beneath
the incoming whale cover. Both directions use the same loader. Light-to-light
links stay native and do not replay it after first entry. Same-page anchors,
modifier clicks, downloads and external links remain native. Cross-page anchors
retain their hash. Frozen hosting prefixes and index.html are supported.

Public pages no longer load the white-hole controller, CSS, boot script or its
idle WebGL preparation. Existing review endpoints retain their previous isolated
setup; 404 remains outside the whale integration. Authored page openings remain
unchanged. The upper-left brand reuses the navigation's current SVG wordmark,
with unique gradient/clip IDs, and the caption reads `LOADING . . .`. The first dot stays visible; the second and third appear every 400ms, then return directly to one dot in a 1.2-second cycle. Their fixed width keeps the caption stationary; reduced motion shows all three dots.

The stationary silhouette and pale markings are the original hand-traced ORCA
mascot from `static/assets/wiki1-main-orca.png`. There is no swimming, tail beat,
blink, roll, scaling or whole-body rotation. A field of LOADING
letters moves clockwise inside a fixed Canvas silhouette clip at 0.85 rad/s.
Mouse/pen hover repels nearby glyphs around a 32–54px characteristic radius. Gaussian
falloff feathers its edge, with smaller peak displacement and slight per-glyph
variation to avoid a hard circular rim. Each letter
eases outward locally and returns to its rotating orbit after pointer exit,
cancel or window blur. The fixed silhouette clips displaced letters. Touch
input and reduced motion do not trigger repulsion; listeners are disposed.

Letters remain upright and the eye/belly markings remain in place. Letters use
the primary visual palette: violet #7375B2, coral pink #FB95A3 and lavender
#C6CCF4, with blush #FFDBDD markings. No bottom preview instruction is shown. The field
covers the complete logo at every angle, with no repeating pose/time reset.

Canvas 2D needs no model, font download or extra WebGL context. DPR is capped at
1.5. The complete logo scales to phone portrait/landscape viewports.

## Rendering budget

Static markings are scanline-rasterized once into a small lookup table. The
seven letters in four inks are rasterized 28 times into an in-memory canvas
atlas on initialization/resize; frames use `drawImage`, not repeated `fillText`
or polygon tests. No image files, AVIF upload or new media URL is involved.

Where transferable OffscreenCanvas and Worker are available, the same script
runs the renderer in a dedicated worker, so Home initialization cannot block
its animation callbacks. Pointer/resize messages go to that worker. Unsupported,
failed or unresponsive workers use the cached main-thread renderer; a transferred
canvas is replaced before fallback. Disposal terminates the worker and frees
the atlas.

Home renders one real frame for shader/readiness initialization, then skips
covered scene updates until the entry cover starts fading. Own page assets still
initialize concurrently. Speculative other-page HTML warming waits until the
cover is removed, then resumes at idle priority.

`?loading=preview&loading-debug=1` displays renderer-loop timing. Worker FPS
counts worker draw callbacks, not a measurement of compositor/display FPS.
Deterministic `loading-frame` snapshots use the main renderer. Normal entry has
no performance panel.

Normal playback reveals the page once its scene/DOM is ready and one second has passed,
then fades out over 240ms (260ms disposal). Home initialization failure falls
back after 3.2 seconds; the head boot watchdog removes a failed cover after 4.5
seconds. Home starts initializing concurrently.

Session storage suppresses repeat same-theme playback; cross-theme route intents replay it. Reduced motion
and history restorations skip normal entry. Storage failures and missing Canvas
remain recoverable. Disposal cancels animation, timers, observers and listeners.

Review on real Home using `?loading=preview`; it runs continuously. Click or
Escape reveals Home. `loading-frame=1200` freezes the letter phase only in
preview. Normal entry ignores this diagnostic parameter.

Validation: `node tests/entry_loading.mjs`, `node tests/entry_loading_worker.mjs`,
`node tests/entry_scene_budget.mjs` and `node tests/opening_warmup.mjs` check
fixed silhouette, clockwise flow, hover recovery, mobile bounds, readiness,
worker/fallback lifecycle, covered-scene budget, resource warming and disposal.

## Background opening preparation

The shared entry head loads `page-warmup.js` independently of animation
playback. On Home and content pages it uses idle time to fetch the
first destination in each of the five real navigation groups, with at most two
HTML requests in flight. It parses markup inertly and prefetches page-specific
CSS, scripts, up to two fonts and two opening images, including authored
`data-image` and SVG image references. Resources already present on the current
page are skipped. Initial warming is limited to 48 unique assets, reserving
additional capacity (96 total) for explicit navigation intent.

Hovering a link for 90ms, focusing it, or pressing it prioritizes its page and
promotes already-known assets to preload/modulepreload. Hovering a navigation
group prepares its first destination. Scripts are downloaded, not executed;
other pages and GPU scenes are never mounted. Same-origin routes and assets on
the current origin or static.igem.wiki are allowed. Save-data and 2G sessions
skip this feature. `pagehide` aborts requests and removes this module's hints;
history restoration reinstalls the intent listeners.

The browser and response cache headers determine reuse; this is resource
preparation, not a promise that every page will open instantly. Validate with
`node tests/opening_warmup.mjs` and the existing transition suites.
