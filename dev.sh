#!/bin/sh

export DOCS_ENTRY_POINT='./sources/near-api-js/packages/near-api-js/src'
export DOCS_TS_CONFIG='./sources/near-api-js/packages/near-api-js/tsconfig.json'
export DOCS_BASE_PATH='./sources/near-api-js/packages/near-api-js/src'
export DOCS_README='./sources/near-api-js/docs/README_TYPEDOC.md'

docusaurus "$1"
