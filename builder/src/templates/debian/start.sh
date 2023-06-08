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
    echo Starting Wayland compositor >> ${START_LOG}

    # Create a basic sway configuration, disabling window decorations.
    echo "default_border none" > /tmp/capyloon_sway.config

    sway -c /tmp/capyloon_sway.config 2>&1 >> /tmp/capyloon_sway.log &

    # Wait for wayland to have set its lock file.
    # Consider it could be either wayland-0 or wayland-1
    LOCK0="/run/user/1000/wayland-0.lock"
    LOCK1="/run/user/1000/wayland-1.lock"
    while [ ! -f "$LOCK0" ] && [ ! -f "$LOCK1" ]; do
       echo "Waiting for Wayland lock" >> ${START_LOG}
       sleep 1
    done
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
/opt/capyloon/b2g/b2g $@ -profile ${HOME}/.capyloon/profile/ 2>&1 | tee /tmp/capyloon_gecko.log
