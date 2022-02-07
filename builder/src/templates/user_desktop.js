//
// Preferences for desktop builds
//
// Use our system app
user_pref("b2g.system_startup_url", "chrome://system/content/index.html");
user_pref(
  "b2g.neterror.url",
  "http://system.localhost:8081/neterror/index.html"
);

// To load about:support for debugging purposes
// user_pref("b2g.system_startup_url", "chrome://global/content/aboutSupport.xhtml");

// Enable tracking protection
user_pref("privacy.trackingprotection.enabled", true);
user_pref("privacy.trackingprotection.pbmode.enabled", true);

// Enable the backdrop-filter CSS property support.
user_pref("layout.css.backdrop-filter.enabled", true);

// user_pref("gfx.webrender.debug.profiler", true);
// user_pref("gfx.webrender.debug.small-screen", true);

user_pref("browser.dom.window.dump.enabled", true);
user_pref("devtools.console.stdout.chrome", true);

user_pref("domsecurity.skip_html_fragment_assertion", true);

user_pref("dom.virtualcursor.enabled", false);

user_pref("consoleservice.logcat", false);

user_pref("device.sensors.enabled", true);
user_pref("device.sensors.motion.enabled", true);
user_pref("device.sensors.orientation.enabled", true);
user_pref("device.sensors.proximity.enabled", true);
user_pref("device.sensors.ambientLight.enabled", true);

// APZ physics settings (fling acceleration, fling curving and axis lock) have
// been reviewed by UX
user_pref("apz.axis_lock.breakout_angle", "0.7853982"); // PI / 4 (45 degrees)
user_pref("apz.axis_lock.mode", 2); // Use "strict" axis locking
user_pref("apz.content_response_timeout", 600);
user_pref("apz.drag.enabled", false);
user_pref("apz.fling_accel_interval_ms", 750);
user_pref("apz.fling_curve_function_x1", "0.59");
user_pref("apz.fling_curve_function_y1", "0.46");
user_pref("apz.fling_curve_function_x2", "0.05");
user_pref("apz.fling_curve_function_y2", "1.00");
user_pref("apz.fling_curve_threshold_inches_per_ms", "0.01");
// apz.fling_friction and apz.fling_stopped_threshold are currently ignored by Fennec.
user_pref("apz.fling_friction", "0.004");
user_pref("apz.fling_stopped_threshold", "0.0");
user_pref("apz.max_velocity_inches_per_ms", "0.07");
user_pref("apz.overscroll.enabled", false);
user_pref("apz.second_tap_tolerance", "0.3");
user_pref("apz.touch_move_tolerance", "0.03");
user_pref("apz.touch_start_tolerance", "0.06");

user_pref("security.sandbox.content.level", 0);

// Adjust the port number for desktop builds.
user_pref(
  "voice-input.icon-url",
  "http://shared.localhost:8081/icons/voice_input.svg"
);

user_pref("browser.contentblocking.category", "strict");
user_pref(
  "browser.contentblocking.features.strict",
  "tp,tpPrivate,cookieBehavior5,cookieBehaviorPBM5,cm,fp,stp,lvl2"
);
user_pref("privacy.trackingprotection.lower_network_priority", true);
user_pref("privacy.trackingprotection.enabled", true);

user_pref("browser.tabs.remote.autostart", true);
user_pref("extensions.webextensions.remote", true);
user_pref("extensions.webextensions.background-delayed-startup", true);

// Simulate space for the "drop" camera at the top.
// user_pref("ui.status-top.enabled", true);

// For the ImageCapture() api to take photos.
user_pref("dom.imagecapture.enabled", true);

// IPFS gateway. Check list at https://ipfs.github.io/public-gateway-checker/
user_pref("ipfs.gateway", "dweb.link");

user_pref("b2g.wifi.nmcli-path", "/usr/bin/nmcli");

user_pref("apz.overscroll.enabled", true);

user_pref("dom.dialog_element.enabled", true);

user_pref("datareporting.healthreport.service.enabled", false);
user_pref("datareporting.healthreport.uploadEnabled", false);
