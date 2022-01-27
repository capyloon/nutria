const kDeps = [
  { name: "main", kind: "virtual", deps: ["action wall"] },
  {
    name: "action wall",
    kind: "script",
    param: "components/actions_wall.js",
    deps: [
      "action store",
      "action wall css",
      "action box",
      "action bookmark",
      "action activity",
      "action widget",
      "api daemon core",
      "apps manager",
    ],
  },
  {
    name: "action store",
    kind: "script",
    param: "js/actions_store.js",
    deps: ["content manager"],
  },
  {
    name: "action wall css",
    kind: "link",
    param: ["/components/actions_wall.css", "text/css", "style"],
  },
  {
    name: "action box",
    kind: "script",
    param: "components/action_box.js",
    deps: ["action box css", "lucide icons"],
  },
  {
    name: "action box css",
    kind: "link",
    param: ["/components/action_box.css", "text/css", "style"],
  },
  {
    name: "lucide icons",
    kind: "sharedModule",
    param: "components/lucide_icon.js",
    deps: ["lucide"],
  },
  {
    name: "lucide",
    kind: "sharedStyle",
    param: "lucide/Lucide.css",
  },
  {
    name: "action bookmark",
    kind: "script",
    param: "components/action_bookmark.js",
    deps: ["action bookmark css"],
  },
  {
    name: "action bookmark css",
    kind: "link",
    param: ["/components/action_bookmark.css", "text/css", "style"],
  },
  {
    name: "action widget",
    kind: "script",
    param: "components/action_widget.js",
    deps: ["action widget css"],
  },
  {
    name: "action widget css",
    kind: "style",
    param: "/components/action_widget.css",
  },
  {
    name: "action activity",
    kind: "script",
    param: "components/action_activity.js",
    deps: ["action activity css"],
  },
  {
    name: "action activity css",
    kind: "link",
    param: ["/components/action_activity.css", "text/css", "style"],
  },
  {
    name: "search",
    kind: "virtual",
    deps: ["search panel"],
  },
  {
    name: "search panel",
    kind: "module",
    param: "/js/search_panel.js",
    deps: [
      "search source",
      "opensearch engine",
      "top sites engine",
      "apps engine",
      "skills engine",
      "contacts engine",
      "fend engine",
      "places engine",
      "media engine",
      "default results comp",
    ],
  },
  {
    name: "opensearch engine",
    kind: "script",
    param: "js/search/opensearch.js",
    deps: ["search source"],
  },
  {
    name: "places engine",
    kind: "script",
    param: "js/search/places.js",
    deps: ["search source", "content manager"],
  },
  {
    name: "media engine",
    kind: "script",
    param: "js/search/media.js",
    deps: ["search source", "content manager"],
  },
  {
    name: "fend engine",
    kind: "script",
    param: "js/search/fend.js",
    deps: ["search source", "fend wasm"],
  },
  {
    name: "fend wasm",
    kind: "script",
    param: "js/search/fend_wasm.js",
  },
  {
    name: "top sites engine",
    kind: "script",
    param: "js/search/top_sites.js",
    deps: ["search source", "top sites data"],
  },
  {
    name: "top sites data",
    kind: "script",
    param: "resources/top_10k_sites.js",
  },
  {
    name: "search source",
    kind: "script",
    param: "js/search/search_source.js",
  },
  {
    name: "apps engine",
    kind: "script",
    param: "js/search/apps.js",
    deps: ["search source", "apps manager"],
  },
  {
    name: "contacts engine",
    kind: "script",
    param: "js/search/contacts.js",
    deps: ["search source", "contacts api"],
  },
  {
    name: "skills engine",
    kind: "script",
    param: "js/search/skills.js",
    deps: ["search source", "apps manager", "contacts api"],
  },
  {
    name: "apps manager",
    kind: "windowModule",
    param: ["/js/apps_manager.js", "appsManager", "AppsManager"],
    deps: ["api daemon core"],
  },
  {
    name: "content manager",
    kind: "sharedWindowModule",
    param: ["js/content_manager.js", "contentManager", "ContentManager"],
    deps: ["api daemon core"],
  },
  {
    name: "contacts api",
    kind: "virtual",
    deps: ["api daemon core"],
  },
  {
    name: "api daemon core",
    kind: "sharedWindowModule",
    param: ["js/api_daemon.js", "apiDaemon", "ApiDaemon"],
  },
  {
    name: "lit element",
    kind: "sharedModule",
    param: ["components/lit.js", ["LitElement", "html", "css"]],
  },
  {
    name: "default results comp",
    kind: "module",
    param: ["./components/default_results.js"],
    deps: ["lit element", "content manager", "media engine", "places engine"],
  },
  {
    name: "apps list comp",
    kind: "module",
    param: ["./components/apps_list.js"],
    deps: ["lit element", "action bookmark", "apps manager"],
  },
];
