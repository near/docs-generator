#!/bin/sh

echo ">>> Running: pull.sh from $CWD $PWD"
git clone --progress --verbose "${SOURCE_REPO}" "${SOURCE_DIR}"
git clone --progress --verbose "${DOCS_REPO}" "${DOCS_DIR}"

cd "${SOURCE_DIR}"

git checkout "tags/${SOURCE_TAG}" -b "${SOURCE_TAG}"
git pull
echo ">>> Running yarn install from ${CWD} ${PWD}"
yarn install

echo ">>> Running docs/build.sh from ${CWD} ${PWD}"
eval "${SOURCE_BUILD_SCRIPT}"

mkdir -p "${DOCS_TARGER_DIR}"

cp -r "${GENERATED_DOCS_DIR}/." "${DOCS_TARGER_DIR}"

echo ">>> Pushing docs"
cd "${DOCS_DIR}"
git add .
git checkout -b "${DOCS_NEW_BRANCH}"
git commit -m "${SOURCE_NAME} docs"
git push -u origin "${DOCS_NEW_BRANCH}"

echo ">>> Making PR"

gh pr create --head "${DOCS_NEW_BRANCH}" --base "${DOCS_BASE_BRANCH}" --label "docs-generator" --title "Generated: ${SOURCE_NAME}" --body "Generated with Docs Generator"
