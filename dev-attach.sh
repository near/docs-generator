#!/bin/sh -l

docker build -t docs-generator . && docker run -it --entrypoint /bin/bash docs-generator

# export DOCS_REPO_NAME="near--docs"
# export SOURCE_NAME="near--near-api-js"
# export SOURCE_TAG="v2.0.0"
# export GITHUB_TOKEN="$(cat ~/.github-token)"