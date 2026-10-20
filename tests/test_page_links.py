"""Regression coverage for team-prefix links and nested custom error pages."""
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
from app import app
from wiki_content import load_markdown_content


class PageLinksTest(unittest.TestCase):
    def test_markdown_links_keep_prefix_queries_and_fragments(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'links.md').write_text('[Experiment](/experiments) [Notebook](/notebook) '
                '[Model](/model?view=all#results) [Software](/software#rewire) '
                '[External](https://example.org/model) [Unknown](/unknown)')
            with patch('wiki_content.DOCS_ROOT', root):
                html = load_markdown_content('links.md', page_url=lambda page: '/sustech/' + page).html
        for target in ['experiments', 'notebook', 'model?view=all#results', 'software#rewire']:
            self.assertIn('href="/sustech/' + target + '"', html)
        self.assertIn('href="https://example.org/model"', html)
        self.assertIn('href="/unknown"', html)

    def test_frozen_contribution_links_remain_under_team_prefix(self):
        from flask_frozen import patch_url_for
        with patch_url_for(app):
            response = app.test_client().get('/contribution')
        self.assertEqual(response.status_code, 200)
        for route in ['experiments', 'notebook', 'model', 'software']:
            self.assertIn('href="' + route + '"', response.text)
            self.assertNotIn('href="/' + route + '"', response.text)

    def test_dynamic_downloads_use_repository_destinations_in_production(self):
        entries = {'static/notebook/pdfs/example.pdf': {'url': 'https://gitlab.igem.org/2026/sustech/-/raw/main/static/notebook/pdfs/example.pdf'}}
        with patch.dict(app.extensions, repository_files=entries):
            with patch.dict(app.config, WIKI_ASSET_MODE='igem'):
                response = app.test_client().get('/asset-runtime.js')
                self.assertIn(entries['static/notebook/pdfs/example.pdf']['url'], response.text)
            with patch.dict(app.config, WIKI_ASSET_MODE='local'):
                response = app.test_client().get('/asset-runtime.js')
                self.assertNotIn(entries['static/notebook/pdfs/example.pdf']['url'], response.text)

    def test_custom_404_has_stable_base_in_both_modes(self):
        for mode, base in [('local', '/'), ('igem', '/sustech/')]:
            with self.subTest(mode=mode), patch.dict(app.config, WIKI_ASSET_MODE=mode):
                response = app.test_client().get('/nested/missing-page')
                self.assertEqual(response.status_code, 404)
                self.assertIn('class="nf-stage"', response.text)
                self.assertIn('<base href="' + base + '">', response.text)


if __name__ == '__main__':
    unittest.main()
