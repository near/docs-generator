# docs-generator

This is:
- A GitHub Action that should run on the docs repo (`near/docs`)
- A GitHub app (`./docs-bot`) that should be installed on the docs repo (`near/docs`)

### GitHub Action

This is a containerized action (see `Dockerfile`).

Inputs:
- `source_repo`: Source repo to generate docs for (`near/near-api-js` and others. Or your fork - ex: `maxhr/near--near-api-js`)
- `release_version`: The git tag to check out, this should match the release version of the package (`v1.0.0`)
- `builder_name`: Name of builder file in `./builder`. Today: `near-api-js`. Soon also: `near-cli | near-sdk-js`
- `github_token`: If you run `dev.sh` it's your Personal Access Token with repos permissions. When running in GitHub workflow - GH provides it automatically as an env var.

`entrypoint.sh`:
- Pulls source and docs
- Builds doc - in `/builder` dir there are build files that match the `builder_name` input (ex: `builder/near-api-js.sh`)
- Creates a PR in the docs repo (the repo that this action runs on)

### GitHub App (Docs Bot)

The app (`./docs-bot`), is published on Vercel (https://docs-bot.vercel.app).

It's (current) purpose is to trigger `repository_dispatch` in the docs repo.

This is done with an App because GitHub doesn't allow triggering `repository_dispatch` from inside the workflow cross-repos, 
unless you provide a Personal Access Token, which gives too much permissions to the workflow.
A GitHub app limits the permissions only the repo it's installed on.

It should be installed on the docs repo and its `https://docs-bot.vercel.app/api/on-release` endpoint can be called
from `near/near-api-js` (and others) workflow when a new version get released. This is to be able to trigger docs build
automatically. You can also invoke the GitHub action (described above) manually with `workflow_dispatch` event.

See the workflows in the docs repo to see how it's configured for manual and automatic listeners.

See the workflows in `near-api-js` repo to see how it's being triggered automatically.

The endpoint must receive a secret token `DOCS_BOT_SECRET`.

## Contributing

You need a GitHub access token with repos permissions to run `./dev.sh`.
Make sure you have it in your `~/.github-token`.

`./dev.sh` will run docker container with the needed params.

- `GITHUB_REPOSITORY_OWNER` - should be `near` or you if you forked
- `GITHUB_REPOSITORY` - `near/docs` or your fork
- `SOURCE_REPO` - for example `near/near-api-js`
- `BUILDER_NAME` - at the moment `near-api-js` others soon. This will run `builder/near-api-js.sj`
- `SOURCE_TAG` - the published package version to checkot (ex: `v1.0.0`)
- `GITHUB_TOKEN` - access token. GitHub provides it in Action Workflow. For local dev you need a Personal Access Token.

`./dev-attach.sh` will run attach to the container, without running the entrypoint file.
You can use it to run `entrypoint.sh` manually for debugging.