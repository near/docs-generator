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
import * as fs from 'fs';

export const uploadToRepo = async (
  octo: typeof GitHub & Api,
  coursePath: string,
  org: string,
  repo: string,
  branch: string = `master`
) => {
  // gets commit's AND its tree's SHA
  const currentCommit = await getCurrentCommit(octo, org, repo, branch)
  const globber = await glob.create(coursePath);
  const filesPaths = await globber.glob();
  const filesBlobs = await Promise.all(filesPaths.map(createBlobForFile(octo, org, repo)))
  const pathsForBlobs = filesPaths.map(fullPath => path.relative(coursePath, fullPath))
  const newTree = await createNewTree(
    octo,
    org,
    repo,
    filesBlobs,
    pathsForBlobs,
    currentCommit.treeSha
  )
  const commitMessage = `testing commit`
  const newCommit = await createNewCommit(
    octo,
    org,
    repo,
    commitMessage,
    newTree.sha,
    currentCommit.commitSha
  )
  await setBranchToCommit(octo, org, repo, branch, newCommit.sha)
}


const getCurrentCommit = async (
  octo: typeof GitHub & Api,
  org: string,
  repo: string,
  branch: string = 'master'
) => {
  const { data: refData } = await octo.rest.git.getRef({
    owner: org,
    repo,
    ref: `heads/${branch}`,
  })
  const commitSha = refData.object.sha
  const { data: commitData } = await octo.rest.git.getCommit({
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
const getFileAsUTF8 = (filePath: string) => fs.readFile.__promisify__(filePath, 'utf8')

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
  const tree = blobs.map(({ sha }, index) => ({
    path: paths[index],
    mode: `100644`,
    type: `blob`,
    sha,
  })) as unknown[]
  //@ts-ignore
  const { data } = await octo.rest.git.createTree({
    owner,
    repo,
    tree,
    base_tree: parentTreeSha,
  })
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