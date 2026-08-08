import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { buildInstagramFeedResponse } from '../lib/instagramFeed.mjs'

function loadFallback() {
  try {
    const path = join(process.cwd(), 'src/content/instagramFeed.json')
    if (!existsSync(path)) return []
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    return []
  }
}

export default async function handler(req, res) {
  if (req.method && req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Method not allowed' }))
    return
  }

  const token = process.env.IG_ACCESS_TOKEN
  const userId = process.env.IG_USER_ID || 'me'
  const fallbackData = loadFallback()

  const { status, body } = await buildInstagramFeedResponse({
    token,
    userId,
    fallbackData,
  })

  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300')
  res.end(JSON.stringify(body))
}
