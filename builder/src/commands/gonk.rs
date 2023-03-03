/// Gonk specific commands: device commands relying on ADB
use crate::build_config::BuildConfig;
use crate::timer::Timer;
use log::{error, info};
use mozdevice::{AndroidStorageInput, Device, Host, UnixPath};
use std::path::{Path, PathBuf};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum AdbError {
    #[error("No device found")]
    NoDeviceFound,
    #[error("Device error: {0}")]
    Device(mozdevice::DeviceError),
    #[error("Device is not rooted, run `adb root` first")]
    NotRooted,
    #[error("Other error: {0}")]
    Other(String),
    #[error("Error pushing apps: {0}")]
    AppsPush(String),
}

trait AdbCommand {
    fn init_adb(&self, needs_root: bool) -> Result<(), AdbError> {
        let host = Host::default();
        match host.device_or_default::<String>(None, AndroidStorageInput::Auto) {
            Ok(device) => {
                if needs_root && !device.is_rooted {
                    return Err(AdbError::NotRooted);
                }
                self.run_on_device(&device)
            }
            Err(err) => {
                error!("Failed to find adb device: {}", err);
                Err(AdbError::Device(err))
            }
        }
    }

    fn run_on_device(&self, device: &Device) -> Result<(), AdbError>;

    fn run_shell_command(&self, device: &Device, command: &str) -> Result<String, AdbError> {
        match device.execute_host_shell_command(command) {
            Ok(res) => {
                let output = res.trim();
                info!("{}: [Success] {}", command, output);
                Ok(output.to_owned())
            }
            Err(err) => Err(AdbError::Device(err)),
        }
    }
}

// Command that resets all storage on device.
pub struct ResetDataCommand;

impl ResetDataCommand {
    pub fn start() -> Result<(), AdbError> {
        let _ = detect_device()?;
        let cmd = Self;
        cmd.init_adb(true)
    }
}

impl AdbCommand for ResetDataCommand {
    fn run_on_device(&self, device: &Device) -> Result<(), AdbError> {
        info!("Using adb connected device: {}", device.serial);

        let commands = [
            "stop b2g",
            "mkdir -p /data/b2g/dummy",
            "rm -r /data/b2g",
            "rm -r /cache/cache2",
            "stop api-daemon",
            "rm -r /mnt/runtime/default/emulated/costaeres",
            "rm /data/local/service/api-daemon/*.sqlite*",
            "rm -r /data/local/webapps",
            "start api-daemon",
            "start b2g",
        ];
        for command in commands {
            match device.execute_host_shell_command(command) {
                Ok(res) => info!("{}: [Success] {}", command, res.trim()),
                Err(err) => {
                    error!("Failed to run '{}' : {}", command, err);
                    return Err(AdbError::Device(err));
                }
            }
        }
        Ok(())
    }
}

// Command that clears the cache on device.
pub struct ClearCacheCommand;

impl ClearCacheCommand {
    pub fn start() -> Result<(), AdbError> {
        let _ = detect_device()?;
        let cmd = Self;
        cmd.init_adb(true)
    }
}

impl AdbCommand for ClearCacheCommand {
    fn run_on_device(&self, device: &Device) -> Result<(), AdbError> {
        info!("Using adb connected device: {}", device.serial);

        let commands = [
            "stop b2g",
            "rm -r /cache/cache2",
            "stop api-daemon",
            "start api-daemon",
            "start b2g",
        ];
        for command in commands {
            match device.execute_host_shell_command(command) {
                Ok(res) => info!("{}: [Success] {}", command, res.trim()),
                Err(err) => {
                    error!("Failed to run '{}' : {}", command, err);
                    return Err(AdbError::Device(err));
                }
            }
        }
        Ok(())
    }
}

// Command that resets time on device.
// Equivalent to the command: "adb shell date @`date +%s`"
pub struct ResetTimeCommand;

impl ResetTimeCommand {
    pub fn start() -> Result<(), AdbError> {
        let _ = detect_device()?;
        let cmd = Self;
        cmd.init_adb(true)
    }
}

impl AdbCommand for ResetTimeCommand {
    fn run_on_device(&self, device: &Device) -> Result<(), AdbError> {
        use std::time::{SystemTime, UNIX_EPOCH};

        match SystemTime::now().duration_since(UNIX_EPOCH) {
            Ok(duration) => {
                let command = format!("date @{}", duration.as_secs());
                match device.execute_host_shell_command(&command) {
                    Ok(res) => {
                        info!("{}: [Success] {}", command, res.trim());
                        Ok(())
                    }
                    Err(err) => {
                        error!("Failed to run '{}' : {}", command, err);
                        Err(AdbError::Device(err))
                    }
                }
            }
            Err(err) => Err(AdbError::Other(format!(
                "Failed to get seconds since UNIX EPOCH: {}",
                err
            ))),
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
    fn new(config: &BuildConfig, requested_apps: &Option<String>) -> Self {
        let data = crate::commands::common::PushedApps::new(config, requested_apps);
        Self {
            apps: data.apps,
            system_update: data.system_update,
            homescreen_update: data.homescreen_update,
            appscmd: config.appscmd_binary(),
        }
    }

    fn push_apps(&self) -> Result<(), AdbError> {
        let mut failed = vec![];
        for app in &self.apps {
            let app_name = app
                .file_name()
                .unwrap_or_else(|| std::ffi::OsStr::new("<no app name>"))
                .to_string_lossy();
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
                        info!("Success pushing {}", app_name);
                    } else {
                        error!("Failed to push {}, exit code: {}", app_name, exit);
                        failed.push(app_name);
                    }
                }
                Err(err) => {
                    error!("Failed to push {}: {}", app_name, err);
                    failed.push(app_name);
                }
            }
        }
        if !failed.is_empty() {
            return Err(AdbError::AppsPush(failed.join(",")));
        }
        Ok(())
    }

    pub fn start(config: &BuildConfig, requested_apps: &Option<String>) -> Result<(), AdbError> {
        let _ = detect_device()?;
        let cmd = PushCommand::new(config, requested_apps);
        cmd.push_apps()?;
        if cmd.system_update || cmd.homescreen_update {
            return cmd.init_adb(true);
        }
        Ok(())
    }
}

impl AdbCommand for PushCommand {
    fn run_on_device(&self, device: &Device) -> Result<(), AdbError> {
        if self.system_update {
            info!("Restarting b2g because of the system app update.");
            for command in ["stop b2g", "start b2g"] {
                match device.execute_host_shell_command(command) {
                    Ok(res) => info!("{}: [Success] {}", command, res.trim()),
                    Err(err) => {
                        error!("Failed to run '{}' : {}", command, err);
                        return Err(AdbError::Device(err));
                    }
                }
            }
        } else if self.homescreen_update {
            match self.run_shell_command(device, "b2g-info") {
                Ok(output) => {
                    for line in output.split('\n') {
                        let parts: Vec<String> =
                            line.split_whitespace().map(|s| s.to_owned()).collect();
                        if parts.len() >= 2 && parts[0] == "homescreen" {
                            let pid: u32 = parts[1].parse().unwrap_or(0);
                            if pid != 0 {
                                self.run_shell_command(device, &format!("kill -9 {}", pid))?;
                            }
                        }
                    }
                }
                Err(err) => return Err(err),
            }
        }
        Ok(())
    }
}

// Command that restarts the api-daemon and b2g.
pub struct RestartCommand;

impl RestartCommand {
    pub fn start() -> Result<(), AdbError> {
        let _ = detect_device()?;
        let cmd = Self;
        cmd.init_adb(true)
    }
}

impl AdbCommand for RestartCommand {
    fn run_on_device(&self, device: &Device) -> Result<(), AdbError> {
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
                    return Err(AdbError::Device(err));
                }
            }
        }
        Ok(())
    }
}

// Command to push a Gecko package to a gonk device.
pub struct PushB2gCommand {
    path: PathBuf,
}

impl PushB2gCommand {
    pub fn start<P: AsRef<Path>>(path: P) -> Result<(), AdbError> {
        let _ = detect_device()?;
        let path = path.as_ref();
        if !path.exists() {
            return Err(AdbError::Other(format!("No such file: {}", path.display())));
        }

        let cmd = PushB2gCommand {
            path: path.to_path_buf(),
        };
        cmd.unpack()
    }

    fn unpack(&self) -> Result<(), AdbError> {
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
                    self.init_adb(true)
                } else {
                    Err(AdbError::Other(format!("Unexpected result code: {}", exit)))
                }
            }
            Err(err) => Err(AdbError::Other(format!("Failed to unpack gecko: {}", err))),
        }
    }

    fn run_command(&self, command: &str, device: &Device) -> Result<(), AdbError> {
        match device.execute_host_shell_command(command) {
            Ok(res) => {
                info!("{}: [Success] {}", command, res.trim());
                Ok(())
            }
            Err(err) => {
                error!("Failed to run '{}' : {}", command, err);
                Err(AdbError::Device(err))
            }
        }
    }
}

impl AdbCommand for PushB2gCommand {
    fn run_on_device(&self, device: &Device) -> Result<(), AdbError> {
        let _timer = Timer::start_with_message("Gecko pushed", "Pushing Gecko...");

        let source = std::env::temp_dir()
            .join("nutria")
            .join("gecko")
            .join("b2g");

        self.run_command("stop b2g", device)?;
        if let Err(err) = device.push_dir(&source, UnixPath::new("/system/b2g"), 0o777) {
            error!("Failed to push gecko: {}", err);
            return Err(AdbError::Device(err));
        }
        self.run_command("start b2g", device)
    }
}

// Returns a description of the first connected android device.
pub fn detect_device() -> Result<String, AdbError> {
    let host = Host::default();
    let devices = host.devices::<Vec<_>>().map_err(AdbError::Device)?;
    if !devices.is_empty() {
        let device = &devices[0];
        let info = &device.info;
        let desc = info.get("model").map(String::clone).unwrap_or_else(|| {
            info.get("product").map(String::clone).unwrap_or_else(|| {
                info.get("device")
                    .map(String::clone)
                    .unwrap_or_else(|| "<none>".to_owned())
            })
        });
        Ok(format!("{} ({})", device.serial, desc))
    } else {
        Err(AdbError::NoDeviceFound)
    }
}
