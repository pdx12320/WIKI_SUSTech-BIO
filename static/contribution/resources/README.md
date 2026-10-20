# Contribution documents

The six code PDFs were supplied in `ORCA-Contribution-6-PDFs.zip`.
`model-figures.pdf` is the supplied `ORCA - Model Figures.pdf`.
All seven PDFs preserve the input bytes; `manifest.json` records their original
names and SHA-256 hashes.

The sibling `previews/` directory contains page images for all 398 code-document
pages and 95 model-figure pages, rendered with Poppler 26.05.0 (`pdftoppm -scale-to 1600 -png`) and converted
to WebP with Pillow 12.3.0 (quality 90, method 4). Its manifest records the PDF
hash, page order, image path and dimensions. The original PDFs remain available
from the Download control beside each reader, including while collapsed.

`documents.js` loads the manifest when a reader is opened and presents every page
in a continuous, resizable scroll region. Page images load lazily. The reader
therefore works without a native PDF browser plugin.
The supplied code is displayed as documentation; this page does not execute it.

All 493 preview images have confirmed iGEM uploads in `asset_uploads.json` and
`asset_mapping.csv`. The category-page filenames returned by the upload tool
were checked against the original WebP bytes on 2026-10-20. Keep the preview
manifest's relative paths: `WIKI_ASSET_MODE=local` serves the original images,
while `WIKI_ASSET_MODE=igem` rewrites its page URLs to the verified CDN uploads.
The reader's existing `wikiAssetURL` resolver also supports the deployed team
path. No changes to the PDFs, page order or image dimensions are needed.

The 2026-10-21 upload batch adds CDN destinations for the six code PDFs and a
9,738,811-byte compressed copy of `model-figures.pdf`. Production downloads use
the confirmed uploads through `asset_mapping.csv`; local mode still serves the
unchanged original PDFs. The compressed copy retains all 95 pages, extracted
text and page dimensions, while raster image resolution is reduced. The original
and uploaded PDF hashes are recorded separately in `asset_uploads.json` and
`docs/releases/asset-uploads-20261021/verification.json`. The original PDF manifest
and all 493 existing reader previews remain unchanged.
