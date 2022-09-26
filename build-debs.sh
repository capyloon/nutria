#!/bin/bash

set -e

# Build the x86 deb
./jackady update-prebuilts --target x86_64-unknown-linux-gnu
./jackady clean
./jackady deb --device desktop
cp ./builder/output/debian/*.deb .

# Build the aarch64 debs for PinePhone and Librem5
./jackady update-prebuilts --target aarch64-unknown-linux-gnu
./jackady clean
./jackady deb --device pinephone
cp ./builder/output/debian/*.deb .

./jackady clean
./jackady deb --device librem5
cp ./builder/output/debian/*.deb .

# Switch back to default prebuilts.
./jackady update-prebuilts

ls -lh *.deb
