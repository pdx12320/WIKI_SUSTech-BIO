"""Team opening animation integration checks."""
from pathlib import Path
import json
import re
import unittest

from app import app


ROOT = Path(app.root_path)


class TeamOpeningTest(unittest.TestCase):
    def test_team_route_includes_four_piece_progressive_opening(self):
        with app.test_client() as client:
            response = client.get("/team")
        self.assertEqual(response.status_code, 200)
        page = response.get_data(as_text=True)
        self.assertIn('data-team-opening', page)
        self.assertIn('team-opening.css', page)
        self.assertIn('team-opening.js', page)
        self.assertEqual(page.count('class="team-opening__piece '), 4)
        self.assertIn('id="main-content"', page)
        self.assertNotIn('Different minds.', page)
        self.assertIn('data-team-package', page)
        self.assertIn('data-team-package-frames', page)
        self.assertIn('data-team-compile', page)
        self.assertIn('_skill.md', page)
        frames = re.search(r'data-team-package-frames="([^"]+)"', page).group(1).split('|')
        self.assertEqual(frames, [f"https://static.igem.wiki/teams/6085/wiki/team/pkg{i}.avif" for i in range(1, 5)])
        self.assertIn(f'src="{frames[0]}"', page)
        self.assertIn(f'src="{frames[3]}"', page)
        self.assertIn('team-opening__blur', page)
        self.assertNotIn('Meet our team.', page)
        self.assertNotIn('team-category-nav', page)
        self.assertNotIn('Skip intro', page)
        self.assertNotIn('team-intro__people', page)
        self.assertNotIn('team-intro__manifest', page)

    def test_user_selected_photos_are_balanced_clipped_and_below_labels(self):
        excluded = {1, 4, 8, 9, 10, 11, 15, 23, 26, 32, 37, 38}
        expected = (set(range(1, 43)) - excluded) | set(range(43, 53))
        with app.test_client() as client:
            page = client.get('/team').get_data(as_text=True)
            actual = re.findall(r'data-team-puzzle-image="(\w+)" src="([^"]+)"', page)
            self.assertEqual([direction for direction, _ in actual], ['nw', 'ne', 'sw', 'se'])
            for direction, url in actual:
                self.assertEqual(url, 'https://static.igem.wiki/teams/6085/wiki/team/'
                                 f'puzzle-collages/team-puzzle-{direction}-collage.avif')
            self.assertNotIn('data-puzzle-photo=', page)
            self.assertNotIn('data-team-puzzle-layouts=', page)
            # Tabs reuse the neighbor's original canvas coordinates, not extra assets.
            fragments = re.findall(r'data-team-puzzle-fragment="(\w+)" style="--collage-column:(\d);--collage-row:(\d)"', page)
            self.assertCountEqual(fragments, [('ne', '1', '0'), ('sw', '0', '1')] * 2)
            image_urls = re.findall(r'src="(https://static.igem.wiki/teams/6085/wiki/team/puzzle-collages/[^"]+)"', page)
            self.assertEqual(len(set(image_urls)), 4)
            self.assertEqual(len(image_urls), len(actual) + len(fragments))
            self.assertIn('data-team-puzzle-ready="pending"', page)
            manifest = json.loads((ROOT / 'static/assets/team/puzzle-collage/manifest.json').read_text())
            self.assertEqual([group['count'] for group in manifest['groups']], [10, 10, 10, 10])
            self.assertEqual(set(sum((group['photos'] for group in manifest['groups']), [])), expected)
            self.assertLess(manifest['total_output_bytes'], 4_000_000)
            for photo in manifest['photos']:
                response = client.get('/static/assets/team/puzzle-collage/' + photo['asset'])
                self.assertEqual(response.status_code, 200, photo['asset'])
                response.close()
        for direction in ['nw', 'ne', 'sw', 'se']:
            self.assertIn(f'id="team-puzzle-photo-clip-{direction}"', page)
            self.assertIn(f'data-team-puzzle-group="{direction}"', page)
        self.assertLess(page.index('data-team-puzzle-collages'), page.index('data-team-puzzle-label="Wet Lab"'))
        self.assertIn('team-puzzle-collage.css', page)
        self.assertTrue(manifest['originals_untouched'])

    def test_collage_rectangles_preserve_aspects_and_cover_without_overlap(self):
        manifest = json.loads((ROOT / 'static/assets/team/puzzle-collage/manifest.json').read_text())
        variants = json.loads((ROOT / 'static/assets/team/puzzle-collage/layouts.json').read_text())
        photos = {photo['number']: photo for photo in manifest['photos']}
        for group in manifest['groups']:
            self.assertEqual(group['count'], 10)
            self.assertGreater(len(variants[group['piece']]), 50)
            for plan in variants[group['piece']]:
                self.assertEqual(len(plan['boxes']), 10)
                self.assertAlmostEqual(sum(w * h for x, y, w, h in plan['boxes']), 1, places=5)
                for number, (x, y, w, h) in zip(group['photos'], plan['boxes']):
                    self.assertGreaterEqual(x, 0)
                    self.assertGreaterEqual(y, 0)
                    self.assertLessEqual(x + w, 1.000001)
                    self.assertLessEqual(y + h, 1.000001)
                    self.assertGreater(w * h, .031)
                    aspect = photos[number]['width'] / photos[number]['height']
                    self.assertAlmostEqual(plan['ratio'] * w / h, aspect, places=4)
                for i, (x, y, w, h) in enumerate(plan['boxes']):
                    for bx, by, bw, bh in plan['boxes'][i+1:]:
                        overlap = max(0, min(x+w, bx+bw)-max(x, bx)) * max(0, min(y+h, by+bh)-max(y, by))
                        self.assertLess(overlap, .000001)
        css = (ROOT / 'static/team-puzzle-collage.css').read_text()
        self.assertIn('object-fit: contain', css)
        self.assertNotIn('object-fit: cover', css)
        square = photos[48]
        self.assertEqual(square['width'], square['height'])
        self.assertTrue(square['approved_source_crop'])

    def test_package_header_precedes_roster_with_filter_folders(self):
        with app.test_client() as client:
            page = client.get('/team').get_data(as_text=True)
        self.assertIn('team-package-header.css', page)
        self.assertLess(page.index('data-team-package-header'), page.index('id="team-deck"'))
        header = page.split('data-team-package-header', 1)[1].split('</header>', 1)[0]
        self.assertIn('data-team-package-mount', header)
        self.assertIn('ORCA_TEAM.pkg', header)
        folders = header.split('class="team-skill-folders"', 1)[1].split('</ul>', 1)[0]
        self.assertEqual(folders.count('<li '), 5)
        for name in ['Dry Lab', 'Wet Lab', 'Human Practices', 'Design', 'Wiki']:
            self.assertIn(f'<span>{name}</span>', folders)
        self.assertNotIn('<a ', folders)
        self.assertEqual(folders.count('data-team-filter='), 5)
        self.assertIn('team-filters.js', page)

    def test_compilation_includes_every_member_once_in_order(self):
        with app.test_client() as client:
            page = client.get('/team').get_data(as_text=True)
        orders = re.findall(r'data-team-compile-order="(\d+)"', page)
        self.assertEqual(sorted(map(int, orders)), list(range(33)))
        self.assertEqual(page.count('hidden>extract '), 25)
        self.assertIn('extract jacky_man-leuk_yuen_skill.md', page)
        self.assertIn('build complete · 25 skills ready', page)

    def test_opening_border_and_package_gate_are_preserved(self):
        css = (ROOT / "static/team-opening.css").read_text()
        js = (ROOT / "static/team-opening.js").read_text()
        self.assertIn('fill: none', css)
        self.assertIn('prefers-reduced-motion: reduce', css)
        self.assertNotIn('team-opening-exit', css)
        self.assertIn('filter: blur(13px)', css)
        self.assertIn('team-page--opening-blur', css)
        self.assertIn('pointer-events: none', css)
        self.assertIn('member-card.is-ready .member-card__turn', css)
        self.assertIn('team-opening__pkg-art', css)
        self.assertIn('border: 0', css)
        self.assertIn('team-opening__compile-code', css)
        self.assertIn('team-compile-line-in', css)
        self.assertIn('team-package-spinner', css)
        self.assertNotIn('data-team-opening-skip', js)
        self.assertNotIn("['Escape'", js)
        self.assertNotIn('setTimeout(finish, 10000)', js)
        self.assertNotIn("addEventListener('scroll'", js)
        self.assertIn("addEventListener('wheel'", js)
        self.assertIn('team-package-open', js)
        self.assertIn('window.scrollTo', js)
        self.assertIn('const sequence = [...frames, ...frames]', js)
        self.assertIn('classList.add(\'is-active\')', js)
        self.assertIn('data-team-compile-order', js)
        self.assertIn('panel.scrollTo', js)
        self.assertIn('createParticleBurst', js)
        self.assertIn('team-particle-field', css)
        self.assertIn('team-package-particle', css)


if __name__ == "__main__":
    unittest.main()
