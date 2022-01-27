// Camera manager class for Gonk devices.

export class Camera extends CameraBase {
  // @preview is the DOM <video> element used for the preview.
  constructor(preview) {
    super(preview);
    this.log(`constructor ${preview}`);
    this.preview = preview;

    // The set of available cameras
    this.cameras = navigator.b2g.cameras.getListOfCameras();
    // Currently selected one.
    this.currentCamera = -1;

    // The current CameraControl object.
    this.camera = null;
  }

  log(msg) {
    console.log(`CameraGonk: ${msg}`);
  }

  error(msg) {
    console.error(`CameraGonk: ${msg}`);
  }

  async getCameraCount() {
    return this.cameras.length;
  }

  async nextCamera() {
    if (this.cameras.length == 0) {
      return;
    }

    if (this.currentCamera == -1) {
      this.currentCamera = 0;
    } else {
      this.currentCamera = (this.currentCamera + 1) % this.cameras.length;
    }
    await this.useCamera(this.cameras[this.currentCamera]);
  }

  async useCamera(name) {
    this.log(`useCamera ${name}`);

    if (this.preview.srcObject) {
      await this.preview.srcObject.release();
      this.preview.srcObject = null;
      this.log(`previous preview released`);
    }

    let params;
    try {
      params = await navigator.b2g.cameras.getCamera(name, {
        mode: "picture",
      });
    } catch (e) {
      this.log(`Failed to getCamera ${name}: ${e}`);
      return;
    }

    this.camera = params.camera;
    let config = params.configuration;

    this.log(`Configuration: ${JSON.stringify(config)}`);
    let previewSize = config.previewSize;

    let transform = this.getPreviewTransform({
      width: previewSize.width,
      height: previewSize.height,
      angle: this.camera.sensorAngle,
      name,
    });
    log(`Setting preview.style to "transform: ${transform}"`);
    this.preview.style = `transform: ${transform}`;
    this.preview.srcObject = this.camera;
    this.preview.play();
  }

  async takePicture() {
    if (!this.camera) {
      this.error(`Can't takePicture(): no camera available.`);
      return;
    }

    try {
      this.startShutterEffect();
      let blob = await this.camera.takePicture();
      this.log(`Got picture blob: ${blob.size} ${blob.type}`);
      this.camera.resumePreview();
      await this.savePicture(blob);
    } catch (e) {
      this.error(`takePicture() failed: ${e}`);
      this.camera.resumePreview();
    }
    this.endShutterEffect();
  }
}
