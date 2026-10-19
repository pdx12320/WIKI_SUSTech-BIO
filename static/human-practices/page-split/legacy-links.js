// Resolve links saved before the HP/Education content split.
(() => {
  const script = document.currentScript;
  const table = new URL('moved-anchors.json', script.src);
  function resolve(routes) {
    const key = decodeURIComponent(location.hash.slice(1));
    if (routes[key]) location.replace(new URL(routes[key].replace(/^\//, ''), location.href));
  }
  fetch(table).then(response => response.json()).then(routes => {
    resolve(routes);
    addEventListener('hashchange', () => resolve(routes));
  }).catch(() => {});
})();
