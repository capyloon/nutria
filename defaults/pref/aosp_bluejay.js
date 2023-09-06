pref("b2g.ims.enabled", false);

// Tweak pref values to match some MOZ_WIDGET_ANDROID ones.
// See StaticPrefList.yaml

pref("gfx.webrender.picture-tile-width", 256);
pref("gfx.webrender.picture-tile-height", 256);
pref("gfx.webrender.max-partial-present-rects", 1);
pref("gfx.webrender.low-quality-pinch-zoom", true);
// On-screen gfx debug info
// pref("gfx.webrender.debug.profiler", true);
// pref("gfx.webrender.debug.small-screen", true);

// Enable the backdrop-filter CSS property support.
pref("layout.css.backdrop-filter.enabled", true);

pref("apz.y_skate_size_multiplier", "1.5");
pref("apz.y_stationary_size_multiplier", "1.5");
pref("apz.zoom_animation_duration_ms", 250);
pref("layers.deaa.enabled", false);

pref("apz.fling_friction", "0.0019");
pref("apz.fling_stopped_threshold", "0.0");
pref("apz.max_velocity_inches_per_ms", "0.07");
pref("apz.overscroll.enabled", true);
pref("apz.second_tap_tolerance", "0.3");
pref("apz.touch_move_tolerance", "0.03");
pref("apz.touch_start_tolerance", "0.06");

pref("dom.events.coalesce.touchmove", true);

// supl server
pref("geo.gps.supl_server", "supl.google.com");
pref("geo.gps.supl_port", 7275);

// for device capability
pref("device.gps", true);

// Restore JS GC prefs to their default or android values.
pref("javascript.options.mem.gc_incremental_slice_ms", 5);
pref("javascript.options.mem.gc_compacting", true);
pref("javascript.options.mem.gc_high_frequency_time_limit_ms", 1000);
pref("javascript.options.mem.gc_low_frequency_heap_growth", 120);
pref("javascript.options.mem.high_water_mark", 32);
pref("javascript.options.mem.gc_allocation_threshold_mb", 10);
pref("javascript.options.mem.gc_max_empty_chunk_count", 30);

// Take into account the "drop" camera at the top.
pref("ui.status-top.enabled", true);
pref("ui.status-top-height", 34);
