# Nutria: An Experimental Web Based OS Frontend

This repo contains a suite of apps and their build system. Several running mode are available:
- Gonk based devices (build from https://github.com/capyloon/B2G).
- Linux mobile form factor emulator.
- Linux desktop form factor.
- Linux desktop session.

The included build system is available by running the `jackady` (spelled like the French "Jacques a dit") command. This lets you run locally in development or production mode, and manage device operations.

If you want to contribute, please read the [Contributing Guide](./CONTRIBUTING.md).

# Prerequisites

In order to develop locally, you need a stable Rust toolchain installed (eg. from https://rustup.rs/) since the first invocation of `jackady` will compile the build system.

Creating debian packages requires the `dpkg-deb` command from the `dpkg` package.

# Quick Start

Once your Rust toolchain is installed, you can get a running system with these 2 commands:
1. `./jackady update-prebuilts`
2. `./jackady dev`

You can then make changes to apps and see the results live, except for the system UI and the homescreen which require a restart.

# Build commands

Running `jackady` without arguments shows the list of available commands:

```
USAGE:
    jackady [OPTIONS] <SUBCOMMAND>

OPTIONS:
    -h, --help       Print help information
    -v, --verbose    Enable verbose output
    -V, --version    Print version information

SUBCOMMANDS:
    clean               Cleans up the output directory
    deb                 Desktop: creates a debian package
    dev                 Desktop: runs without packaging apps
    help                Print this message or the help of the given subcommand(s)
    install             Desktop: package the apps into a given directory
    prod                Desktop: runs with packaged apps
    push                Gonk: push the packaged apps to the device
    push-b2g            Gonk: push Gecko to the device
    reset-data          Gonk: reset the user data on the device
    reset-time          Gonk: reset the time on device
    restart             Gonk: force a restart of the api-daemon and b2g
    update-prebuilts    Download prebuilt versions of the needed binaries
```

`jackady` also relies on some environment variables to be set to control its behavior:
| Variable                 | Description                                                                                 | Default value                              |
| ------------------------ | ------------------------------------------------------------------------------------------- | ------------------------------------------ |
| NUTRIA_OUPUT_ROOT        | The path where build artefacts are created.                                                 | `./builder/output`                         |
| NUTRIA_API_DAEMON_ROOT   | The path to a checkout of the [`api-daemon` crate](https://github.com/capyloon/api-daemon). |                                            |
| NUTRIA_API_DAEMON_BINARY | The path to the `api-daemon` executable built for the desktop platform.                     | `./prebuilts/${HOST_TARGET}/api-daemon`    |
| NUTRIA_API_DAEMON_PORT   | The port on which the api-daemon should run.                                                | 80 but needs to be set to 8081 on desktop. |
| NUTRIA_APPS_ROOT         | The path to the apps directory.                                                             | `./apps`                                   |
| NUTRIA_APPSCMD_BINARY    | The path to the `appscmd` executable built for the desktop platform.                        | `./prebuilts/${HOST_TARGET}/appscmd`       |
| NUTRIA_B2GHALD_BINARY    | The path to a host version of the `b2ghald` executable. Only required for debian packaging. |                                            |
| NUTRIA_B2G_BINARY        | The path to the b2g binary used for running on desktop.                                     | `./b2g`                                    |
| NUTRIA_B2G_PACKAGE       | The path to a b2g package that will be pushed to a device.                                  |                                            |

## The `clean` command

This removes all build artefacts from the selected output directory. Note that this includes all data from development and production profiles.


## The `deb` command

This will create a debian package under `NUTRIA_OUPUT_ROOT/debian/`.

This package provides the desktop session, as well as the mobile & desktop emulators. Note that when installed from the debian package, they all share the same profile data.

## The `dev` command

This command runs the desktop emulator in development mode: apps are not packaged, and changes done to them in the `NUTRIA_APPS_ROOT` directory are immediately visible when reloading the apps. Changes to the system app still require a full restart.

The following options are supported:
```
USAGE:
    jackady dev [OPTIONS]

OPTIONS:
    -d, --debug          Run under gdb if set
    -h, --help           Print help information
        --size <SIZE>    The screen size to emulate. Formatted such as 800x600
        --type <TYPE>    The type of device to emulate. Valid values are 'desktop' and 'mobile'
    -V, --version        Print version information
```

## The `prod` command

This command runs the desktop emulator in production mode, with apps packaged in zips.

The following options are supported:
```
USAGE:
    jackady prod [OPTIONS]

OPTIONS:
    -d, --debug          Run under gdb if set
    -h, --help           Print help information
        --size <SIZE>    The screen size to emulate. Formatted such as 800x600
        --type <TYPE>    The type of device to emulate. Valid values are 'desktop' and 'mobile'
    -V, --version        Print version information
```

## The `install` command

This command takes a mandatory parameter that is the path where the packaged apps will be written. This command is used by the Android build system.

## The `push` command

This command will push the specified apps to the device, effectively updating them. Two special cases are taken into account:
1. If the `system` app is updated, b2g and the api-daemon are restarted.
2. If the `homescreen` app is updated, the current running one is killed which triggers a reload.

The following options are supported:
```
USAGE:
    jackady push [APPS]

ARGS:
    <APPS>    An optional comma separated list of apps

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information
```
## The `push-b2g` command

This command will push a new b2g runtime to the device.

The following options are supported:
```
USAGE:
    jackady push-b2g <PATH>

ARGS:
    <PATH>    The full path to the Gecko package (eg. /home/user/b2g-98.0.en-US.linux-android-
              aarch64.tar.bz2)

OPTIONS:
    -h, --help       Print help information
    -V, --version    Print version information
```

## The `reset-data` command

This command deletes all profile data used by b2g and the api-daemon on device.

## The `reset-time` command

This command set the device time to be the same as the current host.

## The `restart` command

This command forces a restart of b2g and the api-daemon.

## The `update-prebuilts` command

This command will fetch prebuilt binaries for your platform and setup environment variables accordingly.
The downloaded resources are cached in the `.cache` directory.
