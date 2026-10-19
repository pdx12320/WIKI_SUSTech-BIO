(() => {
  const page = document.querySelector('.content-page:has([data-content-source="docs/team/design-communication.md"])');
  if (!page) return;

  const labels = new Map([
    ['#our-design-principles', {title: 'Make It Clear', topic: 'Design principles'}],
    ['#building-an-identity', {title: 'Make It Ours', topic: 'Visual identity'}],
    ['#design-in-action', {title: 'Make It Tangible', topic: 'Design in use'}],
    ['#science-meets-people', {title: 'Make It Matter', topic: 'Media & outreach'}],
  ]);

  page.querySelectorAll('[data-content-directory]').forEach(directory => {
    const label = document.createElement('span');
    label.className = 'content-directory__label';
    label.textContent = 'On this page';
    label.setAttribute('aria-hidden', 'true');
    directory.prepend(label);

    directory.querySelectorAll('[data-content-major]').forEach(link => {
      const chapter = labels.get(link.hash);
      if (!chapter) return;
      const fullLabel = link.textContent.trim();
      const text = document.createElement('span');
      text.className = 'design-directory__chapter';
      const title = document.createElement('span');
      title.className = 'design-directory__title';
      title.textContent = chapter.title;
      const topic = document.createElement('span');
      topic.className = 'design-directory__topic';
      topic.textContent = chapter.topic;
      text.append(title, topic);
      link.replaceChildren(text);
      link.setAttribute('data-content-custom-label', '');
      link.setAttribute('aria-label', `${chapter.title}, ${chapter.topic}: ${fullLabel}`);
      link.title = fullLabel;
    });
  });
})();
