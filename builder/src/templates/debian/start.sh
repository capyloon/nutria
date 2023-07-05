#!/bin/bash
cleanup() {
    # kill all processes whose parent is this process
    pkill -P $$
}

START_LOG=/tmp/capyloon_start.log

echo "Capyloon start.sh" > ${START_LOG}

for FILE in /opt/capyloon/env.d/* ; do
    echo "Sourcing environment from $FILE"
    source $FILE;
done

echo "=================" >> ${START_LOG}
env >> ${START_LOG}
echo "=================" >> ${START_LOG}

if [ -z ${CAPYLOON_LAUNCH_WAYLAND+x} ];
then
    echo "CAPYLOON_LAUNCH_WAYLAND is not set: not starting Wayland compositor"

for sig in INT QUIT HUP TERM; do
  trap "
    cleanup
    trap - $sig EXIT
    kill -s $sig "'"$$"' "$sig"
done
trap cleanup EXIT

else
    echo "Starting Wayland compositor" >> ${START_LOG}

    export SWAY_STARTUP="$XDG_RUNTIME_DIR/sway-startup.$$.pipe"
    mkfifo "$SWAY_STARTUP"

    # Create a basic sway configuration, disabling window decorations.
    echo "default_border none" > /tmp/capyloon_sway.config
    echo "exec echo \"\$WAYLAND_DISPLAY\" > \"\$SWAY_STARTUP\"" >> /tmp/capyloon_sway.config
    echo "exec \"systemctl --user import-environment WAYLAND_DISPLAY XDG_CURRENT_DESKTOP\"" >> /tmp/capyloon_sway.config

    sway -c /tmp/capyloon_sway.config 2>&1 >> /tmp/capyloon_sway.log &

    read wayland_display < "$SWAY_STARTUP"
    rm "$SWAY_STARTUP"

    export WAYLAND_DISPLAY="$wayland_display"
fi

export WAYLAND_DISPLAY=`ls /run/user/1000/wayland-*|grep -v lock|cut -c 16-200`

echo "Setting WAYLAND_DISPLAY to ${WAYLAND_DISPLAY}" >> ${START_LOG}
echo "=================" >> ${START_LOG}

mkdir -p ${HOME}/.capyloon/profile
# Copy our prefs file.
cp /opt/capyloon/b2g/defaults/pref/user.js ${HOME}/.capyloon/profile/

# Copy the daemon config file and substitute the ${HOME} value.
sed -e s#__HOME__#${HOME}#g /opt/capyloon/api-daemon/config.toml > ${HOME}/.capyloon/api-daemon-config.toml

# Copy the ipfsd config file and substitute the ${HOME} value.
sed -e s#__HOME__#${HOME}#g /opt/capyloon/ipfsd/config.toml > ${HOME}/.capyloon/ipfsd-config.toml
# Forcibly remove the lock file since it doesn't get cleaned up when rebooting.
rm -f ${HOME}/.local/share/iroh/iroh-one.lock

export RUST_LOG=warn

# Start the api-daemon
echo Starting api-daemon >> ${START_LOG}
export DEFAULT_SETTINGS=/opt/capyloon/api-daemon/default-settings.json
rm -f /tmp/api-daemon-socket
mkdir -p ${HOME}/.capyloon/api-daemon
pushd ${HOME}/.capyloon/api-daemon > /dev/null
/opt/capyloon/api-daemon/api-daemon ${HOME}/.capyloon/api-daemon-config.toml 2>&1 | tee /tmp/capyloon_api-daemon.log &
popd > /dev/null

# Start ipfsd
echo Starting ipfsd >> ${START_LOG}
mkdir -p ${HOME}/.capyloon/ipfsd
/opt/capyloon/ipfsd/ipfsd --cfg ${HOME}/.capyloon/ipfsd-config.toml 2>&1 | tee /tmp/capyloon_ipfsd.log &

# Wait for /tmp/api-daemon-socket to be ready.
while [ ! -S "/tmp/api-daemon-socket" ] 
do
    echo "Waiting for /tmp/api-daemon-socket"
    sleep 1
done

# Start b2g
echo Starting b2g >> ${START_LOG}
/opt/capyloon/b2g/b2g ${B2G_ARGS} $@ -profile ${HOME}/.capyloon/profile/ 2>&1 | tee /tmp/capyloon_gecko.log
