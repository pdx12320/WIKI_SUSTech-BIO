"""The supported Home reading entrance must never expose the old bare chapters."""
import unittest
from pathlib import Path
from app import app


class HomeStaticEntryTests(unittest.TestCase):
    def test_complete_static_entrance_on_both_home_routes(self):
        with app.test_client() as client:
            for route in ['/', '/next']:
                with self.subTest(route=route):
                    html = client.get(route).get_data(as_text=True)
                    self.assertEqual(html.count('data-home-static-entry'), 1)
                    self.assertIn('static-entry-orca-sea-', html)
                    self.assertIn('assets/wiki1-main-orca.png', html)
                    self.assertIn('href="#ot-index-title"', html)
                    self.assertIn('onetake/home-entry-art.css', html)

    def test_legacy_chapters_remain_animation_only(self):
        css = Path('static/onetake/home-static-entry.css').read_text()
        self.assertIn('.ot--static:has(> [data-home-static-entry])', css)
        self.assertIn('.ot-story', css)
        self.assertIn('display: none !important', css)
        self.assertIn('home-static-entry.css', Path('static/onetake/home-entry-art.css').read_text())
