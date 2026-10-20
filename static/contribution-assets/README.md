# Contribution PDF reader

PDF links under the Human Practices and Education H2 headings are automatically enhanced by `previews.js`. Add a normal PDF anchor to a resource entry; no preview markup, images, page count or manifest is needed. The H3 supplies the viewer title. Links continue to work without JavaScript.

Opening an entry loads the original PDF URL through PDF.js. Pages are stacked in a continuous vertical scroll area. Only nearby pages are rendered to canvases; offscreen canvases are released. Controls provide zoom; the original download remains visible. Rendering is lazy and independent per resource. Cross-origin PDFs must permit CORS. On load failure the source link remains available.

`pdfjs/` is copied from the bundled `pdfjs-dist` 5.6.205 distribution, Apache-2.0. Its license and package metadata are preserved, together with the matching worker, character maps, standard fonts and WASM decoders. No runtime third-party CDN or viewer service is used. Reference: https://mozilla.github.io/pdf.js/examples/ .

Verification: content parsing, original file routes and script syntax checked. Browser review covered automatic preview controls, direct rendering from local and iGEM-hosted PDF URLs, and continuous vertical scrolling.
