// Base class for search sources.
// Each search source is tied to a section of the results panel.

class SearchSource {
  constructor(sourceName, engine) {
    this.name = sourceName;
    this.engine = engine;

    // Add the UI for this source:
    // <h4 data-l10n-id="contacts-title"
    //     id="contacts-title"
    //    class="hidden no-blur"></h4>
    // <div id="contacts-results" class="no-blur"></div>

    this.results = document.createElement("div");
    this.results.setAttribute("id", `${sourceName}-results`);
    this.results.classList.add("no-blur");

    this.title = document.createElement("h4");
    this.title.setAttribute("id", `${sourceName}-title`);
    this.title.setAttribute("data-l10n-id", `${sourceName}-title`);
    this.title.classList.add("no-blur");
    this.title.classList.add("hidden");

    window["search-results"].appendChild(this.title);
    window["search-results"].appendChild(this.results);

    // Initialize this spatial navigation section.
    SpatialNavigation.add(`${this.name}-results`, {});
  }

  updateSpatialNavigation(nodes) {
    console.log(`updateSpatialNavigation ${this.name}: ${nodes.length} nodes`);
    SpatialNavigation.set(`${this.name}-results`, {
      selector: nodes,
    });
  }

  static openURL(url, search = null) {
    if (!url || url.length == 0) {
      return false;
    }

    let isUrl = false;
    try {
      let a = new URL(url);
      isUrl = true;
    } catch (e) {}

    const isFileUrl = url.startsWith("file://");

    // No "." in the url that is not a file:// or ipfs:// one, return false since this
    // is likely a keyword search.
    if (!url.includes(".") && !isUrl) {
      return false;
    }

    if (
      !isFileUrl &&
      !url.startsWith("http") &&
      !url.startsWith("ipfs://") &&
      !url.startsWith("ipns://")
    ) {
      url = `https://${url}`;
    }

    let details = {
      search,
    };
    let encoded = encodeURIComponent(JSON.stringify(details));
    window.open(url, "_blank", `details=${encoded}`);
    return true;
  }

  static closeSearch() {
    window["search-box"].blur();
  }

  get resultsNode() {
    return this.results;
  }

  get titleNode() {
    return this.title;
  }

  clearResults() {
    this.results.innerHTML = "";
    this.title.classList.add("hidden");
  }

  search(what, maxCount) {
    if (!this.preserveCase) {
      what = what.toLowerCase();
    }
    return this.engine.search(what, maxCount);
  }
}
