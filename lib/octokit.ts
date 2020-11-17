import { Octokit } from '@octokit/rest'

const { GITHUB_TOKEN } = process.env
export const octo =
  GITHUB_TOKEN === undefined
    ? new Octokit()
    : new Octokit({ auth: GITHUB_TOKEN })
