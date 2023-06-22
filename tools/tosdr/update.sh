#!/bin/bash

RUST_LOG=info cargo run --release > ../../apps/shared/resources/tosdr_org.json
