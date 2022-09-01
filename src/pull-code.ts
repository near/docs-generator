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

export const pullAndGenerate = async (
  octo: typeof GitHub & Api,
  org: string,
  repo: string,
  branch: string,
) => {
  const repoPath = `https://github.com/${org}/${repo}.git`;
  const dirPath = `./@${org}/${repo}`
  await exec.exec(path.resolve(__dirname, '../src/pull.sh'), [], {
    cwd: path.resolve(__dirname, '../'),
  });
  console.log('pullAndGenerate success');
}
