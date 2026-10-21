"""Scope the entry cover and cross-theme navigation without changing authored openings."""
import unittest
from app import app
from wiki_content import CONTENT_PAGES


class EntryLoadingIntegration(unittest.TestCase):
    def test_one_cover_on_public_routes(self):
        with app.test_client() as client:
            for route in ['/', *('/' + page for page in CONTENT_PAGES)]:
                with self.subTest(route=route):
                    response = client.get(route)
                    self.assertEqual(response.status_code, 200)
                    html = response.get_data(as_text=True)
                    self.assertEqual(html.count('data-entry-loader'), 1)
                    self.assertEqual(html.count('entry-loading/boot.js'), 1)
                    self.assertNotIn('transition/whitehole', html)
                    self.assertIn('entry-orca-sea-', html)
                    self.assertIn('LOADING<span class="entry-loading__dots"> . . .</span>', html)
                    self.assertEqual(html.count('id="entry-orca-sea-1-1-water-clip"'), 1)

    def test_review_and_error_routes_stay_isolated(self):
        with app.test_client() as client:
            for route in ['/next', '/next-journey', '/404.html']:
                with self.subTest(route=route):
                    self.assertNotIn('data-entry-loader', client.get(route).get_data(as_text=True))
