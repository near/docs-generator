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
    // const docsSource = core.getInput('docs_source') as DocsSource;
    // const releaseVersion = core.getInput('release_version') as ReleaseVersion;
    // const githubToken = core.getInput('github_token');
    console.log(process.argv);
    const docsSource = process.argv[2] as DocsSource;
    const releaseVersion = process.argv[3] as ReleaseVersion;
    const githubToken = process.argv[4];
    const options = getOctokitOptions(githubToken, {
      log: {
        debug: (...args: unknown[]) => console.warn(...args),
        info: (...args: unknown[]) => console.warn(...args),
        warn: (...args: unknown[]) => console.warn(...args),
        error: (...args: unknown[]) => console.error(...args),
      },
    });
    const oct = new restGithub(options);
    console.log(`building ${docsSource}@${releaseVersion}`);
    await publish(oct, docsSource, releaseVersion);

  } catch (error) {
    core.setFailed(error.message);
  }
})();