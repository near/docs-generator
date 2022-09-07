#!/bin/bash

set -ex

export DOCS_ENTRY_POINT="${SOURCE_DIR}/src"
export DOCS_TS_CONFIG="${SOURCE_DIR}/tsconfig.json"
export DOCS_BASE_PATH="${SOURCE_DIR}/src"
export DOCS_README="${SOURCE_DIR}/README.md"
export DOCS_NAME="NEAR JavaScript SDK"

mkdir "${SOURCE_DIR}/docs"

cd /app/builder
mkdir docs
yarn build
