//! Download prebuilt binaries for b2g, api-daemon and b2ghald
//! Urls are following the patter:
//! $NUTRIA_DOWNLOAD_URL/$target/$binary
//!
//! Eg: https://download.capyloon.org/prebuilts/x86_64-unknown-linux-gnu/api-daemon.tar.xz

use crate::build_config::BuildConfig;
use crate::common::host_target;
use crate::tasks::Task;
use crate::timer::Timer;
use log::{error, info};
use reqwest::header::{ETAG, IF_NONE_MATCH};
use reqwest::{blocking::Client, StatusCode};
use serde::Deserialize;
use std::collections::HashMap;
use std::fs::{self, File};
use std::io::{Read, Write};
use std::path::PathBuf;
use std::time::Duration;
use url::Url;

struct DownloadTask {
    topdir: PathBuf,
}

impl DownloadTask {
    fn unpack(&self, source: &PathBuf, dest: &PathBuf, package: &str) {
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
    type Input = (Url, String); // (url to download, unpack directory)
    type Output = ();
    type Error = reqwest::Error;

    fn new(_config: &BuildConfig) -> Self {
        let mut topdir = std::env::current_dir().expect("Failed to get current directory!");
        let _ = topdir.pop();

        Self { topdir }
    }

    fn run(&self, (url, path): Self::Input) -> Result<Self::Output, Self::Error> {
        let unpack_path = self.topdir.join(path);

        let url2 = url.clone();
        let package = match url.path_segments() {
            Some(segments) => segments.last().unwrap_or_default(),
            None => "<no package>",
        };
        info!(
            "Will download and unpack {} to {}",
            package,
            unpack_path.display()
        );

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
                let _ = file.read_to_string(&mut res).expect("Failed to read etag");
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
            .build()
            .expect("Failed to build http client");

        let mut request = client.get(url2);
        if !current_etag.is_empty() {
            request = request.header(IF_NONE_MATCH, current_etag);
        }

        let mut response = request.send()?;

        let status = response.status();
        if status.is_success() {
            // Write the response to a temp directory under a random name
            let mut dest = File::create(&cache_path).expect("Failed to create cache file");
            {
                let _timer = Timer::start_with_message(
                    &format!("{} downloaded", package),
                    &format!("Downloading {}", package),
                );
                response.copy_to(&mut dest)?;
            }

            // Write the Etag for this resource.
            if let Some(etag) = response.headers().get(ETAG) {
                let mut etag_file = File::create(&etag_path).expect("Failed to create etag file");
                let _ = etag_file.write_all(etag.as_bytes());
                let _ = etag_file.flush();
            }

            self.unpack(&cache_path, &unpack_path, &package);
        } else if status == StatusCode::NOT_MODIFIED {
            // Got a 304 because of matching Etags: we only need to unpack.
            self.unpack(&cache_path, &unpack_path, &package);
        } else {
            error!("Download failed: {}", status);
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
}

pub fn update(config: BuildConfig) {
    let cwd = std::env::current_dir().expect("Failed to get current directory!");

    let mut json_path = cwd.clone();
    json_path.push("prebuilts.json");
    let prebuilts_json = File::open(&json_path).expect("Unable to open prebuilts.json");

    let list: HashMap<String, PrebuiltsList> =
        serde_json::from_reader(prebuilts_json).expect("Invalid json");
    let target = host_target();
    if let Some(item) = list.get(&target) {
        let mut prebuilts = cwd.clone();
        let _ = prebuilts.pop();
        let topdir = prebuilts.clone();
        prebuilts.push("prebuilts");
        let _ = fs::remove_dir_all(&prebuilts);
        let _ = fs::create_dir_all(&prebuilts);

        let task = DownloadTask::new(&config);

        let mut env_file = File::create(&prebuilts.join("env")).expect("Failed to create env file");

        if let Some(url) = &item.api_daemon {
            let url = Url::parse(&url).expect("Invalid url");
            if let Err(err) = task.run((url, ".".into())) {
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
            let url = Url::parse(&url).expect("Invalid url");
            if let Err(err) = task.run((url, ".".into())) {
                error!("Failed to download & unpack: {}", err);
            } else {
                let _ = writeln!(
                    env_file,
                    "export NUTRIA_B2GHALD_BINARY={}/{}/b2ghald",
                    prebuilts.display(),
                    target
                );
            }
        }

        if let Some(url) = &item.b2g {
            let url = Url::parse(&url).expect("Invalid url");
            if let Err(err) = task.run((url, "prebuilts".into())) {
                error!("Failed to download & unpack: {}", err);
            } else {
                let _ = writeln!(
                    env_file,
                    "export NUTRIA_B2G_BINARY={}/b2g/b2g",
                    prebuilts.display()
                );
            }
        }

        let _ = env_file.flush();
    } else {
        error!("No prebuilts available for this target: {}", target);
    }
}
