const kDeps = [
  {
    name: "settings",
    kind: "virtual",
    deps: ["shoelace-input", 
           "shoelace-menu", 
           "shoelace-menu-item", 
           "shoelace-menu-label",
           "shoelace-divider",
           "shoelace-spinner",
           "shoelace-switch",
           "shoelace-light-theme"],
  },
  {
    name: "shoelace-light-theme",
    kind: "sharedStyle",
    param: "shoelace/themes/light.css",
  },
  {
    name: "shoelace-dark-theme",
    kind: "sharedStyle",
    param: "shoelace/themes/dark.css",
  },
];
