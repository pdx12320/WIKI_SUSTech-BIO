# Home second-act verification — 2026-10-21

Integrated in the existing primary checkout. Preview: http://127.0.0.1:8181/ . No commit, push, deployment, branch switch, worktree creation or shared public build.

## Actual source changes in this chat

- `static/onetake/one-c-copy.mjs`: four exact user-supplied captions; frozen array with no side effects.
- `static/onetake/one-c-context.mjs`: imports that array for the existing caption sequence.
- `wiki/components/one_c_context.html`: initial caption matches the first new sentence.
- `static/onetake/rna-cell-context.css`: only this chat's new Astrocyte font rule, 20–26px. Preserves prior 17px Neuron, inside-only Astrocyte and removed questions.
- `static/onetake/cell-scroll-pacing.mjs`: only this chat's new .375–.435 pacing band; central .39–.42 gets 2.5x scroll distance. Existing A-beta and Paris pacing preserved.

## Supporting files

- `docs/plans/home-second-act-copy-proposal.json`: now records completed integration.
- `docs/plans/home-second-act-ready.patch`: exact applied diff relative to the live pre-edit files, not HEAD.
- This QA folder: mobile screenshots for inside, translation, transport and fourth caption; browser-results.json records all four captions.

## Checks

- `node tests/one_c_context.mjs`: passed.
- `node tests/rna_cell_scene.mjs`: passed.
- `node tests/burden_pacing.mjs`: passed.
- `node tests/one_c_particles.mjs`: passed.
- Additional numeric check: 2.5x reading distance in .39–.42; continuous reversible actual homepage track.
- `git diff --check`: passed.
- Browser: at 390×844 all four exact captions displayed in order, with no horizontal overflow; all captions hidden in the inside stage. Astrocyte computed 20px and visible inside; hidden during translation and transport. No browser errors observed. At the normal 825px preview width Astrocyte also computed 20px.

## Coordination and remaining limits

The user explicitly authorized takeover of the previous integration lock. Its owner record was archived under `.local-task-locks/` rather than deleted. Pre-edit copies of the four live targets are preserved under `.local-backups/home-second-act-20261021/`. The final target content matches the approved local patch exactly, preserving all pre-existing edits in those files. This is evidence for the observed local state, not a guarantee against future concurrent writes.

Changes are integrated into the source and served by the local preview; nothing remains only in a detached preview. Production publication was not requested. The /next markup and structure component were not edited; shared caption behavior continues through the existing module.
