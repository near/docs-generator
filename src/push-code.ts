import {GitHub} from '@actions/github/lib/utils';
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as glob from '@actions/glob';
import * as http from '@actions/http-client';
import * as io from '@actions/io';
import * as tc from '@actions/tool-cache';
import * as artifact from '@actions/artifact';
import * as cache from '@actions/cache';
import * as github from '@actions/github';
import path from 'path'
import {Api} from '@octokit/plugin-rest-endpoint-methods/dist-types/types';
import {Globber} from '@actions/glob';
import {promises as fs} from 'fs';

export const uploadToRepo = async (
  octo: typeof GitHub & Api,
  coursePath: string,
  org: string,
  repo: string,
  branch: string = `master`
) => {
  let currentCommit;
  try {
    currentCommit = await getCurrentCommit(octo, org, repo, 'master')
  } catch (e) {
    console.log('current commit error', e);
    throw e;
  }
  core.info(`currentCommit ${JSON.stringify(currentCommit)}`);
  const globber = await glob.create(coursePath, {followSymbolicLinks: false});
  const filesAndDirsPaths = await globber.glob();
  let filesPaths = (await Promise.all(filesAndDirsPaths.map(async f => {
    const lstat = await fs.lstat(f);
    if (lstat.isFile()) {
      return f;
    } else {
      return null;
    }
  }))).filter(f => f !== null);
  console.log(`globber count ${filesPaths.length}`);
  let filesBlobs;
  filesPaths = filesPaths.slice(0, 20);
  console.log('filesPaths', filesPaths);
  try {
    filesBlobs = await Promise.all(filesPaths.map(createBlobForFile(octo, org, repo)))
  } catch (e) {
    console.error('createBlobForFile error', e);
    throw e;
  }
  const pathsForCommit = filesPaths.map(fullPath => path.relative(path.resolve(__dirname, '../..'), fullPath))
  console.log('pathsForCommit', pathsForCommit);
  core.info(`pathsForCommit ${pathsForCommit.length}`);
  let newTree;
  try {
    newTree = await createNewTree(
      octo,
      org,
      repo,
      filesBlobs,
      pathsForCommit,
      currentCommit.treeSha
    );
  } catch (e) {
    console.log('createNewTree error', e);
    throw e;
  }
  core.info(`newTree ${JSON.stringify(newTree)}`);
  const commitMessage = `testing commit`
  let newCommit;
  try {
    newCommit = await createNewCommit(
      octo,
      org,
      repo,
      commitMessage,
      newTree.sha,
      currentCommit.commitSha
    )
  } catch (e) {
    console.log('createNewCommit error', e);
    throw e;
  }

  core.info(`newCommit ${JSON.stringify(newCommit)}`);
  try {
    await setBranchToCommit(octo, org, repo, branch, newCommit.sha)
  } catch (e) {
    console.log('setBranchToCommit error', e);
    throw e;
  }
}


const getCurrentCommit = async (
  octo: typeof GitHub & Api,
  org: string,
  repo: string,
  branch: string = 'master'
) => {
  const {data: refData} = await octo.rest.git.getRef({
    owner: org,
    repo,
    ref: `heads/${branch}`,
  })
  const commitSha = refData.object.sha
  const {data: commitData} = await octo.rest.git.getCommit({
    owner: org,
    repo,
    commit_sha: commitSha,
  })
  return {
    commitSha,
    treeSha: commitData.tree.sha,
  }
}

// Notice that readFile's utf8 is typed differently from Github's utf-8
const getFileAsUTF8 = (filePath: string) => fs.readFile(filePath, 'utf8')

const createBlobForFile = (octo: typeof GitHub & Api, org: string, repo: string) => async (
  filePath: string
) => {
  const content = await getFileAsUTF8(filePath)
  const blobData = await octo.rest.git.createBlob({
    owner: org,
    repo,
    content,
    encoding: 'utf-8',
  })
  return blobData.data
}

const createNewTree = async (
  octo: typeof GitHub & Api,
  owner: string,
  repo: string,
  blobs: unknown[],
  paths: string[],
  parentTreeSha: string
) => {
  // My custom config. Could be taken as parameters
  const tree = blobs.map(({sha}, index) => ({
    path: paths[index],
    mode: `100644`,
    type: `blob`,
    sha,
  })) as unknown[]
  console.log('creating tree');
  //@ts-ignore
  const {data} = await octo.rest.git.createTree({
    owner,
    repo,
    tree,
    base_tree: parentTreeSha,
  })
  console.log('tree created');
  return data
}

const createNewCommit = async (
  octo: typeof GitHub & Api,
  org: string,
  repo: string,
  message: string,
  currentTreeSha: string,
  currentCommitSha: string
) =>
  (await octo.rest.git.createCommit({
    owner: org,
    repo,
    message,
    tree: currentTreeSha,
    parents: [currentCommitSha],
  })).data

const setBranchToCommit = (
  octo: typeof GitHub & Api,
  org: string,
  repo: string,
  branch: string = `master`,
  commitSha: string
) =>
  octo.rest.git.updateRef({
    owner: org,
    repo,
    ref: `heads/${branch}`,
    sha: commitSha,
  })