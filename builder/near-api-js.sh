#!/bin/bash

set -ex

export DOCS_ENTRY_POINT="/app/builder/source-${SOURCE_REPO}/packages/near-api-js/src"
export DOCS_TS_CONFIG="/app/builder/source-${SOURCE_REPO}/packages/near-api-js/tsconfig.json"
export DOCS_BASE_PATH="/app/builder/source-${SOURCE_REPO}/packages/near-api-js/src"
export DOCS_README="/app/builder/source-${SOURCE_REPO}/docs/README_TYPEDOC.md"

mkdir "/app/builder/source-${SOURCE_REPO}/packages/near-api-js/docs"

cd /app/builder
mkdir docs
yarn build
