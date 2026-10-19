"""Keep the approved characters, original diagrams and CDN routing consistent."""
import hashlib
import json
from pathlib import Path
import unittest
from lxml import html
from app import app, freezer


class EngineeringCartoonsTest(unittest.TestCase):
    def setUp(self):
        self.assets = Path('assets/images/engineering-cartoons')
        self.manifest = json.loads((self.assets / 'manifest.json').read_text())
        self.mode = app.config['WIKI_ASSET_MODE']
        self.client = app.test_client()

    def tearDown(self):
        app.config['WIKI_ASSET_MODE'] = self.mode

    def document(self, mode, prefix=''):
        app.config['WIKI_ASSET_MODE'] = mode
        response = self.client.get('/engineering', environ_overrides={'SCRIPT_NAME': prefix})
        self.assertEqual(response.status_code, 200)
        return html.fromstring(response.get_data(as_text=True))

    def test_characters_match_the_ten_verified_upload_sources(self):
        self.assertEqual(len(self.manifest), 10)
        self.assertEqual(len({r['module'] for r in self.manifest}), 10)
        for record in self.manifest:
            with self.subTest(module=record['module']):
                data = (self.assets / record['image']).read_bytes()
                self.assertEqual(hashlib.sha256(data).hexdigest(), record['sha256'])
                self.assertEqual(record['cdn_verification']['status'], 200)
                self.assertEqual(record['cdn_verification']['format'], 'AVIF')
                self.assertIn('/wiki/cartoon-figure/', record['url'])
                self.assertEqual(app.extensions['igem_assets']['/assets/images/engineering-cartoons/' + record['image']], record['url'])
        io = next(r for r in self.manifest if r['module'] == 'integrated-orca')
        self.assertTrue(io['url'].endswith('integrated-orca-cb14f211df45.avif'))

    def test_local_images_are_native_urls_inside_an_inert_template(self):
        doc = self.document('local')
        images = doc.xpath('//template[@data-engineering-cartoon-assets]//img')
        self.assertEqual(len(images), 10)
        by_module = {image.get('data-engineering-cartoon'): image for image in images}
        for record in self.manifest:
            image = by_module[record['module']]
            self.assertEqual(image.get('src'), '/assets/images/engineering-cartoons/' + record['image'])
            self.assertTrue(image.get('alt'))
        self.assertEqual(len(doc.xpath('//img[@class="engineering-overview-illustration"]')), 12)

    def test_production_templates_use_all_ten_confirmed_cdn_urls(self):
        doc = self.document('igem')
        images = doc.xpath('//template[@data-engineering-cartoon-assets]//img')
        self.assertEqual({image.get('src') for image in images}, {r['url'] for r in self.manifest})
        self.assertTrue(doc.xpath('//script[contains(@src,"engineering-overview-cartoons.js")]'))
        self.assertTrue(doc.xpath('//link[contains(@href,"engineering-overview-cartoons.css")]'))

    def test_local_freeze_discovers_every_inert_template_image(self):
        doc = self.document('local')
        sources = {image.get('src') for image in doc.xpath('//template[@data-engineering-cartoon-assets]//img')}
        self.assertEqual(len(sources), 10)
        self.assertTrue(sources.issubset(set(freezer.all_urls())))
        for source in sources:
            with self.client.get(source) as response:
                self.assertEqual(response.status_code, 200, source)

    def test_asset_routing_preserves_a_deployment_mount_point(self):
        for mode in ['local', 'igem']:
            with self.subTest(mode=mode):
                doc = self.document(mode, '/2026/sustech')
                images = doc.xpath('//template[@data-engineering-cartoon-assets]//img')
                for image in images:
                    expected = ('/2026/sustech/assets/images/engineering-cartoons/' if mode == 'local'
                                else 'https://static.igem.wiki/teams/6085/wiki/cartoon-figure/')
                    self.assertTrue(image.get('src').startswith(expected), image.get('src'))
