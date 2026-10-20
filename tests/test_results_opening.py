"""Protect chapter header isolation and the Results reading handoff."""
import unittest
from lxml import html
from app import app


class ResultsOpeningIntegration(unittest.TestCase):
    def test_results_header_preserves_one_reading_handoff(self):
        with app.test_client() as client:
            response = client.get('/results')
            self.assertEqual(response.status_code, 200)
            page = html.fromstring(response.data)
            self.assertEqual(len(page.xpath('//h1')), 1)
            self.assertEqual(len(page.xpath('//*[@id="results-summary"]')), 1)
            self.assertEqual(len(page.xpath('//a[@href="#results-summary"]')), 1)
            self.assertEqual(len(page.xpath('//*[@id="results-summary"]//p')), 1)
            self.assertIn('Our work on RNA editing', page.xpath('//*[@id="results-summary"]')[0].text_content())
            self.assertTrue(page.xpath('//*[@id="platform-achievements"]'))
            for image in page.xpath('//header[contains(@class,"results-opening")]//img | //*[@id="results-summary"]//img'):
                asset = client.get(image.get('src'))
                self.assertEqual(asset.status_code, 200)
                self.assertTrue(asset.mimetype.startswith('image/'))
                asset.close()

    def test_header_override_keeps_description_opening(self):
        with app.test_client() as client:
            page = html.fromstring(client.get('/description').data)
            self.assertEqual(len(page.xpath('//h1')), 1)
            self.assertTrue(page.xpath('//*[@id="description-opening-title"]'))
            self.assertFalse(page.xpath('//*[@id="results-opening-title"]'))
            self.assertFalse(page.xpath('//*[@id="results-summary"]'))


if __name__ == '__main__':
    unittest.main()
