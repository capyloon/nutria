const kDeps = [
  {
    name: "intro",
    kind: "virtual",
    deps: [
      "content manager",
      "shoelace-button",
      "shoelace-icon",
      "shoelace-dialog",
      "shoelace-qr-code",
      "shoelace-progress-bar",
      "shoelace-light-theme",
      "shoelace-setup",
      "contact info",
    ],
  },
  {
    name: "contact info",
    kind: "module",
    param: ["./components/contact_info.js", ["ContactInfo"]],
    deps: ["lit element", "shoelace-avatar", "shoelace-icon-button"],
  },
  {
    name: "add-panel",
    kind: "virtual",
    deps: ["shoelace-input", "add-module"],
  },
  { name: "add-module", kind: "module", param: "js/add_panel.js" },
  {
    name: "content manager",
    kind: "sharedWindowModule",
    param: ["js/content_manager.js", "contentManager", "ContentManager"],
    deps: ["shared-api-daemon"],
  },
  {
    name: "lit element",
    kind: "sharedModule",
    param: ["components/lit.js", ["LitElement", "html", "css"]],
  },
  { name: "dummy", kind: "virtual", deps: ["shoelace-drawer"] },
];
