/// Common code to Gonk and Linux commands.
use crate::build_config::BuildConfig;
use crate::tasks::{GetAppList, Task};
use log::{error, info};
use std::collections::HashMap;
use std::path::PathBuf;

pub struct PushedApps {
    pub apps: Vec<PathBuf>,
    pub system_update: bool, // Special case if we are updating the system, shared or keyboard apps, since that requires a b2g restart
    pub homescreen_update: bool, // Special case if we are updating the homescreen or the shared app, we'll have to kill it to force a restart.
}

impl PushedApps {
    pub fn new(config: &BuildConfig, requested_apps: &Option<String>) -> Self {
        // Get the list of possible apps.
        let task = GetAppList::new(config);
        let app_list = task.run(()).unwrap_or_default();

        let mut source_apps = HashMap::new();
        app_list.iter().for_each(|(name, path)| {
            source_apps.insert(name, path.clone());
        });

        // Doing a 'push' with no constraints will push the system app.
        let mut system_update = requested_apps.is_none();
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
                        if app_name == "system" || app_name == "shared" || app_name == "keyboard" {
                            system_update = true;
                        }
                        if app_name == "homescreen" || app_name == "shared" {
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
        info!(
            "System update: {}, homescreen update: {}",
            system_update, homescreen_update
        );
        Self {
            apps,
            system_update,
            homescreen_update,
        }
    }
}
