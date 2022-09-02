#!/bin/sh -l

set -ex

git config --global user.email "docs-generator@near"
git config --global user.name "NEAR Docs Generator"
git config pull.rebase true

export SOURCE_NAME=$1
export SOURCE_TAG=$2
export GITHUB_TOKEN=$3

export SOURCE_REPO="https://maxhr:${GITHUB_TOKEN}@github.com/maxhr/${SOURCE_NAME}.git"
export SOURCE_DIR="/work/${SOURCE_NAME}"
export SOURCE_BUILD_SCRIPT=./docs/build.sh
export GENERATED_DOCS_DIR="/work/${SOURCE_NAME}/builder/docs"
export DOCS_REPO="https://maxhr:${GITHUB_TOKEN}@github.com/maxhr/${DOCS_REPO_NAME}.git"
export DOCS_DIR=/work/docs
export DOCS_TARGER_DIR="/work/docs/generated/${SOURCE_NAME}"
export DOCS_NEW_BRANCH="docs-generator-$(date +%s)"
export DOCS_BASE_BRANCH="master"

/app/src/pull.sh

