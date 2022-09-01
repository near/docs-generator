// const core = require('@actions/core');
// const github = require('@actions/github');
//
// try {
//   const docsSource = core.getInput('docs-source');
//   const releaseVersion = core.getInput('release-version');
//   const token = core.getInput('github_token');
//   console.log(`building ${docsSource}@${releaseVersion}`);
//   console.log(JSON.stringify(process.env, undefined, 2))
//   const time = (new Date()).toTimeString();
//   core.setOutput('time', time);
//   // Get the JSON webhook payload for the event that triggered the workflow
//   const payload = JSON.stringify(github.context.payload, undefined, 2);
//   console.log(`The event payload: ${payload}`);
// } catch (error) {
//   core.setFailed(error.message);
// }