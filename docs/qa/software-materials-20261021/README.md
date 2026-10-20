# Delivery mechanism materials — 2026-10-21

User scope: make existing components feel less like uniform plastic, without changing their number, biological categories, relationships or geometry. This change applies to the blood–brain barrier and intracellular expression/editing scenes. The human surface material and anatomy remain unchanged.

## Actual changed files

- `static/software-biological-materials.js` (new): role-specific physical surface profiles and deterministic procedural color, bump, roughness and opacity textures. All textures are generated locally with standard Three.js DataTextures and stock physical materials. No image download, custom shader injection, external dependency or geometry displacement.
- `static/software-delivery-mechanisms-3d.js`: replaces the uniform material factory and passes it to the existing detail builders. No changes to geometry, animation functions, lighting, camera, scene hierarchy, stage labels, C/U sprites or controls in this pass.
- `static/software-anatomy-detail.js`: existing detail builders accept an optional material factory; the original factory remains the default for other consumers. Their geometry and placement code is unchanged.
- This record and `validation.json`.

## Surface treatment

- Membrane: restrained hydrated highlight, fine surface variation, existing cutaway transparency retained.
- Cytoplasm: low-specular pale translucent material with subtle density variation.
- Nuclear components and chromatin: denser diffuse granular material, dusty violet identifier retained.
- Blood cells: deeper muted red with a broad soft surface highlight and much finer grain.
- Protein/capsid/ribosome: fine granular roughness, muted amber or gray-green identifiers, no metallic coating.
- Existing organelle membranes: slightly moist but restrained surface response.
- Basement matrix: faint directional fibrous surface texture on the existing objects.
- RNA: muted teal, fine surface detail; guide lines remain visually subordinate.

The colors remain scientific illustration identifiers, not claims about natural microscopy colors. These surfaces are illustrative approximations, not measured optical properties or new biological structures. Bump maps affect normals only and do not change silhouettes, meshes, counts or positions. Existing opacity animations continue to multiply the new subtle density maps.

## Verification

Captured the actual pre-edit modules in `.local-backups/software-materials-20261021/`. Constructed both old and new scenes with the same Three.js geometry code, using minimal DOM stubs only for text sprites and UI notifications. Compared all scene node types, child counts, transforms, visibility, geometry attribute/index hashes and draw ranges across all six stages and six progress points (72 before/after snapshots total).

- Barrier: 350 mesh objects, structure and snapshots identical.
- Cell: 354 mesh objects, structure and snapshots identical.
- Material profiles cover every mesh material in both scenes. Texture dimensions/data are valid; no displacement map, metalness or clearcoat was introduced.
- All three affected JavaScript modules pass syntax checks.
- Existing Software tests: 8/8 pass.
- Flask serves the material module and both consumers with HTTP 200.
- Touched files pass whitespace checking. A repository-wide check separately encountered unrelated existing whitespace in `asset_mapping.csv`; this task did not edit it.

The scene counts above are render meshes, including parts of biological assemblies, not counts of biological species. See `validation.json` for per-profile mesh coverage and comparisons.

Live browser reading remains blocked by the browser policy from the preceding turn. No alternate browser surface was used to bypass that block, and this record does not claim live visual validation or shader/GPU performance validation. The new surfaces are integrated into the existing local `/software#software-figure-2` preview; reload is needed to load the changed modules. No work is confined to a separate preview. No deployment, branch switch, shared integration file or generated `public/` change was made. Other tasks' changes and the prior anatomy backups were preserved.

## Enlarged live preview

User requested a view of the actual updated materials. Added `static/previews/software-materials-20261021.html` and `static/previews/software-materials-20261021.js`: two large side-by-side model viewports, original legend/reset buttons, stage selection, play/pause and progress scrubbing. The markup is rendered from the existing mechanism component and the page imports the actual current `software-delivery-mechanisms-3d.js`; scene geometry, lighting, camera logic and biological materials are reused without a preview copy. The wrapper only enlarges the viewport and supplies stage/progress events.

Local URL: http://127.0.0.1:8346/static/previews/software-materials-20261021.html . Requested opening this page in the user's Codex browser panel; the app returned queued. The user can open the link directly. Browser-read restrictions still prevent an agent screenshot or live GPU verification, and no alternate observation method was attempted. Flask confirms the preview, stylesheet and controller serve with HTTP 200 and the document contains two model viewports; controller syntax and touched-file whitespace checks pass. These two files are preview-only; the underlying material changes remain integrated into the normal Software page.
