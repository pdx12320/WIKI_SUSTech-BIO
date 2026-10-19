"""Scope the entry cover without changing page or white-hole choreography."""
import unittest
from app import app


class EntryLoadingIntegration(unittest.TestCase):
    def test_one_cover_on_public_routes(self):
        with app.test_client() as client:
            for route in ['/', '/description', '/team', '/model', '/human-practices']:
                with self.subTest(route=route):
                    response = client.get(route)
                    self.assertEqual(response.status_code, 200)
                    html = response.get_data(as_text=True)
                    self.assertEqual(html.count('data-entry-loader'), 1)
                    self.assertEqual(html.count('entry-loading/boot.js'), 1)
                    self.assertLess(html.index('whitehole-boot.js'), html.index('entry-loading/boot.js'))

    def test_review_and_error_routes_stay_isolated(self):
        with app.test_client() as client:
            for route in ['/next', '/next-journey', '/404.html']:
                with self.subTest(route=route):
                    self.assertNotIn('data-entry-loader', client.get(route).get_data(as_text=True))
