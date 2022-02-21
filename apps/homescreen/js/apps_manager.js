// Helper class to manage data related to the apps api.

export class AppsManager extends EventTarget {
  constructor() {
    super();

    this.readyPromise = new Promise((resolve) => {
      this.resolveReady = resolve;
    });
    this.apps = [];
    this.appsManager = window.apiDaemon.getAppsManager();
    this.init();
  }

  async addApp(app) {
    try {
      let response = await fetch(app.manifestUrl);
      app.manifest = await response.json();
      this.apps.push(app);
    } catch (e) {
      console.log(`Failed to add app ${JSON.stringify(app)} : ${e}`);
    }
  }

  removeApp(manifestUrl) {
    let index = this.apps.findIndex((app) => {
      return app.manifestUrl == manifestUrl;
    });
    if (index != -1) {
      this.apps.splice(index, 1);
    }
  }

  async getAll() {
    await this.readyPromise;
    return this.apps;
  }

  async uninstall(manifestUrl) {
    let service = await this.appsManager;

    try {
      service.uninstall(manifestUrl);
      console.log(`App ${manifestUrl} successfully uninstalled.`);
    } catch (e) {
      console.error(
        `App ${manifestUrl} failed to uninstall: ${JSON.stringify(e)}.`
      );
    }
  }

  // Returns { app, title, url, icon, role }
  async getSummary(app) {
    let summary = {};
    try {
      let response = await fetch(app.manifestUrl);
      let manifest = await response.json();

      // Resolve relative urls based on the original manifest url for PWAs
      let manifestUrl = app.manifestUrl.href.startsWith(
        "http://cached.localhost"
      )
        ? app.updateUrl
        : app.manifestUrl;
      let url = new URL(manifest.start_url || "/", manifestUrl);
      url = url.href;
      let icon = `http://branding.localhost:${location.port}/resources/logo.webp`;
      if (manifest.icons && manifest.icons[0]) {
        let iconUrl = new URL(manifest.icons[0].src, manifestUrl);
        icon = iconUrl.href;
      }

      summary = {
        app: app.manifestUrl,
        title: manifest.name,
        url,
        icon,
        role: manifest?.b2g_features?.role,
      };

      if (manifest.background_color) {
        summary.backgroundColor = manifest.background_color;
      } else if (manifest.theme_color) {
        summary.backgroundColor = manifest.theme_color;
      }
    } catch (e) {
      console.error(`AppsList: oops ${e}`);
    }
    return summary;
  }

  async init() {
    try {
      let service = await this.appsManager;

      service.addEventListener(service.APP_INSTALLED_EVENT, async (app) => {
        console.log(
          `AppsManager::AppInstalled ${JSON.stringify(app)} installed`
        );
        await this.addApp(app);
        this.dispatchEvent(new CustomEvent("app-installed"));
      });
      service.addEventListener(service.APP_UNINSTALLED_EVENT, (manifestUrl) => {
        console.log(
          `AppsManager::AppUninstalled ${JSON.stringify(
            manifestUrl
          )} uninstalled`
        );
        this.removeApp(manifestUrl);
        this.dispatchEvent(new CustomEvent("app-uninstalled"));
      });

      let apps = await service.getAll();
      console.log(`AppsManager got ${apps.length} apps`);

      // For each app get the manifest.
      // TODO: listen to install / uninstall events to update the list.
      for (let i = 0; i < apps.length; i++) {
        await this.addApp(apps[i]);
      }
    } catch (e) {
      console.error(`AppsManager::loadApps error: ${e}`);
    }
    this.resolveReady();
  }
}
