//
// Common preferences for device builds
//
// Use our system app
pref("b2g.system_startup_url", "chrome://system/content/index.html");
pref("b2g.neterror.url", "http://system.localhost/neterror/index.html");

// Enable tracking protection
pref("privacy.trackingprotection.enabled", true);
pref("privacy.trackingprotection.pbmode.enabled", true);

pref("browser.dom.window.dump.enabled", true);
pref("devtools.console.stdout.chrome", true);

pref("domsecurity.skip_html_fragment_assertion", true);

pref("dom.virtualcursor.enabled", false);

pref("consoleservice.logcat", false);

pref("device.sensors.enabled", true);
pref("device.sensors.motion.enabled", true);
pref("device.sensors.orientation.enabled", true);
pref("device.sensors.proximity.enabled", true);
pref("device.sensors.ambientLight.enabled", true);

// APZ physics settings (fling acceleration, fling curving and axis lock) have
// been reviewed by UX
// pref("apz.axis_lock.breakout_angle", "0.7853982");    // PI / 4 (45 degrees)
// pref("apz.axis_lock.mode", 1); // Use standard axis locking
// pref("apz.content_response_timeout", 600);
// pref("apz.drag.enabled", false);
// pref("apz.fling_accel_interval_ms", 750);
// pref("apz.fling_curve_function_x1", "0.59");
// pref("apz.fling_curve_function_y1", "0.46");
// pref("apz.fling_curve_function_x2", "0.05");
// pref("apz.fling_curve_function_y2", "1.00");
// pref("apz.fling_curve_threshold_inches_per_ms", "0.01");
// // apz.fling_friction and apz.fling_stopped_threshold are currently ignored by Fennec.
// pref("apz.fling_friction", "0.004");
// pref("apz.fling_stopped_threshold", "0.0");
// pref("apz.max_velocity_inches_per_ms", "0.07");
// pref("apz.overscroll.enabled", false);
// pref("apz.second_tap_tolerance", "0.3");
// pref("apz.touch_move_tolerance", "0.03");
// pref("apz.touch_start_tolerance", "0.06");

// Add brotli support for localhost
pref("network.http.accept-encoding", "gzip, deflate, br");

pref("voice-input.icon-url", "http://shared.localhost/icons/voice_input.svg");

// pref("ril.debugging.enabled", true);
// pref("ril.worker.debugging.enabled", true);

pref("apz.y_skate_size_multiplier", "1.5");
pref("dom.events.coalesce.touchmove", true);

pref("browser.contentblocking.category", "strict");
pref("browser.contentblocking.features.strict", "tp,tpPrivate,cookieBehavior5,cookieBehaviorPBM5,cm,fp,stp,lvl2");
pref("privacy.trackingprotection.lower_network_priority", true);
pref("privacy.trackingprotection.enabled", true);

pref("security.sandbox.content.level", 0);

pref("extensions.webextensions.remote", true);

// IPFS gateway. Check list at https://ipfs.github.io/public-gateway-checker/
pref("ipfs.gateway", "dweb.link");

pref("security.disallow_privileged_https_stylesheet_loads", false);

pref("apz.overscroll.enabled", true);

