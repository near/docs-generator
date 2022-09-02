#!/bin/sh -l

docker build -t docs-generator . && docker run \
  -e REPOS_OWNER="maxhr" \
  -e DOCS_REPO="near--docs" \
  -e SOURCE_REPO="near--near-api-js" \
  -e BUILDER_NAME="near-api-js" \
  -e SOURCE_TAG="v2.0.0" \
  -e GITHUB_TOKEN="$(cat ~/.github-token)" \
  docs-generator