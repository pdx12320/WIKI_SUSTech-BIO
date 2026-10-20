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

Each reader stores its original PDF filename in `data-contribution-file`.
This key remains stable when the download URL is replaced by a renamed iGEM
upload. Preview images are resolved through the existing asset URL resolver.
Production auditing follows the lazy preview manifest and requires all 493
page images to have confirmed iGEM upload mappings before publication.
