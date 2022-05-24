use indicatif::ProgressBar;
use std::time::Duration;

fn main() {
    let progress = ProgressBar::new(10);
    for _ in 0..10 {
        progress.inc(1);
        std::thread::sleep(Duration::from_secs(1));
    }
    progress.finish();
}
