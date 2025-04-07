#!/bin/bash

set -e          # Exit immediately if a command exits with a non-zero status
set -u          # Treat unset variables as an error
set -o pipefail # Ensure errors propagate in pipelines

cargo build --target wasm32-unknown-unknown --release

candid-extractor target/wasm32-unknown-unknown/release/backend.wasm >./src/backend/backend.did

dfx generate backend
