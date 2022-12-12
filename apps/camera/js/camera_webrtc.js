// Camera manager class using getUserMedia apis.

export class Camera extends CameraBase {
  // @preview is the DOM <video> element used for the preview.
  constructor(preview) {
    super(preview);
    this.log(`constructor ${preview}`);
    this.preview = preview;

    // The set of available cameras
    this.cameras = null;

    // Currently selected one.
    this.currentCamera = -1;

    // The MediaStream object for the current camera.
    this.camera = null;
  }

  log(msg) {
    console.log(`CameraWebrtc: ${msg}`);
  }

  error(msg) {
    console.error(`CameraWebrtc: ${msg}`);
  }

  async getCameraCount() {
    try {
      let devices = await navigator.mediaDevices.enumerateDevices();
      this.cameras = devices.filter((device) => {
        this.log(`getCameraCount device: ${JSON.stringify(device)}`);
        return device.kind === "videoinput";
      });
      return this.cameras.length;
    } catch (e) {
      return 0;
    }
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

  async useCamera(device) {
    this.log(`useCamera ${device.deviceId}`);
    let constraints = { video: { deviceId: { exact: device.deviceId } } };
    this.camera = await navigator.mediaDevices.getUserMedia(constraints);

    let videoTrack = this.camera.getVideoTracks()[0];
    this.log(`videoTrack is ${videoTrack}`);
    let settings = videoTrack.getSettings();
    this.log(`video settings: ${JSON.stringify(settings)}`);

    if (this.preview.srcObject) {
      this.preview.srcObject = null;
      this.log(`previous preview released`);
    }

    let angle = 0;

    // Special case back camera detected on the Pinephone.
    if (device.label == "sun6i-csi") {
      angle = 90;
    }

    let transform = this.getPreviewTransform({
      width: settings.width,
      height: settings.height,
      angle,
      name: settings.facingMode,
    });
    this.log(`Setting preview.style to "transform: ${transform}"`);
    this.preview.style = `transform: ${transform}`;
    this.preview.srcObject = this.camera;
    this.preview.play();
  }

  async takePicture(returnBlob = false) {
    const imageCapture = new ImageCapture(this.camera.getVideoTracks()[0]);
    return new Promise((resolve, reject) => {
      imageCapture.onphoto = async (event) => {
        this.endShutterEffect();
        if (returnBlob) {
          resolve(event.data);
        } else {
          await this.savePicture(event.data);
          resolve();
        }
      };

      imageCapture.onerror = reject;

      this.startShutterEffect();
      imageCapture.takePhoto();
    });
  }
}
