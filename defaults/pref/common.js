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

pref("extensions.webextensions.remote", true);

// IPFS gateway. Check list at https://ipfs.github.io/public-gateway-checker/
pref("ipfs.gateway", "dweb.link");

pref("security.disallow_privileged_https_stylesheet_loads", false);

pref("apz.overscroll.enabled", true);

user_pref("datareporting.healthreport.service.enabled", false);
user_pref("datareporting.healthreport.uploadEnabled", false);
