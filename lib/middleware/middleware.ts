import { NextApiRequest, NextApiResponse } from 'next'
import { NextHandler } from 'next-connect'

export type Middleware = (
  request: NextApiRequest,
  response: NextApiResponse,
  next: NextHandler
) => void
