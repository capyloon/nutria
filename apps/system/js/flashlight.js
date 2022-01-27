// A small abstraction over FlashlightManager

class Flashlight {
  constructor() {
    this.fl = null;
    if (!navigator.b2g?.getFlashlightManager) {
      return;
    }
    navigator.b2g.getFlashlightManager().then(
      (fl) => {
        this.fl = fl;
        this.fl.onflashlightchange = this.update.bind(this);
        this.update();
      },
      (error) => {
        console.error(`Failed to get flashlight: ${error}`);
      }
    );
  }

  update() {
    actionsDispatcher.dispatch(
      "flashlight-state-change",
      this.fl.flashlightEnabled
    );
  }

  get enabled() {
    this.fl ? this.fl.flashlightEnabled : false;
  }

  set enabled(value) {
    if (this.fl) {
      this.fl.flashlightEnabled = value;
    }
  }

  toggle() {
    if (this.fl) {
      this.fl.flashlightEnabled = !this.fl.flashlightEnabled;
    }
  }
}

window.flashlightManager = new Flashlight();
