import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  fetchInstagramMedia,
  fetchInstagramInsights,
  mapMedia,
  buildInstagramFeedResponse,
} from './lib/instagramFeed.mjs'

function readJson(path) {
  if (!existsSync(path)) return null
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    return null
  }
}

function loadToken(root, env) {
  const store = readJson(resolve(root, '.instagram-token.json'))
  if (store?.access_token) {
    return {
      token: store.access_token,
      userId: store.user_id || env.IG_USER_ID || 'me',
      expiresAt: store.expires_at ? Date.parse(store.expires_at) : null,
    }
  }
  return {
    token: env.IG_ACCESS_TOKEN,
    userId: env.IG_USER_ID || 'me',
    expiresAt: env.IG_TOKEN_EXPIRES_AT ? Date.parse(env.IG_TOKEN_EXPIRES_AT) : null,
  }
}

async function maybeRefreshToken(root, current) {
  if (!current.token) return current
  if (current.expiresAt && current.expiresAt - Date.now() > 10 * 86400 * 1000) {
    return current
  }

  try {
    const url =
      'https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=' +
      encodeURIComponent(current.token)
    const res = await fetch(url)
    const json = await res.json()
    if (!json.access_token) return current

    const expiresAt = new Date(Date.now() + json.expires_in * 1000).toISOString()
    const userId = current.userId || 'me'
    writeFileSync(
      resolve(root, '.instagram-token.json'),
      JSON.stringify(
        {
          access_token: json.access_token,
          user_id: userId,
          expires_in: json.expires_in,
          expires_at: expiresAt,
          refreshed_at: new Date().toISOString(),
        },
        null,
        2
      ) + '\n'
    )
    writeFileSync(
      resolve(root, '.env'),
      `# Instagram Login — long-lived. Refresh: npm run ig:refresh
IG_ACCESS_TOKEN=${json.access_token}
IG_USER_ID=${userId}
IG_TOKEN_EXPIRES_AT=${expiresAt}
`
    )
    return { token: json.access_token, userId, expiresAt: Date.parse(expiresAt) }
  } catch {
    return current
  }
}

function writeJson(path, data) {
  try {
    mkdirSync(resolve(path, '..'), { recursive: true })
    writeFileSync(path, JSON.stringify(data, null, 2) + '\n')
  } catch {
    // ignore
  }
}

function loadFallback(root) {
  return readJson(resolve(root, 'src/content/instagramFeed.json')) || []
}

function instagramApiPlugin() {
  return {
    name: 'instagram-api',
    configureServer(server) {
      const root = server.config.root

      server.middlewares.use('/api/instagram-feed', async (req, res) => {
        const env = loadEnv(server.config.mode, root, '')
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Cache-Control', 'private, max-age=120')

        if (req.method && req.method !== 'GET' && req.method !== 'HEAD') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        let auth = loadToken(root, env)
        const feedCache = readJson(resolve(root, 'data/instagram-cache.json'))
        const insightsCache = readJson(
          resolve(root, 'data/instagram-insights.json')
        )
        const fallbackData =
          feedCache?.data?.length > 0
            ? feedCache.data
            : loadFallback(root)

        if (!auth.token) {
          const { body } = await buildInstagramFeedResponse({
            token: null,
            fallbackData,
          })
          res.statusCode = 200
          res.end(JSON.stringify(body))
          return
        }

        auth = await maybeRefreshToken(root, auth)
        const [mediaResult, insightsResult] = await Promise.all([
          fetchInstagramMedia(auth.userId, auth.token),
          fetchInstagramInsights(auth.userId, auth.token),
        ])

        let data = []
        let source = 'instagram'
        let softNote = null

        if (mediaResult.ok) {
          data = mapMedia(mediaResult.data)
          writeJson(resolve(root, 'data/instagram-cache.json'), {
            updated_at: new Date().toISOString(),
            data,
          })
        } else if (fallbackData.length) {
          data = fallbackData
          source = feedCache?.data?.length ? 'cache' : 'fallback'
          softNote = 'Showing curated frames while Instagram catches up.'
        } else {
          source = 'empty'
          softNote = 'Visit Instagram for the latest from The Untold Phrase.'
        }

        let insights = null
        if (insightsResult.ok && insightsResult.insights) {
          insights = insightsResult.insights
          writeJson(resolve(root, 'data/instagram-insights.json'), {
            updated_at: new Date().toISOString(),
            insights,
          })
        } else if (insightsCache?.insights) {
          insights = insightsCache.insights
        }

        res.end(
          JSON.stringify({
            source,
            message: null,
            softNote,
            data,
            insights,
          })
        )
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), instagramApiPlugin()],
  envPrefix: ['VITE_'],
})
