// <actions-wall> is a container to layout <action-box> components.

const kMaxWidth = window
  .getComputedStyle(document.body)
  .getPropertyValue("--action-per-line");

class ActionsWall extends HTMLElement {
  constructor() {
    super();

    this.editing = null;

    this.store = new ActionsStore();
    this.store.addEventListener(
      "store-ready",
      () => {
        this.store.forEach((action) => {
          this.addAction(action);
        });
      },
      { once: true }
    );

    // Listen for app related events.
    this.appsManager = window.apiDaemon.getAppsManager();
    this.appsManager.then((service) => {
      service.addEventListener(service.APP_INSTALLING_EVENT, (app) => {
        this.log(`Installing App ${JSON.stringify(app)}`);
      });

      service.addEventListener(
        service.APP_INSTALLED_EVENT,
        this.addAppAction.bind(this)
      );

      service.addEventListener(service.APP_UNINSTALLED_EVENT, (manifestUrl) => {
        this.log(`App ${manifestUrl} uninstalled!`);
        // Remove the action for this manifest url if it exists.
        let action = this.store.getActionByManifestUrl(manifestUrl);
        if (action) {
          let box = window[`action-${action.id}`];
          if (box) {
            this.store.removeAction(action.id);
            this.removeActionNode(box);
          } else {
            this.error(`No DOM node found for action with id ${action.id}`);
          }
        }
      });
    });
  }

  log(msg) {
    console.log(`ActionsWall: ${msg}`);
  }

  error(msg) {
    console.error(`ActionsWall: ${msg}`);
  }

  async addAppAction(app) {
    this.log(`Adding App ${JSON.stringify(app)}`);

    // Don't add Tiles to the homescreen when installing them.
    if (app.updateUrl.protocol === "tile:") {
      return;
    }

    let summary = await window.appsManager.getSummary(app);
    summary.kind = "bookmark";
    this.addNewAction(summary);
  }

  createBox(action, inner) {
    let box = new ActionBox();
    box.setAttribute("position", action.position);
    box.appendChild(inner);
    box.actionId = action.id;
    box.setAttribute("id", `action-${action.id}`);
    box.classList.add("adding");
    this.appendChild(box);
    window.setTimeout(() => {
      box.classList.remove("adding");
    }, 0);
    return box;
  }

  addAction(action) {
    if (action.kind === "bookmark") {
      this.createBox(action, new ActionBookmark(action));
    } else if (action.kind === "activity") {
      this.createBox(action, new ActionActivity(action));
    } else if (action.kind === "widget") {
      let box = this.createBox(action, new ActionWidget(action));
      box.classList.add(`widget-${action.size}`);
    } else {
      this.error(`Unsupported action kind: ${action.kind}`);
    }
  }

  async addNewAction(action) {
    // Find a empty spot for this new action.
    let empty = this.store.getEmptySlots(kMaxWidth);
    action.position = empty.values().next().value;
    let array = new Uint8Array(8);
    window.crypto.getRandomValues(array);
    let hex = "";
    array.forEach((i) => {
      hex += i.toString(16).padStart(2, "0");
    });
    action.id = hex;

    try {
      const stored = await this.store.addAction(action);
      this.addAction(stored);
    } catch (e) {
      this.error(`Failed to add action: ${e}`);
    }
  }

  // Creates a simple action-box with ghost content.
  addGhostAt(position, action) {
    let box = document.createElement("action-box");
    box.setAttribute("position", position);
    box.classList.add("ghost");

    action?.classList.forEach((className) => {
      if (className.startsWith("widget-")) {
        box.classList.add(className);
      }
    });
    this.appendChild(box);
    box.setGhostState(true);
    return box;
  }

  removeAllGhosts() {
    this.querySelectorAll(".ghost").forEach((node) => {
      this.removeChild(node);
    });
  }

  removeActionNode(node) {
    node.addEventListener(
      "transitionend",
      () => {
        node.remove();
      },
      { once: true }
    );
    node.classList.add("removing");
  }

  connectedCallback() {
    let shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <link rel="stylesheet" href="components/actions_wall.css">
      <div>
        <slot> </slot>
      </div>
      `;

    this.addEventListener("delete-action", async (event) => {
      try {
        this.store.removeAction(event.detail);
        this.removeActionNode(event.target);
      } catch (e) {
        console.error(`Failed to remove action from the store: ${e}`);
      }
    });

    this.addEventListener("long-press", (event) => {
      location.hash = "lock";

      let target = event.target;

      // Reset the editing state.
      this.editing = {
        box: event.target,
        startCoords: event.detail,
      };

      // Animate the icon but stop the transition in x,y
      this.editing.box.animate(true);
      this.editing.box.classList.add("no-transition");

      let emptySlots = this.store.getEmptySlots(kMaxWidth);
      emptySlots.forEach((position) => {
        // Add a "ghost" box that will be used for visual effect and hit testing.
        this.addGhostAt(position, target);
      });

      // Add a ghost at the curent position (which is not considered empty)
      // so we can hover on it.
      this.addGhostAt(target.getAttribute("position"), target);

      navigator.vibrate(100);

      this.addEventListener("pointermove", this);
      this.addEventListener("pointerup", this, { once: true });
    });
  }

  findHoverBox(element) {
    while (element && element.localName !== "action-box") {
      element = element.parentNode;
    }
    return element;
  }

  handleEvent(event) {
    if (event.type === "pointerup") {
      this.removeEventListener("pointermove", this);
      this.removeAllGhosts();

      let box = this.editing.box;
      box.animate(false);
      box.classList.remove("no-transition");

      // Update the box position.
      box.translateBy(0, 0);
      let newPosition = this.editing.dropPosition;
      if (newPosition) {
        box.setAttribute("position", newPosition);
        this.store.updatePositionFor(box.actionId, newPosition);
      }

      this.editing = null;

      location.hash = "unlock";
    } else if (event.type === "pointermove") {
      // Find if we are intersecting with a box.
      let hover = this.findHoverBox(
        document.elementFromPoint(event.clientX, event.clientY)
      );
      if (hover) {
        // Change the "active ghost"
        if (this.editing.activeGhost && this.editing.activeGhost !== hover) {
          this.editing.activeGhost.setGhostActive(false);
        }
        hover.setGhostActive(true);
        this.editing.activeGhost = hover;
        this.editing.dropPosition = hover.getAttribute("position");
      }

      let deltaX = event.screenX - this.editing.startCoords.x;
      let deltaY = event.screenY - this.editing.startCoords.y;
      // Update the translation of the box.
      this.editing.box.translateBy(deltaX, deltaY);
    }
  }
}

customElements.define("actions-wall", ActionsWall);
