HTTP_RESPONSE=$(curl \
  -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer ${GITHUB_TOKEN}" \
  "https://api.github.com/repos/${GITHUB_REPOSITORY}/pulls" \
  -d "'{\"title\":\"Generated: ${SOURCE_REPO} ${SOURCE_TAG}\",\"body\":\"Generated with Docs Generator\",\"head\":\"${DOCS_NEW_BRANCH}\",\"${DOCS_BASE_BRANCH}\":\"master\"}'")

echo $HTTP_RESPONSE | jq "."
