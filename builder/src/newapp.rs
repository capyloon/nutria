/// Creates a new app by copying a scaffolding template.
use crate::build_config::BuildConfig;
use crate::timer::Timer;
use std::fs::{copy, create_dir_all, File};
use std::io::{Read, Write};
use thiserror::Error;
use walkdir::WalkDir;

#[derive(Error, Debug)]
pub enum NewAppCommandError {
    #[error("Io error: {0}")]
    Io(#[from] std::io::Error),
    #[error("Walkdir error: {0}")]
    Walkdir(#[from] walkdir::Error),
    #[error("Duplicate app name: {0}")]
    DuplicateName(String),
}

pub fn create(name: &str, config: &BuildConfig) -> Result<(), NewAppCommandError> {
    let dest_dir = config.apps_source_path.join(name);
    if dest_dir.exists() {
        return Err(NewAppCommandError::DuplicateName(name.to_owned()));
    }

    let _timer = Timer::start(&format!("Creating new app: {}", name));

    let src_dir = config.templates_path.join("newapp");

    let src_template = format!("{}", src_dir.display());
    let dest_template = format!("{}", dest_dir.display());

    let walkdir = WalkDir::new(&src_dir);
    for entry in walkdir.into_iter() {
        let entry = entry?;

        let final_path =
            format!("{}", entry.path().display()).replace(&src_template, &dest_template);

        if entry.file_type().is_dir() {
            create_dir_all(&final_path)?;
            continue;
        }

        let is_template = if let Some(ext) = entry.path().extension() {
            ext == "tmpl"
        } else {
            false
        };

        if is_template {
            let final_path = final_path.replace(".tmpl", "");
            let mut input = File::open(entry.path())?;
            let mut output = File::create(final_path)?;
            let mut content = String::new();
            input.read_to_string(&mut content)?;
            output.write_all(content.replace("__APP_NAME__", name).as_bytes())?;
        } else {
            copy(entry.path(), final_path)?;
        }
    }

    Ok(())
}
