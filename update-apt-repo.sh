#!/bin/bash

# Create or update the debian repository.
# Based on https://earthly.dev/blog/creating-and-hosting-your-own-deb-packages-and-apt-repo/

# Usage instructions:
#
# curl -fsSLO https://debian.capyloon.org/capyloon.gpg
# sudo install -D -o root -g root -m 644 capyloon.gpg /etc/apt/keyrings/capyloon.gpg
# Desktop:
# echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/capyloon.gpg] https://debian.capyloon.org ./stable main" | sudo tee /etc/apt/sources.list.d/capyloon.list
# Mobile:
# echo "deb [arch=arm64 signed-by=/etc/apt/keyrings/capyloon.gpg] https://debian.capyloon.org ./stable main" | sudo tee /etc/apt/sources.list.d/capyloon.list


set -e

mkdir -p apt-repo/pool/main
mkdir -p apt-repo/dists/stable/main/binary-amd64
mkdir -p apt-repo/dists/stable/main/binary-arm64

rsync *.deb apt-repo/pool/main

pushd apt-repo/

apt-ftparchive --arch amd64 packages pool/ > dists/stable/main/binary-amd64/Packages
gzip -k -f dists/stable/main/binary-amd64/Packages

apt-ftparchive --arch arm64 packages pool/ > dists/stable/main/binary-arm64/Packages
gzip -k -f dists/stable/main/binary-arm64/Packages

pushd dists/stable

apt-ftparchive release . > Release

# Setup the pgp environment.
export GNUPGHOME="$(mktemp -d /tmp/pgpkeys-XXXXXX)"
cat ${PRIVATE_DEB_KEY} | gpg --import

# Sign the Release file
cat Release | gpg --default-key debian -abs > Release.gpg

# Create the InRelease file
cat Release | gpg --default-key debian -abs --clearsign > InRelease

popd

popd

# Synchronize with live server.
rsync -v -a apt-repo capyloon@capyloon:/data
