# Health Rumor Detectives activity plan

The Chinese source was supplied by the user. Added dates: July 2, 2026 and October 7, 2026. Chinese paragraph and table text are preserved apart from the date addition; English translates all sections and three tables. Planning targets remain targets.

Both DOCX and PDF editions are saved under `assets/human-practices/attachments/health-rumor-detectives-activity-plan-{zh,en}.*`. The two published PDF URLs were supplied and confirmed by the user; downloaded bytes matched the checked local PDFs exactly. See `published-pdfs.json` for hashes. Both PDFs have five pages; every rendered page was visually inspected.

Placed two independent assets in Contribution → Education, following user confirmation. Existing automatic PDF previews provide collapsible vertical readers. Five content tests and the Contribution route/asset checks passed.

Rebuild DOCX files with `prepare_documents.py SOURCE.docx`. Render with the bundled document renderer. For Chinese rendering, supply a task-local fontconfig file via FONTCONFIG_FILE that includes the directory containing Arial Unicode.ttf; merely specifying the font family without configuring the headless renderer drops Chinese glyphs. No system font settings were changed.

This release adds the two activity-plan entries and archives their editable source documents and verified PDFs. It preserves the newer main-branch Contribution structure.
