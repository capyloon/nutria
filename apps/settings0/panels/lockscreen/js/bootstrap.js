class StateManager {
  async init() {
    // Observe the lockscreen related settings.
    this.service = await apiDaemon.getSettings();
    let lib = apiDaemon.getLibraryFor("SettingsManager");

    class LockscreenSettingObserver extends lib.SettingObserverBase {
      constructor(service, session, owner) {
        super(service.id, session);
        this.owner = owner;
      }

      display() {
        return "Lockscreen Setting Observer";
      }

      callback(setting) {
        if (setting.name === "lockscreen.enabled") {
          this.owner.enabled = setting.value;
        } else if (setting.name === "lockscreen.code") {
          this.owner.code = setting.value;
        } else {
          console.error(
            `LockscreenSettingObserver: Unexpected setting change for '${setting.name}'`
          );
        }

        this.owner.updateUI();

        return Promise.resolve();
      }
    }

    let observer = new LockscreenSettingObserver(
      this.service,
      apiDaemon.getSession(),
      this
    );
    this.service.addObserver("lockscreen.enabled", observer);
    this.service.addObserver("lockscreen.code", observer);

    this.enabled = await this.getSetting("lockscreen.enabled", false);

    this.enableCheckbox = window["enable-check"];

    this.enableCheckbox.onchange = async () => {
      this.enabled = this.enableCheckbox.checked;
      await this.service.set([
        { name: "lockscreen.enabled", value: this.enabled },
      ]);
    };

    this.edit1 = window["edit-code-1"];
    this.edit2 = window["edit-code-2"];

    this.edit1.oninput = this.edit2.oninput = () => {
      this.updateUI();
    };

    window["button-ok"].onclick = async () => {
      if (!this.enabled) {
        // Should not happen!
        console.error(`Lock screen is disabled, not saving lock code!`);
        return;
      }

      // Save the new lock code.
      await this.service.set([
        { name: "lockscreen.code", value: this.edit1.value },
      ]);

      // Reset the input fields.
      this.edit1.value = "";
      this.edit2.value = "";
      this.updateUI();
    };

    this.updateUI();
  }

  async getSetting(name, defaultValue) {
    try {
      let settingInfo = await this.service.get(name);
      return settingInfo.value;
    } catch (e) {
      return defaultValue;
    }
  }

  updateUI() {
    this.enableCheckbox.checked = this.enabled;

    let codeCheck = window["code-check"];
    let button = window["button-ok"];

    // The HTML input is not valid yet: prevent button click and
    // hide value comparison status since it doesn't make sense.
    if (
      !this.edit1.validity.valid ||
      !this.edit2.validity.valid
    ) {
      button.setAttribute("disabled", "true");
      codeCheck.classList.add("hidden");
      return;
    }

    let value1 = this.edit1.value;
    let value2 = this.edit2.value;

    if (value1 == value2) {
      codeCheck.classList.remove("hidden");
      codeCheck.classList.add("success");
      codeCheck.classList.remove("error");
      codeCheck.setAttribute("data-l10n-id", "code-check-success");
      if (this.enabled) {
        button.removeAttribute("disabled");
      } else {
        button.setAttribute("disabled", "true");
      }
    } else {
      codeCheck.classList.remove("hidden");
      codeCheck.classList.add("error");
      codeCheck.classList.remove("success");
      codeCheck.setAttribute("data-l10n-id", "code-check-error");
      button.setAttribute("disabled", "true");
    }
  }
}

document.addEventListener(
  "DOMContentLoaded",
  async () => {
    await depGraphLoaded;
    await getSharedDeps(["shared-all"]);

    let manager = new StateManager();
    await manager.init();
  },
  { once: true }
);
