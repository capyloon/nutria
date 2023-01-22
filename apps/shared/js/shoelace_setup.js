// Common setup for Shoelace:
// - register the Lucide icon as the default in the icon registry.
// - add the dark theme if needed.

const graph = new ParallelGraphLoader(
  addSharedDeps([
    {
      name: "shoelace-dark-theme",
      kind: "sharedStyle",
      param: "shoelace/themes/dark.css",
    },
    {
      name: "Readex Pro Font",
      kind: "sharedStyle",
      param: "style/fonts.css",
    },
  ])
);

function addTheme() {
  let link = document.createElement("link");
  link.setAttribute("id", "nutria-theme");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("href", `http://theme.localhost:${config.port}/style.css`);
  document.head.appendChild(link);
}

async function updateDocumentTheme(isDarkMode) {
  if (isDarkMode) {
    await graph.waitForDeps("shoelace-dark-theme");
    document.documentElement.classList.add("sl-theme-dark");
  } else {
    document.documentElement.classList.remove("sl-theme-dark");
  }
}

async function initShoelace() {
  await graph.waitForDeps("Readex Pro Font");

  // Load the Nutria theme.
  addTheme();

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

  // Observe Nutria theme changes.
  // TODO: This requires at least read-only access to the settings api.
  //       Consider switching to a specific permissionless of to a permissionless api.
  await graph.waitForDeps("shared-api-daemon");
  try {
    let settings = await apiDaemon.getSettings();
    settings.addObserver("nutria.theme", async (setting) => {
      // Replace the theme link with a randomized url to not get a stalled cached version.
      let link = document.getElementById("nutria-theme");
      // link.removeAttribute("href");
      link.setAttribute(
        "href",
        `http://theme.localhost:${config.port}/style.css?${Math.random()}`
      );
    });
  } catch (e) {
    console.log(
      `Failed to observe nutria.theme setting in '${location.host}' : ${e}`
    );
  }
}

initShoelace();
