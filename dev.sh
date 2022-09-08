#!/bin/sh -l

#docker build -t docs-generator . && docker run \
#  -e GITHUB_REPOSITORY_OWNER="maxhr" \
#  -e GITHUB_REPOSITORY="maxhr/near--docs" \
#  -e SOURCE_REPO="maxhr/near--near-api-js" \
#  -e BUILDER_NAME="near-api-js" \
#  -e SOURCE_TAG="v2.0.0" \
#  -e GITHUB_TOKEN="$(cat ~/.github-token)" \
#  docs-generator

docker build -t docs-generator . && docker run \
  -e GITHUB_REPOSITORY_OWNER="maxhr" \
  -e GITHUB_REPOSITORY="maxhr/near--docs" \
  -e SOURCE_REPO="near/near-api-js" \
  -e BUILDER_NAME="near-api-js" \
  -e SOURCE_TAG="v1.0.0" \
  -e GITHUB_TOKEN="$(cat ~/.github-token)" \
  docs-generator
