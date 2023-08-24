// Search engine for apps installed locally.

class AppsSearch {
  constructor() {
    this.apps = [];
    window.appsManager.addEventListener("app-installed", this);
    window.appsManager.addEventListener("app-uninstalled", this);
    this.updateApps();
  }

  async handleEvent() {
    // The app list has changed, update it in full.
    // TODO: be smarter with add / remove.
    await this.updateApps();
  }

  async updateApps() {
    console.log(`AppsSearch::updateApps start`);
    try {
      let apps = await window.appsManager.getAll();
      this.apps = [];
      apps.forEach((app) => {
        let manifest = app.manifest;
        let name = manifest.name || app.name;
        let desc = name + " " + (manifest.description || "");
        desc = desc.trim().toLowerCase();
        // Resolve relative urls based on the original manifest url for PWAs
        let manifestUrl = app.manifestUrl.href.startsWith(
          "http://cached.localhost"
        )
          ? app.updateUrl
          : app.manifestUrl;
        let url = new URL(manifest.start_url || "/", manifestUrl);
        let icon = `http://branding.localhost:${location.port}/resources/logo.webp`;
        if (manifest.icons && manifest.icons[0]) {
          let iconUrl = new URL(manifest.icons[0].src, manifestUrl);
          icon = iconUrl.href;
        }
        let display = manifest.display || "browser";
        console.log(`AppsSearch::updateApps adding ${name} ${url}`);
        this.apps.push({ name, desc, url, icon, display });
      });
    } catch (e) {
      console.error(`AppsSearch::updateApps error: ${e}`);
    }
    console.log(`AppsSearch::updateApps end, ${this.apps.length} apps`);
  }

  // Returns a Promise that resolves to a result set.
  search(what, count) {
    console.log(`AppsSearch::search ${what} in ${this.apps.length} apps`);
    let res = [];
    for (let i = 0; i < this.apps.length && res.length <= count; i++) {
      // console.log(`app[${i}].desc is '${this.apps[i].desc}'`);
      if (this.apps[i].desc.includes(what)) {
        res.push(this.apps[i]);
      }
    }

    return Promise.resolve(res);
  }
}

class AppsSource extends SearchSource {
  constructor(sectionName) {
    super(sectionName, new AppsSearch());
  }

  domForResult(result) {
      let node = new ActionBookmark({
        icon: result.icon,
        title: result.name,
        url: result.url.href,
      });
      node.classList.add("small");
      return node;
  }

  activate(_result) {
    // The <action-bookmark> element manages the click.
  }
}
