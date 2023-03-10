//! Tasks definitions.

use crate::build_config::{BuildConfig, DEFAULT_HTTP_PORT};
use crate::daemon_config::*;
use crate::timer::Timer;
use blake2::{Blake2s256, Digest};
use fs_extra::dir;
use log::{debug, info};
use serde::Serialize;
use std::fs::{self, File};
use std::io::{self, ErrorKind, Read, Seek, Write};
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use walkdir::{DirEntry, WalkDir};
use zip::result::ZipError;
use zip::write::FileOptions;
use zip::ZipWriter;

pub static USER_DESKTOP_JS: &str = include_str!("./templates/user_desktop.js");

pub trait Task {
    type Input;
    type Output;
    type Error;

    fn new(config: &BuildConfig) -> Self;
    fn run(&self, input: Self::Input) -> Result<Self::Output, Self::Error>;
}

/// This tasks retrieves the list of apps directories.
pub struct GetAppList {
    root: PathBuf,
}

impl Task for GetAppList {
    type Input = ();
    type Output = Vec<(String, PathBuf)>;
    type Error = io::Error;

    fn new(config: &BuildConfig) -> Self {
        Self {
            root: config.apps_source_path.clone(),
        }
    }

    fn run(&self, _: ()) -> Result<Self::Output, Self::Error> {
        if !self.root.is_dir() {
            return Err(io::Error::new(
                ErrorKind::Other,
                "GetAppList root is not a directory!",
            ));
        }

        let _timer = Timer::start(&format!("Listing apps from {}", self.root.display()));

        let mut res = vec![];

        for entry in fs::read_dir(&self.root)? {
            let entry = entry?;
            let path = entry.path();
            if path.is_dir() {
                let name = path
                    .as_path()
                    .file_name()
                    .unwrap_or_else(|| std::ffi::OsStr::new("<no name>"))
                    .to_string_lossy();
                if !name.starts_with('.') {
                    res.push((name.to_string(), path));
                }
            }
        }

        Ok(res)
    }
}

/// This task creates a link from a source app dir to the target profile/webapps one.
pub struct LinkApp {
    output_path: PathBuf,
}

impl Task for LinkApp {
    type Input = (String, PathBuf); // app: (name, path)
    type Output = ();
    type Error = std::io::Error;

    fn new(config: &BuildConfig) -> Self {
        Self {
            output_path: config.output_path.clone(),
        }
    }

    fn run(&self, input: (String, PathBuf)) -> Result<Self::Output, Self::Error> {
        let _timer = Timer::start(&format!("Creating symlink for app {}", input.0));

        let src_dir = input.1;

        let dest_dir = self.output_path.join("profile").join("webapps");
        let _ = fs::create_dir_all(&dest_dir);

        let dest = dest_dir.join(input.0);
        if dest.exists() {
            // symlink exists, check that it's from the correct path.
            let meta = fs::symlink_metadata(&dest)?;
            if meta.is_symlink() {
                let source = fs::read_link(&dest)?;
                if source == src_dir {
                    return Ok(());
                }
            }
            // Something is wront with the symlink, delete it to re-create it.
            fs::remove_file(&dest)?;
        }

        std::os::unix::fs::symlink(src_dir, dest)?;

        Ok(())
    }
}

/// This task creates a zip file for an application.
pub struct ZipApp {
    output_path: PathBuf,
    use_profile: bool,
}

impl ZipApp {
    // From https://github.com/zip-rs/zip/blob/master/examples/write_dir.rs
    fn zip_dir<T>(
        it: &mut dyn Iterator<Item = DirEntry>,
        prefix: &Path,
        writer: T,
    ) -> Result<(), ZipError>
    where
        T: Write + Seek,
    {
        let mut zip = ZipWriter::new(writer);
        let options_compressed = FileOptions::default()
            .compression_method(zip::CompressionMethod::Deflated)
            .unix_permissions(0o755);
        let options_stored = FileOptions::default()
            .compression_method(zip::CompressionMethod::Stored)
            .unix_permissions(0o755);

        let mut buffer = Vec::new();
        for entry in it {
            let path = entry.path();
            let name = path
                .strip_prefix(prefix)
                .map_err(|_| io::Error::new(ErrorKind::Other, "Failed to strip prefix!"))?;

            // Write file or directory explicitly
            // Some unzip tools unzip files with directory paths correctly, some do not!
            if path.is_file() {
                debug!("adding file {:?} as {:?} ...", path, name);
                // If the file is already in a compressed format, just store it.
                let options = match path.extension().map(|ext| ext.to_str().unwrap_or_default()) {
                    None => options_compressed,
                    Some("xpi") | Some("jpg") | Some("webp") | Some("png") | Some("mp3")
                    | Some("mp4") | Some("ogg") | Some("woff") | Some("woff2") => options_stored,
                    Some(_) => options_compressed,
                };
                zip.start_file(name.to_string_lossy(), options)?;
                let mut f = File::open(path)?;

                f.read_to_end(&mut buffer)?;
                zip.write_all(&buffer)?;
                buffer.clear();
            } else if !name.as_os_str().is_empty() {
                // Only if not root! Avoids path spec / warning
                // and mapname conversion failed error on unzip
                debug!("adding dir {:?} as {:?} ...", path, name);
                zip.add_directory(name.to_string_lossy(), options_stored)?;
            }
        }
        zip.finish()?;
        Ok(())
    }
}

impl Task for ZipApp {
    type Input = (String, PathBuf); // app: (name, path)
    type Output = ();
    type Error = ZipError;

    fn new(config: &BuildConfig) -> Self {
        Self {
            output_path: config.output_path.clone(),
            use_profile: config.use_profile,
        }
    }

    fn run(&self, input: (String, PathBuf)) -> Result<Self::Output, Self::Error> {
        let _timer = Timer::start(&format!("Packaging app {}", input.0));

        let src_dir = input.1;

        let output_dir = if self.use_profile {
            self.output_path
                .join("profile")
                .join("webapps")
                .join(input.0)
        } else {
            self.output_path.join("webapps").join(input.0)
        };

        if File::open(&output_dir).is_err() {
            fs::create_dir_all(&output_dir)?;
        }

        let dst_file = output_dir.join("application.zip");
        let file = File::create(dst_file)?;

        let walkdir = WalkDir::new(&src_dir);
        let it = walkdir.into_iter();

        Self::zip_dir(&mut it.filter_map(|e| e.ok()), &src_dir, file)?;
        Ok(())
    }
}

/// This task creates a webapps.json entry for a single app.
#[derive(Serialize)]
pub struct Webapp {
    pub name: String,
    pub manifest_url: String,
    pub manifest_hash: String,
    pub package_hash: String,
}
pub struct WebappsParam {
    apps_source_path: PathBuf,
    output_path: PathBuf,
    use_profile: bool,
    port: i16,
}

impl WebappsParam {
    fn compute_file_hash<P: AsRef<Path>>(p: P) -> Result<String, io::Error> {
        let mut buffer = Vec::new();
        let mut file = File::open(p)?;
        if file.read_to_end(&mut buffer).is_ok() {
            let mut hasher = Blake2s256::new();
            hasher.update(&buffer);
            let res = hasher.finalize();
            Ok(format!("{:x}", res))
        } else {
            Ok(String::new())
        }
    }
}

impl Task for WebappsParam {
    type Input = (String, bool); // (app name, packaged)
    type Output = Webapp;
    type Error = io::Error;

    fn new(config: &BuildConfig) -> Self {
        Self {
            apps_source_path: config.apps_source_path.clone(),
            output_path: config.output_path.clone(),
            port: config.daemon_port,
            use_profile: config.use_profile,
        }
    }

    fn run(&self, (app_name, packaged): Self::Input) -> Result<Self::Output, Self::Error> {
        let _timer = Timer::start(&format!("Hashing app {}", app_name));

        let manifest_url = if self.port == DEFAULT_HTTP_PORT {
            format!("http://{}.localhost/manifest.webmanifest", app_name)
        } else {
            format!(
                "http://{}.localhost:{}/manifest.webmanifest",
                app_name, self.port
            )
        };

        let manifest_path = self
            .apps_source_path
            .join(&app_name)
            .join("manifest.webmanifest");
        let manifest_hash = Self::compute_file_hash(&manifest_path).map_err(|err| {
            log::error!("Failed to hash {:?}", manifest_path);
            err
        })?;

        let package_hash = if packaged {
            let package_path = if self.use_profile {
                self.output_path
                    .join("profile")
                    .join("webapps")
                    .join(&app_name)
                    .join("application.zip")
            } else {
                self.output_path
                    .join("webapps")
                    .join(&app_name)
                    .join("application.zip")
            };
            Self::compute_file_hash(&package_path).map_err(|err| {
                log::error!("Failed to hash {:?}", package_path);
                err
            })?
        } else {
            "".to_owned()
        };

        Ok(Webapp {
            name: app_name,
            manifest_url,
            manifest_hash,
            package_hash,
        })
    }
}

/// This task writes the webapps.json file
pub struct WebappsJson {
    output_path: PathBuf,
    use_profile: bool,
}

impl Task for WebappsJson {
    type Input = Vec<Webapp>;
    type Output = ();
    type Error = io::Error;

    fn new(config: &BuildConfig) -> Self {
        Self {
            output_path: config.output_path.clone(),
            use_profile: config.use_profile,
        }
    }

    fn run(&self, apps: Vec<Webapp>) -> Result<Self::Output, Self::Error> {
        let _timer = Timer::start("Writing webapps.json");

        let json_path = if self.use_profile {
            self.output_path
                .join("profile")
                .join("webapps")
                .join("webapps.json")
        } else {
            self.output_path.join("webapps").join("webapps.json")
        };
        let json_file = File::create(json_path)?;
        serde_json::to_writer_pretty(json_file, &apps)
            .map_err(|_| io::Error::new(ErrorKind::Other, "Failed to write json!"))?;
        Ok(())
    }
}

/// This tasks prepare the daemon runtime directory:
/// - creates the http_root directory.
/// - copies the api resources from the daemon directory.
/// - configures and write the daemon configuration file.
pub struct PrepareDaemon {
    output_path: PathBuf,
    daemon_path: PathBuf,
}

impl Task for PrepareDaemon {
    type Input = DaemonConfigKind;
    type Output = ();
    type Error = io::Error;

    fn new(config: &BuildConfig) -> Self {
        Self {
            output_path: config.output_path.clone(),
            daemon_path: config.daemon_path.clone(),
        }
    }

    fn run(&self, kind: DaemonConfigKind) -> Result<Self::Output, Self::Error> {
        let _timer = Timer::start("Preparing daemon runtime");

        let daemon_config = DaemonConfig::new(kind);

        // Create the daemon runtime directory.
        let runtime_dir = self.output_path.join("api-daemon");
        fs::create_dir_all(runtime_dir.join("http_root"))?;

        // Clean the js client api directory if needed.
        let _ = fs::remove_dir_all(runtime_dir.join("http_root").join("api"));
        // Copy all the js client api files.
        let options = dir::CopyOptions::new();
        dir::copy(
            self.daemon_path
                .join("prebuilts")
                .join("http_root")
                .join("api"),
            runtime_dir.join("http_root"),
            &options,
        )
        .map(|_| ())
        .map_err(|err| io::Error::new(ErrorKind::Other, err.to_string()))?;

        // Write the daemon configuration file.
        let toml_config =
            toml::to_string(&daemon_config).expect("Failed to serialize daemon configuration");
        let mut file = fs::File::create(runtime_dir.join("config.toml"))?;
        file.write_all(toml_config.as_bytes())?;

        Ok(())
    }
}

/// This task runs the api daemon.
pub struct DaemonRunner {
    daemon_binary: PathBuf,
    current_dir: PathBuf,
    settings_path: PathBuf,
}

impl Task for DaemonRunner {
    type Input = ();
    type Output = std::process::Child;
    type Error = io::Error;

    fn new(config: &BuildConfig) -> Self {
        Self {
            daemon_binary: config.daemon_binary(),
            current_dir: config.output_path.join("api-daemon"),
            settings_path: config.default_settings.clone(),
        }
    }

    fn run(&self, _: ()) -> Result<Self::Output, Self::Error> {
        info!(
            "Running the daemon binary {} in {}",
            self.daemon_binary.display(),
            self.current_dir.display()
        );

        // Spawns the daemon in the proper current directory.
        Command::new(&self.daemon_binary)
            .current_dir(&self.current_dir)
            .env("DEFAULT_SETTINGS", self.settings_path.display().to_string())
            .stdout(Stdio::inherit())
            .stderr(Stdio::inherit())
            .spawn()
    }
}

/// This task runs the iroh daemon.
pub struct IrohRunner {
    iroh_binary: PathBuf,
    current_dir: PathBuf,
    settings_path: PathBuf,
}

impl Task for IrohRunner {
    type Input = ();
    type Output = std::process::Child;
    type Error = io::Error;

    fn new(config: &BuildConfig) -> Self {
        Self {
            iroh_binary: config.ipfsd_binary(),
            current_dir: config.output_path.to_path_buf(),
            settings_path: config.iroh_config(),
        }
    }

    fn run(&self, _: ()) -> Result<Self::Output, Self::Error> {
        info!(
            "Running the ipfsd binary {} in {} with --cfg {}",
            self.iroh_binary.display(),
            self.current_dir.display(),
            self.settings_path.display(),
        );

        // Spawns the daemon in the proper current directory.
        Command::new(&self.iroh_binary)
            .current_dir(&self.current_dir)
            .args(["--cfg", &format!("{}", self.settings_path.display())])
            .stdout(Stdio::inherit())
            .stderr(Stdio::inherit())
            .spawn()
    }
}

/// This task runs the b2g binary.
pub struct B2gRunner {
    b2g_binary: PathBuf,
    profile_path: PathBuf,
}

#[derive(Debug)]
pub struct B2gRunnerInput {
    pub dtype: Option<String>,
    pub size: Option<String>,
    pub debug: bool,
}

impl Task for B2gRunner {
    type Input = B2gRunnerInput;
    type Output = std::process::Child;
    type Error = io::Error;

    fn new(config: &BuildConfig) -> Self {
        Self {
            b2g_binary: config.b2g_path.clone(),
            profile_path: config.output_path.join("profile"),
        }
    }

    fn run(&self, params: B2gRunnerInput) -> Result<Self::Output, Self::Error> {
        info!(
            "Running b2g binary {} with profile {} and params {:?}",
            self.b2g_binary.display(),
            self.profile_path.display(),
            params
        );

        // Write the user.js content to the profile.
        let mut user_file = File::create(self.profile_path.join("user.js"))?;
        user_file.write_all(USER_DESKTOP_JS.as_bytes())?;

        // Spawns b2g.
        let mut cmd = if params.debug {
            // gdb -ex run --args $B2G_BINARY b2g-args...
            let mut gdb_cmd = Command::new("gdb");
            gdb_cmd
                .arg("-ex")
                .arg("run")
                .arg("--args")
                .arg(&self.b2g_binary);

            gdb_cmd
        } else {
            Command::new(&self.b2g_binary)
        };
        cmd.arg("-profile")
            .arg(format!("{}", self.profile_path.display()))
            .stdout(Stdio::inherit())
            .stderr(Stdio::inherit());

        if let Some(dtype) = params.dtype {
            cmd.arg(format!("--type={}", dtype));
        }
        if let Some(size) = params.size {
            cmd.arg(format!("--size={}", size));
        }

        cmd.spawn()
    }
}
