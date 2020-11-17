import { Octokit } from '@octokit/rest'
import { RequestError } from '@octokit/types'

const { GITHUB_TOKEN } = process.env
export const octo =
  GITHUB_TOKEN === undefined
    ? new Octokit()
    : new Octokit({ auth: GITHUB_TOKEN })

// @ts-expect-error
export const isRequestError: (
  error: unknown
) => error is RequestError = error => {
  if (error instanceof Error === false) return false
  if (typeof error !== 'object') return false
  if (error === null) return false

  if ('name' in error === false) return false
  if ('status' in error === false) return false
  if ('documentation_url' in error === false) return false

  const error_ = error as Record<string, unknown>
  if (typeof error_.name !== 'string') return false
  if (typeof error_.status !== 'number') return false
  if (typeof error_.documentation_url !== 'string') return false

  return true
}
