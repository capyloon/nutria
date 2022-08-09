const kDeps = [
  {
    name: "main",
    kind: "virtual",
    deps: [
      "content manager",
      "shoelace-setup",
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

var cameraManager;

document.addEventListener("DOMContentLoaded", async () => {
  console.log(`DOMContentLoaded`);
  await depGraphLoaded;
  graph = new ParallelGraphLoader(addSharedDeps(addShoelaceDeps(kDeps)));

  await graph.waitForDeps("activity manager");
  // Configure activity handlers.
  let activities = new ActivityManager({
    "scan-qr-code": captureQRCode,
  });

  await graph.waitForDeps("main");

  await contentManager.as_superuser();

  let cameraModule;

  // Import the base class in scope.
  const baseModule = await import("./camera_base.js");
  window.CameraBase = baseModule.CameraBase;

  // Load the platform specific module.
  if (navigator.b2g.cameras) {
    cameraModule = await import("./camera_gonk.js");
  } else {
    cameraModule = await import("./camera_fallback.js");
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

  window["shutter"].onclick = async () => {
    await cameraManager.takePicture();
  };

  // Kick-off preview with the first/default camera.
  await cameraManager.nextCamera();
});

async function captureQRCode() {
  return new Promise(async (resolve, reject) => {
    const { QrCodeScanner } = await import(`./qr_code.js`);
    let scanner = new QrCodeScanner(cameraManager);
    scanner.addEventListener("found", (event) => {
      // log(`QR result: ${event.detail}`);
      resolve(event.detail);
      window.close();
    });
    await scanner.start();
  });
}
