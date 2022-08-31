type SourceName = 'naj' | 'cli'; // TODO: add more
interface Source {
  type: SourceName,
  org: string,
  repo: string,
  publishedTags: string[],
  tagsToPublish: string[],
}
const sources: Record<SourceName, Source> = {
  naj: {
    type: 'naj',
    org: 'near',
    repo: 'near-api-js',
    publishedTags: [],
    tagsToPublish: [],
  },
  cli: {
    type: 'cli',
    org: 'near',
    repo: 'near-cli',
    publishedTags: [],
    tagsToPublish: [],
  }
}
export const publish = async (repos: SourceName[], tag: string) => {
  if (repos[0] === 'naj') {
    const tags = getTags('near', 'near-api-js');
  }
};

const getTags = async (org: string, repo: string) => {

}
const getPublishedTags = async (source: string) => {

}
