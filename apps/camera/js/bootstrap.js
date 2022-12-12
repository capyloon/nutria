const kDeps = [
  {
    name: "main",
    kind: "virtual",
    deps: [
      "shared-fluent",
      "content manager",
      "shoelace-light-theme",
      "shoelace-setup",
      "shoelace-tag",
      "shoelace-icon",
    ],
  },
  {
    name: "api daemon core",
    kind: "sharedWindowModule",
    param: ["js/api_daemon.js", "apiDaemon", "ApiDaemon"],
  },
  {
    name: "content manager",
    kind: "sharedWindowModule",
    param: ["js/content_manager.js", "contentManager", "ContentManager"],
    deps: ["api daemon core"],
  },
  {
    name: "activity manager",
    kind: "sharedModule",
    param: ["js/activity_manager.js", ["ActivityManager"]],
  },
];

function log(msg) {
  console.log(`CameraApp: ${msg}`);
}

// A promise that resolves with the cameraManager when it's ready.
var cameraReady;

var cameraManager;

document.addEventListener("DOMContentLoaded", async () => {
  console.log(`DOMContentLoaded`);
  await depGraphLoaded;
  graph = new ParallelGraphLoader(addSharedDeps(addShoelaceDeps(kDeps)));

  var onCameraReady;
  cameraReady = new Promise((resolve) => {
    onCameraReady = resolve;
  });

  await graph.waitForDeps("activity manager");
  // Configure activity handlers.
  let activities = new ActivityManager({
    "scan-qr-code": captureQRCode,
    "pick": pickImage,
  });

  await graph.waitForDeps("main");

  await contentManager.as_superuser();

  let cameraModule;

  // Import the base class in scope.
  const baseModule = await import("./camera_base.js");
  window.CameraBase = baseModule.CameraBase;

  // Load the platform specific module.
  // When scanning a QR Code always use the webrtc fallback because it
  // reliably provides the "loadeddata" event.
  if (navigator.b2g.cameras && location.hash !== "#activity-scan-qr-code") {
    cameraModule = await import("./camera_gonk.js");
  } else {
    cameraModule = await import("./camera_webrtc.js");
  }

  cameraManager = new cameraModule.Camera(window["preview"]);

  let count = await cameraManager.getCameraCount();
  log(`Found ${count} cameras.`);
  if (count == 0) {
    return;
  }

  if (count == 1) {
    window["front-back"].remove();
  } else {
    window["front-back"].onclick = async () => {
      await cameraManager.nextCamera();
    };
  }

  window["shutter"].addEventListener("click", takePicture);

  // Kick-off preview with the first/default camera.
  await cameraManager.nextCamera();
  onCameraReady(cameraManager);
});

async function takePicture() {
  await cameraManager.takePicture();
}

async function pickImage() {
  return new Promise((resolve, reject) => {
    // Re-bind the shutter button
    window["shutter"].removeEventListener("click", takePicture);

    window["shutter"].onclick = async () => {
      try {
        let blob = await cameraManager.takePicture(true);
        resolve(blob);
      } catch (e) {
        reject();
      }
      window.close();
    };
  });
}

async function captureQRCode() {
  window["qr-overlay"].classList.remove("hidden");

  return new Promise(async (resolve) => {
    const { QrCodeScanner } = await import(`./qr_code.js`);
    let scanner = new QrCodeScanner(cameraReady);
    scanner.addEventListener("found", (event) => {
      // log(`QR result: ${event.detail}`);
      resolve(event.detail);
      window.close();
    });
  });
}
