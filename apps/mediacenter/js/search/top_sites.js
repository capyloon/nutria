// Top sites search module.

class TopSites {
  // Returns a Promise that resolves to a result set.
  search(what, count) {
    if (!topSites) {
      return Promise.resolve([]);
    }

    let res = [];
    let i = 0;
    while (res.length < count && i < topSites.length) {
      if (topSites[i].includes(what)) {
        res.push(topSites[i]);
      }
      i += 1;
    }

    return Promise.resolve(res);
  }
}

class TopSitesSource extends SearchSource {
  constructor(sectionName) {
    super(sectionName, new TopSites());
  }

  domForResult(result) {
    let node = document.createElement("li");
    node.tabIndex = 0;
    node.classList.add("like-place");
    node.textContent = result;
    return node;
  }

  activate(result) {
    maybeOpenURL(result);
  }
}
