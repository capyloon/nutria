#!/bin/bash
cleanup() {
    # kill all processes whose parent is this process
    pkill -P $$
}

for sig in INT QUIT HUP TERM; do
  trap "
    cleanup
    trap - $sig EXIT
    kill -s $sig "'"$$"' "$sig"
done
trap cleanup EXIT

mkdir -p ${HOME}/.b2gos/profile

# Copy the daemon config file and substitute the ${HOME} value.
sed -e s#__HOME__#${HOME}#g /opt/b2gos/api-daemon/config.toml > ${HOME}/.b2gos/api-daemon-config.toml

export RUST_LOG=info

# Start the api-daemon
export DEFAULT_SETTINGS=/opt/b2gos/api-daemon/default-settings.json
mkdir -p ${HOME}/.b2gos/api-daemon
pushd ${HOME}/.b2gos/api-daemon > /dev/null
/opt/b2gos/api-daemon/api-daemon ${HOME}/.b2gos/api-daemon-config.toml 2>&1 > /tmp/api-daemon.log &
popd > /dev/null

# Start b2g
# Copy our prefs file and run.
cp /opt/b2gos/b2g/defaults/pref/user.js ${HOME}/.b2gos/profile/
/opt/b2gos/b2g/b2g $@ -profile ${HOME}/.b2gos/profile/ 2>&1 > /tmp/b2gos.log
