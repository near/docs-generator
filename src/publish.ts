import * as core from '@actions/core';
import {Api} from '@octokit/plugin-rest-endpoint-methods/dist-types/types';
import type {GitHub} from '@actions/github/lib/utils';
import {BASE_BRANCH, DocsSource, ReleaseVersion, Source} from './types';
import * as github from '@actions/github';
import {uploadToRepo} from './push-code';
import path from 'path';

const sources: Record<DocsSource, Source> = {
  '@near/near-api-js': {
    type: '@near/near-api-js',
    org: 'near',
    repo: 'near-api-js',
    publishedTags: [],
    tagsToPublish: [],
  },
  '@near/near-cli': {
    type: '@near/near-cli',
    org: 'near',
    repo: 'near-cli',
    publishedTags: [],
    tagsToPublish: [],
  },
  '@near/near-sdk-js': {
    type: '@near/near-sdk-js',
    org: 'near',
    repo: 'near-sdk-js',
    publishedTags: [],
    tagsToPublish: [],
  },
};


export const publish = async (oct: typeof GitHub & Api, docsSource: DocsSource, releaseVersion: ReleaseVersion) => {
  const ts = Date.now();
  const {repo, owner} = github.context.repo;
  core.info(`ts ${ts} repo ${repo} owner ${owner} docsSource ${docsSource} releaseVersion ${releaseVersion}`);
  // const {data: pullRequest} = await oct.rest.pulls.list({
  //   owner,
  //   repo,
  // });
  // const searchPrs = await oct.rest.search.issuesAndPullRequests({
  //   q: `repo:${owner}/${repo} type:pr label:dependency`,
  // })
  const uploadPath = path.resolve('./test-code/1.txt');
  const branch = `docs-generator-test-${ts}`;
  core.info(`uploadPath ${uploadPath} branch ${branch}`);
  const committed = await uploadToRepo(oct,
    uploadPath,
    owner, repo, branch,
  );
  console.log(committed);
  const prCreated = await oct.rest.pulls.create({
    owner, repo, title: `docs-generator test ${ts}`,
    head: branch,
    base: BASE_BRANCH
  });
  console.log(prCreated);
};

// const getReleases = async (org: string, repo: string) => {
//   const releases = await oct.rest.repos.listReleases({
//     owner: org, repo
//   });
//   return releases;
// };
// const getPublishedReleases = async (org: string, repo: string) => {
//
// };
// const getDocsPrs = async() => {
//   // const prs = await oct.rest.pulls.list({
//   //   owner: DOCS_OWNER, repo: DOCS_REPO,
//   //   state: 'open',
//   //   base: 'master',
//   // });
//   const { repository } = await gql(`
//   {
//     repository(owner: "octokit", name: "graphql.js") {
//       issues(last: 3) {
//         edges {
//           node {
//             title
//           }
//         }
//       }
//     }
//   }
// `);
//   return repository;
// }