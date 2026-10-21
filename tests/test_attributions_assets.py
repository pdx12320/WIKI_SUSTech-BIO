"""Attributions media must work locally and on the official Wiki CDN."""
import hashlib
import json
from pathlib import Path
import unittest
from unittest.mock import patch

from app import app, localized_asset_files


class AttributionsAssetsTest(unittest.TestCase):
    def test_local_freeze_includes_reverse_mapped_downloads(self):
        with patch.dict(app.config, WIKI_ASSET_MODE='local'):
            files = {args['filename'] for endpoint, args in localized_asset_files()}
            self.assertIn('human-practices/education/workbook-current-student-zh-compact.pdf', files)
            self.assertIn('human-practices/overview/hp-figure-1-hand-drawn-overview-v2-20261021.webp', files)
        with patch.dict(app.config, WIKI_ASSET_MODE='igem'):
            self.assertEqual(list(localized_asset_files()), [])

    def test_uploaded_files_match_originals_and_mapping(self):
        records = json.loads(Path('asset_uploads.json').read_text())['confirmed_mapping']
        records = [r for r in records if r['local_path'].startswith('static/attributions-portraits/')]
        self.assertEqual(len(records), 11)
        for record in records:
            with self.subTest(path=record['local_path']):
                self.assertEqual(hashlib.sha256(Path(record['local_path']).read_bytes()).hexdigest(), record['sha256'])
                self.assertEqual(app.extensions['igem_assets']['/' + record['local_path']], record['url'])

    def test_page_and_font_resolve_in_both_environments(self):
        client = app.test_client()
        for mode in ['local', 'igem']:
            with self.subTest(mode=mode), patch.dict(app.config, WIKI_ASSET_MODE=mode):
                page = client.get('/attributions')
                css = client.get('/static/attributions.css')
                self.assertEqual(page.status_code, 200)
                self.assertEqual(css.status_code, 200)
                for path in sorted(Path('static/attributions-portraits').iterdir()):
                    local = '/' + path.as_posix()
                    if mode == 'igem':
                        self.assertIn(app.extensions['igem_assets'][local], css.text if path.suffix == '.ttf' else page.text)
                    else:
                        self.assertIn('attributions-portraits/' + path.name, css.text if path.suffix == '.ttf' else page.text)
                        with client.get(local) as asset:
                            self.assertEqual(asset.status_code, 200)
                            self.assertEqual(asset.data, path.read_bytes())
