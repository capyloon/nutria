//! Shared tasks and commands

use crate::build_config::BuildConfig;
use crate::daemon_config::DaemonConfigKind;
use crate::tasks::{
    B2gRunner, B2gRunnerInput, DaemonRunner, GetAppList, PrepareDaemon, Task, Webapp, WebappsJson,
    WebappsParam,
};
use crate::timer::Timer;
use log::{error, info};
use rayon::prelude::*;
use std::path::PathBuf;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;

pub struct DesktopParams {
    pub packaged: bool,
    pub no_run: bool,
    pub dtype: Option<String>,
    pub size: Option<String>,
}

// Implementation of common operations for desktop modes.
pub trait DesktopCommand {
    fn install_app(config: &BuildConfig, app: &(String, PathBuf));

    fn run(config: &BuildConfig, params: DesktopParams) {
        {
            let _timer = Timer::start("Preparing apps took");

            // Build the full app list.
            let task = GetAppList::new(config);
            let app_list = task.run(()).unwrap();

            let names: Vec<String> = app_list.iter().map(|item| item.0.clone()).collect();
            info!("App list is: {:?}", names);

            // Zip all apps.
            app_list.par_iter().for_each(|app| {
                Self::install_app(config, app);
            });

            // Compute the manifest hash and build webapps.json
            let apps: Vec<Webapp> = app_list
                .par_iter()
                .map(|app| {
                    let task = WebappsParam::new(config);
                    task.run((app.0.clone(), params.packaged)).unwrap()
                })
                .collect();

            let json_task = WebappsJson::new(config);
            let _ = json_task.run(apps).unwrap();
        }

        if !params.no_run {
            // Install a Ctrl-C signal handler.
            let term = Arc::new(AtomicBool::new(false));
            signal_hook::flag::register(signal_hook::consts::SIGTERM, Arc::clone(&term))
                .expect("Failed to install Ctrl-C signal handler");

            // Create the proper api-daemon configuration
            let daemon_prep = PrepareDaemon::new(config);
            let _ = daemon_prep
                .run(DaemonConfigKind::Desktop(config.output_path.clone()))
                .unwrap();

            // Run the daemon.
            let daemon_runner = DaemonRunner::new(config);
            let mut daemon_process = daemon_runner.run(()).unwrap();
            info!("Starting api-daemon, pid={}", daemon_process.id());

            // Run b2g
            let b2g_runner = B2gRunner::new(config);
            let mut b2g_process = b2g_runner
                .run(B2gRunnerInput {
                    dtype: params.dtype,
                    size: params.size,
                })
                .unwrap();
            info!("Starting b2g, pid={}", b2g_process.id());

            // Wait for both processes to exit.
            loop {
                std::thread::sleep(std::time::Duration::from_secs(1));

                if term.load(Ordering::Relaxed) {
                    // Kill both processes.
                    if let Err(err) = b2g_process.kill() {
                        error!("Failed to kill b2g: {}", err);
                    }
                    info!("b2g killed");

                    if let Err(err) = daemon_process.kill() {
                        error!("Failed to kill api-daemon: {}", err);
                    }
                    info!("api-daemon killed");
                    break;
                }

                if let (Ok(Some(status1)), Ok(Some(status2))) =
                    (daemon_process.try_wait(), b2g_process.try_wait())
                {
                    info!("api-daemon exited with: {}", status1);
                    info!("b2g exited with: {}", status2);
                    break;
                }
            }
        }
    }
}

pub fn host_target() -> String {
    format!(
        "{}-{}-{}-{}",
        target::arch(),
        target::vendor(),
        target::os(),
        target::env()
    )
}
