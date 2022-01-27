// Base class for camera managers.

export class CameraBase {
  constructor(preview) {
    this.preview = preview;
  }

  log(msg) {
    console.log(`CameraBase: ${msg}`);
  }

  error(msg) {
    console.error(`CameraBase: ${msg}`);
  }

  // Return a proper CSS transform to apply to the video preview element based on
  // the preview stream resolution and sensor orientation.
  // Tis scales the preview to best fill the screen. We take the min
  // of x-scale and y-scale to keep the same aspect ratio.
  // We need to take into account the sensor angle here too.
  // TODO: deal with screen orientation.
  getPreviewTransform({ width = 0, height = 0, angle = 0, name = "front" }) {
    let fullWidth = window.innerWidth;
    let fullHeight = window.innerHeight;
    this.log(`preview: width=${width} height=${height} angle=${angle}`);
    this.log(`screen:  width=${fullWidth} height=${fullHeight}`);

    let xScale = 0;
    let yScale = 0;

    if (angle == 90 || angle == 270) {
      // Change of main axis.
      xScale = fullHeight / width;
      yScale = fullWidth / height;
    } else {
      xScale = fullWidth / width;
      yScale = fullHeight / height;
    }

    let scale = Math.min(xScale, yScale);

    log(
      `angle=${angle} xScale=${xScale} yScale=${yScale} screen=${fullWidth}x${fullHeight}`
    );

    // Mirror the video if using the front camera, otherwise just scale it.
    let transform = "";
    if (name === "front" || name === "user") {
      transform += `scale(-${scale}, ${scale}) `;
    } else {
      transform += `scale(${scale}) `;
    }

    // Compensate for the sensor orientation.
    transform += `rotate(${angle}deg)`;

    return transform;
  }

  // Saves a blob picture in the content manager in the "photos" container.
  async savePicture(blob) {
    let ext = blob.type == "image/jpeg" ? "jpg" : "png";

    let now = new Date();
    now = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    // Format the date such as: 2020-10-02-16-23-40
    const filename = `${now
      .toISOString()
      .slice(0, -5)
      .replace(/[:T]/g, "-")}.${ext}`;

    let container = await contentManager.ensureTopLevelContainer("photos");

    this.log(`Photos container is ${container}, adding ${filename}`);

    contentManager.create(container, filename, blob).then(
      () => {
        this.log(`Photo saved in camera/${filename}`);
      },
      (error) => {
        this.error(`Error saving photo: ${JSON.stringify(error)}`);
      }
    );
  }

  startShutterEffect() {
      this.preview.classList.add("shutter");
  }

  endShutterEffect() {
    this.preview.classList.remove("shutter");
  }
}
