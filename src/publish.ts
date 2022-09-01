import {Api} from '@octokit/plugin-rest-endpoint-methods/dist-types/types';
import type {GitHub} from '@actions/github/lib/utils';
import {DocsSource, ReleaseVersion, Source} from './types';
import * as github from '@actions/github';

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

export const publish = async (octokit: typeof GitHub & Api, docsSource: DocsSource, releaseVersion: ReleaseVersion) => {
  const {repo, owner} = github.context.repo;
  // const {data: pullRequest} = await octokit.rest.pulls.list({
  //   owner,
  //   repo,
  // });
  const data = await octokit.rest.search.issuesAndPullRequests({
    q: `repo:${owner}/${repo} type:pr label:dependency`,
  })
  console.log(data);
  // gql = graphql.defaults({
  //   headers: {
  //     authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
  //   },
  // });
  // const source = sources[sourceId];
  // const releases = await getReleases(source.org, source.repo);
  // const docsPrs = await getDocsPrs();
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