// Preserve accessibility links saved before the Engagement reorganisation.
(() => {
  const paths = {
    '1-anjia-guardian-a-home-safety-mini-app-designed-for-older-adults': 'human-practices#2-5-anjia-guardian-a-home-safety-mini-app-designed-for-older-adults',
    '2-biology-models-to-explore-by-touch-the-brain-and-the-cell': 'education#2-6-biology-models-to-explore-by-touch-the-brain-and-the-cell',
    'hp-figure-23': 'education#hp-figure-23',
    'hp-figure-24': 'education#hp-figure-24',
    'hp-figure-25': 'education#hp-figure-25'
  };
  function resolve() {
    let key;
    try { key = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    if (paths[key]) location.replace(new URL(paths[key], location.href));
  }
  resolve();
  addEventListener('hashchange', resolve);
})();
