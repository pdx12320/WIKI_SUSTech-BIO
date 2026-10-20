"""Deployment coverage for Contribution's lazy document readers."""
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from app import app
from scripts.audit_igem_assets import inspect_build


class ContributionDocumentsTest(unittest.TestCase):
    def test_uploaded_pdf_name_does_not_change_reader_key(self):
        uploaded = 'https://static.igem.wiki/teams/6085/wiki/upload-renamed-document.pdf'
        mapping = app.extensions['igem_assets']
        with patch.dict(mapping, {'/static/contribution/resources/model-figures.pdf': uploaded}):
            with patch.dict(app.config, WIKI_ASSET_MODE='igem'):
                html = app.test_client().get('/contribution').text
        self.assertIn('href="' + uploaded + '"', html)
        self.assertIn('data-contribution-file="model-figures.pdf"', html)

    def test_audit_follows_lazy_preview_manifest(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            previews = root / 'static/contribution/previews'
            previews.mkdir(parents=True)
            (root / 'index.html').write_text('<script src="static/contribution/documents.js"></script>')
            (previews.parent / 'documents.js').write_text('// Lazy reader')
            (previews / 'manifest.json').write_text(json.dumps({
                'model-figures.pdf': {'pages': [{'file': 'page.webp'}]},
            }))
            local = inspect_build(root, {})
            self.assertIn('static/contribution/previews/page.webp', local['missing_files'])
            self.assertIn('static/contribution/previews/page.webp', local['local_media'])
            uploaded = inspect_build(root, {
                '/static/contribution/previews/page.webp':
                    'https://static.igem.wiki/teams/6085/wiki/figure-page.webp',
            })
            self.assertFalse(uploaded['missing_files'])
            self.assertFalse(uploaded['local_media'])

    def test_audit_splits_remote_gallery_urls(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            urls = ['https://static.igem.wiki/teams/6085/wiki/a.avif',
                    'https://static.igem.wiki/teams/6085/wiki/b.avif']
            (root / 'index.html').write_text('<div data-images="' + '|'.join(urls) + '"></div>')
            self.assertEqual(set(inspect_build(root, {})['remote_media']), set(urls))


if __name__ == '__main__':
    unittest.main()
