#!/bin/bash

set -ex

git config --global user.email "docs-generator@near"
git config --global user.name "NEAR Docs Generator"
git config --global pull.rebase false

export SOURCE_REPO_URL="https://${REPOS_OWNER}:${GITHUB_TOKEN}@github.com/${REPOS_OWNER}/${SOURCE_REPO}.git"
export SOURCE_DIR="/app/builder/source-${SOURCE_REPO}"
export DOCS_REPO_URL="https://${REPOS_OWNER}:${GITHUB_TOKEN}@github.com/${REPOS_OWNER}/${DOCS_REPO}.git"
export DOCS_DIR="/app/builder/docs-${DOCS_REPO}"
export DOCS_TARGET_DIR="${DOCS_DIR}/generated/${DOCS_REPO}/${SOURCE_TAG}"
export GENERATED_DOCS_DIR=/app/builder/docs
export DOCS_NEW_BRANCH="docs-generator/${SOURCE_REPO}/${SOURCE_TAG}/$(date +"%y%m%d_%H%M%S")"
export DOCS_BASE_BRANCH="master"

echo ">>> Pulling repos"
git clone "${SOURCE_REPO_URL}" "${SOURCE_DIR}"
git clone "${DOCS_REPO_URL}" "${DOCS_DIR}"

cd "${SOURCE_DIR}"

git checkout "tags/${SOURCE_TAG}" -b "${SOURCE_TAG}"
echo ">>> Running yarn install for source"
yarn install

echo ">>> Running docs builder script"
eval "/app/builder/${BUILDER_NAME}.sh"
echo ">>> Pushing docs"
cd "${DOCS_DIR}"
git status
git checkout -b "${DOCS_NEW_BRANCH}"
rm -rf "${DOCS_TARGET_DIR}"
mkdir -p "${DOCS_TARGET_DIR}"
git status
cp -r "${GENERATED_DOCS_DIR}/." "${DOCS_TARGET_DIR}"
git status
git add .
git status
git commit -m "${SOURCE_REPO} docs"
git status
git push -u origin "${DOCS_NEW_BRANCH}"
git status

echo ">>> Making PR"

gh pr create --head "${DOCS_NEW_BRANCH}" --base "${DOCS_BASE_BRANCH}" --label "docs-generator" --title "Generated: ${SOURCE_REPO} ${SOURCE_TAG}" --body "Generated with Docs Generator"

echo ">>> Finished"
