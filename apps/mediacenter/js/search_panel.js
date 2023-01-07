// Manages the search panel.

export class SearchPanel {
  init() {
    this.panel = document.getElementById("search-panel");
    this.searchBox = document.getElementById("search-box");
    this.searchBox.addEventListener("input", this);

    this.sources = [
      new PlacesSource("places"),
      new TopSitesSource("top-sites"),
    ];
  }

  onOpen() {
    this.panel.classList.add("open");
    this.panel.classList.remove("hidden");
    document.getElementById("search-results").classList.remove("hidden");
    this.panel.addEventListener(
      "transitionend",
      () => {
        document
          .getElementById("theme-color")
          .setAttribute("content", "rgba(0, 0, 0, 0.5)");
      },
      { once: true }
    );

    this.getTopFrecencyResults();
  }

  onClose() {
    this.panel.classList.remove("open");
    this.panel.classList.add("hidden");
    document.getElementById("search-results").classList.add("hidden");
    document
      .getElementById("theme-color")
      .setAttribute("content", "transparent");
  }

  openURL(url, search) {
    return SearchSource.openURL(url, search);
  }

  clearAllResults() {
    this.sources.forEach((source) => {
      source.clearResults();
    });
  }

  // Add nodes to parent, but will try to replace
  // existing children if any instead of starting
  // from scratch if some are already in the tree.
  mergeDom(parent, nodes) {
    let childCount = parent.children.length;
    let children = parent.children;

    if (childCount <= nodes.length) {
      // Less children in parent than new nodes: replace all
      // existing parent children and add remaining nodes.
      for (let i = 0; i < children.length; i++) {
        children[i].replaceWith(nodes[i]);
      }

      for (let i = children.length; i < nodes.length; i++) {
        parent.appendChild(nodes[i]);
      }
    } else {
      // More children in parent than new nodes: replace all
      // nodes, remove the remaining children from the parent.
      for (let i = 0; i < nodes.length; i++) {
        children[i].replaceWith(nodes[i]);
      }

      let toRemove = childCount - nodes.length;
      for (let i = 0; i < toRemove; i++) {
        children[nodes.length].remove();
      }
    }
  }

  handleEvent() {
    let what = this.searchBox.value.trim();

    let inputChanged = this.previousInput !== what;
    this.previousInput = what;

    if (what.length == 0) {
      inputChanged && this.getTopFrecencyResults();
      return;
    }

    if (what.length < 2) {
      // Clear top frecency results if any.
      let defaultResults = document.getElementById("default-search-results");
      defaultResults.classList.add("hidden");
      defaultResults.clear();

      // Clear search results in case we had some from
      // a longer search term.
      this.clearAllResults();

      // TODO: just trigger a search
      return;
    }

    this.sources.forEach(async (source) => {
      let results = await source.search(what, 7);
      if (results.length === 0) {
        source.clearResults();
        return;
      }
      source.titleNode.classList.remove("hidden");

      let nodes = [];
      results.forEach((result) => {
        let node = source.domForResult(result);
        node.addEventListener(
          "click",
          () => {
            this.clearAllResults();
            // Make sure we will dismiss the virtual keyboard.
            SearchSource.closeSearch();
            source.activate(result);
          },
          { once: true }
        );
        nodes.push(node);
      });
      this.mergeDom(source.resultsNode, nodes);
    });
  }

  async getTopFrecencyResults() {
    // console.log(`getTopFrecencyResults`);
    let defaultResults = document.getElementById("default-search-results");
    defaultResults.classList.remove("hidden");
    defaultResults.refresh();
  }
}
