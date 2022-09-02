#!/bin/sh -l

docker build -t docs-generator . && docker run -e DOCS_REPO_NAME="near--docs"  -e SOURCE_NAME="near--near-api-js" -e SOURCE_TAG="v2.0.0" -e GITHUB_TOKEN="$(cat ~/.github-token)" docs-generator