// Represents an <activity-chooser> element
// Not using LitElement to workaround a bug in Lit
// when updating the l10n part.

class ActivityChooser extends HTMLElement {
  constructor() {
    super();
    this.drawer = this.parentElement;
    this.drawer.addEventListener("sl-request-close", (event) => {
      event.preventDefault();
      this.canceled();
    });

    let shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `<div class="container">
      <link rel="stylesheet" href="components/activity_chooser.css" />
      <h3></h3>
      <sl-menu></sl-menu>
      <sl-divider></sl-divider>
      <sl-button
        variant="neutral"
        data-l10n-id="button-cancel"
      ></sl-button>
    </div>`;
    shadow.querySelector("sl-button").onclick = this.canceled.bind(this);
  }

  async open(providers) {
    console.log(`activity_chooser: ${JSON.stringify(providers)}`);
    let apps = [];
    for (let item of providers?.choices) {
      let summary = await window.appsManager.getSummary({
        manifestUrl: new URL(item.manifest),
        updateUrl: new URL(item.manifest),
      });
      apps.push(summary);
    }
    this.activityId = providers.id;
    this.apps = apps;
    this.activityName = providers.name;

    this.render();

    this.drawer.show();

    return new Promise((resolve, reject) => {
      this.deferred = { resolve, reject };
    });
  }

  reset() {
    this.deferred = null;
    this.providers = null;
    this.apps = null;
    this.render();
  }

  makeChoice(event) {
    let value = event.target.dataset.index;
    this.drawer.addEventListener(
      "sl-after-hide",
      () => {
        this.deferred?.resolve({ id: this.activityId, value });
        this.reset();
      },
      { once: true }
    );
    this.drawer.hide();
  }

  canceled() {
    console.log(`activity_chooser: canceled`);
    this.drawer.addEventListener(
      "sl-after-hide",
      () => {
        this.deferred?.resolve({ id: this.activityId });
        this.reset();
      },
      { once: true }
    );
    this.drawer.hide();
  }

  render() {
    // console.log(`activity_chooser: activity_chooser render() ${this.activityName}`);
    let menu = this.shadowRoot.querySelector("sl-menu");

    menu.innerHTML = "";
    let choiceFn = this.makeChoice.bind(this);
    this.apps?.forEach((app, index) => {
      let item = document.createElement("sl-menu-item");
      item.dataset.index = index;
      item.onclick = choiceFn;
      item.textContent = app.title;

      let icon = document.createElement("img");
      icon.setAttribute("slot", "prefix");
      icon.src = app.icon;
      item.append(icon);

      menu.append(item);
    });

    let title = this.shadowRoot.querySelector("h3");
    title.innerText = this.activityName;
    title.dataset.l10nId = `activity-${this.activityName}`;
    document.l10n.translateFragment(this.shadowRoot);
  }
}

customElements.define("activity-chooser", ActivityChooser);
