export type DocsSource = '@near/near-api-js' | '@near/near-cli' | '@near/near-sdk-js';
export type ReleaseVersion = string;
export interface Source {
  type: DocsSource,
  org: string,
  repo: string,
  publishedTags: string[],
  tagsToPublish: string[],
}