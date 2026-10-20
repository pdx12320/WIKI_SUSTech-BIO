# Software delivery anatomy refinement — 2026-10-20

Integrated into the local `/software#software-figure-2` component. Independent preview: http://127.0.0.1:8346/software#software-figure-2. No changes are confined to a separate preview implementation. Not deployed or committed by this task.

## Changed files

- `static/software-anatomy-detail.js` (new): original surface refinement, matte tissue material, irregular cell contour, organelle geometry and BBB supporting structures.
- `static/software-delivery-body-3d.js`: imports the detail module, softens illumination and highlights, adds facial/clavicular/chest/abdominal/patellar relief, refines organ shapes, adds kidney/bronchial/coronary context and shallow cortical contours.
- `static/software-delivery-mechanisms-3d.js`: imports the detail module, uses matte materials and softer light, adds endothelial contours, basement-membrane texture, junction seams, pericyte and astrocytic endfoot details; adds nuclear/cytoplasmic details and a less regular membrane cut edge. Removes the empty ISF oval to represent ISF as extracellular space.
- This record and `software-anatomy-surface-20261020.png`, `software-anatomy-cell-20261020.png`.

## Scope and anatomical basis

These remain original educational cutaways, not clinical or patient-specific anatomy. Organelle sizes, endothelial thickness and molecular objects are exaggerated for legibility; the BBB view is a transport-oriented wall cutaway, not a capillary cross section to scale. No model parameters, delivery state definitions, data or numerical results changed. The original body mesh payload remains unchanged; surface refinements apply at display time.

BBB layer organization checked against [Brain Ultrastructure: Putting the Pieces Together](https://pubmed.ncbi.nlm.nih.gov/33681208/) and [The Blood–Brain Barrier](https://pmc.ncbi.nlm.nih.gov/articles/pmid/25561720/). No external image/model asset or runtime dependency was added.

## Verification

- All three changed/new JavaScript modules pass syntax checking.
- Existing `test_software.py`: 8/8 checks pass.
- Actual 45,538-vertex / 91,304-triangle body loaded in a geometry check: positions and normals finite, color count matches vertices, maximum component displacement 0.007289 nominal metres; topology unchanged. Cell contour closes. Tissue default roughness/specular/metalness checked.
- Browser: all three WebGL scenes load; opaque surface toggle exposes facial and torso relief; cell arrow-key rotation and reset work; barrier stage playback reaches the brain side; RNA-editing playback visibly changes C to U and preserves editor motion. Screenshots show the actual local Software page.
- `git diff --check` passes.
- Browser skill initialization failed because its local native dependency signature was invalid; visual checking used the available CUA browser surface instead.

## Workspace cooperation

Both existing scene files were clean at task start. Their initial versions were preserved under `.local-backups/delivery-anatomy-20261020/`. Changes stay in the Software scene modules and the new dedicated detail module; no shared integration file, generated `public/`, other task's work, branch or server was replaced. Existing unrelated working-tree changes were preserved. No overlap was observed on these module files during this task; other chats may continue changing the wider repository after these checks.

Mobile layout and sustained animation performance on low-power physical devices were not measured in this pass.

## Follow-up: cervical proportions and translucent surface

User requested a shorter, more natural neck and a translucent body that exposes delivery paths. Updated `static/software-anatomy-detail.js` and `static/software-delivery-body-3d.js`: shortened the cervical interval by 25%, widened the neck subtly, and translated the head and brain/pathway coordinates together while preserving head dimensions and torso heights. Default skin opacity is now 0.30. The optional surface emphasis is also translucent (0.42), and no longer hides internal organs or transport routes.

Verification: both modules pass syntax checking; actual body positions/normals remain finite; height mapping preserves head dimensions and torso heights; `git diff --check` passes. Browser reload and reset show the shorter neck, translucent skin and exposed vessels/organs. Screenshot: `software-anatomy-neck-transparent-20261020.png`. This follow-up changes those two source files, this record, and adds that screenshot. Still integrated locally, not deployed. No shared entry point or generated output was changed.

## Follow-up: adult proportions and requested limb shapes

The latest user request includes reduced shoulder muscle prominence, fuller calves, separated thighs and a longer ankle/Achilles-to-foot transition. This supersedes the earlier neck-only mapping.

Actual changed files in this follow-up:

- `static/software-body-proportions.js` (new): smooth monotone landmark remapping, relaxed arm placement, waist/pelvis adjustment, longer ankle region and foot length. The surface and internal anatomy use the same point transform; organ radii are adjusted with the same map.
- `static/software-anatomy-detail.js`: applies that transform and reduces pectoral relief.
- `static/software-delivery-body-3d.js`: applies the shared transform to organ centres, organ scales and transport curves. Existing translucent skin and route visibility are retained.
- `static/assets/software/body-3d-adult/`: new reproducible source mesh, parameters, generator, README and checksum/validation record. Deltoid lobes reduced; thigh centres/radii/blending changed to create a real opening, and calf cross section increased. Original `body-3d/` assets are preserved.
- `wiki/components/software/delivery-body.html`: one asset URL change selects the new mesh.
- `docs/qa/software-body-proportions-comparison-20261020.png` and this record.

Reference: NASA's adult anthropometric dimension definitions and relationships, https://www.nasa.gov/reference/appendix-e-vol-2/ . Display targets are original artistic choices, not a fitted person, measured population average or medical model. Illustrative nominal shoulder centre is 1.43, elbow 1.125, wrist .865, crotch .810, knee .490 and ankle landmark .195; source stature is remapped to approximately 1.77 nominal metres.

Verification: all three JavaScript modules pass syntax checks; existing Software checks 8/8 pass; fresh Flask client confirms the rendered component selects the new mesh and all five runtime module/mesh requests return HTTP 200. New mesh has 46,113 vertices and 92,440 triangles with finite positions and normals. Numerical Jacobian sampled at every source vertex is positive (minimum 0.3188; 0 inverted samples). Actual horizontal mesh slices at Y=.60/.65/.70 have central thigh gaps of approximately .0493/.0409/.0378 nominal metres. These are illustrative geometric checks, not physiological measurements. Body vertical mapping is monotone and bilateral mapping symmetric. `git diff --check` passes.

Visual verification: inspected actual before/after surface projections from front and side at identical scale. The diagnostic comparison uses opaque diffuse shading to show contours; website skin remains translucent (default opacity .30, emphasis .42). The browser preview connection repeatedly timed out in this follow-up, so no new live-page visual or interaction claim is made. Earlier live interaction checks remain historical. The task's own preview on port 8346 was restarted to clear the template cache and select the new asset. No other server was stopped. All changes are integrated in the local repository, not confined to a preview and not deployed. No overlap was observed on the edited Software files; unrelated working-tree changes were retained.


### Final refinement: rounded cranial vault

User requested that the head no longer look pointed. The adult source cranium radii changed from [.079,.116,.084] to [.086,.107,.089], producing a broader, lower dome while retaining face, ears and jaw. The shared cranial coordinate map adds a further 2.5% lateral/depth expansion to the brain and vessels as well as the surface. Updated the generator, regenerated only the three adult mesh payload/parameter files, refreshed hashes and the diagnostic comparison, and retained the preceding adult payload in `.local-backups/delivery-rounded-head-20261020/`. Final asset: 46,192 vertices, 92,586 triangles, 2,219,640 bytes; positions/normals finite, all sampled transformation Jacobians positive (minimum .3188, 0 inverted samples). Software checks again pass 8/8; syntax and whitespace checks pass. Existing translucency, relaxed shoulders, thigh openings, fuller calves and extended ankle transition remain. The browser connection limitation described above still applies; the final comparison is a direct render of the actual final mesh.
