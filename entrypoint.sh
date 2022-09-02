#!/bin/sh -l

set -x

git config --global user.email "docs-generator@near"
git config --global user.name "NEAR Docs Generator"
git config --global pull.rebase false

export SOURCE_REPO="https://maxhr:${GITHUB_TOKEN}@github.com/maxhr/${SOURCE_NAME}.git"
export SOURCE_DIR="/work/${SOURCE_NAME}"
export SOURCE_BUILD_SCRIPT=./docs/build.sh
export GENERATED_DOCS_DIR="/work/${SOURCE_NAME}/builder/docs"
export DOCS_REPO="https://maxhr:${GITHUB_TOKEN}@github.com/maxhr/${DOCS_REPO_NAME}.git"
export DOCS_DIR=/work/docs
export DOCS_TARGET_DIR="/work/docs/generated/${SOURCE_NAME}"
export DOCS_NEW_BRANCH="docs-generator/${SOURCE_NAME}/${SOURCE_TAG}/$(date +"%y%m%d_%H%M%S")"
export DOCS_BASE_BRANCH="master"

echo ">>> Running: pull.sh from $CWD $PWD"
git clone --progress --verbose "${SOURCE_REPO}" "${SOURCE_DIR}"
git clone --progress --verbose "${DOCS_REPO}" "${DOCS_DIR}"

cd "${SOURCE_DIR}"

git checkout "tags/${SOURCE_TAG}" -b "${SOURCE_TAG}"
echo ">>> Running yarn install from ${CWD} ${PWD}"
yarn install

echo ">>> Running docs/build.sh from ${CWD} ${PWD}"
eval "${SOURCE_BUILD_SCRIPT}"

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
git commit -m "${SOURCE_NAME} docs"
git status
git push -u origin "${DOCS_NEW_BRANCH}"
git status

echo ">>> Making PR"

gh pr create --head "${DOCS_NEW_BRANCH}" --base "${DOCS_BASE_BRANCH}" --label "docs-generator" --title "Generated: ${SOURCE_NAME}" --body "Generated with Docs Generator"

echo ">>> Finished"