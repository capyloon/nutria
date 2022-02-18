//! Debian specific support.
//!
//! Create a debian package with the following structure:
//!   /opt/b2gos
//!     |- start.sh
//!     |- api-daemon
//!     |       +- api-daemon
//!     |       +- config.toml
//!     |       +- default-settings.json
//!     |       +- http_root
//!     |              +- api
//!     |- b2ghald
//!     |       +- b2ghald
//!     |- webapps
//!     |       +- system
//!     |              +- application.zip
//!     |       +- shared
//!     |              +- application.zip
//!     |       +- homescreen
//!     |              +- application.zip
//!     |- b2g
//!     |    +- [all of gecko]
//!     |    +- defaults/pref/user.js
//!  /usr/share/xsessions/b2gos-session.desktop
//!  /usr/share/applications/
//!                  +- b2gos-mobile.desktop
//!                  +- b2gos-desktop.desktop
//!  /usr/lib/systemd/system/b2ghald.service

use crate::build_config::BuildConfig;
use crate::common::{DesktopCommand, DesktopParams};
use crate::daemon_config::DaemonConfigKind;
use crate::tasks::{PrepareDaemon, Task, ZipApp, USER_DESKTOP_JS};
use crate::timer::Timer;
use log::error;
use std::fs::{copy, create_dir_all, OpenOptions};
use std::io::{self, Write};
use std::os::unix::fs::OpenOptionsExt;
use std::path::{Path, PathBuf};
use std::process::Command;
use thiserror::Error;

static DESKTOP_DESKTOP: &str = include_str!("templates/debian/b2gos-desktop.desktop");
static MOBILE_DESKTOP: &str = include_str!("templates/debian/b2gos-mobile.desktop");
static SESSION_DESKTOP: &str = include_str!("templates/debian/b2gos-session.desktop");
static START_SH: &str = include_str!("templates/debian/start.sh");
static PRERM: &str = include_str!("templates/debian/prerm");
static PREINST: &str = include_str!("templates/debian/preinst");
static POSTINST: &str = include_str!("templates/debian/postinst");
static CONTROL: &str = include_str!("templates/debian/control");
static B2GHALD_SERVICE: &str = include_str!("templates/debian/b2ghald.service");

// TODO: Move to some configuration
static PACKAGE_NAME: &str = "capyloon";
static PACKAGE_VERSION: &str = "0.1";

#[derive(Error, Debug)]
pub enum DebianError {
    #[error("Io error: {0}")]
    Io(#[from] std::io::Error),
    #[error("Desktop command error: {0}")]
    DesktopCommand(#[from] crate::common::DesktopCommandError),
    #[error("Other error: {0}")]
    Other(String),
}

#[derive(clap::ArgEnum, PartialEq, Debug, Clone)]
pub enum DebianTarget {
    Desktop,
    Mobian,
}

impl Default for DebianTarget {
    fn default() -> Self {
        DebianTarget::Desktop
    }
}

impl DebianTarget {
    fn arch(&self) -> String {
        match &self {
            DebianTarget::Desktop => "x86_64-unknown-linux-gnu".to_owned(),
            DebianTarget::Mobian => "aarch64-unknown-linux-gnu".to_owned(),
        }
    }

    fn deb_arch(&self) -> String {
        match &self {
            DebianTarget::Desktop => "amd64".to_owned(),
            DebianTarget::Mobian => "arm64".to_owned(),
        }
    }
}

pub struct DebianCommand;

impl DesktopCommand for DebianCommand {
    fn install_app(config: &BuildConfig, app: &(String, PathBuf)) {
        // Install the apps under /opt/b2gos/webapps
        let task = ZipApp::new(config);
        if let Err(err) = task.run(app.clone()) {
            error!("ZipApp failed: {}", err);
        }
    }
}

macro_rules! template {
    ($template:expr, $path:expr, $perms:expr) => {
        if let Err(err) = Self::copy_template($template, &$path, $perms) {
            return Err(DebianError::Other(format!(
                "Failed to create {}: {}",
                $path.display(),
                err
            )));
        }
    };
}
impl DebianCommand {
    pub fn start(config: BuildConfig, device: &DebianTarget) -> Result<(), DebianError> {
        let mut config = config;
        let _timer = Timer::start_with_message(
            &format!("Debian {:?} package created", device),
            &format!("Creating {:?} debian package", device),
        );

        let output = config.output_path.clone(); //BuildConfig::default_output_path();
        let params = DesktopParams {
            packaged: true,
            no_run: true,
            dtype: None,
            size: None,
            debug: false,
        };
        Self::run(&config, params)?;

        // Copy the various templated files for desktop environment integration.
        template!(START_SH, output.join("start.sh"), Some(0o755));
        let default_output = BuildConfig::default_output_path().join("debian");
        let share = default_output.join("usr").join("share");
        let _ = create_dir_all(share.join("applications"));
        let _ = create_dir_all(share.join("xsessions"));

        template!(
            DESKTOP_DESKTOP,
            share.join("applications").join("b2gos-desktop.desktop"),
            None
        );
        template!(
            MOBILE_DESKTOP,
            share.join("applications").join("b2gos-mobile.desktop"),
            None
        );
        template!(
            SESSION_DESKTOP,
            share.join("xsessions").join("b2gos-session.desktop"),
            None
        );

        let opt_b2gos = default_output.join("opt").join("b2gos");

        // api-daemon: regular configuration and executable.
        let daemon_dir = opt_b2gos.join("api-daemon");
        config
            .set_output_path(&opt_b2gos)
            .expect("Failed to set api-daemon path");
        let task = PrepareDaemon::new(&config);
        task.run(DaemonConfigKind::DebianDesktop)
            .expect("Failed to prepare api-daemon");
        let _ = std::fs::copy(config.daemon_binary(), daemon_dir.join("api-daemon"))
            .expect("Failed to copy api-daemon binary");
        // Copy the default settings files to /opt/b2gos/api-daemon/default-settings.json
        let _ = std::fs::copy(
            config.default_settings,
            daemon_dir.join("default-settings.json"),
        )
        .expect("Failed to copy default-settings.json");

        // b2g
        let status = {
            let source = BuildConfig::b2g_package();
            let _timer = Timer::start_with_message("Gecko unpacked", "Unpacking gecko...");
            std::process::Command::new("tar")
                .arg("xf")
                .arg(format!("{}", source.display()))
                .arg("-C")
                .arg(format!("{}", opt_b2gos.display()))
                .status()
        };
        match status {
            Ok(exit) => {
                if exit.code() != Some(0) {
                    return Err(DebianError::Other(format!(
                        "Unexpected result code unpacking gecko: {}",
                        exit
                    )));
                }
            }
            Err(err) => {
                return Err(DebianError::Other(format!(
                    "Failed to unpack gecko: {}",
                    err
                )));
            }
        }

        // Add the default prefs file.
        let prefs_dir = opt_b2gos.join("b2g").join("defaults").join("pref");
        let _ = create_dir_all(&prefs_dir);
        template!(USER_DESKTOP_JS, prefs_dir.join("user.js"), None);

        // b2ghald
        let b2ghald_bin = BuildConfig::b2ghald_binary();
        let b2ghald_dir = opt_b2gos.join("b2ghald");
        let _ = create_dir_all(&b2ghald_dir);
        copy(b2ghald_bin, b2ghald_dir.join("b2ghald"))?;
        // Create /usr/lib/systemd/system/b2ghald.service
        let systemd = default_output
            .join("usr")
            .join("lib")
            .join("systemd")
            .join("system");
        let _ = create_dir_all(&systemd);
        template!(B2GHALD_SERVICE, systemd.join("b2ghald.service"), None);

        // Debian specific files.
        let debian_dir = default_output.join("DEBIAN");
        let _ = create_dir_all(&debian_dir);
        template!(PRERM, debian_dir.join("prerm"), Some(0o755));
        template!(PREINST, debian_dir.join("preinst"), Some(0o755));
        template!(POSTINST, debian_dir.join("postinst"), Some(0o755));

        // TODO: don't hardcode the architecture substitution.
        let control = CONTROL
            .replace("${PKG_NAME}", PACKAGE_NAME)
            .replace("${VERSION}", PACKAGE_VERSION)
            .replace("${ARCH}", &device.deb_arch());

        template!(&control, debian_dir.join("control"), None);

        let status = {
            let _timer = Timer::start_with_message("Debian packaging", "Starting Debian packaging");

            let package_path = default_output.join(&format!(
                "{}_{}_{}.deb",
                PACKAGE_NAME,
                device.arch(),
                PACKAGE_VERSION
            ));

            // dpkg-deb -Zxz --build ${PATH} ${ARCHIVE_NAME}.deb
            // Run dpkg-deb using -Zxz because the default is zstd on Ubuntu 21.10 but Mobian's dpkg is not
            // able to decompress zstd debs.
            Command::new("dpkg-deb")
                .arg("-Zxz")
                .arg("--build")
                .arg(format!("{}", default_output.display()))
                .arg(format!("{}", package_path.display()))
                .status()
        };
        match status {
            Ok(exit) => {
                if exit.code() != Some(0) {
                    error!("Unexpected result code running dpkg-deb: {}", exit);
                }
            }
            Err(err) => {
                error!("Failed to run dpkg-deb: {}", err);
            }
        }

        Ok(())
    }

    fn copy_template<P: AsRef<Path>>(
        template: &str,
        path: &P,
        perms: Option<u32>,
    ) -> Result<(), io::Error> {
        let mut options = OpenOptions::new();
        if let Some(perms) = perms {
            options.mode(perms);
        }

        let mut file = options.write(true).create(true).open(path)?;
        file.write_all(template.as_bytes())?;

        Ok(())
    }
}
