// System app side of the remote control feature.
// It is responsible for answering the dial query
// with a webrtc answer, and after that to manage
// remote commands.

class RemoteControl {
  constructor() {
    this.controlId = null;
  }

  log(msg) {
    console.log(`RemoteControl: ${msg}`);
  }

  error(msg) {
    console.error(`RemoteControl: ${msg}`);
  }

  async process(params) {
    this.log(`process ${JSON.stringify(params)}`);

    if (!!params.start) {
      const random = new Uint8Array(16);
      window.crypto.getRandomValues(random);
      this.controlId = random.reduce(
        (output, elem) => output + ("0" + elem.toString(16)).slice(-2),
        ""
      );
      return this.controlId;
    }

    if (
      !params.controlId ||
      !this.controlId ||
      params.controlId !== this.controlId
    ) {
      this.error(`Invalid or missing controlId`);
      return false;
    }

    if (params.keypress) {
      // Dispatch the keypress events to the active frame.
      let keys = params.keypress.split(",");
      let win = window.wm.currentFrame().webView.ownerGlobal;

      // We can't use the KeyEventGenerator API because it doesn't support
      // key sequences that change modifier states.
      // Modifier state changes are needed eg. for [Shift]+[Tab] generation.
      try {
        let tip = Cc["@mozilla.org/text-input-processor;1"].createInstance(
          Ci.nsITextInputProcessor
        );
        tip.beginInputTransaction(win, () => {});
        keys.forEach((key) => {
          tip.keydown(new win.KeyboardEvent("keydown", { key }));
        });

        keys.reverse().forEach((key) => {
          tip.keyup(new win.KeyboardEvent("keyup", { key }));
        });

        tip = null;
      } catch (e) {
        this.error(`Failed to generate key event: ${e}`);
      }
    }
    return true;
  }
}
