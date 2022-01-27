function install() {
  console.log(`About to install plugin...`);
  try {
    let url = `http://shared.localhost:${location.port}/wasm_plugins/images.wasm`;
    let json = {
      description: "Demo Image Processing",
      mimeType: "image/*",
    };

    let activity = new WebActivity("install-wasm-plugin", { json, url });
    activity.start();
  } catch (e) {
    console.error(`Ooops: ${e}`);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("button").addEventListener("click", install);
});
