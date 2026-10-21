# 3E animation placement — 21 October 2026

The supplied hand-drawn HP Figure 1 remains first. The existing layered-v3 Emit/Echo/Evolve SVG is restored beneath the three model definitions, before the question-led reading panel. No artwork is regenerated and no new upload or figure renumbering is needed. The original accessible image dimensions, descriptive alternative text and reduced-motion behavior of the SVG are retained.

The HP-only placement module restores direct fragment positions for the overview and its model/animation children after its stylesheet and fonts settle. The animation has a 24px scroll margin.

Modified product files: HP Markdown, overview-page.css and overview-page.mjs. Shared templates, other pages, asset mappings and existing media are unchanged.

Verification: 31 content/wiki tests and 490 subtests passed; module syntax and diff checks passed. In-app browser checked desktop 1440px and mobile 390px: hand-drawn image remains present, seven chapter headings remain, animation follows the definitions, loaded image keeps its aspect ratio and no horizontal overflow occurs. After stylesheet/font settling, the mobile animation fragment is at 24px. Measurements are in results.json. Local desktop/mobile screenshots are retained in the primary workspace beside this report.
