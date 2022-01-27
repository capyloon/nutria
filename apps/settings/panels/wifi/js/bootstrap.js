
document.addEventListener(
  "DOMContentLoaded",
  async () => {
    await depGraphLoaded;
    await getSharedDeps(["shared-fluent", "shared-icons"]);

    setupWifi();
  },
  { once: true }
);
