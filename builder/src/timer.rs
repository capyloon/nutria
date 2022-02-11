//! A scoped timer.
use log::info;
use std::time::Instant;

pub(crate) struct Timer {
    start: Instant,
    name: String,
}

impl Timer {
    pub fn start(name: &str) -> Self {
        Self {
            name: name.into(),
            start: Instant::now(),
        }
    }

    pub fn start_with_message(name: &str, message: &str) -> Self {
        info!("{}", message);
        Self {
            name: name.into(),
            start: Instant::now(),
        }
    }
}

impl Drop for Timer {
    fn drop(&mut self) {
        let elapsed = self.start.elapsed();
        if elapsed.as_secs() == 0 {
            info!("{} ⏱️  {}ms", self.name, elapsed.as_millis());
        } else {
            info!("{} ⏱️  {:.1}s", self.name, elapsed.as_secs_f32());
        }
    }
}
