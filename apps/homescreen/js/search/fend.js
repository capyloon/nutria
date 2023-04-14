// A search engine powered by https://github.com/printfn/fend
// Currently using revision 685110de575f54a872a64a20b9a17abb1b4a457b
//
// Generate by running `wasm-pack build --release --no-typescript --target no-modules` in the
// wasm directory and replacing wasm_bindgen with fend_wasm in fend_wasm.js

class FendConverter {
  constructor() {
    this.initialized = false;
  }

  async init() {
    if (!this.initialized) {
      await fend_wasm("/js/search/fend_wasm_bg.wasm");
      fend_wasm.initialise();
      this.initialized = true;
    }
  }

  // Returns a Promise that resolves to a result set.
  async search(what, count) {
    await this.init();

    let result = await fend_wasm.evaluateFendWithTimeout(what, 500);
    if (!result.startsWith("Error:")) {
      return [`${result}`];
    } else {
      return [];
    }
  }
}

class FendConverterSource extends SearchSource {
  constructor(sectionName) {
    super(sectionName, new FendConverter());
    this.preserveCase = true;
  }

  domForResult(result) {
    let node = document.createElement("div");
    node.classList.add("skill");

    let doc = document.createElement("span");
    doc.classList.add("flex-fill");
    doc.textContent = `→ ${result}`;
    node.appendChild(doc);

    let icons = document.createElement("div");
    icons.classList.add("icons");
    let clipboard = document.createElement("sl-icon");
    clipboard.setAttribute("name", "clipboard");
    icons.appendChild(clipboard);
    node.appendChild(icons);

    icons.addEventListener(
      "click",
      (event) => {
        // Copy the result to the clipboard, and keep the search interface open.
        event.preventDefault();
        event.stopPropagation();
        navigator.clipboard.writeText(result).then(
          () => {},
          (err) => {
            console.error(
              `Failure copying '${result}' to the clipboard: ${err}`
            );
          }
        );
      },
      { once: true, capture: true }
    );

    return node;
  }

  activate(_result) {
    // No action available, we just display the result.
  }
}
