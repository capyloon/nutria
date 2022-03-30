//! Local commands running on the desktop host.

use crate::build_config::BuildConfig;
use crate::common::{DesktopCommand, DesktopCommandError, DesktopParams};
use crate::tasks::{LinkApp, Task, ZipApp};
use log::{error, info};
use std::path::PathBuf;

// Production mode specific implementation: package apps.
pub struct ProdCommand;

impl DesktopCommand for ProdCommand {
    fn install_app(config: &BuildConfig, app: &(String, PathBuf)) {
        let task = ZipApp::new(config);
        if let Err(err) = task.run(app.clone()) {
            error!("ZipApp failed: {}", err);
        }
    }
}

impl ProdCommand {
    pub fn start(
        config: BuildConfig,
        dtype: Option<String>,
        size: Option<String>,
        debug: bool,
    ) -> Result<(), DesktopCommandError> {
        info!("Starting production build...");
        let params = DesktopParams {
            packaged: true,
            no_run: false,
            dtype,
            size,
            debug,
        };
        Self::run(&config, params)
    }
}

// Install packaged apps into a given directory.
pub struct InstallCommand;

impl DesktopCommand for InstallCommand {
    fn install_app(config: &BuildConfig, app: &(String, PathBuf)) {
        let task = ZipApp::new(config);
        if let Err(err) = task.run(app.clone()) {
            error!("ZipApp failed: {}", err);
        }
    }
}

impl InstallCommand {
    pub fn start(config: BuildConfig) -> Result<(), DesktopCommandError> {
        info!("Installing packaged...");
        let params = DesktopParams {
            packaged: true,
            no_run: true,
            dtype: None,
            size: None,
            debug: false,
        };
        Self::run(&config, params)
    }
}

// Development mode specific implementation: create symlinks for apps.
pub struct DevCommand;

impl DesktopCommand for DevCommand {
    fn install_app(config: &BuildConfig, app: &(String, PathBuf)) {
        let task = LinkApp::new(config);
        if let Err(err) = task.run(app.clone()) {
            error!("LinkApp failed: {}", err);
        }
    }
}

impl DevCommand {
    pub fn start(
        config: BuildConfig,
        dtype: Option<String>,
        size: Option<String>,
        debug: bool,
    ) -> Result<(), DesktopCommandError> {
        info!("Starting development build...");
        let params = DesktopParams {
            packaged: false,
            no_run: false,
            dtype,
            size,
            debug,
        };
        Self::run(&config, params)
    }
}
