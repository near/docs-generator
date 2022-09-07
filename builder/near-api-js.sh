#!/bin/bash

set -ex

export DOCS_ENTRY_POINT="${SOURCE_DIR}/packages/near-api-js/src"
export DOCS_TS_CONFIG="${SOURCE_DIR}/packages/near-api-js/tsconfig.json"
export DOCS_BASE_PATH="${SOURCE_DIR}/packages/near-api-js/src"
export DOCS_README="${SOURCE_DIR}/docs/README_TYPEDOC.md"
export DOCS_NAME="NEAR JavaScript API"

mkdir "${SOURCE_DIR}/packages/near-api-js/docs"

cd /app/builder
mkdir docs
yarn build
