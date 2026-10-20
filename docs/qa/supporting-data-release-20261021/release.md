# Supporting Data release — 21 October 2026

Base: `67fe5fc` on `pdx12320/WIKI_SUSTech-BIO/main`. Release branch: `feat/supporting-data-doi-links`.

## Scope

Eight Supporting Data strips are rendered from explicit Markdown slots: FR, IO, GFA, MRE, ASO, SONAR Engineering and FV in Engineering, plus Measurement. SONAR's two page entries share one DOI. All archive actions use the user-supplied published Zenodo links; all “All Supporting Data” actions point to `/contribution#supporting-data`, already present in merged PR #157. Strips follow conclusions and precede references; SONAR retains its existing Contribution navigation after the strip. The approved standalone index is available at `/supporting-data`.

The Overview-aligned style, stronger text contrast and 18 px archive actions are retained. The DOI mark is inline SVG, preserving the original artwork and avoiding a new media upload. Source: https://commons.wikimedia.org/wiki/File:DOI_logo.svg ; owner: DOI Foundation.

A scoped Contribution arrival handler corrects this hash after late content/font reflow and immediately stops adjusting when the reader interacts. This fixes a reproduced first-arrival landing above the requested directory.

## Verification

- 185 Python tests passed, including four new archive/chapter/Contribution/prefix/production-mode regressions.
- All seven Zenodo records were independently checked through the public API and were published with matching module titles; see `doi-verification.json`.
- Local static freeze completed. Engineering, Measurement, Contribution and the index passed document and internal-link audits. The full local audit also reports four existing Education/HP local-only export omissions; no source or media for those pages changed in this PR.
- Production static freeze and full-site audit passed. Reachable production media audit found zero local media and zero missing dependencies; see `production.json`.
- Browser verified native click and keyboard activation of the cross-page directory link, visible target heading, and all eight destination entries. The stable desktop landing places the target heading at 252 px.
- 390 px mobile reader inspected: 298 px strip, approximately 199 px action, inline logo visible, no page-level horizontal overflow. Native anchor actions need no custom touch handling.
- Static HTML includes real archive and index anchors without waiting for JavaScript. Supporting-data code adds no animation and the arrival correction uses instant scrolling.
- `git diff --check` passed. Review-only preview server/gallery files and the previous preview worktree are excluded from this release.

GitHub merge and public iGEM deployment are separate. No new media upload is required by this change.
