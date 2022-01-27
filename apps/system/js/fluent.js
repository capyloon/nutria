// Fluent registration for the system app.

// Register our source as chrome to not be dependent on the daemon.
L10nRegistry.getInstance().registerSources([
  new L10nFileSource(
    "system-app",
    "app",
    ["en-US"],
    "chrome://system/content/locales/{locale}/"
  ),
]);
