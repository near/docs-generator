import {GitHub, getOctokitOptions} from '@actions/github/lib/utils'

const core = require('@actions/core');
const exec = require('@actions/exec');
const glob = require('@actions/glob');
const http = require('@actions/http-client');
const io = require('@actions/io');
const tc = require('@actions/tool-cache');
const artifact = require('@actions/artifact');
const cache = require('@actions/cache');
const github = require('@actions/github');
const {restEndpointMethods} = require('@octokit/plugin-rest-endpoint-methods');
const restGithub = GitHub.plugin(restEndpointMethods);

(async () => {
  try {
    const docsSource = core.getInput('docs-source');
    const releaseVersion = core.getInput('release-version');
    const githubToken = core.getInput('github_token');

    const octokit = new restGithub(githubToken);
    console.log(`building ${docsSource}@${releaseVersion}`);
    console.log(JSON.stringify(process.env, undefined, 2))

    const payload = JSON.stringify(github.context.payload, undefined, 2);
    console.log(`The event payload: ${payload}`);
    const {data: pullRequest} = await octokit.rest.pulls.get({
      owner: 'near',
      repo: 'docs',
      pull_number: 100,
      mediaType: {
        format: 'diff'
      }
    });
    console.log(pullRequest);
  } catch (error) {
    core.setFailed(error.message);
  }
})();