# Fixed-logo first-entry loading

The shared layout includes `entry_loading_head.html` and `entry_loading.html`
for public Home/content routes. A visitor's first page in a browsing session
shows the letter whale, including direct entry through a content URL. Subsequent
content visits skip it. Explicit same-window Home links replay it: a capture
handler records a short-lived Home intent and uses native navigation before the
white-hole click handler runs. Hash links, modifier clicks and external links
remain native. Home-to-content keeps the existing white-hole transition.
Review endpoints (`/next` etc.) and 404 pages stay isolated. No Home template
content or authored opening is changed.

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

Normal playback reveals the page once its scene/DOM is ready and one second has passed,
then fades out over 240ms (260ms disposal). Home initialization failure falls
back after 3.2 seconds; the head boot watchdog removes a failed cover after 4.5
seconds. Home starts initializing concurrently.

Session storage suppresses repeat content playback; explicit Home clicks replay it. White-hole arrivals, reduced motion
and history restorations skip normal entry. Storage failures and missing Canvas
remain recoverable. Disposal cancels animation, timers, observers and listeners.

Review on real Home using `?loading=preview`; it runs continuously. Click or
Escape reveals Home. `loading-frame=1200` freezes the letter phase only in
preview. Normal entry ignores this diagnostic parameter.

Validation: `node tests/entry_loading.mjs` checks fixed silhouette, clockwise
letter flow, mobile bounds, readiness, bypasses, failure recovery and disposal.

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
