# Sea-glass navigation and whale-tail ORCA wordmark

Current implementation: Revision 5 below. Earlier sections record the design
iterations and checks before the publication request. Publication targets only
`design/sea-glass-menu`; main and deployment remain outside this request.

The selected design combines a pale teal frosted surface, layered ocean currents,
and an ORCA serif wordmark with waves inside O and a whale tail at the A apex.
The existing SUSTech-BIO mascot logo and the wordmark stay at the left of the bar.

## Implementation

- `wiki/menu.html`: adds the scoped navigation class and two decorative components;
  existing routes, labels, accessibility attributes, and RNA interactions remain.
- `wiki/layout.html`: loads `static/navigation-sea-glass.css` after existing navigation styles.
- `static/navigation-sea-glass.css`: frosted surfaces, responsive layouts, focus
  treatment, and readable colors on both Home and reading pages.
- `wiki/components/navigation/sea_current.html`: parameterized inline SVG currents
  with unique gradient IDs for the header and each dropdown.
- `wiki/components/navigation/orca_wordmark.html`: outlined Didot Regular lettering
  with custom wave and whale-tail paths. No font file, remote image, or runtime
  dependency is added. The home link provides the accessible name.

The implementation follows the approved AI-generated visual concept, not a
flattened screenshot. The wordmark and current shapes remain scalable vectors.
Existing mascot artwork is reused. Reading content and scientific claims are unchanged.

## Responsive behavior

- At 1060 px and above, the brand, navigation links, and search share one row.
- From 600–1059 px, the brand remains left aligned above a row of navigation links.
- Below 600 px, the six links use a three-column, two-row grid so labels remain legible.
- Small-screen dropdowns are centered, constrained to the viewport, and scroll
  internally when the screen is short. The last group uses the same positioning.
- Existing keyboard, touch, search, navigation hiding, and reduced-motion behavior
  is retained. Reduced-transparency preferences receive an opaque surface.

## Validation

Actual browser screenshots and the verification report are saved under
`docs/previews/sea-glass-navigation-2026-10-19/`.

- `python -m unittest discover -s tests -p test_wiki.py -v`: all 26 checks passed.
- `node tests/navigation_scroll.mjs`: all navigation direction, focus, Home story,
  and Engineering visibility checks passed.
- Browser validation passed at 1440×900, 1060×800, 1024×768, 768×1024, 600×900,
  599×900, 390×844, 320×568, and 667×375. Every dropdown stayed within the viewport,
  had unclipped labels, and allowed reaching the final item.
- Keyboard ArrowDown/Escape, search filtering, touch C-to-U, pointer hover, and
  outside-click dismissal passed. Additional Home, Engineering, and Model checks
  passed with no JavaScript page errors. Home used its reduced-motion fallback;
  the full WebGL narrative was not replayed.
- Normal-motion Description rendering and reduced-motion views were inspected.
- `git diff --check` passed.

Validation uses the existing Python environment (Python 3.12.14, Flask 3.1.3,
Frozen-Flask 1.0.2, Markdown 3.11, PyYAML 6.0.3), Node 24.19.0, bundled
Playwright 1.62.1, and installed Chrome. No dependencies were installed or upgraded.

Scope of delivery: local source changes and actual browser previews. No commit,
push, pull request, or deployment was performed for this design task.

## Revision 2: night ocean and interaction refinements

- Removed the active top-level navigation underline and the decorative arrow in
  the footer's team link; the link and accessible page state remain intact.
- Replaced the navigation's PNG whale with an original inline side-profile orca
  (`swimming_orca.html`); the mascot and ORCA lettering now have matching visual
  heights while retaining the original logo asset.
- Home alone receives a deep teal-blue surface, softly luminous currents and
  sparse floating plankton (`night_plankton.html`). Other pages retain sea glass.
- Replaced synchronous glyph-mask sampling and colour reconstruction with 32
  decorative plankton dots. The actual menu surface and labels appear immediately
  in their final colours; reduced motion skips these decorative animations.
- The animated Home now offers navigation at its opening, slides it above the
  viewport after entering the story, and restores it on return to the opening or
  arrival at the project index. Static Home retains ordinary navigation scrolling.
- Added Home opening/rewind assertions to `tests/navigation_scroll.mjs`.

Revision 2 validation: the 26 route tests and navigation-scroll checks passed.
All 12 browser viewport/route scenarios passed again, including keyboard, search,
touch disclosure and label bounds. A normal-motion Home browser run verified the
actual WebGL opening, wheel-driven menu exit and return to the top (no page errors).
The header bottom moved from 112 px to -11.2 px and back to 112 px. During 52 sampled
animation frames, inner-page dropdown background, text colour and content opacity
were stable, with no legacy gathering class. This verifies rendering behaviour in
Chrome, not a cross-device frame-rate guarantee. Final mobile SVG points preserve
aspect ratio. No dependencies, scientific content, commits or remote changes added.

Revision 2 screenshots and reports are in the adjacent preview directory under
`revision-2/`; the original previews are retained for comparison.

## Revision 3: stable hover and visible particle assembly

The Home dropdown still inherited `rna-arrive`, which animated its margin from
-8 px to 0 while fading the entire surface and shadow. Browser samples measured
8 px of panel movement. All sea-glass menus now explicitly disable that legacy
entrance and keep their panel opacity and position fixed. Their near-opaque
coloured gradients supply the frosted appearance without sampling live pixels
through a backdrop filter. Home also avoids a live blur behind its header.
A transparent desktop pointer bridge spans the 8 px gap between trigger and panel,
so slowly crossing it does not close and reopen the menu.

After user feedback that the 32 decorative dots were too subtle, restored visible
particle assembly of actual labels and nucleotide outlines. Labels are measured
once per element rather than once per character. A CPU-backed raster mask is
sampled on a 3 px grid and capped at 420 text dots plus 12 outline dots per base.
Particles use the final text and border colours, then crossfade into the content
over 850 ms. The surface and shadow never fade or change colour. Keyboard focus
reveals content immediately; switching menus or closing removes the old effect.
Reduced-motion preferences retain immediate content without particle animation.

Checks executed after restoration:
- 26 `test_wiki.py` route tests passed; `node tests/navigation_scroll.mjs` passed.
- `node --check static/wiki.js` and `git diff --check` passed.
- 15 animated arrivals across Home, Model and Human Practices: particles painted,
  panel position/background/shadow/ink remained stable, and canvases were removed.
- 20 menu openings across desktop/mobile Home and Human Practices: menu bounds,
  desktop gap crossing, touch, keyboard and search passed, without page errors.
- Rapid switching, immediate keyboard reveal and reduced motion passed.
- Sampled frame intervals during the particle test peaked at 18.2 ms on the local
  Chrome test machine; this is not a universal device-performance guarantee.

Revision 3 evidence is saved in `docs/previews/sea-glass-navigation-2026-10-19/revision-3/`.
Only `static/navigation-sea-glass.css` and `static/wiki.js` runtime behaviour changed
in this revision. The separate Team-page opening sequence remains unchanged.

## Revision 4: one crisp handoff after assembly

User feedback requested keeping particle assembly while removing overlapping,
unsteady lettering. The effect now runs for 420 ms on straight, easing paths.
The real content retains its layout but stays hidden during assembly; the canvas
is removed and real text revealed synchronously at completion. There is no
crossfade and no interval with both text layers visible. Font ascent/descent and
letter spacing are used to align the particle targets with the actual labels.
The background and shadow remain stationary. ArrowDown and Tab cancel the effect
before keyboard focus enters the menu; reduced motion reveals text immediately.

Validation: 10 frame-sampled arrivals (five menus on Home and Model) showed one
clean visibility handoff, no overlapping text layers, and stable panel position
and shadow. Keyboard ArrowDown/Tab, touch at 390 px and reduced motion passed.
`node --check static/wiki.js`, `node tests/navigation_scroll.mjs`, and
`git diff --check` passed. The final Model menu screenshot was visually inspected.
Source changes remain confined to the menu script and sea-glass stylesheet.

## Revision 5: assemble the entire menu without a terminal swap

The user clarified that the complete dropdown should assemble together, with no
pause or switch at the end. The effect now uses one animated particle mask on the
actual menu: its glass surface, border, currents, shadow, labels and bases share
the same reveal. There is no duplicated text, canvas rasterisation or separate
visibility handoff. Small circular openings grow and merge over 440 ms using a
smoothstep curve. The final radius exceeds the tile half-diagonal; the mask has
already become fully opaque before cleanup. `mask-clip: no-clip` preserves the
external shadow. Reduced motion skips the effect and keyboard entry finishes it.

Checks: 10 frame-sampled arrivals on Home and Model preserved geometry and one
real content layer; 20 desktop/mobile menu interactions passed, including hover
gaps, touch, keyboard and search. A full-mask/cleaned-up screenshot comparison of
the panel and surrounding shadow found no channel difference above 2/255 (the
remaining tiny differences are antialiasing). The first comparison was invalidated
by the independent C-to-U focus flip; the comparison was repeated after that
animation settled. The assembled menu and a partial-mask preview were inspected.
The 26 route tests, navigation-scroll tests, JS syntax and whitespace checks passed.
No dependencies or remote repository state were changed.

## Branch publication validation — 2026-10-19

The user authorized publication only to `design/sea-glass-menu`. The branch
incorporates `main` at `b33c901e306b0beffe7b6c488f1e32882eadd4fb`, preserving
Blueprint removal and the newer Engineering navigation/illustration changes.
The merge required no conflict resolution. Validation on the combined tree:
145 Python tests passed, as did `tests/navigation_scroll.mjs`, JavaScript syntax
checks and 12 browser viewport/route scenarios. The original Python environment
lacked test-only lxml; the complete run used the existing bundled lxml 6.1.1
without installing packages or changing dependency manifests. Runtime content
and deployment targets remain unchanged by this publication step.
