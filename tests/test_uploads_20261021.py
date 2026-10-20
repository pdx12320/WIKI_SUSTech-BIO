"""The final upload batch keeps archival originals and changes production URLs."""
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import unittest

from app import app


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.hrefs = set()

    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            href = dict(attrs).get('href')
            if href:
                self.hrefs.add(href)


class FinalUploadsTest(unittest.TestCase):
    def setUp(self):
        self.mode = app.config['WIKI_ASSET_MODE']
        self.root = Path(app.root_path)
        self.client = app.test_client()
        self.records = json.loads((self.root / 'docs/releases/asset-uploads-20261021/verification.json').read_text())['records']

    def tearDown(self):
        app.config['WIKI_ASSET_MODE'] = self.mode

    def test_every_uploaded_resource_resolves_from_unchanged_source_bytes(self):
        self.assertEqual(len(self.records), 73)
        for record in self.records:
            path = record['local_path']
            with self.subTest(path=path):
                self.assertEqual(hashlib.sha256((self.root / path).read_bytes()).hexdigest(), record['source_sha256'])
                self.assertEqual(app.extensions['igem_assets']['/' + path], record['url'])

    def test_original_pdf_and_preview_manifest_remain_archival(self):
        path = 'static/contribution/resources/model-figures.pdf'
        record = next(record for record in self.records if record['local_path'] == path)
        original = (self.root / path).read_bytes()
        self.assertEqual(len(original), 27154896)
        self.assertEqual(record['source_sha256'], '9f8f0f255cf5ad88d514b4bf70e0747e42b8fa9725315304be844ab96a481b29')
        self.assertEqual(record['uploaded_sha256'], '92d91f835707ee0583be8eeee4da8bf5513fac396c2216016d483071c5c263b7')
        self.assertEqual(record['bytes'], 9738811)
        self.assertEqual(record['page_count'], 95)
        manifest = json.loads((self.root / 'static/contribution/previews/manifest.json').read_text())
        self.assertEqual(len(manifest['model-figures.pdf']['pages']), 95)
        for mode in ['local', 'igem']:
            app.config['WIKI_ASSET_MODE'] = mode
            with self.subTest(mode=mode), self.client.get('/' + path) as response:
                self.assertEqual(response.status_code, 200)
                self.assertEqual(response.data, original)

    def test_production_downloads_use_uploads_at_both_mount_points(self):
        for mount in ['', '/sustech']:
            for mode in ['local', 'igem']:
                app.config['WIKI_ASSET_MODE'] = mode
                for route, folder in [('/contribution', 'static/contribution/resources/'),
                                      ('/project-contribution-sonar', 'static/sonar-contribution/resources/')]:
                    with self.subTest(mount=mount, mode=mode, route=route), self.client.get(
                        route, environ_overrides={'SCRIPT_NAME': mount}
                    ) as response:
                        self.assertEqual(response.status_code, 200)
                        links = Links()
                        links.feed(response.get_data(as_text=True))
                        for record in self.records:
                            if not record['local_path'].startswith(folder):
                                continue
                            if mode == 'igem':
                                self.assertIn(record['url'], links.hrefs)
                            else:
                                self.assertNotIn(record['url'], links.hrefs)
                                self.assertTrue(any(href.endswith(record['local_path']) for href in links.hrefs))

    def test_engineering_cover_font_switches_only_in_production(self):
        path = 'static/fonts/headers/LibreBaskerville-Italic.ttf'
        remote = app.extensions['igem_assets']['/' + path]
        for mode in ['local', 'igem']:
            app.config['WIKI_ASSET_MODE'] = mode
            with self.subTest(mode=mode), self.client.get('/static/engineering-opening.css') as response:
                css = response.get_data(as_text=True)
                if mode == 'igem':
                    self.assertIn(remote, css)
                else:
                    self.assertNotIn(remote, css)
                    self.assertIn('fonts/headers/LibreBaskerville-Italic.ttf', css)
