"""Published archives must stay attached to their intended Wiki chapters."""
import re
import unittest
from app import app
from supporting_data import load_datasets

EXPECTED = {
    'fr': '23511762', 'io': '23510189', 'gfa': '23501695',
    'mre': '23502863', 'aso': '23503139',
    'sonar-engineering': '23510572', 'measurement': '23510572', 'fv': '23511905',
}


class SupportingDataTest(unittest.TestCase):
    def setUp(self):
        self.mode = app.config['WIKI_ASSET_MODE']
        app.config['WIKI_ASSET_MODE'] = 'local'
        self.client = app.test_client()

    def tearDown(self):
        app.config['WIKI_ASSET_MODE'] = self.mode

    def test_each_chapter_links_to_its_published_record(self):
        pages = {route: self.client.get('/' + route).get_data(as_text=True)
                 for route in ('engineering', 'measurement')}
        for item in load_datasets():
            with self.subTest(chapter=item['id']):
                html = pages['measurement' if item['id'] == 'measurement' else 'engineering']
                bars = re.findall(r'<aside class="sd-bar"[^>]*id="sd-' + item['id'] + r'".*?</aside>', html, re.S)
                self.assertEqual(len(bars), 1)
                self.assertIn('https://doi.org/10.5281/zenodo.' + EXPECTED[item['id']], bars[0])
                self.assertIn('href="/contribution#supporting-data"', bars[0])
                self.assertIn('<svg', bars[0])
                self.assertNotIn('<img', bars[0])
                self.assertNotIn('pending', bars[0])
        self.assertEqual(pages['engineering'].count('class="sd-bar"'), 7)
        self.assertEqual(pages['measurement'].count('class="sd-bar"'), 1)
        self.assertNotIn('<!-- SUPPORTING_DATA:', ''.join(pages.values()))

    def test_contribution_destination_has_all_eight_record_entries(self):
        html = self.client.get('/contribution').get_data(as_text=True)
        self.assertIn('id="wet-resources"', html)
        self.assertIn('id="supporting-data"', html)
        for key, number in EXPECTED.items():
            self.assertIn('id="resource-' + key + '"', html)
            self.assertIn('https://doi.org/10.5281/zenodo.' + number, html)

    def test_team_prefix_and_production_mode_preserve_links_without_new_media(self):
        for mode in ('local', 'igem'):
            app.config['WIKI_ASSET_MODE'] = mode
            html = self.client.get('/engineering', environ_overrides={
                'SCRIPT_NAME': '/2026/sustech'}).get_data(as_text=True)
            self.assertEqual(html.count('href="/2026/sustech/contribution#supporting-data"'), 7)
            self.assertNotIn('supporting-data-doi-logo.svg', html)
            self.assertIn('https://doi.org/10.5281/zenodo.23510572', html)

    def test_index_is_canonical_and_has_no_placeholders(self):
        response = self.client.get('/supporting-data')
        self.assertEqual(response.status_code, 200)
        html = response.get_data(as_text=True)
        self.assertEqual(html.count('class="sd-row"'), 8)
        self.assertIn('<h1>Supporting Data', html)
        self.assertNotIn('DOI pending', html)
        self.assertNotIn('zenodo.XXXX', html)
        self.assertNotIn('/supporting-data-preview', html)
