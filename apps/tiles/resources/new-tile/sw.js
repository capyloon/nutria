const HAS_RETURN_VALUE_ACTIVITIES = ["p2p-tile-called"];
const ACTIVITIES_URL = {
  "p2p-tile-called": "/index.html",
  "p2p-tile-start": "/index.html",
};

try {
  importScripts(`http://shared.localhost/js/activity_sw.js`);
} catch (e) {
  // If we the load from port 80 fails, fallback to port 8081.
  // TODO: smarter detection of which port to use.
  importScripts(`http://shared.localhost:8081/js/activity_sw.js`);
}
