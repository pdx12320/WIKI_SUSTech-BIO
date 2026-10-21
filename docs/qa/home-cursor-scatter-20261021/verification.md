# Home cursor avoidance — 2026-10-21

Updated the existing primary checkout and preview at http://127.0.0.1:8181/ . No commit, push, publication, shared build or separate checkout.

## Actual changed files

- `static/onetake/particle-cursor-scatter.mjs`: adopts the original brain shader's aspect-correct NDC Gaussian falloff (14), displacement (.07), radial direction and pointer interpolation rate (3). Removes five-point trails, per-particle jitter and depth kicks. The existing RNA particle module already imports this helper.
- `static/onetake/rna-cell-scene.mjs`: replaces its separate hover implementation with the same helper, applied to the existing cell-body mask. Preserves all geometry, labels, scene timing, opacity and existing question-removal edits.
- This QA directory contains the exact local patch, cell/RNA hover screenshots and this record.

## Verification

Passed existing `tests/one_c_particles.mjs`, `tests/rna_cell_scene.mjs`, and `tests/brain_correspondence.mjs`.

Additional runtime checks passed for brain-matched pointer interpolation, viewport aspect correction, immediate pointer-leave deactivation, reduced-motion deactivation and missing-pointer handling. The helper's perspective conversion gives the same projected displacement as the brain shader without changing vertex depth.

Browser preview: the cell and RNA scenes loaded with the updated materials; pointer input visibly parts particles, captions remain present, and no browser/shader errors were captured. `cell-hover.png` and `rna-hover.png` preserve the observed state. A single loader wait timed out while opening the RNA view; the subsequent live observation confirmed it loaded successfully.

`git diff --check` passed for both modules. No source changes are confined to a detached preview.

## Concurrency

The shared integration lock was owned by a separate task editing `wiki_content.py` and `wiki/components/chapter_personality.html`. This task edited only independent particle modules, used its own `home-cursor-scatter` lock, and left that shared lock intact. The pre-edit copies are preserved in `.local-backups/home-cursor-scatter-20261021/`. Existing edits remain in place; future concurrent writes remain outside this verification.
