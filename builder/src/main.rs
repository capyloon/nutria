//! Main driver for the build system.
//! Recognized commands:
//! - dev
//! - run
//! - push <app>

mod build_config;
mod commands;
mod common;
mod daemon_config;
mod debian;
mod tasks;
mod timer;

use crate::commands::{
    DevCommand, InstallCommand, ProdCommand, PushB2gCommand, PushCommand, ResetDataCommand,
    ResetTimeCommand, RestartCommand,
};
use crate::debian::DebianCommand;
use clap::{AppSettings, Parser, Subcommand};
use log::{error, info};

#[derive(Parser)]
#[clap(author, version, about, long_about = None)]
#[clap(global_setting(AppSettings::PropagateVersion))]
#[clap(global_setting(AppSettings::UseLongFormatForHelpSubcommand))]
struct Cli {
    #[clap(subcommand)]
    command: Commands,
    /// Enable verbose output.
    #[clap(long, short)]
    verbose: bool,
}

#[derive(Debug, Subcommand)]
enum Commands {
    /// Desktop: runs without packaging apps.
    Dev {
        /// The type of device to emulate. Valid values are 'desktop' and 'mobile'.
        #[clap(long)]
        r#type: Option<String>,
        /// The screen size to emulate. Formatted such as 800x600.
        #[clap(long)]
        size: Option<String>,
    },
    /// Desktop: runs with packaged apps.
    Prod {
        /// The type of device to emulate. Valid values are 'desktop' and 'mobile'.
        #[clap(long)]
        r#type: Option<String>,
        /// The screen size to emulate. Formatted such as 800x600.
        #[clap(long)]
        size: Option<String>,
    },
    /// Gonk: push the packaged apps to the device.
    Push {
        /// An optional comma separated list of apps.
        apps: Option<String>,
    },
    /// Gonk: push Gecko to the device.
    PushB2g {
        /// The full path to the Gecko package (eg. /home/user/b2g-98.0.en-US.linux-android-aarch64.tar.bz2)
        path: String,
    },
    /// Gonk: reset the user data on the device.
    ResetData {},
    /// Gonk: reset the time on device.
    ResetTime {},
    /// Gonk: force a restart of the api-daemon and b2g.
    Restart {},
    /// Desktop: package the apps into a given directory.
    Install {
        /// The root path of the packaged app, like /system/b2g/webapps on Gonk devices.
        path: String,
    },
    /// Desktop: creates a debian package.
    Deb {
        /// The device environment: desktop|pinephone, defaults to desktop.
        device: Option<String>,
    },
    /// Cleans up the output directory.
    Clean {},
}

fn main() {
    env_logger::init();

    let cli = Cli::parse();

    let mut display_info = cli.verbose;

    let mut config = build_config::BuildConfig::default();
    if let Err(err) = config.validate() {
        error!("Invalid configuration: {}", err);
        display_info = true;
    }

    if display_info {
        let s = "=".repeat(80);
        info!("{}", s);
        info!("Environment:");
        [
            "CAPYLOON_OUPUT_ROOT",
            "CAPYLOON_API_DAEMON_ROOT",
            "CAPYLOON_API_DAEMON_BINARY",
            "CAPYLOON_API_DAEMON_PORT",
            "CAPYLOON_APPS_ROOT",
            "CAPYLOON_APPSCMD_BINARY",
            "CAPYLOON_B2GHALD_ROOT",
            "CAPYLOON_B2G_BINARY",
            "CAPYLOON_B2G_PACKAGE",
        ]
        .iter()
        .for_each(|name| {
            // 26 = length of CAPYLOON_API_DAEMON_BINARY
            info!("{:26} = {}", name, std::env::var(name).unwrap_or_default());
        });

        info!("{}", s);
        info!("Configuration:");
        config.log();
        info!("{}", s);
    }

    // You can check for the existence of subcommands, and if found use their
    // matches just as you would the top level app
    match &cli.command {
        Commands::Prod { r#type, size } => {
            if config.set_output_name("prod").is_ok() {
                ProdCommand::start(config, r#type.clone(), size.clone());
            } else {
                error!("Failed to configure 'prod' build");
            }
        }
        Commands::Dev { r#type, size } => {
            if config.set_output_name("dev").is_ok() {
                DevCommand::start(config, r#type.clone(), size.clone());
            } else {
                error!("Failed to configure 'dev' build");
            }
        }
        Commands::ResetData {} => ResetDataCommand::start(),
        Commands::ResetTime {} => ResetTimeCommand::start(),
        Commands::Push { apps } => PushCommand::start(config, apps),
        Commands::PushB2g { path } => PushB2gCommand::start(path),
        Commands::Restart {} => RestartCommand::start(),
        Commands::Install { path } => {
            if config.set_output_path(path).is_ok() {
                InstallCommand::start(config);
            } else {
                error!("Failed to setup installation path.");
            }
        }
        Commands::Deb { device } => {
            let output_path = config.output_path.join("debian").join("opt").join("b2gos");
            if config.set_output_path(&output_path).is_ok() {
                let device = match device {
                    Some(val) => val.clone(),
                    None => String::from("desktop"),
                };

                if device != "desktop" {
                    error!(
                        "Creating debian packages for '{}' is not supported.",
                        device
                    );
                    return;
                }

                config.daemon_port = 8081;
                DebianCommand::start(config, &device);
            } else {
                error!("Failed to configure 'debian' build");
            }
        }
        Commands::Clean {} => {
            if let Err(err) = std::fs::remove_dir_all(&config.output_path) {
                error!(
                    "Failed to clean output directory {} : {}",
                    config.output_path.display(),
                    err
                );
            }
        }
    }
}
