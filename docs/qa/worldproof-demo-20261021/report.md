# WORLDPROOF five-team English overview

21 October 2026. Table work only; the user assigned PRs and merges to another window.

## Scope and source

The supplied demo collection has five rows with project name (B), assigned constraint card (F) and project overview (I), at source rows 2–6. All five team-name cells are blank. The edited output assigns Team 1–5 in original row order. Rows 7–12 contain no project information and are omitted. Challenge logs and optimisation fields are excluded from this comparison because they were not completed across all five entries, following the user's latest instruction.

The original attachment is unchanged. The workbook and website contain English translations; the figure contains shorter English summaries. Constraint-card situations are explicitly hypothetical assigned prompts. In particular, Mossback's 80% describes a hypothetical energy offset in its card, not a measured team result. No missing implementation, validation, or award information was invented.

## Changed files

- `docs/human-practices/inclusivity.md`: section 3.6 now shows the five-team overview and five expandable English records; adds the dedicated WORLDPROOF stylesheet. Earlier game images, photo, name explanation, and heading-line removal are preserved.
- `static/human-practices/inclusivity-spectrum/worldproof.css`: diagram and record styles, scoped to this component.
- `assets/human-practices/worldproof-demo/worldproof-five-demos-en.png`: 2400 × 3906, ORCA palette, Georgia Bold and Futura.
- `assets/human-practices/worldproof-demo/worldproof-five-demos-en.svg`: editable vector source with embedded fonts.
- `assets/human-practices/worldproof-demo/provenance.json`: source rows, selected fields, image hashes and publication status.
- `outputs/01a15c5f-ff58-7010-8556-6c7c2c191c32/WORLDPROOF-demo-curated.xlsx`: one English sheet, five records, four fields including the editorial team label.
- `docs/design/worldproof-change-log-20261021/`: selected source extraction, English translations, reproducible workbook/figure builders and their verification previews. No personal-name or demo-package columns were imported into the public output.
- `docs/qa/worldproof-demo-20261021/`: this report, checks.json and desktop/mobile page screenshots.

## Checks performed

- Every retained source row has nonempty B/F/I. Five project records and placeholder labels reconcile to source rows 2–6.
- Saved XLSX values match curated translations exactly, including full constraint-card questions. All visible workbook values are English. No formulas or formula errors are present. The workbook was recalculated, inspected, rendered and exported with Artifact Tool, and the saved XML was independently checked.
- The five-team figure was visually inspected for wrapping, font readability and clipping. A separate review compared the translations to B/F/I; precision fixes for the raw-material batch number, chemical fertiliser and hypothetical 80% offset were incorporated.
- Flask `/inclusivity` returned 200 in local and production asset modes, both at root and `/sustech`, with exactly five English record controls and the figure within section 3.6. Earlier section refinements remain present.
- Browser decoded the 2400 × 3906 image. All five expandable record names were found. At 390 × 844, the longest record opens correctly, body text is 18 px and document scroll width is 390 px. The temporary viewport override was reset.
- `git diff --check` passed.

## Publication state

The diagram is integrated in the local Wiki preview using its repository asset. The user prefers to upload images; its official iGEM upload URL is still pending. Replace the figure's image/link URL with the returned official address before publication. This task did not create a PR, merge, switch branch, restore a checkout or modify shared Home modules. Other concurrent changes remain in the primary directory.
