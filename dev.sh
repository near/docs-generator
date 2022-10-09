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
  -e SOURCE_TAG="near-api-js@1.1.0" \
  -e GITHUB_TOKEN="$(cat ~/.github-token)" \
  docs-generator

#docker build -t docs-generator . && docker run \
#  -e GITHUB_REPOSITORY_OWNER="maxhr" \
#  -e GITHUB_REPOSITORY="maxhr/near--docs" \
#  -e SOURCE_REPO="near/near-sdk-js" \
#  -e BUILDER_NAME="near-sdk-js" \
#  -e SOURCE_TAG="v0.5.0" \
#  -e GITHUB_TOKEN="$(cat ~/.github-token)" \
#  docs-generator
