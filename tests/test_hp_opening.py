from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest
import xml.etree.ElementTree as ET

from app import app

ROOT = Path(__file__).resolve().parents[1]
PHOTO = 'https://static.igem.wiki/teams/6085/wiki/hp/banana-dna-original.avif'


class HPOpeningTests(unittest.TestCase):
    def test_hp_entry_keeps_reading_target_and_complete_question(self):
        with app.test_client() as client:
            response = client.get('/human-practices')
        self.assertEqual(response.status_code, 200)
        html = response.get_data(as_text=True)
        self.assertIn('aria-label="What can we do with THIS once we have extracted it?"', html)
        self.assertIn('href="#main-content" aria-label="Continue to Human Practices"', html)
        self.assertIn('id="main-content"', html)
        self.assertLess(html.index('data-hp-opening'), html.index('id="main-content"'))

    def test_production_photo_uses_verified_cdn_for_all_layers(self):
        mode = app.config['WIKI_ASSET_MODE']
        try:
            app.config['WIKI_ASSET_MODE'] = 'igem'
            with app.test_client() as client:
                html = client.get('/human-practices').get_data(as_text=True)
        finally:
            app.config['WIKI_ASSET_MODE'] = mode
        opening = html.split('data-hp-opening', 1)[1].split('</section>', 1)[0]
        self.assertEqual(opening.count(PHOTO), 3)
        self.assertNotIn('/assets/human-practices/opening/', opening)

    def test_curved_print_is_reproducible_without_font_dependencies(self):
        with tempfile.TemporaryDirectory(prefix='hp-print-regenerate-') as directory:
            root = Path(directory)
            for name in ['scripts', 'docs/design/hp-opening', 'wiki/components/human-practices']:
                (root / name).mkdir(parents=True, exist_ok=True)
            for name in ['scripts/build_hp_cup_projection.py', 'docs/design/hp-opening/this-glyph-outlines.json']:
                shutil.copyfile(ROOT / name, root / name)
            subprocess.run([sys.executable, str(root / 'scripts/build_hp_cup_projection.py')], check=True, capture_output=True)
            name = 'wiki/components/human-practices/cup_print.html'
            self.assertEqual((root / name).read_bytes(), (ROOT / name).read_bytes())
        source = (ROOT / name).read_text().split('\n', 1)[1]
        tree = ET.fromstring('<svg>' + source + '</svg>')
        self.assertEqual(len(tree.findall('.//path')), 3)
        self.assertEqual(len(tree.findall('.//use')), 0)
        self.assertEqual(len(tree.findall('.//clipPath')), 0)


if __name__ == '__main__':
    unittest.main()
