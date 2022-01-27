// Opensearch based search module, providing suggestions results.

function parseOpenSearchXML(root) {}

const kEcosiaSearch = {
  shortName: "Ecosia",
  longName: "Ecosia Search",
  description: "Search Ecosia",
  inputEncoding: "UTF-8",
  contact: "info@ecosia.org",
  image: {
    width: 16,
    height: 16,
    url: "data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAACMuAAAjLgAAAAAAAAAAAAAAAAAAAAAAAAAAAAC8qzQBuaw3UrmsN6u5rDfruaw37bmsN+25rDfSuaw3fLmsNyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC2rTokrLFGurqsNv+5rDf/uaw3/7msN/+5rDf/uaw3/7urNP/AqS7suqw2aAAAAAAAAAAAAAAAAAAAAAC/qjApkbpn4mvJlf/EqCr/uaw3/7msN/+5rDf/uaw3/7urNP+rsUj/ib5x/7qsNv+9qzKBAAAAAAAAAAC5rDcLwKkvzom9cf813Nb/lrlh/8KoLP+5rDf/uaw3/7msN//BqS3/eMSF/yXj6v+BwHv/lbli/7atO1IAAAAAuaw3bsCqL/+Rumb/K+Di/z3ZzP+dtln/vqox/7msN/+5rDf/waku/23Ikv8s4OH/ONvS/5m4Xv+7qzXZuaw3CbmsN9DBqS7/hL93/zDe3f8v393/RdbD/7OuPv+7qzX/uqw2/8WoKf99wn//Lt/e/y/e3f99wn//v6ow/7msN0+7qzT7s64+/0bWwf8y3tn/L97d/03TuP+usET/vKoz/7isOP+vr0P/XM6n/zDe3P813Nb/L97d/5O6Zf/EpymOu6s0/7OuPv8+2cv/J+Hn/1HStP+0rjz/vasy/76qMP9zxYr/NtzV/zTd1/823NX/NtzV/zLd2f9I1b//mbheqsGpLf+gtVX/bseR/3fEhv+wr0L/vaoy/7msN/+/qjD/Wc+q/yvg4/813Nb/Md7b/zfc1P833NT/Mt7a/zbc1aqHvnT6bMiT/522WP+wr0L/vqox/7msN/+5rDf/vaoy/6C1VP8/2cr/N9zT/2vJlf9hzKD/NtzU/zbc1f813NaONdzWz3HGjv9ky53/prNN/8SoKv+8qzT/uaw3/7msOP/EqCr/ecOE/0HYx/9V0K//N9vT/zXc1v823NX/NtzVTjXc120w3tz/Lt/e/0zUu/+Fv3X/rrBF/7msN/+7qzX/vaoy/6qxSf9G1sH/L9/d/zPd2P8x3tv/L9/e2C/f3Qk23NUKNtzVzDbc1v823NX/OdvQ/0nVvv+xr0H/ta07/7+qL/+7qzT/r69D/2LMoP823NX/VNGx/2TLnVEAAAAAAAAAADbc1Sc03dfgQNnJ/2bKm/862tD/pLRP/1vOqf9S0rP/ib1x/8CpL/+4rDj/qLJM/7qsNn4AAAAAAAAAAAAAAAAAAAAAM93YI0vUvLtux5H/VdGw/3DHj/9Zz6r/Xc2m/3rDgv+5rDf/u6s1672rM2gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAyaYjUburNaytsUbZuK056cGpLuS/qjDGuaw3gLmsNx4AAAAAAAAAAAAAAAAAAAAA+D8AAOAPAADAAwAAgAMAAIABAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAABAACAAQAAgAMAAMAHAADgDwAA+B8AAA==",
  },
  search: {
    method: "get",
    type: "text/html",
    template:
      "https://www.ecosia.org/search?q={searchTerms}&amp;addon=opensearch",
  },
  suggestions: {
    template:
      "https://ac.ecosia.org/autocomplete?q={searchTerms}&amp;type=list",
  },
};

const kDuckDuckGoSearch = {
  shortName: "DuckDuckGo",
  longName: "Ecosia Search",
  description: "Search DuckDuckGo",
  inputEncoding: "UTF-8",
  image: {
    width: 16,
    height: 16,
    url: "data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB8lBMVEUAAADkRQzjPwPjQQXkRQ3iPwTiQQXgPQPeQgrcOwPVNgDVNQDWOgbTMwDRMgDQMwDSMwDRNwTQLgDRJgDSJwDSLgDSNwTjOgDiOADjOQDkPADhQAXzs5v+/fv////0vKbiRQvgPQHpdUr85NzuknPdKgDcIwDnZzj2w7HqeU/gPQLsimb/+PftjWn97Obpb0LdJQDeLQDtjmvsi2jgSBDnbULgOQD/39HgLQDeMgDpeFLgSBH0v670uqbaJQD2qImWvP/G1Ob5+/3u//+fvvXyp47dMwDaLwD0u6v0v6/aNQDiXi/aKQD3qozU7/8gSY2vvtg0ZK/OqLDaKQHYKgLgWTfaNADZMgDZMADZLADzqpD7//+xwdz//9H/5Bn/7Bn//ADofADYMADYMQDZOgPXLgDiZDj//97/0AD3tQDvlgHZOgbXLATXMADWMgDfXjLVLQD///z+0AD/3Rn/yRnwnQDcVjbVMQDyv67wuKTSJwDRHQD+8O/tg3/iQQDwhAHnawHWMADvtKfyva7XQxHga0bQGQD2vbH/u8LXIQCmPQzja07XQxLliGn99fPkcVHvhnGZ5VguvUU5wktBwCcAgxzydVv/8/XmiGngdlL+ysi3+I8LtCE80V6P3YmX4sDleljSNQLzr6D7sKPXNQTSIwAEAbMrAAAAF3RSTlMARqSkRvPz80PTpKRG3fPe3hio9/eoGP50jNsAAAABYktHRB5yCiArAAAAyElEQVQYGQXBvUqCYRiA4fu2V9Tn+UQddI3aCpxaOoU6iU4gcqqpoYbALXBuCuoYmttamqJDiEoh4YP+MOi6BNCh+uYKEGiOVNCXXxA2XDVV/UyfKbRCXTLQWAxbP2vt8Ue/uYDvfim91615sb2um6rqtrr/NFb1cUf1Ybd06areU6lSlYpK79jzK1SyJOkfhOl8JGEcqV5zoKrTRqO6yUzIzNu46ijdM1VV9bhuUJ/nZURExLRzUiPQm3kKXHi4BAEGOmOi78A/L1QoU/VHoTsAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTQtMDEtMTlUMjA6MDE6MTEtMDU6MDAuET6cAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE0LTAxLTE5VDIwOjAxOjExLTA1OjAwX0yGIAAAAABJRU5ErkJggg==",
  },
  search: {
    method: "get",
    type: "text/html",
    template: "https://duckduckgo.com/?q={searchTerms}",
  },
  suggestions: {
    template: "https://duckduckgo.com/ac/?q={searchTerms}&amp;type=list",
  },
};

const kBraveSearch = {
  shortName: "Brave",
  longName: "Brave Search",
  description: "Brave Search beta: private, independent, open",
  inputEncoding: "UTF-8",
  image: {
    width: 32,
    height: 32,
    url: "https://cdn.search.brave.com/serp/v1/static/brand/16c26cd189da3f0f7ba4e55a584ddde6a7853c9cc340ff9f381afc6cb18e9a1e-favicon-32x32.png",
  },
  search: {
    method: "get",
    type: "text/html",
    template: "https://search.brave.com/search?q={searchTerms}",
  },
  suggestions: {
    method: "get",
    type: "application/x-suggestions+json",
    template: "https://search.brave.com/api/suggest?q={searchTerms}",
  },
};

class OpenSearch {
  constructor(searchDesc) {
    this.searchDesc = searchDesc;
  }

  // Build a safe url doing parameter substitution.
  buildUrl(what, template) {
    let encoded = encodeURIComponent(what).replace(/[!'()*]/g, function (c) {
      return "%" + c.charCodeAt(0).toString(16);
    });
    return template.replace("{searchTerms}", encoded);
  }

  // Returns a Promise that resolves to a result set.
  search(what, count) {
    let res = [];

    let template = this.searchDesc?.suggestions?.template;
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
    let template = this.searchDesc?.search?.template;
    if (!template) {
      return null;
    }

    return this.buildUrl(what, template);
  }
}

class OpenSearchSource extends SearchSource {
  constructor(sectionName) {
    super(sectionName, new OpenSearch(kBraveSearch));
  }

  activate(result) {
    SearchSource.openURL(this.engine.getSearchUrlFor(result));
  }

  domForResult(result) {
    let node = document.createElement("div");
    node.classList.add("suggestion");
    node.textContent = result;
    return node;
  }
}
