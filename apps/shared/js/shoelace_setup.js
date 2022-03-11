// Common setup for Shoelace:
// - register the Lucide icon as the default in the icon registry.
// - add the dark theme if needed.

function getShoelaceThemeGraph() {
  let deps = [
    {
      name: "shoelace-dark-theme",
      kind: "sharedStyle",
      param: "shoelace/themes/dark.css",
    },
  ];

  return new ParallelGraphLoader(deps);
}

const graph = getShoelaceThemeGraph();

async function updateDocumentTheme(value) {
  let isDarkMode = value === "dark";
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
  let settings = await apiDaemon.getSettings();
  try {
    let result = await settings.get("ui.prefers.color-scheme");
    updateDocumentTheme(result.value);
  } catch (e) {}

  // Observe theme changes.
  settings.addObserver("ui.prefers.color-scheme", (setting) => {
    updateDocumentTheme(setting.value);
  });
}

initShoelace();
