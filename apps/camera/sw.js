const HAS_RETURN_VALUE_ACTIVITIES = ["pick", "scan-qr-code"];
const ACTIVITIES_DISPOSITION = { "scan-qr-code": "inline", pick: "inline" };

importScripts(`http://shared.localhost:${location.port}/js/activity_sw.js`);
