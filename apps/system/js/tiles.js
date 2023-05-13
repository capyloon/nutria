// Do a full installation of a tile:
// - PWA install.
// - Fetching of all the tile resources.

// Returns true if the tile is available, false otherwise.
async function registerTile(manifestUrl) {
  let service = await window.apiDaemon.getAppsManager();
  let app;
  try {
    // Check if the app is installed. getApp() expects the cached url, so instead
    // we need to get all apps and check their update url...
    let apps = await service.getAll();
    app = apps.find((app) => {
      return app.updateUrl == manifestUrl;
    });
  } catch (e) {}
  if (!app) {
    let appObject = await service.installPwa(manifestUrl);
    console.log(`Tile registered: ${JSON.stringify(appObject)}`);

    // Fetch all the resources linked in the tile manifest.
    let response = await fetch(manifestUrl);
    let manifest = await response.json();
    let tileResources = manifest.tile?.resources;
    console.log(`Will fetch tile resources: ${tileResources}`);
    let fetches = [];
    tileResources.forEach((resource) => {
      fetches.push(fetch(new URL(resource, manifestUrl)));
    });
    console.log(`Tile resources fetched`);
    let results = await Promise.allSettled(fetches);
    // Check if all the tile resources were fetched successfully.
    let success = true;
    results.forEach((result) => {
      if (result.status === "rejected") {
        success = false;
      }
    });
    return success;
  } else {
    console.log(`The tile at ${manifestUrl} is already registered`);
    return true;
  }
}
