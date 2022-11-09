const kDeps = [
  {
    name: "main",
    kind: "virtual",
    deps: ["main screen", "shoelace-light-theme", "shoelace-setup"],
  },
  {
    name: "lit element",
    kind: "sharedModule",
    param: ["components/lit.js", ["LitElement", "html", "css"]],
  },
  {
    name: "main screen",
    kind: "module",
    param: ["./components/main_screen.js"],
    deps: [
      "lit element",
      "content manager",
      "shoelace-icon",
      "shoelace-icon-button",
      "shoelace-button",
      "shoelace-breadcrumb",
      "shoelace-breadcrumb-item",
    ],
  },
  {
    name: "api daemon core",
    kind: "sharedWindowModule",
    param: ["js/api_daemon.js", "apiDaemon", "ApiDaemon"],
  },
  {
    name: "content manager",
    kind: "sharedWindowModule",
    param: ["js/content_manager.js", "contentManager", "ContentManager"],
    deps: ["api daemon core"],
  },
];

function log(msg) {
  console.log(`Files: ${msg}`);
}

let ready;
let _p = new Promise((resolve) => {
  ready = resolve;
});

document.addEventListener(
  "DOMContentLoaded",
  async () => {
    log(`DOMContentLoaded`);
    await depGraphLoaded;

    let graph = new ParallelGraphLoader(addSharedDeps(addShoelaceDeps(kDeps)));
    await Promise.all(
      ["shared-fluent", "shared-api-daemon", "main"].map((dep) =>
        graph.waitForDeps(dep)
      )
    );

    await contentManager.as_superuser();

    log(`Starting at ${document.location}`);

    if (document.location.hash == "#root") {
      document.querySelector("main-screen").openRoot();
    }

    ready();
  },
  { once: true }
);

// Listen to messages from the service worker.
// This needs to be setup before the DOMContentLoaded event handler returns.
navigator.serviceWorker.onmessage = async (event) => {
  await ready;

  let activity = event.data;
  log(`Activity: ${activity.name}`);
  for (let prop in activity.data) {
    log(`   ${prop}: ${activity.data[prop]}`);
  }

  await contentManager.as_superuser();

  if (activity.name === "view-resource") {
    history.replaceState(activity.data, "");
    document.querySelector("main-screen").switchTo(activity.data, true);
  } else if (activity.name === "install-wasm-plugin") {
    // TODO: run in the service worker instead.
    try {
      log(`Installing wasm plugin: ${JSON.stringify(activity.data)}`);
      let pluginsManager = contentManager.getPluginsManager();
      await pluginsManager.add(activity.data.json, activity.data.url);
    } catch (e) {
      console.error(`WASM plugin installation failed: ${e}`);
    }
    window.close();
  }
};
