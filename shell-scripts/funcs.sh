log () {
  echo ">>>>> ${1}"
}

pull() {
  log "Pulling repos"

  git clone "${SOURCE_REPO_URL}" "${SOURCE_DIR}" --verbose
  git clone "${DOCS_REPO_URL}" "${DOCS_DIR}" --verbose

  cd "${SOURCE_DIR}" || (log "No source dir" && exit 201)
  git checkout "tags/${SOURCE_TAG}" -b "${SOURCE_TAG}"
  log "Running yarn install for source"
  yarn install

  log "Running yarn install for docs website"
  cd "${DOCS_DIR}/website" || (log "No website dir" && exit 208)
  yarn install

  cd "${DOCS_DIR}" || (log "No docs dir" && exit 210)

  log "Done pull"
}

build_docs() {
  log "Running docs builder script"
  eval "/app/builder/${BUILDER_NAME}.sh"

  log "(Over)write files to target docs dir"
  rm -rf -v "${DOCS_TARGET_DIR}"
  mkdir -p -v "${DOCS_TARGET_DIR}"
  cd "${GENERATED_DOCS_DIR}" || (log "No generated docs dir" && exit 213)
  mv -v ./* "${DOCS_TARGET_DIR}"

  patch_versions

  log "Done build"
}

patch_versions () {
  log "Creating docusaurus version"
  rm -rf "${DOCS_DIR}/website/${BUILDER_NAME}_versioned_docs/version-${SOURCE_TAG}"
  rm -rf "${DOCS_DIR}/website/${BUILDER_NAME}_versioned_sidebars/version-${SOURCE_TAG}"

  log "Patch versions file"
  versions_file="${DOCS_DIR}/website/near-api-js_versions.json"
  node -e "
    let versions = JSON.parse(process.argv[1]);
    versions = versions.filter(v => v !== '${SOURCE_TAG}');
    console.log(JSON.stringify(versions,null,2));
  " "$(cat "${versions_file}")" >| "${versions_file}"
  cd "${DOCS_DIR}/website" || (log "No website dir" && exit 205)
  yarn docusaurus docs:version:"${BUILDER_NAME}" "${SOURCE_TAG}"
  rm -rf "${DOCS_TARGET_DIR}"
}

push() {
  log "Pushing docs"

  cd "${DOCS_DIR}" || (log "No docs dir" && exit 202)

  git status -v -v
  git checkout -b "${DOCS_NEW_BRANCH}"
  git add . --verbose
  git commit -m "${SOURCE_REPO_SAFE} docs"
  git push -u origin "${DOCS_NEW_BRANCH}" --verbose
  git status -v -v

  log "Done pushing"
}

github_pr() {
  log "Making PR"

  HTTP_RESPONSE=$(curl \
    --request POST "https://api.github.com/repos/${GITHUB_REPOSITORY}/pulls" \
    --header "Accept: application/vnd.github+json" \
    --header "${GH_HTTP_AUTH}" \
    --header "Content-Type: application/json" \
    --data-raw "{
        \"title\":\"Generated: ${SOURCE_REPO} ${SOURCE_TAG}\",
        \"body\":\"Generated with Docs Generator\",
        \"head\":\"${DOCS_NEW_BRANCH}\",
        \"base\":\"${DOCS_BASE_BRANCH}\"
      }")

  export PR_NUMBER=$(echo $HTTP_RESPONSE | jq ".number")

  if [ "${PR_NUMBER}" == "null" ]; then
    log "PR number is null"
    exit 203
  fi

  log "Labeling PR"
  curl --request POST "https://api.github.com/repos/${GITHUB_REPOSITORY}/issues/${PR_NUMBER}/labels" \
    --header "Accept: application/vnd.github.v3+json" \
    --header "${GH_HTTP_AUTH}" \
    --header "Content-Type: application/json" \
    --data-raw '{
        "labels": ["docs-generator"]
    }'

  log "Finished PR"
}