// Manages favorite items pinned to the homescreen.

class Favorites {
  constructor(parent, containerName) {
    this.log("constructor");
    this.parentNode = parent;
    this.container = contentManager.getContainerManager(containerName, []);
    this.container.addEventListener("full-list", this);
    this.container.addEventListener("child-created", this);
    this.container.addEventListener("child-deleted", this);

    this._triggerReady = null;
    this.ready = new Promise(resolve => {
      this._triggerReady = resolve;
    });
  }

  log(msg) {
    console.log(`Favorites: ${msg}`);
  }

  async init() {
    this.log("init start");
    try {
      await this.container.init();
    } catch (e) {
      console.error(e);
    }

    var list = this.parentNode.querySelector("div");

    // If user didn't scroll. We put this so we still have the overflow fade gradient mask.
    list.classList.add("start");

    list.onscroll = () => {
      if (list.scrollLeft <= 1) {
        list.classList.remove("end");
        list.classList.remove("center");
        list.classList.add("start");
      } else if (list.scrollLeft >= (list.scrollWidth - list.offsetWidth - 1)) {
        list.classList.remove("center");
        list.classList.remove("start");
        list.classList.add("end");
      } else {
        list.classList.remove("end");
        list.classList.remove("start");
        list.classList.add("center");
      }
    };
    this.log("init done");
  }

  async handleEvent(event) {
    // this.log(`event ${event.type}`);
    switch (event.type) {
      case "full-list":
        this.updateList(event.detail);
        break;
      case "child-created":
        // this.log(`child-created: ${JSON.stringify(event.detail)}`);
        await this.addChild(event.detail);
        break;
      case "child-deleted":
        // this.log(`child-deleted: ${JSON.stringify(event.detail)}`);
        this.removeChild(event.detail);
        break;
    }
  }

  // Add a single child.
  async addChild(item) {
    // Get a resource from this child id.
    let resource = await contentManager.resourceFromId(item.id);
    // We need the default resource.
    let response = await fetch(resource.variantUrl("default"));
    let content = await response.json();
    if (this.shouldDisplay(content)) {
      let container = this.parentNode.querySelector("div");
      let node = this.buildNodeFor(content, resource);
      node.dataset.resourceId = resource.meta.id;
      container.append(node);
    }
  }

  // Remove a single child.
  removeChild(item) {
    this.log(`removeChild ${item.id}`);
    // Search for the node with the given id.
    let nodes = this.parentNode.querySelectorAll(".favorite");
    nodes.forEach((node) => {
      this.log(`checking node resource=${node.dataset["resource-id"]}`);
      if (node.dataset.resourceId == item.id) {
        node.remove();
      }
    });
  }

  // Updates the full list of favorites.
  async updateList(list) {
    // Clear old one.
    let container = this.parentNode.querySelector("div");
    container.innerHTML = "";
    let itemCount = 0;

    for (let item of list) {
      let text = await item.variant("default").text();
      let content = JSON.parse(text);
      if (this.shouldDisplay(content)) {
        let node = this.buildNodeFor(content, item);
        node.dataset.resourceId = item.meta.id;
        container.append(node);
        itemCount += 1;
      }
    }

    if (itemCount) {
      this.parentNode.classList.remove("hidden");
    } else {
      this.parentNode.classList.add("hidden");
    }

    this._triggerReady();
  }
}

class Apps extends Favorites {
  constructor(parent) {
    super(parent, "homescreen");
  }

  shouldDisplay(content) {
    return content.kind === "bookmark";
  }

  buildNodeFor(content, resource) {
    let node = document.createElement("div");
    node.setAttribute("tabindex", "0");
    node.classList.add('app');
    node.onclick = () => {
      window.open(content.url, "_blank");
    };

    node.classList.add("favorite");

    let bg = document.createElement("div");
    bg.classList.add("background");
    bg.style.backgroundColor = content.backgroundColor;
    bg.style.backgroundImage = `url(${resource.variantUrl("icon")})`;

    node.append(bg);

    let icon = document.createElement("img");
    icon.classList.add("icon");
    icon.style.backgroundColor = content.backgroundColor;
    icon.src = resource.variantUrl("icon");

    node.append(icon);

    let title = document.createElement("div");
    title.textContent = content.title;
    title.classList.add("title");

    node.append(title);

    return node;
  }
}

class Videos extends Favorites {
  constructor(parent) {
    super(parent, "media");
  }

  shouldDisplay(content) {
    // this.log(`shouldDisplay ${JSON.stringify(content)}`);
    return true;
  }

  buildNodeFor(content, resource) {
    let node = document.createElement("div");
    node.setAttribute("tabindex", "0");
    node.onclick = () => {
      window.open(content.url, "_blank");
    };

    node.classList.add("favorite");

    let bg = document.createElement("div");
    bg.classList.add("background-video");
    bg.classList.add("background");
    bg.style.backgroundColor = content.backgroundColor;
    bg.style.backgroundImage = `url(${resource.variantUrl("poster")})`;

    node.append(bg);

    let icon = document.createElement("img");
    icon.classList.add("icon");
    icon.src = resource.variantUrl("icon");
    node.append(icon);

    let title = document.createElement("div");
    title.textContent = content.title;
    title.classList.add("title");

    node.append(title);

    return node;
  }
}
