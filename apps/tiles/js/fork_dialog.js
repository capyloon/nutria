// Helper class to manage the Fork dialog

class ForkDialog {
  constructor(mode = "fork") {
    document.getElementById(
      "fork-chooser-title"
    ).dataset.l10nId = `fork-dialog-title-${mode}`;
    this.dialog = document.getElementById("fork-chooser");
    this.dialog.addEventListener("sl-after-hide", this);
    let okButton = document.getElementById("fork-chooser-ok");
    okButton.dataset.l10nId = `btn-${mode}`;
    okButton.addEventListener("click", this, { once: true });
    document
      .getElementById("fork-chooser-cancel")
      .addEventListener("click", this, { once: true });
    this.promise = null;
    this.mode = mode;

    this.dialog
      .querySelector("sl-dropdown")
      .addEventListener("sl-select", (event) => {
        this.dialog.querySelector("#fork-url").value = event.detail.item.value;
      });
  }

  handleEvent(event) {
    if (this.promiseDone) {
      return;
    }

    if (event.type === "sl-after-hide") {
      // sl-after-hide is also dispatched when "closing" the sl-select drop down,
      // but we should not do anything in that case.
      if (event.target !== this) {
        return;
      }

      this.promiseDone = true;
      this.promise?.reject();
      return;
    }

    let id = event.target.getAttribute("id");
    if (id === "fork-chooser-ok") {
      let input = this.dialog.querySelector("#fork-url").value.trim();
      let result = input || this.dialog.querySelector("#fork-list").value;
      if (!result.endsWith("/manifest.webmanifest")) {
        result += "/manifest.webmanifest";
      }
      this.updateRecents(result);
      this.promiseDone = true;
      this.promise?.resolve(result);
    } else if (id === "fork-chooser-cancel") {
      this.promiseDone = true;
      this.promise?.reject();
    } else {
      console.error(
        `Unexpected event: ${event.type} from ${event.target.localName}#${id}`
      );
      return;
    }
    this.dialog.hide();
  }

  // Update the LRU of recent tiles.
  // TODO: use origin-bound storage in the content manager.
  updateRecents(newItem) {
    console.log(`updateRecents`, newItem);
    const recents = JSON.parse(localStorage.getItem("recents") || "[]");
    // Remove the new item if it's already present.
    let lru = [newItem].concat(recents.filter((item) => item != newItem));
    // Limit to 10 elements.
    let filtered = lru.slice(0, 10);

    localStorage.setItem("recents", JSON.stringify(filtered));
  }

  updateRecentList() {
    try {
      let menu = document.getElementById("fork-chooser-recents");
      menu.innerHTML = "";
      let recents = JSON.parse(localStorage.getItem("recents") || "[]");
      menu.parentElement.disabled = recents.length == 0;

      recents.forEach((recent) => {
        let item = document.createElement("sl-menu-item");
        item.textContent = recent;
        item.value = recent;
        menu.append(item);
      });
    } catch (e) {
      console.error(e);
    }
  }

  open() {
    this.updateRecentList();
    this.promiseDone = false;
    return new Promise(async (resolve, reject) => {
      this.promise = { resolve, reject };
      this.dialog.show();

      await graph.waitForDeps("apps manager");

      let list = this.dialog.querySelector("#fork-list");
      list.innerHTML = "";

      let subtitle = document.createElement("small");

      // Show installed tiles when forking, but not when installing.
      if (this.mode === "fork") {
        subtitle.dataset.l10nId = "fork-chooser-your-library";
        let apps = await appsManager.getAll();
        list.append(subtitle);

        for (let app of apps) {
          let summary = await appsManager.getSummary(app);
          const isTile = summary.url?.startsWith("tile://");
          if (isTile) {
            let option = document.createElement("sl-option");
            option.value = summary.updateUrl;
            let icon = document.createElement("img");
            icon.src = summary.icon;
            icon.setAttribute("slot", "prefix");
            let desc = document.createElement("span");
            desc.textContent = summary.description;
            option.append(icon);
            option.append(desc);

            list.append(option);
          }
        }

        list.append(document.createElement("sl-divider"));
        subtitle = document.createElement("small");
      }

      subtitle.dataset.l10nId = "fork-chooser-public-library";
      list.append(subtitle);

      // Add entries from the Tiles repo
      let response = await fetch(
        "https://raw.githubusercontent.com/capyloon/tiles/main/tiles.json"
      );
      let remoteList = await response.json();
      remoteList.forEach((item) => {
        let option = document.createElement("sl-option");
        option.value = item.manifestUrl;
        let icon = document.createElement("img");
        icon.src = item.icon;
        icon.setAttribute("slot", "prefix");
        let desc = document.createElement("span");
        desc.textContent = item.description;
        option.append(icon);
        option.append(desc);

        list.append(option);
      });
    });
  }
}
