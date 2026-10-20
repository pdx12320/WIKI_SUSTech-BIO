"""Reject frozen Wiki links that escape the team path or target missing files."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit
import sys


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.base = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'base':
            self.base = attrs.get('href')
        if tag in {'a', 'area'} and attrs.get('href'):
            self.links.append(attrs['href'])
        if attrs.get('data-reader-url'):
            self.links.append(attrs['data-reader-url'])


def inspect(root):
    files = {p.relative_to(root).as_posix() for p in root.rglob('*') if p.is_file()}
    issues, count = [], 0
    for name in sorted(files):
        if Path(name).suffix not in {'', '.html'}:
            continue
        try:
            document = (root / name).read_text()
        except UnicodeError:
            continue
        if '<html' not in document.lower():
            continue
        parser = Links()
        parser.feed(document)
        base = urljoin('https://2026.igem.wiki/sustech/' + name, parser.base or '')
        for href in parser.links:
            if href.startswith(('#', 'mailto:', 'tel:', 'javascript:', 'data:', 'blob:')):
                continue
            url = urlsplit(urljoin(base, href))
            if url.netloc != '2026.igem.wiki':
                continue
            count += 1
            if not url.path.startswith('/sustech/'):
                issues.append(f'{name}: link escapes team path: {href}')
                continue
            target = unquote(url.path[len('/sustech/'):])
            candidates = [target, target + '.html', target.rstrip('/') + '/index.html' if target else 'index.html']
            if not any(candidate in files for candidate in candidates):
                issues.append(f'{name}: missing destination: {href}')
    return count, issues


if __name__ == '__main__':
    root = Path(sys.argv[1] if len(sys.argv) > 1 else 'public')
    if not root.is_dir():
        raise SystemExit(f'Missing build directory: {root}')
    count, issues = inspect(root)
    if issues:
        raise SystemExit('\n'.join(issues))
    print(f'Passed {count} internal link and reader destinations.')
