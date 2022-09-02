#!/bin/sh -l

docker build -t docs-generator . && docker run -it --entrypoint /bin/bash \
  -e REPOS_OWNER="maxhr" \
  -e DOCS_REPO="maxhr/near--docs" \
  -e SOURCE_REPO="maxhr/near--near-api-js" \
  -e BUILDER_NAME="near-api-js" \
  -e SOURCE_TAG="v2.0.0" \
  -e GITHUB_TOKEN="$(cat ~/.github-token)" \
  docs-generator