// Opensearch based search module, providing suggestions results.

class OpenSearch {
  constructor() {
    this.searchEngines = [];
    this.init();
  }

  log(msg) {
    console.log(`OpenSearchEngine: ${msg}`);
  }

  async init() {
    this.log(`init`);
    this.openSearch = contentManager.getOpenSearchManager((items) => {
      this.searchEngines = [];
      for (let item of items) {
        let meta = item.meta;
        if (meta.tags.includes("enabled")) {
          this.log(`Adding ${meta.name} ${meta.tags}`);
          this.searchEngines.push(item.variant("default"));
        }
      }
    });
    await this.openSearch.init();
  }

  // Pick one engine randomly in the list.
  get searchDesc() {
    let index = Math.floor(Math.random() * this.searchEngines.length);
    this.log(`Will use search engine #${index}`);
    return this.searchEngines[index].OpenSearchDescription;
  }

  // Build a safe url doing parameter substitution.
  buildUrl(what, template) {
    let encoded = encodeURIComponent(what).replace(/[!'()*]/g, function (c) {
      return "%" + c.charCodeAt(0).toString(16);
    });
    return template.replace("{searchTerms}", encoded);
  }

  // Kind can be "search" or "suggestions"
  templateUrlFor(kind = "search") {
    let desc = this.searchDesc;
    if (!desc) {
      return null;
    }
    let uType;
    switch (kind) {
      case "search":
        uType = "text/html";
        break;
      case "suggestions":
        uType = "application/x-suggestions+json";
        break;
      default:
        console.error(`Unsupported opensearch url kind: ${kind}`);
        return null;
    }

    let urls = desc.Url;
    if (!Array.isArray(urls)) {
      urls = [urls];
    }
    let found = urls.find((item) => item._attributes.type == uType);
    return found?._attributes.template;
  }

  // Returns a Promise that resolves to a result set.
  search(what, count) {
    let res = [];

    let template = this.templateUrlFor("suggestions");
    if (!template) {
      return Promise.resolve(res);
    }

    // Get the suggestions url and fetch it.
    let url = this.buildUrl(what, template);

    return fetch(url).then(
      async (response) => {
        let json = await response.json();
        let res = json[1];
        if (res.length > count) {
          res.length = count;
        }
        return json[1];
      },
      (error) => {
        console.error(
          `OpenSearch error fetching suggestions from ${url}: ${error}`
        );
        return Promise.resolve([]);
      }
    );
  }

  // Returns the url of the full search results page.
  getSearchUrlFor(what) {
    let template = this.templateUrlFor("search");
    if (!template) {
      return null;
    }

    return this.buildUrl(what, template);
  }
}

class OpenSearchSource extends SearchSource {
  constructor(sectionName) {
    super(sectionName, new OpenSearch());
  }

  activate(result) {
    maybeOpenURL(this.engine.getSearchUrlFor(result));
  }

  domForResult(result) {
    let node = document.createElement("div");
    node.classList.add("suggestion");
    node.textContent = result;
    return node;
  }
}
