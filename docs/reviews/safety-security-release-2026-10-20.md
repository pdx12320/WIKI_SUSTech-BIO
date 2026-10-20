# Safety & Security release — 20 October 2026

The page now presents eight risk scales entering four review stages, with explicit decisions and return paths. The framework covers wet lab, Human Practices, education, inclusivity, modeling and software. Experimental conditions, evidence limits and next steps remain in the response register and prose.

Four module links and a sticky miniature connect the diagram to the corresponding sections. Hover and keyboard focus use four distinct colors. Decisions have no default approval and no automatic cycling. The title uses an OFL-licensed Sora subset; body and navigation typography are unchanged. The shared content template adds only a Safety-specific stylesheet reference.

Validation on a separate checkout of current main: 31 content/route tests pass; SVG XML, JavaScript syntax and diff checks pass. Local headed Chrome confirms title font, four keyboard links, current-section highlighting, mouse navigation, return-to-figure link, decision interaction, reduced-motion behavior and no-JavaScript fallback. Figure bounds fit 1440, 1024, 768, 760, 390 and 320px. Latest-main anchor spacing is handled when determining the current miniature stage.

The browser's 320px document width reached 368px while the Safety figure stayed within the viewport. Global floating sweeper / footer decorations extend beyond the viewport; those shared components are outside this PR. Screenshots and structured results are in ../qa/safety-security-release-20261020/.

The font is committed with its OFL license and source provenance. Its official iGEM upload/mapping remains a deployment prerequisite; this PR does not deploy or modify GitLab. Institutional authorization, participant permissions and scientific review remain the team follow-ups identified by the page.

## Font CDN mapping completed — 21 October 2026

The team supplied https://static.igem.wiki/teams/6085/wiki/safety/sora-title-700.woff2. Download verification returned HTTP 200, font/woff2, 1,940 bytes, SHA-256 b20b86e03f48f1693a5b2b4b7832618e0192110184d09c63c855f184aebe45c4, identical to the checked-in font. Added this one file to upload evidence and the explicit mapping; official-resource mode now rewrites the font URL in Safety CSS to that CDN address. Provenance retains the original OFL license and source information. The earlier font-upload deployment prerequisite is complete; no deployment was performed.
