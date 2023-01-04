/// Linux specific commands: device commands for remote linux hosts.
/// We use ssh and scp to discover and communicate with the target device.
use crate::build_config::BuildConfig;
use crate::timer::Timer;
use log::{error, info};
use std::env;
use std::io::Error as IoError;
use std::path::{Path, PathBuf};
use std::process::{Command, Output};
use std::time::{SystemTime, UNIX_EPOCH};
use thiserror::Error;

static DEFAULT_LINUX_USER: &str = "mobian";
static DEFAULT_LINUX_HOST: &str = "pinephone";

#[derive(Error, Debug)]
pub enum LinuxError {
    #[error("No device found")]
    NoDeviceFound,
    #[error("Bad Command: {0}")]
    BadCommand(String),
    #[error("Error pushing apps: {0}")]
    AppsPush(String),
    #[error("I/O error: {0}")]
    Io(#[from] IoError),
    #[error("scp failed: {0}")]
    Scp(String),
    #[error("Other error: {0}")]
    Other(String),
}

// A Command-like struct that relies on a ssh connection.
struct SshCommand {
    command: Command,
    args: String,
    ssh_args: String,
}

impl SshCommand {
    fn new(user: &str, host: &str, program: &str) -> Self {
        let command = Command::new("ssh");
        let ssh_args = format!("{}@{}", user, host);
        Self {
            command,
            args: program.into(),
            ssh_args,
        }
    }

    fn arg(&mut self, arg: &str) -> &mut Self {
        self.args.push(' ');
        self.args.push_str(arg);
        self
    }

    fn args(&mut self, args: Vec<String>) -> &mut Self {
        for arg in args {
            self.args.push(' ');
            self.args.push_str(&arg);
        }
        self
    }

    fn output(&mut self) -> Result<Output, IoError> {
        self.command.arg(&self.ssh_args).arg(&self.args).output()
    }
}

// A wrapper around the 'scp' command.

enum ScpLocation {
    Local(PathBuf),
    Remote(PathBuf),
}

impl ScpLocation {
    fn as_string(&self, user: &str, host: &str) -> String {
        match &self {
            ScpLocation::Local(path) => format!("{}", path.display()),
            ScpLocation::Remote(path) => format!("{}@{}:{}", user, host, path.display()),
        }
    }
}

struct ScpCommand {
    user: String,
    host: String,
}

impl ScpCommand {
    fn new() -> Self {
        let user = env::var("NUTRIA_LINUX_USER").unwrap_or_else(|_| DEFAULT_LINUX_USER.to_owned());
        let host = env::var("NUTRIA_LINUX_HOST").unwrap_or_else(|_| DEFAULT_LINUX_HOST.to_owned());

        Self { user, host }
    }

    fn copy_recursive(&self, from: ScpLocation, to: ScpLocation) -> Result<(), LinuxError> {
        let status = Command::new("scp")
            .arg("-Cqr")
            .arg(from.as_string(&self.user, &self.host))
            .arg(to.as_string(&self.user, &self.host))
            .status()?;

        if !status.success() {
            return Err(LinuxError::Scp(status.to_string()));
        }
        Ok(())
    }
}

struct Device {
    host: String,
    user: String,
    description: String,
}

impl Device {
    fn connect() -> Result<Self, LinuxError> {
        if env::var("NUTRIA_LINUX_DISABLED").is_ok() {
            return Err(LinuxError::NoDeviceFound);
        }

        let user = env::var("NUTRIA_LINUX_USER").unwrap_or_else(|_| DEFAULT_LINUX_USER.to_owned());
        let host = env::var("NUTRIA_LINUX_HOST").unwrap_or_else(|_| DEFAULT_LINUX_HOST.to_owned());

        let output = SshCommand::new(&user, &host, "cat")
            .arg("/proc/sys/kernel/hostname")
            .output()?;

        let description = String::from_utf8_lossy(&output.stdout).trim().to_owned();
        if description.is_empty() {
            return Err(LinuxError::NoDeviceFound);
        }

        Ok(Self {
            user,
            host,
            description,
        })
    }

    fn description(&self) -> String {
        self.description.clone()
    }

    fn command(&self, cmd: &str) -> Result<String, LinuxError> {
        let mut parts: Vec<String> = cmd.split_whitespace().map(String::from).collect();
        if parts.is_empty() {
            return Err(LinuxError::BadCommand(cmd.into()));
        }
        let mut ssh = SshCommand::new(&self.user, &self.host, &parts[0]);
        let output = ssh.args(parts.drain(1..).collect()).output()?;

        let status = output.status;

        // log::info!("Status for '{}' is {}", cmd, status);

        if status.code() == Some(0) {
            Ok(String::from_utf8_lossy(&output.stdout).trim().to_owned())
        } else {
            error!("Command '{}' failed with exit code: {}", cmd, status);
            Err(LinuxError::BadCommand(format!(
                "Command '{}' failed with exit code: {}",
                cmd, status
            )))
        }
    }
}

pub fn detect_device() -> Result<String, LinuxError> {
    let device = Device::connect()?;
    Ok(device.description())
}

// Push a single app
fn push_app(path: &Path, app_name: &str, device: &Device) -> Result<(), LinuxError> {
    // Creates an empty directory at /tmp/b2g_app
    let _ = device.command("rm -rf /tmp/b2g_app")?;
    let _ = device.command("mkdir -p /tmp/b2g_app")?;

    // Copy the app to the temporary directory.
    let scp = ScpCommand::new();
    scp.copy_recursive(
        ScpLocation::Local(path.into()),
        ScpLocation::Remote("/tmp/b2g_app".into()),
    )?;

    // Run appscmd to install the app.
    let _ = device.command(&format!(
        "/opt/capyloon/api-daemon/appscmd --socket=/tmp/apps_service_uds.sock install /tmp/b2g_app/{}",
        app_name
    ))?;

    // Remove the temporary directory.
    let _ = device.command("rm -rf /tmp/b2g_app")?;
    Ok(())
}

// Push command
pub fn push_apps(config: &BuildConfig, requested_apps: &Option<String>) -> Result<(), LinuxError> {
    let data = crate::commands::common::PushedApps::new(config, requested_apps);

    let device = Device::connect()?;
    let mut failed = vec![];
    for app in data.apps {
        let app_name = format!(
            "{}",
            app.file_name()
                .unwrap_or_else(|| std::ffi::OsStr::new("<no app name>"))
                .to_string_lossy()
        );
        let _timer = Timer::start_with_message(
            &format!("{} pushed", app_name),
            &format!("Pushing {}", app_name),
        );

        if let Err(err) = push_app(&app, &app_name, &device) {
            error!("Failed to push {} : {:?}", app_name, err);
            failed.push(app_name);
        }
    }

    if !failed.is_empty() {
        return Err(LinuxError::AppsPush(failed.join(",")));
    }

    if data.system_update {
        info!("Restarting system app");
        let _ = device.command("/opt/capyloon/b2ghald/b2ghalctl restart-service capyloon")?;
    } else if data.homescreen_update {
        let pids = device.command("pidof b2g")?;
        let pids: Vec<&str> = pids.split(' ').collect();
        for pid in pids {
            let stat = device.command(&format!("cat /proc/{}/stat", pid))?;
            let parts: Vec<&str> = stat.split(' ').collect();
            if parts.len() > 1 && parts[1] == "(homescreen)" {
                info!("About to kill pid {} to restart homescreen...", pid);
                let _ = device.command(&format!("kill -9 {}", pid))?;
                break;
            }
        }
    }

    Ok(())
}

/// Restarts the capyloon service.
pub fn restart() -> Result<(), LinuxError> {
    let device = Device::connect()?;
    let _ = device.command("/opt/capyloon/b2ghald/b2ghalctl restart-service capyloon")?;
    Ok(())
}

/// Clears up all data (b2g profile including cache, costaeres) and restarts.
pub fn reset_data() -> Result<(), LinuxError> {
    let device = Device::connect()?;
    let _ = device.command("/opt/capyloon/b2ghald/b2ghalctl stop-service capyloon")?;
    let _ = device.command("rm -rf /home/*/.capyloon")?;
    let _ = device.command("/opt/capyloon/b2ghald/b2ghalctl start-service capyloon")?;

    Ok(())
}

/// Sets the time on device to the current host time.
pub fn reset_time() -> Result<(), LinuxError> {
    match SystemTime::now().duration_since(UNIX_EPOCH) {
        Ok(duration) => {
            let device = Device::connect()?;
            let _ = device.command(&format!(
                "/opt/capyloon/b2ghald/b2ghalctl set-time {}",
                duration.as_millis()
            ));
            Ok(())
        }
        Err(err) => Err(LinuxError::Other(format!(
            "Failed to get seconds since UNIX EPOCH: {}",
            err
        ))),
    }
}
