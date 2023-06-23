// Wallpaper manager

class ColorUtil {
  constructor(rgb) {
    this.rgb = rgb; // [r, g, b] array.
  }

  get relativeLuminance() {
    const [r, g, b] = this.rgb.map((c) => {
      const sRGB = c / 255;
      return sRGB <= 0.03928 ? sRGB / 12.92 : ((sRGB + 0.055) / 1.055) ** 2.4;
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  contrastWith(otherColor) {
    const otherLuminance = otherColor.relativeLuminance + 0.05;
    const ourLuminance = this.relativeLuminance + 0.05;

    return (
      Math.max(otherLuminance, ourLuminance) /
      Math.min(otherLuminance, ourLuminance)
    );
  }
}

class WallpaperManager extends EventTarget {
  constructor() {
    super();
    this.loadOrUseDefault().then(() => {
      this.log(`ready`);
      this.updateBackground();
      this.dispatchEvent(new CustomEvent("wallpaper-ready"));
    });

    actionsDispatcher.addListener("set-wallpaper", (_name, url) => {
      this.log(`about to fetch ${url} as a wallpapper`);

      this.fetchAsBlob(url)
        .then(async (blob) => {
          this.ignoreNextChange = true;
          await this.save(blob);

          let msg = await window.utils.l10n("wallpaper-changed");
          window.toaster.show(msg, "success");
        })
        .catch(this.error);
    });
  }

  async extractPalette(url) {
    this.log(`extractPalette`);

    // Crop the original image to only use the bottom.
    const heightPercent = 5;
    const originalImage = new Image();
    const loaded = new Promise((resolve) => {
      originalImage.onload = resolve;
    });
    originalImage.src = url;
    await loaded;
    let width = originalImage.naturalWidth;
    let height = (originalImage.naturalHeight * heightPercent) / 100;
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext("2d");

    //draw the image
    ctx.drawImage(
      originalImage,
      0,
      originalImage.naturalHeight - height,
      width,
      height,
      0,
      0,
      width,
      height
    );

    let croppedBlob = await canvas.convertToBlob();
    let croppedUrl = URL.createObjectURL(croppedBlob);

    let v = Vibrant.from(croppedUrl);
    let palette = await v.getPalette();
    // this.log(`${JSON.stringify(palette)}`);

    URL.revokeObjectURL(croppedBlob);

    function toCSS(item) {
      let [r, g, b] = item.rgb;
      return `rgb(${r},${g},${b})`;
    }

    // Find the accent color: choose the one with the most contrast
    // compared to the reference one.
    let refColor = new ColorUtil(palette.Muted.rgb);
    let accent = null;
    let bestContrast = 0;
    [
      palette.LightVibrant,
      palette.DarkVibrant,
      palette.Muted,
      palette.LightMuted,
      palette.DarkMuted,
    ].forEach((color) => {
      let contrast = refColor.contrastWith(new ColorUtil(color.rgb));
      if (contrast > bestContrast) {
        bestContrast = contrast;
        accent = color;
      }
    });
    this.log(`best contrast: ${bestContrast}`);

    let themeData = {
      "theme.wallpaper.vibrant": toCSS(palette.Vibrant),
      "theme.wallpaper.vibrant-light": toCSS(palette.LightVibrant),
      "theme.wallpaper.vibrant-dark": toCSS(palette.DarkVibrant),
      "theme.wallpaper.muted": toCSS(palette.Muted),
      "theme.wallpaper.muted-light": toCSS(palette.LightMuted),
      "theme.wallpaper.muted-dark": toCSS(palette.DarkMuted),
      "theme.wallpaper.accent": toCSS(accent),
    };

    embedder.updateThemeColors(themeData);
  }

  updateBackground() {
    let url = this.asURL();
    this.log(`updateBackground -> ${url}`);
    if (url) {
      let randomized = `${url}?r=${Math.random()}`;
      this.extractPalette(randomized).then(() => {
        let cssUrl = `url(${randomized})`;
        document.body.style.backgroundImage = cssUrl;
        window.lockscreen.setBackground(cssUrl);
        this.log(`system & lockscreen updated`);
      });
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

      // At first launch install an observer for the wallpaper container,
      // making sure we switch when the content manager is used directly
      // to manipulate the wallpaper.
      await this.attachObserver();
    }
  }

  async save(image) {
    this.log("saving");

    if (!image) {
      this.error(`no wallpaper image to save!`);
      this.ignoreNextChange = false;
      return;
    }

    try {
      if (this.currentResource) {
        await this.currentResource.update(image);
      } else {
        await this.ensureWallpaperContainer();
        this.currentResource = await contentManager.create(
          this.wallpaperContainer,
          "current",
          image
        );
      }
    } catch (e) {
      this.error(`Failed to save wallpaper: ${JSON.stringify(e)}`);
    }
  }

  async attachObserver() {
    if (!this.wallpaperContainer) {
      this.error(`Can't attach observer to a null resource!`);
      return;
    }

    // Get an observable resource for the container.
    let containerResource = await contentManager.resourceFromId(
      this.wallpaperContainer
    );

    await containerResource.observe(async (change) => {
      if (this.ignoreNextChange == true) {
        this.ignoreNextChange = false;
        return;
      }

      this.log(`id=${this.currentResource.id} ${JSON.stringify(change)}`);
      // Update when the change is either ChildModified or ChildDeleted
      if (
        (change.kind == 4 || change.kind == 5) &&
        change.id == this.currentResource.id &&
        change.parent
      ) {
        await this.loadOrUseDefault();
        this.updateBackground();
      }
    });
  }

  async loadDefaultWallpaper() {
    let image = await this.fetchAsBlob("./resources/default-wallpaper.webp");
    this.log(`got default blob ${image}`);
    await this.save(image);
  }

  // Retrieve the list of wallpapers from the content manager.
  async getCurrentWallpaper() {
    try {
      await this.ensureWallpaperContainer();

      let current = await contentManager.childByName(
        this.wallpaperContainer,
        "current"
      );
      this.log(`Found current: ${current?.debug()}`);
      return current;
    } catch (e) {
      this.error(`getCurrentWallpaper failed: ${e}`);
      return null;
    }
  }

  async loadOrUseDefault() {
    this.log(`loadOrUseDefault`);

    this.currentResource = await this.getCurrentWallpaper();
    if (!this.currentResource) {
      this.log("No current wallpaper set");
      await this.loadDefaultWallpaper();
    }
  }

  asURL() {
    return this.currentResource.variantUrl("default");
  }
}

window.WallpaperManager = WallpaperManager;
