// Wallpaper manager

class WallpaperManager extends EventTarget {
  constructor() {
    super();
    this.image = null;
    this.loadOrUseDefault().then(() => {
      this.log(`ready`);
      this.updateBackground();
      this.dispatchEvent(new CustomEvent("wallpaper-ready"));
    });

    actionsDispatcher.addListener("set-wallpaper", (_name, url) => {
      this.log(`about to fetch ${url} as a wallpapper`);

      this.fetchAsBlob(url)
        .then(async (blob) => {
          this.image = blob;
          this.ignoreNextChange = true;
          await this.save();

          this.updateBackground();
          let msg = await window.utils.l10n("wallpaper-changed");
          window.toaster.show(msg, "success");
        })
        .catch(this.error);
    });
  }

  updateBackground() {
    let url = this.asURL();
    this.log(`updateBackground -> ${this.url}`);
    if (url) {
      let bgUrl = `url(${url}?r=${Math.random()})`;
      document.body.style.backgroundImage = bgUrl;
      window.lockscreen.setBackground(bgUrl);
    } else {
      // Fallback to a gradient.
      let gradient =
        "linear-gradient(135deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%)";
      document.body.style.background = gradient;
      window.lockscreen.setBackground(gradient);
    }
  }

  log(msg) {
    console.log(`WallpaperManager: ${msg}`);
  }

  error(msg) {
    console.error(`WallpaperManager: ${msg}`);
  }

  fetchAsBlob(url) {
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error fetching ${url}`);
        }
        return response.blob();
      })
      .catch((error) => {
        this.error(
          `There has been a problem with your fetch operation for ${url}: ${error}`
        );
      });
  }

  async ensureWallpaperContainer() {
    this.log(`ensureWallpaperContainer ${this.wallpaperContainer}`);
    if (!this.wallpaperContainer) {
      await contentManager.as_superuser();
      this.wallpaperContainer = await contentManager.ensureTopLevelContainer(
        "wallpapers"
      );

      this.log(`ensureWallpaperContainer got ${this.wallpaperContainer}`);
    }
  }

  async save() {
    this.log("saving");

    if (!this.image) {
      this.error(`no wallpaper image to save!`);
      this.ignoreNextChange = false;
      return;
    }

    try {
      if (this.currentResource) {
        await this.currentResource.update(this.image);
      } else {
        await this.ensureWallpaperContainer();
        this.currentResource = await contentManager.create(
          this.wallpaperContainer,
          "default",
          this.image
        );
      }
    } catch (e) {
      this.error(`Failed to save wallpaper: ${e}`);
    }
  }

  async loadDefaultWallpaper() {
    this.image = await this.fetchAsBlob("./resources/default-wallpaper.webp");
    this.log(`got default blob ${this.image}`);
    return this.save();
  }

  // Retrieve the list of wallpapers from the content manager.
  async getCurrentWallpaper() {
    try {
      await this.ensureWallpaperContainer();

      let current = await contentManager.childByName(
        this.wallpaperContainer,
        "default"
      );
      this.log(`Found current: ${current?.debug()}`);
      return current;
    } catch (e) {
      this.error(`getCurrentWallpaper failed: ${e}`);
      return null;
    }
  }

  async loadOrUseDefault(firstLaunch = true) {
    this.log(`loadOrUseDefault`);

    this.currentResource = await this.getCurrentWallpaper();
    if (!this.currentResource) {
      this.error("No current wallpaper set");
      return this.loadDefaultWallpaper();
    }

    this.url = this.currentResource.variantUrl("default");

    // At first launch install an observer for the default wallpaper,
    // making sure we switch when the content manager is used directly
    // to change the wallpaper.
    if (firstLaunch) {
      await this.currentResource.observe(async (change) => {
        if (this.ignoreNextChange == true) {
          this.ignoreNextChange = false;
          return;
        }

        this.log(`Wallpaper changed: ${JSON.stringify(change)}`);
        await this.loadOrUseDefault(false);
        this.updateBackground();
      });
    }
  }

  asURL() {
    if (!this.url) {
      this.url = this.currentResource.variantUrl("default");
    }
    return this.url;
  }
}

window.WallpaperManager = WallpaperManager;
