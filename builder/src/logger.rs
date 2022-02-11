/// A Custom logger
use std::io::Write;
use log::Level;

pub fn init() {
    env_logger::builder()
        .format(|buf, record| {
            let emoji = match record.level() {
                Level::Error => "🚫",
                Level::Warn => "⚠️",
                Level::Info => "👍",
                Level::Debug=> "🪲",
                Level::Trace=> "🐛",
                
            };
            writeln!(buf, "{} {}", emoji, record.args())
        })
        .init();
}
