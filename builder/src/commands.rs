//! High level commands.

use crate::build_config::BuildConfig;
use crate::common::{DesktopCommand, DesktopCommandError, DesktopParams};
use crate::tasks::{GetAppList, LinkApp, Task, ZipApp};
use crate::timer::Timer;
use log::{error, info};
use mozdevice::{AndroidStorageInput, Device, Host, UnixPath};
use std::collections::HashMap;
use std::path::Path;
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
    ) -> Result<(), DesktopCommandError> {
        info!("Starting production build...");
        let params = DesktopParams {
            packaged: true,
            no_run: false,
            dtype,
            size,
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
    ) -> Result<(), DesktopCommandError> {
        info!("Starting development build...");
        let params = DesktopParams {
            packaged: false,
            no_run: false,
            dtype,
            size,
        };
        Self::run(&config, params)
    }
}

trait AdbCommand {
    fn init_adb(&self, needs_root: bool) {
        let host = Host::default();
        match host.device_or_default::<String>(None, AndroidStorageInput::Auto) {
            Ok(device) => {
                if needs_root && !device.is_rooted {
                    error!("Device is not rooted, run `adb root` first");
                    return;
                }
                self.run_on_device(&device);
            }
            Err(err) => error!("Failed to find adb device: {}", err),
        }
    }

    fn run_on_device(&self, device: &Device);

    fn run_shell_command(&self, device: &Device, command: &str) -> Option<String> {
        match device.execute_host_shell_command(command) {
            Ok(res) => {
                let output = res.trim();
                info!("{}: [Success] {}", command, output);
                Some(output.to_owned())
            }
            Err(err) => {
                error!("Failed to run '{}' : {}", command, err);
                None
            }
        }
    }
}

// Command that resets all storage on device.
pub struct ResetDataCommand;

impl ResetDataCommand {
    pub fn start() -> Result<(), String> {
        let cmd = ResetDataCommand;
        cmd.init_adb(true);
        Ok(())
    }
}

impl AdbCommand for ResetDataCommand {
    fn run_on_device(&self, device: &Device) {
        info!("Using adb connected device: {}", device.serial);

        let commands = [
            "stop b2g",
            "mkdir -p /data/b2g/dummy",
            "rm -r /data/b2g",
            "rm -r /cache/cache2",
            "stop api-daemon",
            "rm -r /mnt/runtime/default/emulated/costaeres",
            "rm /data/local/service/api-daemon/*.sqlite*",
            "start api-daemon",
            "start b2g",
        ];
        for command in commands {
            match device.execute_host_shell_command(command) {
                Ok(res) => info!("{}: [Success] {}", command, res.trim()),
                Err(err) => {
                    error!("Failed to run '{}' : {}", command, err);
                    return;
                }
            }
        }
    }
}

// Command that resets time on device.
// Equivalent to the command: "adb shell date @`date +%s`"
pub struct ResetTimeCommand;

impl ResetTimeCommand {
    pub fn start() -> Result<(), String> {
        let cmd = ResetTimeCommand;
        cmd.init_adb(true);
        Ok(())
    }
}

impl AdbCommand for ResetTimeCommand {
    fn run_on_device(&self, device: &Device) {
        use std::time::{SystemTime, UNIX_EPOCH};

        match SystemTime::now().duration_since(UNIX_EPOCH) {
            Ok(duration) => {
                let command = format!("date @{}", duration.as_secs());
                match device.execute_host_shell_command(&command) {
                    Ok(res) => info!("{}: [Success] {}", command, res.trim()),
                    Err(err) => error!("Failed to run '{}' : {}", command, err),
                }
            }
            Err(err) => error!("Failed to get seconds since UNIX EPOCH: {}", err),
        }
    }
}

// Push a set of apps to the device.
// This is done using appcmd to properly deal with the apps service and vhost state
// without needing a restart.
pub struct PushCommand {
    apps: Vec<PathBuf>,      // The list of app paths.
    system_update: bool, // Special case if we are updating the system app, since that requires a b2g restart
    homescreen_update: bool, // Special case if we are updating the homescreen, we'll have to kill it to force a restart.
    appscmd: PathBuf,
}

impl PushCommand {
    fn new(config: BuildConfig, requested_apps: &Option<String>) -> Self {
        // Get the list of possible apps.
        let task = GetAppList::new(&config);
        let app_list = task.run(()).unwrap_or_default();

        let mut source_apps = HashMap::new();
        app_list.iter().for_each(|(name, path)| {
            source_apps.insert(name, path.clone());
        });

        let mut system_update = false;
        let mut homescreen_update = false;

        // The resulting list is the intersection of the requested and available apps.
        let apps = match requested_apps {
            None => app_list.iter().map(|item| item.1.clone()).collect(),
            Some(requested_apps) => {
                let list: Vec<String> = requested_apps.split(',').map(|s| s.to_owned()).collect();
                let mut res = vec![];
                for app_name in list {
                    if let Some(path) = source_apps.get(&app_name) {
                        res.push(path.clone());
                        if app_name == "system" {
                            system_update = true;
                        }
                        if app_name == "homescreen" {
                            homescreen_update = true;
                        }
                    } else {
                        error!("Requested app '{}' unknown.", app_name);
                    }
                }
                res
            }
        };

        info!("Will push apps: {:?}", apps);
        Self {
            apps,
            system_update,
            homescreen_update,
            appscmd: config.appscmd_binary(),
        }
    }

    fn push_apps(&self) {
        for app in &self.apps {
            let status = {
                let _timer = Timer::start(&format!("Pushing {}", app.display()));
                std::process::Command::new(&self.appscmd)
                    .arg("install")
                    .arg(&format!("{}", app.display()))
                    .status()
            };
            match status {
                Ok(exit) => {
                    if exit.code() == Some(0) {
                        info!("Success pushing {}", app.display());
                    } else {
                        error!("Failed to push {}, exit code: {}", app.display(), exit);
                    }
                }
                Err(err) => {
                    error!("Failed to push {}: {}", app.display(), err);
                }
            }
        }
    }

    pub fn start(config: BuildConfig, requested_apps: &Option<String>) -> Result<(), String> {
        let cmd = PushCommand::new(config, requested_apps);
        cmd.push_apps();
        if cmd.system_update || cmd.homescreen_update {
            cmd.init_adb(true);
        }
        Ok(())
    }
}

impl AdbCommand for PushCommand {
    fn run_on_device(&self, device: &Device) {
        if self.system_update {
            info!("Restarting b2g to update system app.");
            for command in ["stop b2g", "start b2g"] {
                match device.execute_host_shell_command(command) {
                    Ok(res) => info!("{}: [Success] {}", command, res.trim()),
                    Err(err) => {
                        error!("Failed to run '{}' : {}", command, err);
                        return;
                    }
                }
            }
        } else if self.homescreen_update {
            if let Some(output) = self.run_shell_command(device, "b2g-info") {
                for line in output.split('\n') {
                    let parts: Vec<String> = line.trim().split(' ').map(|s| s.to_owned()).collect();
                    if parts.len() >= 2 && parts[0] == "homescreen" {
                        let pid: u32 = parts[1].parse().unwrap_or(0);
                        if pid != 0 {
                            self.run_shell_command(device, &format!("kill -9 {}", pid));
                        }
                    }
                }
            }
        }
    }
}

// Command that restarts the api-daemon and b2g.
pub struct RestartCommand;

impl RestartCommand {
    pub fn start() -> Result<(), String> {
        let cmd = RestartCommand;
        cmd.init_adb(true);
        Ok(())
    }
}

impl AdbCommand for RestartCommand {
    fn run_on_device(&self, device: &Device) {
        for command in [
            "stop b2g",
            "stop api-daemon",
            "start api-daemon",
            "start b2g",
        ] {
            match device.execute_host_shell_command(command) {
                Ok(res) => info!("{}: [Success] {}", command, res.trim()),
                Err(err) => {
                    error!("Failed to run '{}' : {}", command, err);
                    return;
                }
            }
        }
    }
}

// Command to push a Gecko package to a gonk device.
pub struct PushB2gCommand {
    path: PathBuf,
}

impl PushB2gCommand {
    pub fn start<P: AsRef<Path>>(path: P) -> Result<(), String> {
        let path = path.as_ref();
        if !path.exists() {
            return Err(format!("No such file: {}", path.display()));
        }

        let cmd = PushB2gCommand {
            path: path.to_path_buf(),
        };
        cmd.unpack();
        Ok(())
    }

    fn unpack(&self) {
        let unpack_dest = std::env::temp_dir().join("nutria").join("gecko");
        // Try to remove any old one, and recreate it.
        let _ = std::fs::remove_dir_all(&unpack_dest);
        let _ = std::fs::create_dir_all(&unpack_dest);

        let status = {
            let _timer = Timer::start_with_message("Gecko unpacked", "Unpacking gecko...");
            std::process::Command::new("tar")
                .arg("xf")
                .arg(format!("{}", self.path.display()))
                .arg("-C")
                .arg(format!("{}", unpack_dest.display()))
                .status()
        };
        match status {
            Ok(exit) => {
                if exit.code() == Some(0) {
                    self.init_adb(true);
                } else {
                    error!("Unexpected result code: {}", exit);
                }
            }
            Err(err) => {
                error!("Failed to unpack gecko: {}", err);
            }
        }
    }

    fn run_command(&self, command: &str, device: &Device) -> bool {
        match device.execute_host_shell_command(command) {
            Ok(res) => info!("{}: [Success] {}", command, res.trim()),
            Err(err) => {
                error!("Failed to run '{}' : {}", command, err);
                return false;
            }
        }
        true
    }
}

impl AdbCommand for PushB2gCommand {
    fn run_on_device(&self, device: &Device) {
        let _timer = Timer::start_with_message("Gecko pushed", "Pushing Gecko...");

        let source = std::env::temp_dir()
            .join("nutria")
            .join("gecko")
            .join("b2g");

        if self.run_command("stop b2g", device) {
            if let Err(err) = device.push_dir(&source, UnixPath::new("/system/b2g"), 0o777) {
                error!("Failed to push gecko: {}", err);
            }
            self.run_command("start b2g", device);
        }
    }
}
