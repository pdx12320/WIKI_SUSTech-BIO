(() => {
  const assets = document.querySelector('[data-engineering-cartoon-assets]')?.content;
  if (!assets) return;
  const records = [
    ['pod', 'pod', 'POD'], ['cetus', 'cetus', 'CETUS'],
    ['integrated-orca', 'integrated-orca', 'Integrated ORCA'],
    ['gfa', 'gfa', 'GFA'], ['mre', 'mre', 'MRE'], ['aso', 'aso', 'ASO'],
    ['cre-loxp', 'cre-loxp', 'Cre–loxP'], ['deliver', 'aav9', 'AAV9'],
    ['measure', 'sonar', 'SONAR'], ['dry-dbtl', 'puffer', 'PUFFER'],
    ['model-rna-seq', 'puffer', 'PUFFER'], ['model-puf', 'puffer', 'PUFFER'],
    ['model-apobec', 'puffer', 'PUFFER'], ['model-lamar', 'puffer', 'PUFFER'],
    ['model-whole-body', 'puffer', 'PUFFER'],
  ];
  const modelIllustration = document.querySelector('#dry-dbtl-overview')
    ?.closest('.engineering-overview-card')?.querySelector('.engineering-overview-illustration');
  const icon = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20 8a8 8 0 0 0-13-3L4 8m0-5v5h5M4 16a8 8 0 0 0 13 3l3-3m0 5v-5h-5"/><path d="M9 9h6v6H9z" stroke-width="1.3"/></svg>';

  for (const [id, asset, name] of records) {
    const heading = document.getElementById(`${id}-overview`);
    const overview = heading?.closest('.engineering-overview-card');
    if (!overview || overview.querySelector('.mascot-flip')) continue;
    const characterSource = assets.querySelector(`[data-engineering-cartoon="${asset}"]`);
    if (!characterSource) continue;
    let image = overview.querySelector('.engineering-overview-illustration');
    // Model subchapters share the existing, authored PUFFER workflow illustration.
    if (!image && id.startsWith('model-') && modelIllustration) {
      image = modelIllustration.cloneNode(true);
      heading.after(image);
    }
    if (!image) continue;

    const card = document.createElement('div');
    card.className = 'mascot-flip';
    card.dataset.mascotChapter = id;
    card.setAttribute('role', 'group');
    card.setAttribute('aria-label', `${name} overview illustration`);
    image.before(card);
    const stage = document.createElement('div');
    stage.className = 'mascot-flip-stage';
    stage.id = `mascot-flip-${id}-sides`;
    const front = document.createElement('div');
    front.className = 'mascot-flip-face mascot-flip-front';
    front.append(image);
    const back = document.createElement('div');
    back.className = 'mascot-flip-face mascot-flip-back';
    back.setAttribute('aria-hidden', 'true');
    const character = characterSource.cloneNode(true);
    character.removeAttribute('data-engineering-cartoon');
    back.append(character);
    stage.append(front, back);
    const button = document.createElement('button');
    button.className = 'mascot-flip-toggle';
    button.type = 'button';
    button.setAttribute('aria-controls', stage.id);
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-label', `Show ${name} cartoon`);
    button.title = 'Flip to cartoon';
    button.innerHTML = icon;
    button.addEventListener('click', () => {
      const flipped = card.dataset.flipped !== 'true';
      card.dataset.flipped = String(flipped);
      button.setAttribute('aria-pressed', String(flipped));
      button.title = flipped ? 'Flip to mechanism diagram' : 'Flip to cartoon';
      front.setAttribute('aria-hidden', String(flipped));
      back.setAttribute('aria-hidden', String(!flipped));
    });
    card.append(stage, button);
  }
})();
