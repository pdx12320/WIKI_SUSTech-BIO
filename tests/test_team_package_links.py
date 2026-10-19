"""Integration checks for package-file targets across all roster categories."""
from html.parser import HTMLParser
import unittest

from app import app


class PackageTargetParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.cards = {}
        self.targets = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'article' and 'data-member-card' in attrs:
            self.cards[attrs['id']] = attrs['data-member-name']
        if 'data-team-member-target' in attrs:
            self.targets.append(attrs['data-team-member-target'])


class TeamPackageLinksTest(unittest.TestCase):
    def test_every_extract_line_has_one_unique_card_target(self):
        with app.test_client() as client:
            response = client.get('/team')
        self.assertEqual(response.status_code, 200)
        page = response.get_data(as_text=True)
        parser = PackageTargetParser()
        parser.feed(page)
        self.assertEqual(len(parser.cards), 25)
        self.assertEqual(len(parser.targets), 25)
        self.assertEqual(set(parser.targets), set(parser.cards))
        self.assertEqual(parser.cards['team-card-3'], 'Chenfan Liao')
        self.assertEqual(parser.cards['team-card-21'], 'Jacky Man-leuk Yuen')
        self.assertEqual(parser.cards['team-card-25'], 'Min Zhang')
        self.assertIn('team-package-links.js', page)
        self.assertIn('team-package-links.css', page)


if __name__ == '__main__':
    unittest.main()
