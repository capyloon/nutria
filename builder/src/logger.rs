/// A Custom logger
use log::Level;
use std::io::Write;

pub fn init() {
    env_logger::builder()
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
