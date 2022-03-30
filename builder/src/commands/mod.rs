pub mod common;
pub mod desktop;
pub mod gonk;
pub mod linux;

use crate::build_config::BuildConfig;
use log::error;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum DeviceError {
    #[error("No device found")]
    NoDeviceFound,
    #[error("Multiple devices found")]
    MultipleDeviceFound,
    #[error("ADB error: {0}")]
    Adb(#[from] gonk::AdbError),
    #[error("Linux error: {0}")]
    Linux(#[from] linux::LinuxError),
}

// Common entry points for commands that are available both for Gonk and Linux.
pub fn push(config: BuildConfig, requested_apps: &Option<String>) -> Result<(), DeviceError> {
    let has_gonk = gonk::detect_device();
    let has_linux = linux::detect_device();

    match (has_gonk, has_linux) {
        (Err(_), Err(_)) => {
            error!("No device detected!");
            return Err(DeviceError::NoDeviceFound);
        }
        (Ok(gonk_device), Ok(linux_device)) => {
            error!(
                "Multiple devices detected:\n\tGonk: {}\n\tLinux: {}",
                gonk_device, linux_device
            );
            return Err(DeviceError::MultipleDeviceFound);
        }
        (Ok(_), Err(_)) => {
            // Gonk device present.
            let _ = gonk::PushCommand::start(config, requested_apps)?;
        }
        (Err(_), Ok(_)) => {
            // Linux device present.
            let _ = linux::push_apps(config, requested_apps)?;
        }
    }

    Ok(())
}
