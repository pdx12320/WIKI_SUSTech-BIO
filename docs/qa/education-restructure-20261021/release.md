# Education chapters and engagement titles

This release follows the seven-chapter local restructure and the subsequent user review of the English and display titles. Education now concentrates its body on teaching choices, participation, feedback and outputs. Evaluation is six connected paragraphs describing what the existing feedback suggests and how the next trials can build on it; the evidence boundary is stated briefly. No new outcome data or classroom implementation claims were added.

Education uses Caveat, Human Practices uses Patrick Hand, and Inclusivity uses Shantell Sans. Only the overview H1 changes size and alignment; body text and directory typography retain their existing rules. Original font sources, lossless WOFF2 files, provenance and OFL notices are included. The earlier unused Fraunces trial is retained as a source asset.

The PR starts at upstream main f53d821. HP and Inclusivity each receive only a stylesheet link. The local teacher-screenshot deduplication is a required dependency: its merged Figure 2 caption and two legacy anchor aliases accompany the restructured Education page. No original screenshot file is removed.

The initial handoff and screenshots remain in this directory. Later screenshots show the final handwritten and centered titles. Migration audit uses the recorded Git baseline and checksum manifest, so it can run in a clean checkout without local backup folders.

## Publication resource status

The four workbook comparison images and three active WOFF2 fonts still require official iGEM CDN uploads. Three editable DOCX files are included as versioned downloads; their blank worksheets contain no participant responses. Automatic approval review blocked selecting these files for the iGEM upload page because the PR/merge request did not explicitly authorize transfer to that service. No file upload was executed. A dedicated empty upload folder was created. No production deployment was run.

The PR remains a draft until the required media have verified official URLs. Existing resource links and all source assets remain available in local mode.

## Release checks

46 tests passed across content, wiki routes, iGEM asset rewriting and dual-mode uploads. Both affected JavaScript files passed syntax checks. The full static freeze stopped when the local disk ran out of space; only this task’s redundant temporary snapshot and incomplete build were removed. No shared public output or another task’s files were touched. A fresh full build remains required after official media upload.
