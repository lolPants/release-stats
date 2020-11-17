import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { NextApiRequest } from 'next'
import { isRequestError, octo } from '~octokit'
import { resolveQuery as rq } from '~utils/query'
import { Middleware } from './middleware'

export const repo: Middleware = async (request, resp, next) => {
  const { owner, repo } = getRepo(request)
  if (owner === undefined || repo === undefined) {
    return resp.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST)
  }

  try {
    await octo.request('GET /repos/:owner/:repo', { owner, repo })
    return next()
  } catch (error: unknown) {
    if (isRequestError(error)) {
      if (error.status === StatusCodes.NOT_FOUND) {
        return resp.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND)
      }

      console.error(error)
      return resp
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(ReasonPhrases.INTERNAL_SERVER_ERROR)
    }

    throw error
  }
}

export const getRepo = (request: NextApiRequest) => ({
  owner: rq(request.query.owner),
  repo: rq(request.query.repo),
})
