# Results final layout

The Results page contains Platform Achievements, SONAR Spotlight and Beyond One Base.
The closing thank-you follows the team signature. The obsolete bibliography is removed.

## Maintained implementation

- `docs/project/results.md`: approved page copy and static diagrams.
- `wiki/pages/results.html`: Results-only template and figure dialog.
- `static/results-opening.css`: restrained serif introduction within the Results header.
- `static/results-achievements.css` and `.js`: two-column cards and native figure enlargement.
- `static/results-sonar.css`: equal square cards, clockwise arrows and equal oval labels.
- `static/results-conclusion.css`: editorial closing text and final thank-you.
- `wiki_content.py`: Results template registration.

## Opening revision — team approved, 2026-10-20

The 54-word opening now belongs to the page header, below the title and mascot
and above its existing rule. The reading surface begins with Platform Achievements.
The old italic subtitle and two introductory paragraphs have been replaced.
Copy remains editable in `docs/project/results.md` as `header_introduction`.
The shared header's optional introduction is empty on all other current pages.

Changed implementation files: `docs/project/results.md`,
`wiki/components/chapter_personality.html`, `wiki/pages/content_page.html`,
`wiki/pages/results.html`, and `static/results-opening.css`.
The team reviewed the local preview and approved this revision for integration.

Validation: all 161 existing Python tests passed on the current main baseline;
the local frozen build and 24-route asset/link audit passed. Rendered checks confirmed six
achievement cards, three SONAR cards, unchanged section anchors and closing text,
and no introduction on other chapter headers. Browser review at 1280, 390 and
320 px found no horizontal overflow. Temporary viewport overrides were reset.

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

- 161 Python tests passed on the updated main baseline.
- Local frozen build and the 24-route asset/link audit passed. The earlier Engineering cartoon export issue was resolved on main before the opening revision was integrated.
- Results image responses, Engineering/Measurement/Contribution anchors, section order and thank-you placement checked.
- Desktop and mobile visual review, including 320 px overflow check, completed during design.

## Image checksums

- `assets/images/results-achievements/edit.png`: `a46409cd5579a9a17d548ff808bc295fa1bb5243030ff999e313db9d94e1a09c`
- `assets/images/results-achievements/control.png`: `6628940b73c56ad983d37a407b277325f566374588e94407025df5fadb73942c`
- `assets/images/results-ending/orca-thank-you.png`: `4d74a7512752e34fc390bb40ffbe16cc57c76797fdbbbe8905eec06f9416a3e2`
