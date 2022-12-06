#!/bin/bash
cleanup() {
    # kill all processes whose parent is this process
    pkill -P $$
}

for FILE in /opt/capyloon/env.d/* ; do
    echo "Sourcing environment from $FILE"
    source $FILE;
done

if [ -z ${CAPYLOON_LAUNCH_WESTON+x} ];
then
    echo "CAPYLOON_LAUNCH_WESTON is not set: not starting weston"

for sig in INT QUIT HUP TERM; do
  trap "
    cleanup
    trap - $sig EXIT
    kill -s $sig "'"$$"' "$sig"
done
trap cleanup EXIT

else
    # Start Weston in kiosk mode
    weston --shell=kiosk-shell.so &

    sleep 2
fi

export WAYLAND_DISPLAY=wayland-1

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
export DEFAULT_SETTINGS=/opt/capyloon/api-daemon/default-settings.json
rm -f /tmp/api-daemon-socket
mkdir -p ${HOME}/.capyloon/api-daemon
pushd ${HOME}/.capyloon/api-daemon > /dev/null
/opt/capyloon/api-daemon/api-daemon ${HOME}/.capyloon/api-daemon-config.toml 2>&1 | tee /tmp/capyloon_api-daemon.log &
popd > /dev/null

# Start ipfsd
mkdir -p ${HOME}/.capyloon/ipfsd
/opt/capyloon/ipfsd/ipfsd --cfg ${HOME}/.capyloon/ipfsd-config.toml 2>&1 | tee /tmp/capyloon_ipfsd.log &

# Wait for /tmp/api-daemon-socket to be ready.
while [ ! -S "/tmp/api-daemon-socket" ] 
do
    echo "Waiting for /tmp/api-daemon-socket"
    sleep 1
done

# Start b2g
/opt/capyloon/b2g/b2g $@ -profile ${HOME}/.capyloon/profile/ 2>&1 | tee /tmp/capyloon_gecko.log
