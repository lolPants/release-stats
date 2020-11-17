import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { NextApiRequest } from 'next'
import { resolveQuery as rq } from '~utils/query'
import { Middleware } from './middleware'

export const repo: Middleware = async (request, resp, next) => {
  const { owner, repo } = getRepo(request)
  if (owner === undefined || repo === undefined) {
    return resp.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST)
  }

  const r = await fetch(`https://api.github.com/repos/${owner}/${repo}`)
  if (r.status === StatusCodes.OK) return next()
  if (r.status === StatusCodes.NOT_FOUND) {
    return resp.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND)
  }

  return resp
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send(ReasonPhrases.INTERNAL_SERVER_ERROR)
}

export const getRepo = (request: NextApiRequest) => ({
  owner: rq(request.query.owner),
  repo: rq(request.query.repo),
})
