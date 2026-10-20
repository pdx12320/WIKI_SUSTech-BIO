# Final iGEM upload batch — 21 October 2026

Connects the 73 URLs supplied by the team to the current source files. Every URL
returned HTTP 200 during verification. The batch contains 29 uploads identical
to their source bytes, 43 converted images checked against their source Git
filename fingerprints, decoded dimensions/aspect ratios and thumbnail differences,
and one explicitly verified compressed PDF derivative. Some long images were
downscaled by the upload service; converted image bytes are not claimed to match
their original PNG/JPEG encoding.

`upload-links.txt` preserves the supplied URLs. `verification.json` records the
source and uploaded SHA-256 values, response types, byte counts and image checks.
`asset_uploads.json` and the generated asset CSV files provide the existing
local/production resolver with the confirmed destinations.

Production downloads for `static/contribution/resources/model-figures.pdf` use
the uploaded 9,738,811-byte derivative. Its SHA-256 is
`92d91f835707ee0583be8eeee4da8bf5513fac396c2216016d483071c5c263b7`.
All 95 pages retain the original extracted text and page dimensions. The original
27,154,896-byte PDF, original resource manifest and 493 reader previews remain
unchanged. Local preview and direct local file requests continue to serve the
originals. Other newly uploaded PDFs and the Engineering cover font use the same
existing production resolver.

The resource audit now rejects quoted non-asset data before accessing the
filesystem. This prevents long strings in the vendored PDF.js library from
raising `ENAMETOOLONG`, while a regression fixture verifies that genuine image
dependencies in the same script remain visible.

Validation:

- All 73 supplied URLs downloaded successfully and passed their recorded checks.
- `WIKI_ASSET_MODE=local python -m unittest discover -s tests -v`: 171 tests passed.
- Production freeze and strict CDN asset audit passed: 24 required routes,
  zero reachable local media and zero missing dependencies.
- The generated runtime contains the same 1,754 destinations as the final CSV;
  exactly 73 destinations changed from the source baseline.
- Internal-link checking still reports 698 pre-existing errors, identical to
  the unmodified baseline, with no new errors. These include root-relative
  downloads and archived preview navigation. The check is not claimed to pass;
  it remains a separate GitLab publication limitation.

No original scientific figures, data, PDFs, text, thresholds or schemas were
modified. This release updates GitHub source and upload evidence; GitLab is a
separate publication destination.
