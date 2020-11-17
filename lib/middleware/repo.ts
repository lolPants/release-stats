import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { resolveQuery as rq } from '~utils/query'
import { Middleware } from './middleware'

export const repo: Middleware = async (request, resp, next) => {
  const user = rq(request.query.user)
  const repo = rq(request.query.repo)

  if (user === undefined || repo === undefined) {
    return resp.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST)
  }

  const r = await fetch(`https://api.github.com/repos/${user}/${repo}`)
  if (r.status === StatusCodes.OK) return next()
  if (r.status === StatusCodes.NOT_FOUND) {
    return resp.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND)
  }

  return resp
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send(ReasonPhrases.INTERNAL_SERVER_ERROR)
}
