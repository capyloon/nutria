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

  log(msg) {
    console.log(`AppsManager: ${msg}`);
  }

  error(msg) {
    console.error(`AppsManager: ${msg}`);
  }

  async addApp(app) {
    let manifestUrl = app.manifestUrl;
    let index = this.apps.findIndex((item) => {
      return item.manifestUrl == manifestUrl;
    });
    if (index != -1) {
      // Duplicate app, ignore.
      return false;
    }

    try {
      let response = await fetch(manifestUrl);
      app.manifest = await response.json();
      this.apps.push(app);
      return true;
    } catch (e) {
      this.log(`Failed to add app ${JSON.stringify(app)} : ${e}`);
    }
    return false;
  }

  removeApp(manifestUrl) {
    if (manifestUrl.href) {
      manifestUrl = manifestUrl.href;
    }
    let index = this.apps.findIndex((app) => {
      return app.manifestUrl == manifestUrl;
    });
    if (index != -1) {
      this.apps.splice(index, 1);
    } else {
      this.error(`Failed to remove app ${manifestUrl}`);
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
      this.log(`App ${manifestUrl} successfully uninstalled.`);
    } catch (e) {
      this.error(
        `App ${manifestUrl} failed to uninstall: ${JSON.stringify(e)}.`
      );
    }
  }

  // Returns { app, updateUrl, title, description, url, icon, role, removable }
  async getSummary(app) {
    let summary = {};
    try {
      if (!app.manifestUrl.href) {
        app.manifestUrl = new URL(app.manifestUrl);
      }

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
      let port = location.port || window.config.port;
      let icon = `http://branding.localhost:${port}/resources/logo.webp`;
      if (manifest?.icons && manifest?.icons[0]) {
        let iconUrl = new URL(manifest.icons[0].src, manifestUrl);
        icon = iconUrl.href;
      }

      summary = {
        app: app.manifestUrl,
        updateUrl: app.updateUrl || app.manifestUrl,
        title: manifest?.name,
        description: manifest?.description,
        url,
        icon,
        role: manifest?.b2g_features?.role,
        removable: app.removable,
      };

      if (manifest?.background_color) {
        summary.backgroundColor = manifest.background_color;
      } else if (manifest?.theme_color) {
        summary.backgroundColor = manifest.theme_color;
      }
    } catch (e) {
      this.error(`getSummary failed for ${app.manifestUrl} : ${e}`);
    }
    return summary;
  }

  async init() {
    try {
      let service = await this.appsManager;

      service.addEventListener(service.APP_INSTALLED_EVENT, async (app) => {
        this.log(`AppInstalled ${JSON.stringify(app)} installed`);
        if (await this.addApp(app)) {
          this.dispatchEvent(new CustomEvent("app-installed"));
        }
      });
      service.addEventListener(service.APP_UNINSTALLED_EVENT, (manifestUrl) => {
        this.log(`AppUninstalled ${manifestUrl} uninstalled`);
        this.removeApp(manifestUrl);
        this.dispatchEvent(new CustomEvent("app-uninstalled"));
      });

      let apps = await service.getAll();
      this.log(`AppsManager got ${apps.length} apps`);

      // For each app get the manifest.
      for (let i = 0; i < apps.length; i++) {
        await this.addApp(apps[i]);
      }
    } catch (e) {
      this.error(`loadApps error: ${e}`);
    }
    this.resolveReady();
  }
}
