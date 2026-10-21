"""Current workbook editions remain readable at each account's point of use."""
from html.parser import HTMLParser
from unittest import TestCase
from unittest.mock import patch

from app import app


class WorkbookMarkup(HTMLParser):
    def __init__(self):
        super().__init__()
        self.groups = 0
        self.open_readers = 0
        self.pdfs = []
        self.editable = []

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if 'data-workbook-readers' in attrs:
            self.groups += 1
        if tag == 'details' and attrs.get('class') == 'contribution-pdf' and 'open' in attrs:
            self.open_readers += 1
        if tag == 'a' and attrs.get('data-pdf-title', '').startswith('Healthy Living Workbook — '):
            self.pdfs.append(attrs['href'])
        if tag == 'a' and '/education/workbook-current-' in attrs.get('href', '') and attrs['href'].endswith('.docx'):
            self.editable.append(attrs['href'])


class WorkbookReadersTest(TestCase):
    def test_three_current_editions_are_open_at_each_account(self):
        client = app.test_client()
        for mode in ('local', 'igem'):
            for mount in ('', '/sustech'):
                for route in ('/human-practices', '/inclusivity', '/contribution'):
                    with self.subTest(mode=mode, mount=mount, route=route), patch.dict(app.config, WIKI_ASSET_MODE=mode):
                        response = client.get(route, environ_overrides={'SCRIPT_NAME': mount})
                        self.assertEqual(response.status_code, 200)
                        parsed = WorkbookMarkup()
                        parsed.feed(response.text)
                        self.assertEqual(parsed.groups, 1)
                        self.assertEqual(parsed.open_readers, 3)
                        self.assertEqual(len(set(parsed.pdfs)), 3)
                        self.assertEqual(len(set(parsed.editable)), 3)
                        self.assertIn('human-practices/workbook-readers.mjs', response.text)
                        for edition in ('student-zh', 'student-en', 'teacher-zh'):
                            self.assertTrue(any(f'workbook-current-{edition}-compact.pdf' in url for url in parsed.pdfs))
                            self.assertTrue(any(f'workbook-current-{edition}.docx' in url for url in parsed.editable))

    def test_current_local_downloads_have_the_expected_file_types(self):
        client = app.test_client()
        with patch.dict(app.config, WIKI_ASSET_MODE='local'):
            for edition in ('student-zh', 'student-en', 'teacher-zh'):
                for suffix, magic in (('-compact.pdf', b'%PDF-'), ('.docx', b'PK')):
                    url = f'/assets/human-practices/education/workbook-current-{edition}{suffix}'
                    with self.subTest(url=url), client.get(url) as response:
                        self.assertEqual(response.status_code, 200)
                        self.assertTrue(response.data.startswith(magic))

    def test_workbook_account_does_not_send_readers_to_the_resource_table(self):
        with app.test_client().get('/inclusivity') as response:
            self.assertNotIn('href="#workbook-resources"', response.text)
        with app.test_client().get('/contribution') as response:
            self.assertLess(response.text.index('id="workbook-editions"'), response.text.index('id="carry-the-work-forward"'))
            for anchor in ('education-workbook-chinese', 'education-workbook-english', 'education-workbook-teacher-chinese'):
                self.assertEqual(response.text.count(f'id="{anchor}"'), 1)
