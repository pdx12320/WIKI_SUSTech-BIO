# Education chapters, title typography and compact workbooks

Education now follows seven chapters, with the curriculum collaboration, older-learners’ workbook and WORLDPROOF as its three main projects. The body focuses on teaching choices, participation, recorded feedback and outputs. Evaluation explains what existing feedback suggests and how the next trials can build on it, with a brief evidence boundary. No new outcome data or classroom implementation claims were added. The original handoff in review.md contains the old/new directory comparison, migration list and outstanding source-material gaps.

Education uses Caveat, Human Practices uses Patrick Hand, and Inclusivity uses Shantell Sans. Only the overview H1 changes size and alignment; body and directory typography retain existing rules. Font sources, WOFF2 files, provenance and OFL notices are preserved. The unused Fraunces trial remains a source asset. HP and Inclusivity each receive only a stylesheet link.

The teacher-screenshot dependency retains the merged Figure 2 caption and two legacy anchor aliases. No original screenshot file is removed. Other windows’ uncommitted source changes were not copied into this release. Upstream main was merged into the isolated release branch before final verification; the shared live checkout was neither switched nor reset.

## Official resource uploads

All ten approved files have confirmed official iGEM URLs: four workbook comparison images, three active WOFF2 fonts and three compact PDFs. The image service converted PNG to AVIF, with dimensions verified. Remote font and PDF bytes match the local files. See upload-verification.json and official-upload-ten.png. Education uses the compact PDFs in its existing readers and preserves original PDF links and editable DOCX downloads. No production deployment command was run.

| Current edition | PDF size | Pages |
| --- | ---: | ---: |
| English student | 2,233,197 bytes | 56 |
| Chinese student | 3,020,117 bytes | 56 |
| Chinese teacher guide | 2,322,043 bytes | 54 |

The original DOCX sources are unchanged. To compile compact copies, only embedded opaque images were resized/compressed in temporary inputs; document text, styles, drawing extents and fonts were retained. PDF optimization further compresses images and removes duplicate objects. All 166 pages retain selectable text, page boxes and link annotations. All pages were rendered and reviewed in contact sheets, with representative pages and the pages showing the largest compression differences inspected at full size. Pixel comparisons, checksums and compression settings are recorded in compact-pdfs.json and pdf-render-comparison.json. Temporary compilation inputs are outside the repository.

## Verification

- The final full frozen build and CDN asset audit passed for 24 routes in a task-specific temporary destination. Shared public output was not rebuilt.
- The migration audit passed with 92 legacy IDs and 177 resource URLs retained, excluding the intentionally deduplicated standalone teacher screenshot. No local resource failures.
- Both affected JavaScript files passed syntax checks. Scoped whitespace checks exclude unchanged upstream font-license whitespace.
- Desktop and mobile title rendering, directory/anchor behavior and workbook readers were checked. Final PDF readers report 56, 56 and 54 pages. Representative screenshots and browser-final.json are included.
- The whole-site internal-link scan checked 2,842 destinations and reports zero Education issues. It also reports 693 existing out-of-scope links, mostly historical static preview HTML and 16 links on other main routes; those were not modified. Details are in internal-links-final.json.

The final full unittest suite passed: 173 tests in 116.258 seconds. Temporary test-only lxml dependencies were isolated outside the repository; no dependency manifest or shared environment was changed.
