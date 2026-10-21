import json
import re
import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

from app import app
from wiki_content import CONTENT_PAGES, NAVIGATION, load_markdown_content

ROOT = Path(__file__).resolve().parents[1]


class DesignImages(HTMLParser):
    def __init__(self):
        super().__init__()
        self.images = []
        self.pdf_links = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'img':
            self.images.append(attrs)
        if tag == 'a' and '.pdf' in attrs.get('href', ''):
            self.pdf_links.append(attrs['href'])


class DesignCommunicationTest(unittest.TestCase):
    def test_design_route_and_team_navigation(self):
        self.assertIn('design-communication', CONTENT_PAGES)
        team = next(group for group in NAVIGATION if group['label'] == 'Team')
        self.assertIn(('design-communication', 'Design & Media Promotion'), team['items'])
        response = app.test_client().get('/design-communication')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'data-design-opening', response.data)
        self.assertIn(b'static/design-communication.css', response.data)

    def test_blur_cover_is_installed_in_head_before_loading_controller(self):
        html = app.test_client().get('/design-communication').get_data(as_text=True)
        head, body = html.split('</head>', 1)
        self.assertIn('static/design-opening-boot.js', head)
        self.assertIn('static/design-opening.css', head)
        self.assertLess(head.index('static/design-opening-boot.js'), head.index('static/design-opening.css'))
        self.assertIn('static/design-opening.js', body)
        self.assertNotIn('static/design-opening-boot.js" defer', head)

    def test_figure_groups_and_official_downloads(self):
        content = load_markdown_content('team/design-communication.md')
        self.assertEqual([x['name'] for x in content.toc if x['level'] == 2], [
            'Our Design Principles', 'Building an Identity', 'Design in Action', 'Science Meets People'])
        self.assertEqual(re.findall(r'<figcaption>Figure (\d+)\.', content.html), [str(n) for n in range(1, 20)])
        page = DesignImages()
        page.feed(content.html)
        self.assertEqual(len(page.images), 36)
        english_poster = 'https://static.igem.wiki/teams/6085/wiki/inclusivity/aphasia-map-instructions-en.avif'
        self.assertIn(english_poster, {image['src'] for image in page.images})
        for image in page.images:
            self.assertTrue(image.get('alt'))
            self.assertTrue(image['src'].startswith('https://static.igem.wiki/teams/6085/wiki/design/')
                            or image['src'] == english_poster)
            self.assertTrue(image['src'].endswith('.avif'))
        self.assertEqual(len({url.split('#')[0] for url in page.pdf_links}), 4)
        self.assertTrue(any(url.endswith('#page=1') for url in page.pdf_links))
        self.assertTrue(any(url.endswith('#page=2') for url in page.pdf_links))
        for url in page.pdf_links:
            self.assertEqual(urlsplit(url).hostname, 'static.igem.wiki')

    def test_primary_palette_matches_approved_reference(self):
        colors = ['#FFDBDD', '#C6CCF4', '#7375B2', '#303D72', '#FB95A3']
        content = load_markdown_content('team/design-communication.md')
        self.assertEqual(re.findall(r'<dd>(#[A-F0-9]{6})</dd>', content.html), colors)
        self.assertIn('Figure 2. ORCA’s primary visual palette.', content.html)
        self.assertNotIn('supplied by the team', content.html)
        self.assertIn('https://static.igem.wiki/teams/6085/wiki/design/identity/visual-system-primary-colour-palette.avif', content.html)
        css = ''.join((ROOT / name).read_text() for name in ['static/design-communication.css', 'static/design-opening.css'])
        self.assertEqual({value.upper() for value in re.findall(r'#[A-Fa-f0-9]{3,8}\b', css)}, {*colors, '#FFF'})

    def test_every_design_media_dependency_is_verified_and_hosted(self):
        manifest = json.loads((ROOT / 'docs/design/design-communication-sources/igem-upload-links.json').read_text())
        rows = manifest['files']
        self.assertEqual(len(rows), 43)
        self.assertEqual(len({r['server_url'] for r in rows}), 43)
        for row in rows:
            self.assertEqual(row['status'], 200)
            self.assertEqual(urlsplit(row['server_url']).hostname, 'static.igem.wiki')
        for group in ['identity', 'applications', 'stories']:
            self.assertLess(sum(r['bytes'] for r in rows if r['group'] == group), 10_000_000)
        opening = (ROOT / 'wiki/components/design-communication/opening.html').read_text()
        self.assertEqual(len(re.findall(r'data-image="https://static.igem.wiki/[^\"]+"', opening)), 3)
        self.assertIn('mascot-opening-bottom-left.webp', opening)
        self.assertIn('mascot-opening-top-right.webp', opening)
        css = (ROOT / 'static/design-communication.css').read_text()
        self.assertIn('https://static.igem.wiki/teams/6085/wiki/design/stories/pinyon-script-regular.ttf', css)
        self.assertNotIn('url("fonts/', css)


if __name__ == '__main__':
    unittest.main()
