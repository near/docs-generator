import core from '@actions/core';
import github from '@actions/github';

try {
  const docsSource = core.getInput('docs-source');
  const releaseVersion = core.getInput('release-version');
  console.log(`building ${docsSource}@${releaseVersion}`);
  const time = (new Date()).toTimeString();
  core.setOutput('time', time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}