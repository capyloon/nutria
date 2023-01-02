/* image/* renderer component */

class ConsoleImpl {
  constructor(name) {
    this.name = name;
  }

  consoleLog(msg) {
    console.log(`${this.name}:`, msg);
  }

  consoleError(msg) {
    console.error(`${this.name}:`, msg);
  }
}

export class ImageRenderer extends LitElement {
  constructor(resource) {
    super();
    this.resource = resource;
    this.src = resource.variantUrl();
    this.editMode = false;
    this.algorithms = [];
    this.plugins = new Map();
    this.modules = new Map();

    this.pluginsManager = contentManager.getPluginsManager(
      this.pluginsChange.bind(this)
    );
    this.pluginsManager.init();
  }

  log(msg) {
    console.log(`ImageRenderer: ${msg}`);
  }

  static get properties() {
    return {
      src: { state: true },
      editMode: { type: Boolean },
      algorithms: { state: true },
    };
  }

  async pluginsChange(list) {
    this.log(`Plugins list is now ${list}`);

    this.plugins = new Map();
    for (let plugin of list) {
      let text = await plugin.variant("default").text();
      let json = JSON.parse(text);
      if (json?.mimeType.startsWith("image/")) {
        json.url = plugin.variantUrl("wasm");
        this.plugins.set(json.url, json);
      }
    }
    this.log(`${this.plugins.size} plugins registered.`);
    await this.ensureModules();
  }

  enterEditMode() {
    this.editMode = true;
  }

  leaveEditMode() {
    this.editMode = false;
  }

  asCanvas() {
    let img = this.shadowRoot.querySelector("img");
    let canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    let ctxt = canvas.getContext("2d");

    ctxt.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
    return { canvas, ctxt };
  }

  async applyEffect(event) {
    let [url, algo] = event.target.dataset.cmd.split("|");
    this.log(`applyEffect ${algo}`);

    if (!this.modules.has(url)) {
      console.error(`No module ready for ${url} !`);
      return;
    }

    let { canvas, ctxt } = this.asCanvas();
    let dx = canvas.width;
    let dy = canvas.height;
    let imageData = ctxt.getImageData(0, 0, dx, dy);
    let newData = this.modules
      .get(url)
      .processImage(algo, imageData.data, dx, dy);
    let buffer = newData.buffer;
    let res = new Uint8ClampedArray(buffer, 0, buffer.byteLength);
    ctxt.putImageData(new ImageData(res, dx, dy), 0, 0);

    canvas.toBlob((blob) => {
      this.src = URL.createObjectURL(blob);
    });
  }

  undo() {
    if (!this.imageModule) {
      // No effect was applied yet.
      return;
    }

    if (this.src.startsWith("blob:")) {
      URL.revokeObjectURL(this.src);
    }

    // This will trigger render() -> updated()
    this.src = `${this.resource.variantUrl()}?${Math.random()}`;
  }

  save() {
    // Get a blob from the current image and save it as the default variant for this resource.
    let { canvas } = this.asCanvas();
    canvas.toBlob(async (blob) => {
      await this.resource.update(blob);
    });
  }

  // Will reload wasm modules if needed.
  async ensureModules(forUI = false) {
    console.log(`Loading effect list...`);

    if ((forUI && !this.imageModule) || this.imageModule) {
      let tmp_algorithms = [];
      this.modules = new Map();

      const { ImageModule } = await import(
        `http://shared.localhost:${window.config.port}/wasm_plugins/js/image_module.js`
      );
      const { addConsoleToImports } = await import(
        `http://shared.localhost:${window.config.port}/wasm_plugins/js/console.js`
      );

      for (let plugin of this.plugins.values()) {
        let module = new ImageModule();

        let imports = {};
        addConsoleToImports(imports, new ConsoleImpl("ImageModule"), (what) => {
          if (what == "memory") {
            return module._exports.memory;
          } else {
            console.error("Unsupport get_export() parameter: ", what);
          }
        });

        await module.instantiate(fetch(plugin.url), imports);
        console.log(`Module instanciated`);
        let algorithms = module.algorithms(navigator.language);
        console.log(
          `Algorithms for ${plugin.url}: `,
          algorithms.map((algo) => algo.name).join(",")
        );

        algorithms.forEach((item) => {
          item.url = plugin.url;
          tmp_algorithms.push(item);
        });

        this.modules.set(plugin.url, module);
      }

      this.algorithms = tmp_algorithms;
      this.imageModule = true;

      this.log(`Algorithms: ${JSON.stringify(this.algorithms)}`);
    }
  }

  async effects() {
    await this.ensureModules(true);

    let dialog = this.shadowRoot.querySelector("dialog");
    if (!dialog.showModal) {
      console.error("The <dialog> element is not supported!");
      return;
    }
    dialog.showModal();
  }

  closeDialog() {
    this.shadowRoot.querySelector("dialog")?.close();
  }

  updated() {
    document.l10n.translateFragment(this.shadowRoot);
  }

  render() {
    this.log(`Will render ${this.algorithms.length} algos`);

    return html`<link rel="stylesheet" href="components/image_renderer.css" />
      <img crossorigin="anonymous" src=${this.src} />
      <footer class="${this.editMode ? "" : "hidden"}">
        <div @click="${this.save}">
          <sl-icon-button name="download"></sl-icon-button>
        </div>
        <div @click="${this.effects}">
          <sl-icon-button name="image"></sl-icon-button>
        </div>
        <div @click="${this.undo}"><sl-icon-button name="undo"></sl-icon-button></div>
      </footer>
      <dialog>
        <ul>
          ${this.algorithms.map((item) => {
            return html`<li
              @click="${this.applyEffect}"
              data-cmd="${item.url}|${item.name}"
            >
              <sl-icon name="chevron-right"></sl-icon>
              ${item.description}
            </li>`;
          })}
        </ul>
        <sl-button @click="${this.closeDialog}" data-l10n-id="close"></sl-button>
      </dialog> `;
  }

  canEdit() {
    return true;
  }
}

customElements.define("image-renderer", ImageRenderer);
