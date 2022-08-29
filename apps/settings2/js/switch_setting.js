// Bind a <sl-switch> to a boolean setting in a bi-directional way.

export class SwitchAndSetting extends EventTarget {
  constructor(element, name) {
    super();
    this.element = element;
    this.name = name;

    this.timezonesLoaded = false;
  }

  async init() {
    let settings = await apiDaemon.getSettings();
    // Get the initial value and set the switch position.
    let initValue = false;
    try {
      let setting = await settings.get(this.name);
      initValue = setting.value;
    } catch (e) {}
    this.element.checked = initValue;

    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { name: this.name, value: initValue },
      })
    );

    // Listen to changes on the element and update the setting.
    this.element.addEventListener("sl-change", async () => {
      try {
        let setting = { name: this.name, value: this.element.checked };
        await settings.set([setting]);
        this.dispatchEvent(new CustomEvent("change", { detail: setting }));
      } catch (e) {
        this.error(
          `Failed to mirror ${this.name} switch -> setting (value is ${this.element.checked})`
        );
      }
    });

    // Listen to setting changes and update the switch.
    settings.addObserver(this.name, async (setting) => {
      this.element.cheked = setting.value;
      this.dispatchEvent(new CustomEvent("change", { detail: setting }));
    });
  }
}
