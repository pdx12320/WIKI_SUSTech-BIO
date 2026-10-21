# A-beta labels and lipid self-rotation — 2026-10-21

Applied to the existing primary checkout served at http://127.0.0.1:8181/ . No commit, push, publication, separate checkout or shared public build.

## Actual changed files

- `static/onetake/rna-cell-context.css`: Aβ font weight 700 → 400; removes artificial stroke; increases the entire responsive size curve by exactly 2px (18–24px → 20–26px).
- `static/onetake/rna-cell-scene.mjs`: Aβ labels use particle presence rather than the flight chapter gate. Each label follows its own particle cluster through the shader's position blend, world transform and camera projection. Offscreen particles carry their labels out of view. Labels fade with the Aβ-to-tower handoff and are suppressed during replay. Existing static/fallback content and particle geometry remain intact.
- The same scene module adds lipid-carrier local Y rotation at 0.45 radians/second (about 14 seconds per turn), with no change to carrier centers, transport route or speed. Reduced motion disables rotation.
- This QA directory records the local patch and checks.

## Verification

- Existing `tests/rna_cell_scene.mjs`, `tests/one_c_particles.mjs` and `tests/paris_particles.mjs` passed. The cell-scene check was rerun after adding lipid rotation and passed again.
- Additional desktop/mobile runtime checks passed: labels show before the flight chapter; camera turns reproject labels; absent particles and replay hide labels.
- Lipid runtime check passed: 2 seconds advances local rotation by 0.9 radians while all carrier centers remain unchanged; reduced motion returns rotation to zero.
- Browser observation at actual take 0.5600, transport stage: one on-screen Aβ cluster label was visible at 20px, weight 400; the other four anchors were offscreen and hidden. Browser error log was empty.
- Final browser reconnection for take 0.64 repeatedly timed out, including after the connection reset. No final screenshot or final visual confirmation of self-rotation is claimed; self-rotation is verified by runtime checks.
- `git diff --check` passed for both source files.

## Coordination

Only the independent cell-context modules were edited under this task's `home-amyloid-labels` lock. The other chat's shared integration lock for memory-maze files was preserved. Pre-existing changes, including particle-hover work, remain intact; pre-edit copies are in `.local-backups/home-amyloid-labels-20261021/`. Source changes are fully integrated, not limited to a detached preview; future concurrent writes remain outside this verification.
