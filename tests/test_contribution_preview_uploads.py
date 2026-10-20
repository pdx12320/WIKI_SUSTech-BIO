"""Contribution PDF page previews resolve locally and on the iGEM site."""
import hashlib
import json
import unittest
from pathlib import Path

from app import app


class ContributionPreviewUploadsTest(unittest.TestCase):
    route = '/static/contribution/previews/manifest.json'
    upload_prefix = 'https://static.igem.wiki/teams/6085/wiki/10-20/dry/'

    def setUp(self):
        self.mode = app.config['WIKI_ASSET_MODE']
        self.client = app.test_client()
        self.root = Path(app.root_path)
        self.original = (self.root / self.route.lstrip('/')).read_bytes()
        self.manifest = json.loads(self.original)
        evidence = json.loads((self.root / 'asset_uploads.json').read_text())
        self.records = {
            record['local_path']: record
            for record in evidence['confirmed_mapping']
            if record['url'].startswith(self.upload_prefix)
        }

    def tearDown(self):
        app.config['WIKI_ASSET_MODE'] = self.mode

    def test_all_uploaded_pages_have_current_source_evidence(self):
        paths = {
            'static/contribution/previews/' + page['file']
            for document in self.manifest.values() for page in document['pages']
        }
        self.assertEqual(len(paths), 493)
        self.assertEqual(set(self.records), paths)
        self.assertEqual(len({record['url'] for record in self.records.values()}), 493)
        for path, record in self.records.items():
            with self.subTest(path=path):
                self.assertEqual(hashlib.sha256((self.root / path).read_bytes()).hexdigest(),
                                 record['sha256'])
                self.assertEqual(app.extensions['igem_assets']['/' + path], record['url'])

    def test_local_manifest_and_all_images_preserve_original_bytes(self):
        app.config['WIKI_ASSET_MODE'] = 'local'
        with self.client.get(self.route) as response:
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data, self.original)
        for document in self.manifest.values():
            for page in document['pages']:
                path = 'static/contribution/previews/' + page['file']
                with self.subTest(path=path), self.client.get('/' + path) as response:
                    self.assertEqual(response.status_code, 200)
                    self.assertEqual(response.mimetype, 'image/webp')
                    self.assertEqual(response.data, (self.root / path).read_bytes())

    def test_igem_manifest_switches_every_page_without_changing_metadata(self):
        app.config['WIKI_ASSET_MODE'] = 'igem'
        expected = json.loads(self.original)
        for document in expected.values():
            for page in document['pages']:
                path = 'static/contribution/previews/' + page['file']
                page['file'] = self.records[path]['url']
        for mount in ['', '/sustech']:
            with self.subTest(mount=mount), self.client.get(
                self.route, environ_overrides={'SCRIPT_NAME': mount}
            ) as response:
                self.assertEqual(response.status_code, 200)
                self.assertEqual(response.get_json(), expected)

    def test_reader_runtime_uses_uploads_only_in_igem_mode(self):
        for mode in ['local', 'igem']:
            app.config['WIKI_ASSET_MODE'] = mode
            with self.subTest(mode=mode), self.client.get('/asset-runtime.js') as response:
                self.assertEqual(response.status_code, 200)
                script = response.get_data(as_text=True)
                if mode == 'local':
                    self.assertIn('const mapping = {};', script)
                    self.assertNotIn(self.upload_prefix, script)
                else:
                    for record in self.records.values():
                        self.assertIn(record['url'], script)
            with self.client.get('/contribution') as response:
                self.assertEqual(response.status_code, 200)
                html = response.get_data(as_text=True)
                self.assertIn('contribution/documents.js', html)
                self.assertEqual('asset-runtime.js' in html, mode == 'igem')
