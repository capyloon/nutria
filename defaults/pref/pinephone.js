
// Pinephone specific prefs.

user_pref("hal.linux.flashlight.path", "/sys/class/leds/white:flash/brightness");

// Allow remote debugging without a ssh tunnel.
user_pref("devtools.debugger.force-local", false);
