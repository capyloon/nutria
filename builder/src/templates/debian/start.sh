#!/bin/bash
cleanup() {
    # kill all processes whose parent is this process
    pkill -P $$
}

for FILE in /opt/b2gos/env.d/* ; do
    echo "Sourcing environment from $FILE"
    source $FILE;
done

if [ -z ${B2GOS_LAUNCH_WESTON+x} ];
then
    echo "B2GOS_LAUNCH_WESTON is not set: not starting weston"

for sig in INT QUIT HUP TERM; do
  trap "
    cleanup
    trap - $sig EXIT
    kill -s $sig "'"$$"' "$sig"
done
trap cleanup EXIT

else
    # Start Weston in kiosk mode
    /opt/bin/weston --shell=kiosk-shell.so &

    sleep 2
fi

export WAYLAND_DISPLAY=wayland-1

mkdir -p ${HOME}/.b2gos/profile
# Copy our prefs file.
cp /opt/b2gos/b2g/defaults/pref/user.js ${HOME}/.b2gos/profile/

# Copy the daemon config file and substitute the ${HOME} value.
sed -e s#__HOME__#${HOME}#g /opt/b2gos/api-daemon/config.toml > ${HOME}/.b2gos/api-daemon-config.toml

export RUST_LOG=warn

# Start the api-daemon
export DEFAULT_SETTINGS=/opt/b2gos/api-daemon/default-settings.json
mkdir -p ${HOME}/.b2gos/api-daemon
pushd ${HOME}/.b2gos/api-daemon > /dev/null
/opt/b2gos/api-daemon/api-daemon ${HOME}/.b2gos/api-daemon-config.toml 2>&1 | tee /tmp/b2g_api-daemon.log &
popd > /dev/null

# Start b2g
/opt/b2gos/b2g/b2g $@ -profile ${HOME}/.b2gos/profile/ 2>&1 | tee /tmp/b2g_gecko.log
