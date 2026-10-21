// RAF callbacks run after boot's promise resolves, so boot.catch cannot catch them.
export function guardSceneFrame(render, stopped, fallback) {
  let failed = false;
  return (...args) => {
    if (failed || stopped()) return;
    try { render(...args); }
    catch (error) { failed = true; fallback(error); }
  };
}
