#!/bin/bash

set -ex

. /app/builder/funcs.sh

git config --global user.email "docs-generator@near"
git config --global user.name "NEAR Docs Generator"
git config --global pull.rebase false

export SOURCE_REPO_SAFE="${SOURCE_REPO/\//"-"}"
export DOCS_REPO_SAFE="${GITHUB_REPOSITORY/\//"-"}"

export SOURCE_REPO_URL="https://${GITHUB_REPOSITORY_OWNER}:${GITHUB_TOKEN}@github.com/${SOURCE_REPO}.git"
export SOURCE_DIR="/app/builder/source-${SOURCE_REPO_SAFE}"
export DOCS_REPO_URL="https://${GITHUB_REPOSITORY_OWNER}:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
export DOCS_DIR="/app/builder/docs-${DOCS_REPO_SAFE}"
export DOCS_TARGET_DIR="${DOCS_DIR}/generated/${DOCS_REPO_SAFE}/${SOURCE_TAG}"
export GENERATED_DOCS_DIR=/app/builder/docs
export DOCS_NEW_BRANCH="docs-generator/${SOURCE_REPO_SAFE}/${SOURCE_TAG}/$(date +"%y%m%d_%H%M%S")"
export DOCS_BASE_BRANCH="master"

export GH_HTTP_AUTH="Authorization: Bearer ${GITHUB_TOKEN}"

pull
build_docs
push
github_pr
