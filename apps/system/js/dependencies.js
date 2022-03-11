const kDeps = [
  {
    name: "phase1",
    kind: "virtual",
    deps: [
      "actions dispatcher",
      "haptic feedback",
      "input method",
      "notifications",
      "watch homescreen",
      "audio volume indicator comp",
      "api daemon core",
      "shoelace-light-theme",
      "shoelace-alert",
      "shoelace-setup",
    ],
  },
  {
    name: "actions dispatcher",
    kind: "windowModule",
    param: [
      "./js/actions_dispatcher.js",
      "actionsDispatcher",
      "ActionsDispatcher",
    ],
  },
  {
    name: "watch homescreen",
    kind: "custom",
    custom: "watchHomescreen",
    deps: ["actions dispatcher"],
  },
  {
    name: "haptic feedback",
    kind: "windowModule",
    param: ["./js/haptic_feedback.js", "hapticFeedback", "HapticFeedback"],
  },
  {
    name: "input method",
    kind: "windowModule",
    param: ["./js/input_method.js", "inputMethod", "InputMethod"],
    deps: ["actions dispatcher"],
  },
  {
    name: "lockscreen comp",
    kind: "module",
    param: ["./components/lock_screen.js"],
    deps: ["api daemon core", "battery helper", "actions dispatcher"],
  },
  {
    name: "notifications",
    kind: "script",
    param: ["./js/notifications.js"],
  },
  {
    name: "launch",
    kind: "virtual",
    deps: ["hide logo", "various modules", "swproxy", "activity handler"],
  },
  {
    name: "swproxy",
    kind: "script",
    param: ["./swproxy/helper.js"],
  },
  {
    name: "activity handler",
    kind: "script",
    param: ["./js/activity_handler.js"],
  },
  {
    name: "hide logo",
    kind: "virtual",
    deps: ["homescreen ready", "status bar", "wallpaper ready"],
  },
  {
    name: "wallpaper ready",
    kind: "custom",
    custom: "wallpaperReady",
    deps: ["wallpaper"],
  },
  {
    name: "homescreen ready",
    kind: "custom",
    custom: "homescreenLauncher",
    deps: ["window manager"],
  },
  {
    name: "window manager",
    kind: "module",
    param: "./components/window_manager.js",
    deps: ["content window"],
  },
  {
    name: "content window",
    kind: "module",
    param: "./components/content_window.js",
    deps: ["api daemon core", "content manager"],
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
  {
    name: "battery helper",
    kind: "windowModule",
    param: ["js/battery.js", "batteryHelper", "BatteryHelper"],
  },
  {
    name: "status bar",
    kind: "module",
    param: "./components/status_bar.js",
    deps: ["lucide icons", "battery helper"],
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
    name: "wallpaper",
    kind: "module",
    param: "./js/wallpaper_manager.js",
    deps: ["content manager"],
  },
  {
    name: "various modules",
    kind: "virtual",
    deps: [
      "backdrop",
      "flashlight",
      "keys",
      "power manager",
      "context menu comp",
      "input method comp",
      "quick settings comp",
      "browser actions popup comp",
      "reboot menu comp",
      "site info comp",
      "url edit comp",
      "select ui comp",
      "downloads",
    ],
  },
  {
    name: "lit element",
    kind: "sharedModule",
    param: ["components/lit.js", ["LitElement", "html", "css"]],
  },
  { name: "backdrop", kind: "module", param: ["./js/backdrop.js"] },
  { name: "flashlight", kind: "module", param: ["./js/flashlight.js"] },
  { name: "keys", kind: "module", param: ["./js/keys.js"] },
  { name: "downloads", kind: "module", param: ["./js/downloads.js"], deps: ["content manager"] },
  {
    name: "audio volume",
    kind: "module",
    param: ["./js/audio_volume/__PLATFORM__.js"],
  },
  {
    name: "power manager",
    kind: "module",
    param: ["./js/power_manager.js"],
    deps: ["api daemon core"],
  },
  {
    name: "context menu comp",
    kind: "module",
    param: ["./components/context_menu.js"],
  },
  {
    name: "select ui comp",
    kind: "module",
    param: ["./components/select_ui.js"],
  },
  {
    name: "input method comp",
    kind: "module",
    param: ["./components/input_method.js"],
  },
  {
    name: "quick settings comp",
    kind: "module",
    param: ["./components/quick_settings.js"],
    deps: ["notification comp", "webext comp", "api daemon core"],
  },
  {
    name: "browser actions popup comp",
    kind: "module",
    param: ["./components/browser_action_popup.js"],
    deps: ["lucide icons"],
  },
  {
    name: "notification comp",
    kind: "script",
    param: ["./components/notification.js"],
  },
  {
    name: "webext comp",
    kind: "module",
    param: ["./components/web_extensions.js", ["BrowserAction"]],
    deps: ["lit element"],
  },
  {
    name: "reboot menu comp",
    kind: "module",
    param: ["./components/reboot_menu.js"],
    deps: ["content manager"],
  },
  {
    name: "audio volume indicator comp",
    kind: "module",
    param: ["./components/audio_volume_indicator.js"],
    deps: ["lit element"],
  },
  {
    name: "site info comp",
    kind: "module",
    param: ["./components/site_info.js"],
    deps: ["api daemon core"],
  },
  {
    name: "url edit comp",
    kind: "module",
    param: ["./components/url_edit.js"],
    deps: ["content manager"],
  },
];
