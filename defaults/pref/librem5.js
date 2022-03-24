// Librem 5 specific prefs.

user_pref("hal.linux.flashlight.path", "/sys/class/leds/white:torch/");

// Allow remote debugging without a ssh tunnel.
user_pref("devtools.debugger.force-local", false);

// Disable use of XDG portal for settings / look-and-feel information
// The DBus service is not present and that causes a 25s timeout blocking
// the startup.
user_pref("widget.use-xdg-desktop-portal.settings", 0);
