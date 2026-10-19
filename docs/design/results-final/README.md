# Results final layout

The Results page contains Platform Achievements, SONAR Spotlight and Beyond One Base.
The closing thank-you follows the team signature. The obsolete bibliography is removed.

## Maintained implementation

- `docs/project/results.md`: approved page copy and static diagrams.
- `wiki/pages/results.html`: Results-only template and figure dialog.
- `static/results-achievements.css` and `.js`: two-column cards and native figure enlargement.
- `static/results-sonar.css`: equal square cards, clockwise arrows and equal oval labels.
- `static/results-conclusion.css`: editorial closing text and final thank-you.
- `wiki_content.py`: Results template registration.

## New image sources

All three new images are distributed with this repository's CC BY 4.0 content license.
The team's original character design is retained in the generated thank-you pose.
Alt text and dimensions are maintained in the page source.

| Asset | Source | Use |
| --- | --- | --- |
| `assets/images/results-achievements/edit.png` | Team-supplied EDIT summary illustration | Edit card |
| `assets/images/results-achievements/control.png` | Team-supplied CONTROL summary illustration | Control card |
| `assets/images/results-ending/orca-thank-you.png` | Built-in image_gen, referencing `assets/images/engineering/mascot-standing.png`; see `mascot-prompt.md` | Thank-you ending |

The remaining four card images reuse existing Engineering conclusion assets.
Local source images are checked in. New iGEM media uploads and public deployment
are separate from this GitHub source merge and have not been verified here.

## Validation

- 153 Python tests passed on the updated main baseline.
- Local frozen build completed; the Results document audit passed.
- The whole-site audit reports 10 pre-existing missing frozen Engineering cartoon assets. Their source files exist; the existing freeze discovery does not collect them. This Results change does not modify that feature.
- Results image responses, Engineering/Measurement/Contribution anchors, section order and thank-you placement checked.
- Desktop and mobile visual review, including 320 px overflow check, completed during design.

## Image checksums

- `assets/images/results-achievements/edit.png`: `a46409cd5579a9a17d548ff808bc295fa1bb5243030ff999e313db9d94e1a09c`
- `assets/images/results-achievements/control.png`: `6628940b73c56ad983d37a407b277325f566374588e94407025df5fadb73942c`
- `assets/images/results-ending/orca-thank-you.png`: `4d74a7512752e34fc390bb40ffbe16cc57c76797fdbbbe8905eec06f9416a3e2`
