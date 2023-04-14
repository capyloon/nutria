// Search module using the search-provider activity.
// TODO: switch to activity.broadcast() once it's available.

class SearchActivity {
  // Returns a Promise that resolves to a result set.
  async search(input, count) {

    let res = [];
    let provider = new WebActivity("search-provider", { input });
    try {
      let providers = await provider.start();
      providers.forEach(provider => {
        provider.results.forEach(result => {
            res.push(result);
        })
      });
    } catch (e) {
    }

    return res;
  }
}

class SearchActivitySource extends SearchSource {
  constructor(sectionName) {
    super(sectionName, new SearchActivity());
    this.preserveCase = true;
  }

  domForResult(result) {
    let node = document.createElement("div");
    node.classList.add("skill");

    let doc = document.createElement("span");
    doc.classList.add("flex-fill");
    doc.textContent = `→ ${result.text}`;
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
        navigator.clipboard.writeText(result.text).then(
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

  activate(result) {
    maybeOpenURL(result);
  }
}
