//! Defines the configuration context available to all build steps.
//! Values are infered from environment variables to change the defaults.
//! All paths are turned into absolute ones.

use crate::common::host_target;
use log::info;
use std::env;
use std::fs::{self, File};
use std::{
    path::{Path, PathBuf},
    str::FromStr,
};

pub const DEFAULT_HTTP_PORT: i16 = 80;

#[derive(Clone, Debug)]
pub struct BuildConfig {
    pub apps_source_path: PathBuf, // Directory where the apps are stored.
    pub output_path: PathBuf,      // Directory where build artifacts will be created.
    pub daemon_path: PathBuf,      // Path to the api-daemon directory.
    pub daemon_port: i16,          // Port on which the daemon will listen.
    pub b2g_path: PathBuf,         // Path to the b2g binary
    pub use_profile: bool,         // Whether we will add the profile/ subdirectory or not.
    pub default_settings: PathBuf, // Path to the defaults settings file.
    pub templates_path: PathBuf,   // Path to the templates.
}

impl Default for BuildConfig {
    /// The default configuration uses the following values:
    /// $CWD/apps for apps_path
    /// $CWD/output for output_path
    /// $CWD/prebuilts/$RUST_TARGET/api-daemon for daemon_path
    fn default() -> Self {
        let cwd = env::current_dir().unwrap_or_else(|_| env::temp_dir());

        let templates_path = cwd.join("src").join("templates");

        let default_settings = cwd
            .parent()
            .unwrap()
            .join("defaults")
            .join("default-settings.json");

        let apps_source_path = match env::var("NUTRIA_APPS_ROOT") {
            Ok(path) => PathBuf::from_str(&path)
                .unwrap_or_else(|_| panic!("Invalid NUTRIA_APPS_ROOT path: {}", path)),
            Err(_) => cwd.join("apps"),
        };

        let output_path = Self::default_output_path();

        let b2g_path = match env::var("NUTRIA_B2G_BINARY") {
            Ok(path) => PathBuf::from_str(&path)
                .unwrap_or_else(|_| panic!("Invalid NUTRIA_B2G_BINARY path: {}", path)),
            Err(_) => cwd.join("b2g"),
        };

        let daemon_path = match env::var("NUTRIA_API_DAEMON_ROOT") {
            Ok(path) => PathBuf::from_str(&path)
                .unwrap_or_else(|_| panic!("Invalid NUTRIA_API_DAEMON_ROOT path: {}", path)),
            Err(_) => cwd,
        };

        let daemon_port = match env::var("NUTRIA_API_DAEMON_PORT") {
            Ok(value) => value.parse().unwrap_or(DEFAULT_HTTP_PORT),
            Err(_) => DEFAULT_HTTP_PORT,
        };

        Self {
            apps_source_path,
            output_path,
            daemon_path,
            daemon_port,
            b2g_path,
            use_profile: true,
            default_settings,
            templates_path,
        }
    }
}

impl BuildConfig {
    /// Ensure that the required path and files exists.
    pub fn validate(&self) -> Result<(), std::io::Error> {
        let _ = File::open(&self.apps_source_path)?;

        if File::open(&self.output_path).is_err() {
            fs::create_dir_all(&self.output_path)?;
        }

        let _ = File::open(&self.daemon_path)?;

        Ok(())
    }

    pub fn log(&self) {
        info!("Apps source path: {}", self.apps_source_path.display());
        info!("Output path     : {}", self.output_path.display());
        info!("API Daemon path : {}", self.daemon_path.display());
        info!("API Daemon port : {}", self.daemon_port);
        info!("B2G binary path : {}", self.b2g_path.display());
    }

    pub fn set_output_name(&mut self, name: &str) -> Result<(), std::io::Error> {
        self.output_path = self.output_path.join(name);
        fs::create_dir_all(&self.output_path)
    }

    pub fn set_output_path<P: AsRef<Path>>(&mut self, path: P) -> Result<(), std::io::Error> {
        self.use_profile = false;
        self.output_path = path.as_ref().to_path_buf();
        fs::create_dir_all(&self.output_path)
    }

    pub fn daemon_binary(&self) -> PathBuf {
        match env::var("NUTRIA_API_DAEMON_BINARY") {
            Ok(path) => PathBuf::from_str(&path)
                .unwrap_or_else(|_| panic!("Invalid NUTRIA_API_DAEMON_BINARY path: {}", path)),
            Err(_) => self
                .daemon_path
                .join("prebuilts")
                .join(host_target())
                .join("api-daemon"),
        }
    }

    pub fn appscmd_binary(&self) -> PathBuf {
        match env::var("NUTRIA_APPSCMD_BINARY") {
            Ok(path) => PathBuf::from_str(&path)
                .unwrap_or_else(|_| panic!("Invalid NUTRIA_APPSCMD_BINARY path: {}", path)),
            Err(_) => self
                .daemon_path
                .join("prebuilts")
                .join(host_target())
                .join("appscmd"),
        }
    }

    pub fn ipfsd_binary(&self) -> PathBuf {
        match env::var("NUTRIA_IPFSD_BINARY") {
            Ok(path) => PathBuf::from_str(&path)
                .unwrap_or_else(|_| panic!("Invalid NUTRIA_IPFSD_BINARY path: {}", path)),
            Err(_) => self
                .daemon_path
                .join("prebuilts")
                .join(host_target())
                .join("ipfsd"),
        }
    }

    pub fn iroh_config(&self) -> PathBuf {
        match env::var("NUTRIA_IPFSD_CONFIG") {
            Ok(path) => PathBuf::from_str(&path)
                .unwrap_or_else(|_| panic!("Invalid NUTRIA_IPFSD_CONFIG path: {}", path)),
            Err(_) => {
                let cwd = env::current_dir().unwrap_or_else(|_| env::temp_dir());
                cwd.parent().unwrap().join("defaults").join("ipfsd.toml")
            }
        }
    }

    pub fn default_output_path() -> PathBuf {
        let cwd = env::current_dir().unwrap_or_else(|_| env::temp_dir());
        match env::var("NUTRIA_OUPUT_ROOT") {
            Ok(path) => PathBuf::from_str(&path)
                .unwrap_or_else(|_| panic!("Invalid NUTRIA_OUPUT_ROOT path: {}", path)),
            Err(_) => cwd.join("output"),
        }
    }

    pub fn b2g_package() -> PathBuf {
        match env::var("NUTRIA_B2G_PACKAGE") {
            Ok(path) => PathBuf::from_str(&path)
                .unwrap_or_else(|_| panic!("Invalid NUTRIA_B2G_PACKAGE path: {}", path)),
            Err(_) => {
                panic!("Please set NUTRIA_B2G_PACKAGE to the path of the b2g package.");
            }
        }
    }

    pub fn b2ghald_binary() -> PathBuf {
        match env::var("NUTRIA_B2GHALD_BINARY") {
            Ok(path) => PathBuf::from_str(&path)
                .unwrap_or_else(|_| panic!("Invalid NUTRIA_B2GHALD_BINARY path: {}", path)),
            Err(_) => {
                panic!("Please set NUTRIA_B2GHALD_BINARY to the path of the b2ghald executable.");
            }
        }
    }

    pub fn b2ghalctl_binary() -> PathBuf {
        match env::var("NUTRIA_B2GHALCTL_BINARY") {
            Ok(path) => PathBuf::from_str(&path)
                .unwrap_or_else(|_| panic!("Invalid NUTRIA_B2GHALCTL_BINARY path: {}", path)),
            Err(_) => {
                panic!(
                    "Please set NUTRIA_B2GHALCTL_BINARY to the path of the b2ghalctl executable."
                );
            }
        }
    }
}
