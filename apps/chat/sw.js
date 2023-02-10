const HAS_RETURN_VALUE_ACTIVITIES = ["p2p-respond"];
const ACTIVITIES_URL = {
  "p2p-start": "/index.html",
  "p2p-respond": "/index.html",
};

importScripts(`http://shared.localhost:${location.port}/js/activity_sw.js`);
