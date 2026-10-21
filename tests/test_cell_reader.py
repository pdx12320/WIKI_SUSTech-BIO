"""Scope checks for the replacement; panel navigation remains independent."""
import unittest
from reading_navigation import reading_navigation_mode
from wiki_content import CONTENT_PAGES


class CellReaderScopeTests(unittest.TestCase):
    def test_common_template_pages_also_get_cell(self):
        for slug, config in CONTENT_PAGES.items():
            if not config.is_custom:
                with self.subTest(page=slug):
                    self.assertEqual(reading_navigation_mode('pages', config), 'cell')

    def test_custom_reading_pages_get_cell(self):
        for slug in ['design-communication', 'model', 'software', 'dry-lab',
                     'brain-delivery', 'offtarget-atlas', 'human-practices',
                     'education', 'contribution', 'experiments', 'notebook']:
            with self.subTest(page=slug):
                self.assertEqual(reading_navigation_mode('pages', CONTENT_PAGES[slug]), 'cell')

    def test_team_and_independent_engineering_paper_have_no_exterior_navigation(self):
        self.assertEqual(reading_navigation_mode('pages', CONTENT_PAGES['team']), 'none')
        self.assertEqual(reading_navigation_mode('pages', CONTENT_PAGES['engineering']), 'internal')

    def test_home_reviews_errors_and_unknown_pages_have_no_exterior_navigation(self):
        for endpoint in ['home', 'home_next', 'home_next_crayon', 'home_next_journey', 'static_404', None]:
            self.assertEqual(reading_navigation_mode(endpoint), 'none')
        self.assertEqual(reading_navigation_mode('pages'), 'none')


class CellReaderRenderedRouteTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        from app import app
        cls.client = app.test_client()

    def test_every_content_route_uses_exactly_one_cell_except_internal_reader(self):
        for slug in CONTENT_PAGES:
            with self.subTest(page=slug):
                response = self.client.get('/' + slug)
                self.assertEqual(response.status_code, 200)
                html = response.get_data(as_text=True)
                internal = slug == 'engineering' and 'data-reading-scroll-target=' in html
                self.assertEqual(html.count('data-reading-orbit role='), int(internal))
                if internal:
                    self.assertIn('reading-orbit/reading-orbit.js', html)
                    self.assertIn('reading-orbit/reading-orbit.css', html)
                expected = 0 if slug in {'team', 'engineering'} else 1
                self.assertEqual(html.count('data-cell-reader aria-label='), expected)
                self.assertEqual(html.count('cell-reader/cell-reader.js'), expected)
                self.assertEqual(html.count('cell-reader/cell-reader.css'), expected)
                if expected:
                    self.assertIn('data-cell-reader-drag', html)
                    self.assertNotIn('data-cell-reader-top', html)
                    self.assertNotIn('A little break for your eyes', html)
                if slug == 'human-practices':
                    self.assertIn('data-cell-reader-start="#main-content > .content-overview" hidden', html)
                else:
                    self.assertNotIn('data-cell-reader-start=', html)

    def test_home_reviews_and_errors_have_no_cell_or_old_exterior_orbit(self):
        for path in ['/', '/next', '/next-crayon', '/next-journey', '/404.html', '/missing-cell-test-page']:
            with self.subTest(path=path):
                html = self.client.get(path).get_data(as_text=True)
                self.assertNotIn('data-cell-reader aria-label=', html)
                self.assertNotIn('data-reading-orbit role=', html)

    def test_engineering_keeps_independent_reader_and_dbtl_controls(self):
        html = self.client.get('/engineering').get_data(as_text=True)
        self.assertIn('data-engineering-scroll', html)
        self.assertIn('data-dbtl-wheel', html)
        self.assertNotIn('data-cell-reader aria-label=', html)

    def test_production_assets_are_served(self):
        for name in ['cell-reader.css', 'cell-reader.js']:
            with self.client.get('/static/cell-reader/' + name) as response:
                self.assertEqual(response.status_code, 200)


if __name__ == '__main__':
    unittest.main()
