#!/bin/bash

echo $PATH

export PATH=/usr/bin:${PATH}

RUST_LOG=info cargo run --release -- install $1
