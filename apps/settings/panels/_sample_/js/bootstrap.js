
document.addEventListener(
  "DOMContentLoaded",
  async () => {
    await depGraphLoaded;
    await getSharedDeps(["shared-fluent", "shared-icons"]);

    // Run code that depends on localization and icons being ready.
  },
  { once: true }
);
