"""The October 20 upload batch resolves in both preview and publication modes."""
import hashlib
import json
import unittest
from pathlib import Path
from urllib.parse import urlsplit

from app import app
from scripts.import_asset_uploads import compatible, normalized_stem, package_name


class UploadedBatchTest(unittest.TestCase):
    def setUp(self):
        self.mode = app.config['WIKI_ASSET_MODE']
        self.client = app.test_client()
        self.root = Path(app.root_path)
        evidence = json.loads((self.root / 'asset_uploads.json').read_text())
        self.batch = [r for r in evidence['confirmed_mapping']
                      if '/wiki/10-20-9-10/' in r['url']]

    def tearDown(self):
        app.config['WIKI_ASSET_MODE'] = self.mode

    def text(self, route):
        with self.client.get(route) as response:
            self.assertEqual(response.status_code, 200)
            return response.get_data(as_text=True)

    def test_all_sixty_urls_match_current_originals_and_runtime_map(self):
        self.assertEqual(len(self.batch), 60)
        self.assertEqual(len({r['url'] for r in self.batch}), 60)
        for record in self.batch:
            with self.subTest(path=record['local_path']):
                data = (self.root / record['local_path']).read_bytes()
                self.assertEqual(hashlib.sha256(data).hexdigest(), record['sha256'])
                self.assertEqual(normalized_stem(package_name(record['local_path'], data)),
                                 normalized_stem(urlsplit(record['url']).path))
                self.assertTrue(compatible(record['local_path'], urlsplit(record['url']).path))
                self.assertEqual(app.extensions['igem_assets']['/' + record['local_path']], record['url'])

    def test_pages_and_fonts_switch_without_editing_original_sources(self):
        cases = [
            ('/results', 'assets/images/results-achievements/edit.png'),
            ('/engineering', 'assets/images/engineering-conclusions/aso.png'),
            ('/team', 'static/assets/team/mascots/coding.png'),
            ('/education', 'assets/human-practices/attachments/icii-orca-project-poster.pdf'),
            ('/static/chapter-personalities.css', 'static/fonts/headers/CourierPrime-Bold.ttf'),
        ]
        for route, path in cases:
            remote = app.extensions['igem_assets']['/' + path]
            with self.subTest(route=route):
                app.config['WIKI_ASSET_MODE'] = 'local'
                local = self.text(route)
                self.assertIn(Path(path).name, local)
                self.assertNotIn(remote, local)
                app.config['WIKI_ASSET_MODE'] = 'igem'
                published = self.text(route)
                self.assertIn(remote, published)
                self.assertNotIn('"/' + path + '"', published)

    def test_notebook_keeps_local_base_and_archival_bytes(self):
        app.config['WIKI_ASSET_MODE'] = 'igem'
        self.assertIn('data-index="/static/notebook/index.json"', self.text('/notebook'))
        for path in ['static/notebook/index.json', 'static/sap-demo/site-integrity.json']:
            with self.client.get('/' + path) as response:
                self.assertEqual(response.data, (self.root / path).read_bytes())
        script = self.text('/static/notebook/notebook.mjs')
        self.assertIn('fetch(sourceURL(baseURL.href))', script)
        runtime = self.text('/asset-runtime.js')
        for record in self.batch:
            self.assertIn(record['url'], runtime)
        app.config['WIKI_ASSET_MODE'] = 'local'
        self.assertIn('const mapping = {};', self.text('/asset-runtime.js'))
