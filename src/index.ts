import {GitHub, getOctokitOptions} from '@actions/github/lib/utils'
import {DocsSource, ReleaseVersion} from './types';
import {publish} from './publish';

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
    const docsSource = core.getInput('docs-source') as DocsSource;
    const releaseVersion = core.getInput('release-version') as ReleaseVersion;
    const githubToken = core.getInput('github_token');
    const octokit = new restGithub(githubToken);
    console.log(`building ${docsSource}@${releaseVersion}`);
    await publish(octokit, docsSource, releaseVersion);

  } catch (error) {
    core.setFailed(error.message);
  }
})();