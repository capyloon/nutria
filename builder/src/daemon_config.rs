//! Representation of a daemon configuration file.
//! Instead of importing various crates defining sub-parts,
//! we define it fully here for simplicity.

use serde::{Deserialize, Serialize};
use std::path::{Path, PathBuf};

static CONFIG_DESKTOP: &str = include_str!("./templates/config-desktop.toml");
static CONFIG_DEBIAN_DESKTOP: &str = include_str!("templates/debian/config.toml");

#[derive(Debug)]
pub enum DaemonConfigKind {
    Desktop(PathBuf), // the output path
    DebianDesktop,
}

#[derive(Deserialize, Serialize)]
pub struct DaemonConfig {
    pub general: GeneralConfig,
    pub http: HttpConfig,
    pub vhost: VhostConfig,
    pub apps_service: AppsServiceConfig,
    pub procmanager_service: ProcManagerServiceConfig,
    pub content_manager: ContentManagerConfig,
    pub dweb: DwebConfig,
}

impl DaemonConfig {
    pub fn new(kind: DaemonConfigKind) -> Self {
        let mut config: Self = toml::from_str(match kind {
            DaemonConfigKind::Desktop(ref _path) => CONFIG_DESKTOP,
            DaemonConfigKind::DebianDesktop => CONFIG_DEBIAN_DESKTOP,
        })
        .expect("Invalid configuration file!");

        if let DaemonConfigKind::Desktop(ref path) = kind {
            config.set_paths(path);
        }
        config
    }

    // Configure the paths based on the main output one.
    pub fn set_paths(&mut self, output: &Path) {
        let daemon_path = output.join("api-daemon");
        let http_root = daemon_path.join("http_root");

        self.http.root_path = format!("{}", http_root.display());
        self.vhost.root_path = format!("{}", http_root.join("webapps").join("vroot").display());
        self.apps_service.data_path = format!("{}", http_root.join("webapps").display());

        self.general.remote_services_config = format!(
            "{}",
            daemon_path.join("remote").join("config.toml").display()
        );
        self.general.remote_services_path = format!("{}", daemon_path.join("remote").display());
        self.apps_service.root_path =
            format!("{}", output.join("profile").join("webapps").display());
        self.content_manager.storage_path = format!("{}", output.join("costaeres").display());
        self.dweb.storage_path = format!("{}", output.join("dweb").display());
    }
}

#[derive(Deserialize, Serialize)]
pub struct GeneralConfig {
    pub host: String,
    pub port: i16,
    pub message_max_time: u32,
    pub verbose_log: bool,
    pub log_path: String,
    pub remote_services_config: String,
    pub remote_services_path: String,
}

#[derive(Deserialize, Serialize)]
pub struct HttpConfig {
    root_path: String,
}

#[derive(Deserialize, Serialize)]
pub struct VhostConfig {
    root_path: String,
    csp: String,
    report_csp: bool,
}

#[derive(Deserialize, Serialize)]
pub struct AppsServiceConfig {
    root_path: String,
    data_path: String,
    uds_path: String,
    cert_type: String,
    updater_socket: String,
    user_agent: String,
    allow_remove_preloaded: bool,
}

#[derive(Deserialize, Serialize)]
pub struct ProcManagerServiceConfig {
    socket_path: String,
    hints_path: String,
}

#[derive(Deserialize, Serialize)]
pub struct ContentManagerConfig {
    storage_path: String,
    metadata_cache_capacity: usize,
}

#[derive(Deserialize, Serialize)]
pub struct DwebConfig {
    storage_path: String,
}
