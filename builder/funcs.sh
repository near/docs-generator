log () {
  echo "\e[1;36m>>>>> ${1}"
}

pull() {
  log "Pulling repos"

  git clone "${SOURCE_REPO_URL}" "${SOURCE_DIR}"
  git clone "${DOCS_REPO_URL}" "${DOCS_DIR}"

  cd "${SOURCE_DIR}" || log "No source dir" && exit 243

  git checkout "tags/${SOURCE_TAG}" -b "${SOURCE_TAG}"

  log "Running yarn install for source"
  yarn install

  log "Done pull"
}

build_docs() {
  log "Running docs builder script"

  eval "/app/builder/${BUILDER_NAME}.sh"

  log "Done build"
}

push() {
  log "Pushing docs"

  cd "${DOCS_DIR}" || log "No docs dir" && exit 243

  git status
  git checkout -b "${DOCS_NEW_BRANCH}"

  log "(Over)write files to target docs dir"
  rm -rf "${DOCS_TARGET_DIR}"
  mkdir -p "${DOCS_TARGET_DIR}"
  cp -r "${GENERATED_DOCS_DIR}/." "${DOCS_TARGET_DIR}"

  git add .
  git commit -m "${SOURCE_REPO_SAFE} docs"
  git push -u origin "${DOCS_NEW_BRANCH}"

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
    exit 243
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