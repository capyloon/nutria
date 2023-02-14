const kDeps = [
  {
    name: "setup",
    kind: "virtual",
    deps: ["content manager", "activity manager"],
  },
  {
    name: "intro",
    kind: "virtual",
    deps: [
      "shoelace-button",
      "shoelace-icon",
      "shoelace-light-theme",
      "shoelace-setup",
    ],
  },
  {
    name: "qr dialog",
    kind: "virtual",
    deps: ["shoelace-dialog", "shoelace-qr-code", "shoelace-progress-bar"],
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
    deps: ["shoelace-input", "shoelace-switch", "add-module"],
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
  {
    name: "activity manager",
    kind: "sharedModule",
    param: ["js/activity_manager.js", ["ActivityManager"]],
  },
  { name: "dummy", kind: "virtual", deps: ["shoelace-drawer"] },
];
