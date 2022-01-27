const kDeps = [
  {
    name: "main",
    kind: "virtual",
    deps: ["content manager"],
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
];

function log(msg) {
  console.log(`CameraApp: ${msg}`);
}

document.addEventListener("DOMContentLoaded", async () => {
  await depGraphLoaded;
  let graph = new ParallelGraphLoader(kDeps);
  await Promise.all([getSharedDeps("shared-all"), graph.waitForDeps("main")]);

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

  let manager = new cameraModule.Camera(window["preview"]);

  let count = await manager.getCameraCount();
  log(`Found ${count} cameras.`);
  if (count == 0) {
    return;
  }

  if (count == 1) {
    window["front-back"].remove();
  } else {
    window["front-back"].onclick = async () => {
      await manager.nextCamera();
    };
  }

  window["shutter"].onclick = async () => {
    await manager.takePicture();
  };

  // Kick-off preview with the first/default camera.
  await manager.nextCamera();
});
