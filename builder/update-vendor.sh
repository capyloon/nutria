#!/bin/bash

set -e

rm -rf third-party/*
rm -f .cargo/config

cargo clean
cargo update $@

cargo vendor -- third-party > .cargo/config

# Remove large but useless windows libraries.
rm -rf third-party/windows_i686_msvc*/lib
rm -rf third-party/windows_i686_gnu*/lib
rm -rf third-party/windows_x86_64_msvc/lib
rm -rf third-party/windows_aarch64_msvc/lib
rm -rf third-party/windows_x86_64_gnu/lib
rm -rf third-party/winapi-x86_64-pc-windows-gnu/lib
rm -rf third-party/winapi-i686-pc-windows-gnu/lib
rm -rf third-party/windows-sys*/src/Windows
rm -rf third-party/windows_aarch64_msvc*/lib
rm -rf third-party/windows_x86_64_gnu*/lib
