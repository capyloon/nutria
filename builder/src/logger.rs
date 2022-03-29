/// A Custom logger
use log::{Level, LevelFilter};
use std::io::Write;

pub fn init() {
    env_logger::builder()
        .filter_module("mozdevice", LevelFilter::Error)
        .filter_module("rustls::check", LevelFilter::Error)
        .format(|buf, record| {
            let emoji = match record.level() {
                Level::Error => "🔴",
                Level::Warn => "🟡",
                Level::Info => "🟢",
                Level::Debug => "🔵",
                Level::Trace => "🟣",
            };
            writeln!(buf, "{} {}", emoji, record.args())
        })
        .init();
}
