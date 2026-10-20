# Adult delivery display surface

Original procedural geometry derived from the repository's `body-3d/generate_body.py`. The original asset is retained unchanged. This variant reduces deltoid and upper-arm bulges, separates the thighs with a smaller implicit blend radius and adjusted centres, increases calf volume, and broadens/lowers the cranial vault to remove the pointed crown. `generate_body.py` reproduces this source mesh with NumPy; it refuses to overwrite an existing output.

The live scene additionally uses `static/software-body-proportions.js` for coherent adult landmark remapping: shoulder, elbow, wrist, crotch, knee and ankle heights, relaxed arm placement and foot length. The surface detail module and the organ/pathway scene share that map. Runtime skin remains translucent and matte.

Proportional reference: [NASA adult anthropometric dimensions](https://www.nasa.gov/reference/appendix-e-vol-2/). Shape targets are illustrative choices checked against adult landmark relationships, not a measured subject, a population average, medical imaging or a calibrated anatomical simulation. The changed mesh retains the original nominal coordinate system so the shared display transform can align it with the organ and transport geometry.

The final rounded-head asset has 46,192 vertices and 92,586 triangles; payload 2,219,640 bytes. `validation.json` records hashes and geometry checks. The PNG comparison under `docs/qa/software-body-proportions-comparison-20261020.png` shows actual source surfaces at the same orthographic scale with opaque diagnostic shading, rather than the website's translucent material.
