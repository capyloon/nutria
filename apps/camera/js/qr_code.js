// QR Decoding support.
// TODO: check if we should move that into a Web Worker.

export class QrCodeScanner extends EventTarget {
  constructor(cameraReady) {
    super();
    cameraReady.then((cameraManager) => {
      this.cameraManager = cameraManager;
      this.start();
    });
    this.ready = false;
    this.module = null;
  }

  async start() {
    // hide all the controls since we will be in "automatic" mode.
    window["controls"].classList.add("hide-qr-scan");

    // Wait for some data to be loaded in the video preview.
    window.preview.addEventListener(
      "loadeddata",
      () => {
        this.ready = true;
        this.scheduleFrame();
      },
      { once: true }
    );

    await this.initWasmDecoder();
  }

  async initWasmDecoder() {
    this.module = await import(
      `http://camera.localhost:${window.config.port}/qrdecoder/qrdecoder.js`
    );
  }

  scheduleFrame() {
    window.requestAnimationFrame(() => {
      this.processFrame();
    });
  }

  async processFrame() {
    // Grab a frame, and check if it contains a QR-code.
    // If not, schedule a new frame capture.
    if (!this.ready || this.cameraManager?.currentCamera == -1) {
      this.scheduleFrame();
      return;
    }

    try {
      let bitmap = await createImageBitmap(window.preview);
      let canvas = document.createElement("canvas");
      let width = bitmap.width;
      let height = bitmap.height;
      canvas.width = width;
      canvas.height = height;
      let ctxt = canvas.getContext("2d");
      ctxt.drawImage(bitmap, 0, 0, width, height);
      let imageData = ctxt.getImageData(0, 0, width, height);
      // let start = Date.now();
      let result = this.module?.decodeQr(imageData.data, width, height);
      // let elapsed = Date.now() - start;
      // console.log(`QR: decoding took ${elapsed}ms`);
      if (!result) {
        this.scheduleFrame();
      } else {
        navigator.vibrate(200);
        this.dispatchEvent(new CustomEvent("found", { detail: result }));
      }
    } catch (e) {
      // Just in case...
      log(`QR decoding error: ${e}`);
      // this.scheduleFrame();
    }
  }

  resume() {
    this.scheduleFrame();
  }
}
