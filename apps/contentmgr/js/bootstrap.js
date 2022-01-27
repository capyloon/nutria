const kDeps = [
  {
    name: "main",
    kind: "virtual",
    deps: ["main screen"],
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
    deps: ["lit element", "content manager"],
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
  console.log(`ContentMgr: ${msg}`);
}

document.addEventListener(
  "DOMContentLoaded",
  async () => {
    log(`DOMContentLoaded`);
    await depGraphLoaded;

    let graph = new ParallelGraphLoader(kDeps);
    await Promise.all([getSharedDeps("shared-all"), graph.waitForDeps("main")]);

    log(`Starting at ${document.location}`);

    if (document.location.hash == "#root") {
      document.querySelector("main-screen").openRoot();
    }

    // Listen to messages from the service worker.
    navigator.serviceWorker.onmessage = async (event) => {
      let activity = event.data;
      log(`Activity: ${activity.name}`);
      for (let prop in activity.data) {
        log(`   ${prop}: ${activity.data[prop]}`);
      }

      if (activity.name === "view-resource") {
        document.querySelector("main-screen").switchTo(activity.data);
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
  },
  { once: true }
);
