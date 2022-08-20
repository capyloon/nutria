// Common setup for Shoelace:
// - register the Lucide icon as the default in the icon registry.
// - add the dark theme if needed.

const graph = new ParallelGraphLoader([
  {
    name: "shoelace-dark-theme",
    kind: "sharedStyle",
    param: "shoelace/themes/dark.css",
  },
]);

async function updateDocumentTheme(isDarkMode) {
  if (isDarkMode) {
    await graph.waitForDeps("shoelace-dark-theme");
    document.documentElement.classList.add("sl-theme-dark");
  } else {
    document.documentElement.classList.remove("sl-theme-dark");
  }
}

async function initShoelace() {
  const { registerIconLibrary } = await import(
    `http://shared.localhost:${config.port}/shoelace/utilities/icon-library.js`
  );

  // Use the Lucide icons as the default ones to be consistent.
  registerIconLibrary("default", {
    resolver: (name) =>
      `http://shared.localhost:${config.port}/lucide/icons/${name}.svg`,
  });

  // Set initial theme.
  const matchDarkTheme = window.matchMedia("(prefers-color-scheme: dark)");
  updateDocumentTheme(matchDarkTheme.matches);

  // Observe theme changes.
  matchDarkTheme.addEventListener("change", () => {
    updateDocumentTheme(matchDarkTheme.matches);
  });
}

initShoelace();
