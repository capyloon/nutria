//! Download prebuilt binaries for b2g, api-daemon and b2ghald
//! Urls are configured in prebuilts.json

use crate::build_config::BuildConfig;
use crate::common::host_target;
use crate::tasks::Task;
use crate::timer::Timer;
use indicatif::{ProgressBar, ProgressStyle};
use log::{error, info};
use reqwest::header::{ETAG, IF_NONE_MATCH};
use reqwest::{blocking::Client, StatusCode};
use serde::Deserialize;
use std::collections::HashMap;
use std::fs::{self, File};
use std::io::{Error as IoError, Read, Write};
use std::path::{Path, PathBuf};
use std::time::Duration;
use thiserror::Error;
use url::{ParseError as UrlError, Url};

#[derive(Error, Debug)]
pub enum DownloadTaskError {
    #[error("Reqwest error: {0}")]
    Reqwest(#[from] reqwest::Error),
    #[error("Io error: {0}")]
    Io(#[from] std::io::Error),
    #[error("Json error: {0}")]
    Json(#[from] serde_json::Error),
    #[error("Url error: {0}")]
    Url(#[from] UrlError),
}

struct DownloadWriter {
    file: File,
    total_size: usize,
    downloaded: usize,
    pb: ProgressBar,
    #[allow(dead_code)] // We rely on the Timer drop implementation.
    timer: Timer,
}

impl DownloadWriter {
    fn new(package: &str, file: File, total_size: usize) -> Self {
        let pb = ProgressBar::new(total_size as _);
        pb.enable_steady_tick(std::time::Duration::from_secs(1));
        pb.set_style(ProgressStyle::default_bar().template("{spinner:.green} [{elapsed_precise}] [{wide_bar:.cyan/blue}] {bytes}/{total_bytes} ({bytes_per_sec}, {eta})").unwrap());

        let timer = Timer::start_with_message(
            &format!("{} downloaded", package),
            &format!("Downloading {}", package),
        );

        Self {
            file,
            total_size,
            downloaded: 0,
            pb,
            timer,
        }
    }
}

impl Write for DownloadWriter {
    fn write(&mut self, buf: &[u8]) -> Result<usize, IoError> {
        match self.file.write(buf) {
            Ok(size) => {
                let new_downloaded = std::cmp::min(self.downloaded + size, self.total_size);
                self.downloaded = new_downloaded;
                self.pb.set_position(new_downloaded as _);
                self.downloaded += size;
                Ok(size)
            }
            Err(err) => Err(err),
        }
    }

    fn flush(&mut self) -> Result<(), IoError> {
        self.file.flush()
    }
}

impl Drop for DownloadWriter {
    fn drop(&mut self) {
        self.pb.finish_and_clear();
    }
}

struct DownloadTask {
    topdir: PathBuf,
}

impl DownloadTask {
    fn unpack(&self, source: &Path, dest: &Path, package: &str) {
        // Unpack to the proper directory.
        let status = {
            let _timer = Timer::start_with_message(
                &format!("{} unpacked", package),
                &format!("Unpacking {}", package),
            );
            std::process::Command::new("tar")
                .arg("xf")
                .arg(format!("{}", source.display()))
                .arg("-C")
                .arg(format!("{}", dest.display()))
                .status()
        };
        match status {
            Ok(exit) => {
                if exit.code() != Some(0) {
                    error!("Unexpected result code: {}", exit);
                }
            }
            Err(err) => {
                error!("Failed to unpack download: {}", err);
            }
        }
    }
}

impl Task for DownloadTask {
    type Input = (String, Url, String); // (prebuilt name, url to download, unpack directory)
    type Output = ();
    type Error = DownloadTaskError;

    fn new(_config: &BuildConfig) -> Self {
        let mut topdir = std::env::current_dir().expect("Failed to get current directory!");
        let _ = topdir.pop();

        Self { topdir }
    }

    fn run(&self, (name, url, path): Self::Input) -> Result<Self::Output, Self::Error> {
        let unpack_path = self.topdir.join(path);

        let url2 = url.clone();
        let package = match url.path_segments() {
            Some(segments) => segments.last().unwrap_or("<no package>"),
            None => "<no package>",
        };
        info!("About to download and unpack {}: {}", name, url.as_str());

        let _ = fs::create_dir_all(&self.topdir.join(".cache"));
        let cache_path = self.topdir.join(".cache").join(package);

        // Check if we have an etag value for this resource.
        let etag_path = self
            .topdir
            .join(".cache")
            .join(&format!("{}.etag", package));

        let current_etag = match File::open(&etag_path) {
            Ok(mut file) => {
                let mut res = String::new();
                file.read_to_string(&mut res)?;
                res
            }
            Err(_) => String::new(),
        };

        let client = Client::builder()
            .deflate(true)
            .brotli(true)
            .gzip(true)
            .connect_timeout(Duration::from_secs(30))
            .timeout(Duration::from_secs(60 * 5))
            .build()?;

        let mut request = client.get(url2);
        if !current_etag.is_empty() {
            request = request.header(IF_NONE_MATCH, current_etag);
        }

        let mut response = request.send()?;

        let status = response.status();
        if status.is_success() {
            let size = response.content_length().unwrap_or(0);

            // Write the response to the cache directory.
            {
                let dest = File::create(&cache_path)?;
                let mut writer = DownloadWriter::new(package, dest, size as _);
                response.copy_to(&mut writer)?;
            }

            // Write the Etag for this resource.
            if let Some(etag) = response.headers().get(ETAG) {
                let mut etag_file = File::create(&etag_path)?;
                let _ = etag_file.write_all(etag.as_bytes());
                let _ = etag_file.flush();
            }

            self.unpack(&cache_path, &unpack_path, package);
        } else if status == StatusCode::NOT_MODIFIED {
            // Got a 304 because of matching Etags: we only need to unpack.
            self.unpack(&cache_path, &unpack_path, package);
        } else {
            error!("Download failed: {}", status);
            for (name, value) in response.headers() {
                if name.to_string().starts_with("x-ipfs-") {
                    error!("{}: {:?}", name, value);
                }
            }
        }

        Ok(())
    }
}

#[derive(Debug, Deserialize)]
struct PrebuiltsList {
    #[serde(rename = "api-daemon")]
    api_daemon: Option<String>,
    b2ghald: Option<String>,
    b2g: Option<String>,
    weston: Option<String>,
    ipfsd: Option<String>,
}

fn maybe_add_package(env_file: &mut File, topdir: &Path, url: &Url, var_name: &str) {
    // Get the last component of the url to use as the cached filename for the package.
    if let Some(segments) = url.path_segments() {
        match segments.last() {
            Some(path_name) => {
                let _ = writeln!(
                    env_file,
                    "export {}={}/.cache/{}",
                    var_name,
                    topdir.display(),
                    path_name
                );
            }
            None => error!("Failed to create NUTRIA_B2G_PACKAGE from {}", url),
        }
    }
}

pub fn update(config: BuildConfig, target: Option<String>) -> Result<(), DownloadTaskError> {
    let cwd = std::env::current_dir()?;

    let json_path = match std::env::var("NUTRIA_PREBUILTS_JSON") {
        Ok(json_path) => PathBuf::from(&json_path),
        Err(_) => {
            let mut json_path = cwd.clone();
            json_path.push("prebuilts.json");
            json_path
        }
    };

    let prebuilts_json = File::open(&json_path)?;

    let list: HashMap<String, PrebuiltsList> = serde_json::from_reader(prebuilts_json)?;
    let target = target.unwrap_or_else(host_target);
    if let Some(item) = list.get(&target) {
        let mut prebuilts = cwd;
        let _ = prebuilts.pop();
        let topdir = prebuilts.clone();
        prebuilts.push("prebuilts");
        let _ = fs::remove_dir_all(&prebuilts);
        let _ = fs::create_dir_all(&prebuilts);

        let mut env_file = File::create(&prebuilts.join("env"))?;

        let _ = writeln!(
            env_file,
            "export NUTRIA_APPS_ROOT={}/apps",
            topdir.display()
        );

        let task = DownloadTask::new(&config);

        if let Some(url) = &item.api_daemon {
            let url = Url::parse(url)?;
            if let Err(err) = task.run(("api-daemon".into(), url, ".".into())) {
                error!("Failed to download & unpack: {}", err);
            } else {
                let _ = writeln!(
                    env_file,
                    "export NUTRIA_API_DAEMON_BINARY={}/{}/api-daemon",
                    prebuilts.display(),
                    target
                );
                let _ = writeln!(
                    env_file,
                    "export NUTRIA_APPSCMD_BINARY={}/{}/appscmd",
                    prebuilts.display(),
                    target
                );
                let _ = writeln!(env_file, "export NUTRIA_API_DAEMON_PORT=8081");
                let _ = writeln!(
                    env_file,
                    "export NUTRIA_API_DAEMON_ROOT={}",
                    topdir.display()
                );
            }
        }

        if let Some(url) = &item.b2ghald {
            let url = Url::parse(url)?;
            if let Err(err) = task.run(("b2ghald".into(), url, ".".into())) {
                error!("Failed to download & unpack: {}", err);
            } else {
                let _ = writeln!(
                    env_file,
                    "export NUTRIA_B2GHALD_BINARY={}/{}/b2ghald",
                    prebuilts.display(),
                    target
                );
                let _ = writeln!(
                    env_file,
                    "export NUTRIA_B2GHALCTL_BINARY={}/{}/b2ghalctl",
                    prebuilts.display(),
                    target
                );
            }
        }

        if let Some(url) = &item.b2g {
            let url = Url::parse(url)?;
            if let Err(err) = task.run(("b2g".into(), url.clone(), "prebuilts".into())) {
                error!("Failed to download & unpack: {}", err);
            } else {
                #[cfg(target_os = "macos")]
                let _ = writeln!(
                    env_file,
                    "export NUTRIA_B2G_BINARY={}/Capyloon.app/Contents/MacOS/b2g",
                    prebuilts.display()
                );
                #[cfg(not(target_os = "macos"))]
                let _ = writeln!(
                    env_file,
                    "export NUTRIA_B2G_BINARY={}/b2g/b2g",
                    prebuilts.display()
                );

                maybe_add_package(&mut env_file, &topdir, &url, "NUTRIA_B2G_PACKAGE");
            }
        }

        if let Some(url) = &item.ipfsd {
            let url = Url::parse(url)?;
            if let Err(err) = task.run(("ipfsd".into(), url, ".".into())) {
                error!("Failed to download & unpack: {}", err);
            } else {
                let _ = writeln!(
                    env_file,
                    "export NUTRIA_IPFSD_BINARY={}/{}/ipfsd",
                    prebuilts.display(),
                    target
                );
            }
        }

        if let Some(url) = &item.weston {
            let url = Url::parse(url)?;
            if let Err(err) = task.run(("weston".into(), url.clone(), "prebuilts".into())) {
                error!("Failed to download & unpack: {}", err);
            } else {
                maybe_add_package(&mut env_file, &topdir, &url, "NUTRIA_WESTON_PACKAGE");
            }
        }

        let _ = env_file.flush();
    } else {
        error!("No prebuilts available for this target: {}", target);
        let targets: Vec<String> = list.keys().into_iter().cloned().collect();
        info!(
            "{} Available targets:\n\t{}",
            targets.len(),
            targets.join("\n\t")
        );
    }

    Ok(())
}
