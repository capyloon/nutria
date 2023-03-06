const kDeps = [
  {
    name: "main",
    kind: "virtual",
    deps: [
      "shared-fluent",
      "shoelace-light-theme",
      "shoelace-setup",
      "shoelace-tree",
      "shoelace-tree-item",
      "shoelace-textarea",
      "shoelace-button",
      "shoelace-tab",
      "shoelace-tab-group",
      "shoelace-tab-panel",
    ],
  },
  {
    name: "content manager",
    kind: "sharedWindowModule",
    param: ["js/content_manager.js", "contentManager", "ContentManager"],
    deps: ["shared-api-daemon"],
  },
];

function log(msg) {
  console.log(`Tiles: ${msg}`);
}

var graph;

document.addEventListener("DOMContentLoaded", async () => {
  console.log(`DOMContentLoaded`);
  await depGraphLoaded;
  graph = new ParallelGraphLoader(addSharedDeps(addShoelaceDeps(kDeps)));

  await graph.waitForDeps("main");

  document.getElementById("tabs").show("file-1");

  ace.config.set("useStrictCSP", true);
  const editor = ace.edit("editor");
  // editor.setTheme("ace/theme/twilight");
});
