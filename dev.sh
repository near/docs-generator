#!/bin/sh -l

docker build -t docs-generator . && docker run -e DOCS_REPO_NAME="near--docs" docs-generator "near--near-api-js" "v2.0.0" "$(cat ~/.github-token)"