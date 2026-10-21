# HP evidence, decisions and supplied hand-drawn overview — release review

Date: 21 October 2026. Release branch is based on upstream/main de831de; shared original checkout stays on its existing branch with unrelated edits preserved.

## Result

Human Practices keeps its seven question-led chapters and removes the repeated opening brand block and divider. Clinical/research discussions, PI guidance, public communication responses and implementation decisions remain distinct. The full Anjia Guardian Mini Program is labelled as the complete experience; its web link is a demonstration.

The user-supplied final hand-drawn artwork replaces the animated overview as **HP Figure 1**. The original supplied JPG is unchanged in the repository; the iGEM platform converted its published copy to AVIF at the same 1685 × 1000 dimensions. An explanation of Emit, Echo and Evolve sits immediately beneath the figure and describes the existing banana-DNA question, treatment/function concerns, workbook revision and stopped partnership. The old figure anchor remains. No replacement artwork was generated.

Six newly reviewed sources are integrated next to relevant cases. Figure A / Figure 12 is a qualitative evidence-to-action matrix; Figure B / Figure 13 shows the 103-record sample and selected Q8/Q10 counts with denominators and multi-select rules. Native figures retain readable text and source links; small screens read the matrix theme by theme. SVG and high-resolution image downloads use verified official iGEM resources. The review is explicitly retrospective and bounded; methods, source ledger and local material inventory are in docs/human-practices/evidence-analysis/.

Ye and Dai circular interview triggers use the original embedded JPEGs with cover cropping; rectangular SVG canvas edges no longer appear. Existing full profile cards and keyboard interactions remain.

## Scope

HP Markdown, HP-only overview/viewpoint/evidence CSS and scripts, figure data and source assets, research ledgers, five explicit verified asset mappings, and this QA record. The content parser test now permits HP's deliberately empty subtitle while still requiring a string metadata field; other pages retain their nonempty-subtitle check. This fixes the previous validation mismatch without restoring an unwanted tagline.

No Education, Inclusivity or Project body copy, shared template, navigation, dependency or site style changes are included. Three Home Protection PDF links use their existing verified official URLs because their local manuscript-era paths do not exist on main. HP attachment/data links are relative to the page so they stay under the deployed team path.

## Verification

- 185 existing unittest tests passed using the bundled Python with available project dependencies. The first local environment lacked lxml; no repository dependency changes were required.
- Focused content/wiki/asset tests: 43 passed and 490 subtests passed.
- Desktop 1440px and mobile 390px: supplied figure decoded at the original dimensions, three 3E terms visible beneath it, no overflow, seven chapters retained, question first in the reading panel, no page errors. Earlier evidence/avatar checks also passed at 320px. Browser JSON is retained alongside this report.
- Five official upload URLs returned HTTP 200. Both SVGs were byte-identical; AVIF copies decoded at 1685×1000, 3200×2000 and 2400×2800. Source/remote hashes and image differences are in upload-verification.json. The platform processes raster uploads asynchronously; extra alternate filenames are not used by the page.
- Production Frozen-Flask build completed in /private/tmp/hp-evidence-build-20261021, without modifying shared public/. Strict CDN/media audit passed for 24 required routes.
- 39 legacy source IDs retained, no duplicate rendered IDs; local record/Engineering links resolve. Prior media are retained except the overview replacement explicitly requested by the user.
- HP frozen links pass the deployed /sustech/ path check. The broader existing checker still reports unrelated root-relative links in Contribution, Engineering, Safety and archived static previews; no changes to those pages are included. Details are in frozen-link-results.json.
- JavaScript syntax and source diff whitespace checks passed, excluding the two generated Matplotlib SVGs, which retain their original exporter whitespace to preserve the verified uploaded bytes. A duplicate upload solely to normalize that whitespace was rejected by automatic approval review; the previously authorized SVGs remain in use.

## Evidence limits carried forward

Fuxing Zeng's identity is verified, but concrete attributable guidance remains absent. Dated full interview records, anonymous respondent data and recruitment/item completion records, detailed Anjia trial/version records and the final stakeholder analysis map remain missing. No cross-tabs, patient-needs representativeness, new consultation, clinical regimen, safety improvement or functional rescue is inferred. The hand-drawn overview is now supplied and is no longer listed as pending. Figure C remains omitted because no established ORCA clinical pathway is documented.

The user explicitly authorized creating and merging a PR, then explicitly authorized these HP image uploads after the automatic approval review blocked the earlier upload step. Publication authorization is limited to this release; no direct GitLab deployment command is run.
