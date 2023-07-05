#!/bin/bash

set -e

# Build the x86 deb
./jackady update-prebuilts --target x86_64-unknown-linux-gnu
./jackady clean
./jackady deb --device desktop
cp ./builder/output/debian/*.deb .

# Build the aarch64 debs for PinePhone, Librem5 and Rpi
./jackady update-prebuilts --target aarch64-unknown-linux-gnu

./jackady clean
./jackady deb --device pinephone
cp ./builder/output/debian/*.deb .

./jackady clean
./jackady deb --device librem5
cp ./builder/output/debian/*.deb .

./jackady clean
./jackady deb --device rpi
cp ./builder/output/debian/*.deb .

# Switch back to default prebuilts.
./jackady update-prebuilts

# Build the plymouth theme
HERE=`pwd`
pushd ../plymouth-theme-capyloon
./build.sh ${HERE}
popd
mv ../plymouth-theme-capyloon*.deb .

rm ../plymouth-theme-capyloon_*

ls -lh *.deb
