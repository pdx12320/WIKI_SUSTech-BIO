# Shokz cooperation proposal editions

The user supplied the Chinese proposal and requested an English edition, PDFs of both languages, and inclusion on Human Practices and Contribution HP.

Outputs: assets/human-practices/attachments/shokz-industry-university-cooperation-proposal-{zh,en}.{docx,pdf}. Chinese text and all four tables are unchanged. English covers every nonempty source paragraph and table cell. The source's March discussion date, April/May development milestones and October-December schedule are preserved rather than reconciled without authorization. The proposal's targets and requested resources remain conditional.

Chinese PDF: five pages. English PDF: six pages. All final pages visually inspected. Full paragraph text checked against PDF extraction; both PDFs served successfully through Flask. Thirty-one content and Wiki tests passed on the release branch; JavaScript syntax and diff whitespace checks passed. Both languages loaded from their iGEM URLs in both page readers, with five Chinese pages and six English pages.

Integration: docs/human-practices/human-practices.md, adjacent to the existing Shokz account, with two collapsible PDF.js readers; docs/project/contribution.md, two independent assets within Human Practices, using its existing automatic vertical PDF readers. Both page readers now use the user-uploaded public iGEM URLs recorded in published-pdfs.json. Remote bytes match the checked PDFs. No Chrome interaction was used.

Rebuild: run prepare_documents.py with the source DOCX path, then use the bundled render_docx.py with --emit_pdf. The bundled LibreOffice requires FONTCONFIG_FILE to include a task-local directory with Arial Unicode.ttf for Chinese rendering. Do not use the user's desktop LibreOffice.
