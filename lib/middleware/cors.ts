import { NextApiRequest, NextApiResponse } from 'next'
import { NextHandler } from 'next-connect'

export const cors = (
  request: NextApiRequest,
  resp: NextApiResponse,
  next: NextHandler
) => {
  if (request.headers.origin) {
    resp.setHeader('Access-Control-Allow-Origin', request.headers.origin)
    resp.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
    resp.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    )

    if (request.method === 'OPTIONS') {
      return resp.status(200).end()
    }
  }

  return next()
}
