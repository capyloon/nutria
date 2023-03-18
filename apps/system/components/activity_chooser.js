// Represents an <activity-chooser> element

class ActivityChooser extends LitElement {
  constructor() {
    super();
    this.drawer = this.parentElement;
    this.drawer.addEventListener("sl-request-close", (event) => {
      event.preventDefault();
      this.canceled();
    });
  }

  static get properties() {
    return {
      apps: { state: true },
    };
  }

  updated() {
    document.l10n.translateFragment(this.shadowRoot);
  }

  async open(providers) {
    console.log(`ABCD ${JSON.stringify(providers)}`);
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
    this.drawer.show();
    return new Promise((resolve, reject) => {
      this.deferred = { resolve, reject };
    });
  }

  makeChoice(event) {
    let value = event.target.dataset.index;
    this.drawer.addEventListener(
      "sl-after-hide",
      () => {
        this.deferred?.resolve({ id: this.activityId, value });
        this.deferred = null;
        this.providers = null;
      },
      { once: true }
    );
    this.drawer.hide();
  }

  canceled() {
    console.log(`ZZZ canceled`);
    this.drawer.addEventListener(
      "sl-after-hide",
      () => {
        this.deferred?.resolve({ id: this.activityId });
        this.deferred = null;
        this.providers = null;
      },
      { once: true }
    );
    this.drawer.hide();
  }

  render() {
    return html`<div class="container">
      <link rel="stylesheet" href="components/activity_chooser.css" />
      <h3 data-l10n-id="activity-${this.activityName}">${this.activityName}</h3>
      <sl-menu>
        ${this.apps?.map((app, index) => {
          return html`<sl-menu-item
            @click="${this.makeChoice}"
            data-index=${index}
            ><img src="${app.icon}" slot="prefix" />${app.title}</sl-menu-item
          >`;
        })}
      </sl-menu>
      <sl-divider></sl-divider>
      <sl-button
        variant="neutral"
        data-l10n-id="button-cancel"
        @click="${this.canceled}"
      ></sl-button>
    </div>`;
  }
}

customElements.define("activity-chooser", ActivityChooser);
