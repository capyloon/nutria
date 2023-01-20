// Base class for search sources.
// Each search source is tied to a section of the results panel.

class SearchSource {
  constructor(sourceName, engine) {
    this.name = sourceName;
    this.engine = engine;

    // Add the UI for this source:
    // <div id="contacts-results" class="no-blur"></div>
    // <h4 data-l10n-id="contacts-title"
    //     id="contacts-title"
    //    class="hidden no-blur"></h4>

    this.results = document.createElement("div");
    this.results.setAttribute("id", `${sourceName}-results`);
    this.results.classList.add("no-blur");

    this.title = document.createElement("h4");
    this.title.setAttribute("id", `${sourceName}-title`);
    this.title.setAttribute("data-l10n-id", `${sourceName}-title`);
    this.title.classList.add("no-blur");
    this.title.classList.add("hidden");

    window["search-results"].appendChild(this.results);
    window["search-results"].appendChild(this.title);
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
