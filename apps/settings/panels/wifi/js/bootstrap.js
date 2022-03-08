var wifi;

document.getElementById("wifi").addEventListener(
  "bootstrap",
  async () => {
    wifi = await import("/panels/wifi/js/wifi.js");
    wifi.setupWifi();
  },
  { once: true }
);
