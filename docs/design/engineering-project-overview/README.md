# Engineering project overview

The approved landscape overview is shown before the mind map on Engineering.
`source.pptx` is the editable artwork; the displayed PNG is
`assets/images/engineering-overviews/project-overview.png`.

The SVG overlay supplies independent hover highlighting and chapter links.
The image keeps its aspect ratio within a single viewport. The title and three
navigation actions occupy side rails. Separate scroll gestures are required to
switch scenes; the explicit switch buttons navigate immediately.

## Validation

- 140 Python tests passed on the integration branch.
- 12 existing chapter-boundary tests passed.
- Browser verification: contained artwork, aligned icons, Start engineering
  opens Fundamental Research with the current sidebar, both scene buttons work.

## Production asset status

The PNG remains the local source. Its new iGEM AVIF upload has been verified
against this source and added to the asset mapping. The URL and comparison
record are in `provenance.json`. GitHub merge and production deployment are
verified separately.

Model branch labels now use Landscape, Recognition / Catalysis, LAMAR and Delivery.
Full names appear in section headings and accessible link labels; chapter anchors are unchanged.
