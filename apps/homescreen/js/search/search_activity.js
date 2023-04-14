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
    let node = document.createElement("li");
    node.textContent = result.text;
    return node;
  }

  activate(result) {
    maybeOpenURL(result);
  }
}
