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

fn gonk_or_linux<F, G>(when_gonk: F, when_linux: G) -> Result<(), DeviceError>
where
    F: FnOnce() -> Result<(), DeviceError>,
    G: FnOnce() -> Result<(), DeviceError>,
{
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
            return when_gonk();
        }
        (Err(_), Ok(_)) => {
            // Linux device present.
            return when_linux();
        }
    }
}

// Common entry points for commands that are available both for Gonk and Linux.
pub fn push(config: BuildConfig, requested_apps: &Option<String>) -> Result<(), DeviceError> {
    gonk_or_linux(
        || {
            let _ = gonk::PushCommand::start(&config, requested_apps)?;
            Ok(())
        },
        || {
            let _ = linux::push_apps(&config, requested_apps)?;
            Ok(())
        },
    )
}

pub fn restart() -> Result<(), DeviceError> {
    gonk_or_linux(
        || {
            let _ = gonk::RestartCommand::start()?;
            Ok(())
        },
        || {
            let _ = linux::restart()?;
            Ok(())
        },
    )
}

pub fn reset_data() -> Result<(), DeviceError> {
    gonk_or_linux(
        || {
            let _ = gonk::ResetDataCommand::start()?;
            Ok(())
        },
        || {
            let _ = linux::reset_data()?;
            Ok(())
        },
    )
}

pub fn reset_time() -> Result<(), DeviceError> {
    gonk_or_linux(
        || {
            let _ = gonk::ResetTimeCommand::start()?;
            Ok(())
        },
        || {
            let _ = linux::reset_time()?;
            Ok(())
        },
    )
}
