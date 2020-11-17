import { Octokit } from '@octokit/rest'
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { cors } from '~middleware/cors'
import { getRepo, repo } from '~middleware/repo'

const octo = new Octokit()
const handler = nc<NextApiRequest, NextApiResponse>()
  .use(cors)
  .use(repo)
  .get(async (request, resp) => {
    const { owner, repo } = getRepo(request)
    const releases = await octo.paginate('GET /repos/:owner/:repo/releases', {
      owner,
      repo,
      per_page: 100,
    })

    let total = 0
    const assets: Map<string, number> = new Map()
    const tags: Map<string, number> = new Map()

    for await (const release of releases) {
      let tagCount = tags.get(release.tag_name) ?? 0

      for (const asset of release.assets) {
        total += asset.download_count
        tagCount += asset.download_count

        const assetCount = assets.get(asset.name) ?? 0
        assets.set(asset.name, assetCount + asset.download_count)
      }

      tags.set(release.tag_name, tagCount)
    }

    resp.send({
      total,
      assets: Object.fromEntries(assets.entries()),
      tags: Object.fromEntries(tags.entries()),
    })
  })

export default handler
