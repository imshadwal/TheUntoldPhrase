import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

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

async function igGet(path, token) {
  const url = `https://graph.instagram.com/v21.0/${path}${
    path.includes('?') ? '&' : '?'
  }access_token=${encodeURIComponent(token)}`
  const res = await fetch(url)
  const json = await res.json()
  return { ok: res.ok && !json.error, json }
}

async function fetchInstagramMedia(userId, token) {
  const fields =
    'id,caption,media_url,permalink,thumbnail_url,media_type,timestamp'
  const { ok, json } = await igGet(
    `${userId}/media?fields=${fields}&limit=6`,
    token
  )
  if (ok && Array.isArray(json.data)) {
    return { ok: true, data: json.data }
  }
  return {
    ok: false,
    message: json.error?.message || 'Instagram API error',
    data: [],
  }
}

function mapMedia(items) {
  return items.map((item) => ({
    id: item.id,
    image:
      item.media_type === 'VIDEO'
        ? item.thumbnail_url || item.media_url
        : item.media_url,
    caption: (item.caption || 'View on Instagram').split('\n')[0].slice(0, 110),
    href: item.permalink,
    timestamp: item.timestamp,
  }))
}

function totalValue(metricBlock) {
  return metricBlock?.total_value?.value ?? null
}

function breakdownMap(metricBlock) {
  const results =
    metricBlock?.total_value?.breakdowns?.[0]?.results || []
  const out = {}
  for (const row of results) {
    const key = row.dimension_values?.[0]
    if (key) out[key] = row.value ?? 0
  }
  return out
}

async function fetchInstagramInsights(userId, token) {
  // Insights lag ~48h — end range 2 days ago, look back 30 days
  const until = Math.floor(Date.now() / 1000) - 2 * 86400
  const since = until - 30 * 86400
  const range = `period=day&metric_type=total_value&since=${since}&until=${until}`

  const [profile, totals, follows, followerSeries] = await Promise.all([
    igGet(
      `me?fields=user_id,username,followers_count,media_count,account_type`,
      token
    ),
    igGet(
      `${userId}/insights?metric=views,reach,profile_views,accounts_engaged,total_interactions&${range}`,
      token
    ),
    igGet(
      `${userId}/insights?metric=follows_and_unfollows&${range}&breakdown=follow_type`,
      token
    ),
    igGet(
      `${userId}/insights?metric=reach,follower_count&period=day&since=${since}&until=${until}`,
      token
    ),
  ])

  if (!profile.ok) {
    return {
      ok: false,
      message: profile.json.error?.message || 'Could not load profile',
      insights: null,
    }
  }

  const byName = {}
  for (const item of totals.json.data || []) byName[item.name] = item
  for (const item of follows.json.data || []) byName[item.name] = item

  const followBreakdown = breakdownMap(byName.follows_and_unfollows)
  // Meta returns FOLLOWER = new follows, NON_FOLLOWER = unfollows in this breakdown
  const followsGained = followBreakdown.FOLLOWER ?? followBreakdown.FOLLOW ?? 0
  const unfollows =
    followBreakdown.NON_FOLLOWER ?? followBreakdown.UNFOLLOW ?? 0
  const netFollowers = followsGained - unfollows

  const reachSeries =
    (followerSeries.json.data || []).find((d) => d.name === 'reach')?.values ||
    []
  const dailyReach = reachSeries.map((v) => ({
    date: v.end_time,
    value: v.value ?? 0,
  }))

  const insights = {
    periodDays: 30,
    updatedAt: new Date().toISOString(),
    username: profile.json.username,
    followers: profile.json.followers_count ?? null,
    mediaCount: profile.json.media_count ?? null,
    views: totalValue(byName.views),
    reach: totalValue(byName.reach),
    profileViews: totalValue(byName.profile_views),
    accountsEngaged: totalValue(byName.accounts_engaged),
    interactions: totalValue(byName.total_interactions),
    follows: followsGained,
    unfollows,
    netFollowers,
    dailyReach,
  }

  const hasCore =
    insights.views != null ||
    insights.reach != null ||
    insights.followers != null

  return {
    ok: hasCore,
    message: hasCore
      ? null
      : totals.json.error?.message ||
        follows.json.error?.message ||
        'Insights unavailable',
    insights,
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

function instagramApiPlugin() {
  return {
    name: 'instagram-api',
    configureServer(server) {
      const root = server.config.root

      server.middlewares.use('/api/instagram-feed', async (req, res) => {
        const env = loadEnv(server.config.mode, root, '')
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Cache-Control', 'private, max-age=120')

        // Block non-GET (token never accepted from client body/query)
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

        if (!auth.token) {
          res.statusCode = 200
          res.end(
            JSON.stringify({
              source: feedCache?.data?.length ? 'cache' : 'fallback',
              message:
                'Add IG_ACCESS_TOKEN to .env (see INSTAGRAM_SETUP.md), then restart npm run dev.',
              data: feedCache?.data || [],
              insights: insightsCache?.insights || null,
            })
          )
          return
        }

        auth = await maybeRefreshToken(root, auth)
        const [mediaResult, insightsResult] = await Promise.all([
          fetchInstagramMedia(auth.userId, auth.token),
          fetchInstagramInsights(auth.userId, auth.token),
        ])

        let data = mediaResult.data
        let source = 'instagram'
        let message = null

        if (mediaResult.ok) {
          data = mapMedia(mediaResult.data)
          writeJson(resolve(root, 'data/instagram-cache.json'), {
            updated_at: new Date().toISOString(),
            data,
          })
        } else if (feedCache?.data?.length) {
          data = feedCache.data
          source = 'cache'
          message = mediaResult.message
        } else {
          data = []
          source = 'error'
          message = mediaResult.message
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
          message =
            [message, insightsResult.message].filter(Boolean).join(' · ') ||
            message
        } else if (insightsResult.message) {
          message =
            [message, insightsResult.message].filter(Boolean).join(' · ') ||
            message
        }

        res.end(
          JSON.stringify({
            source,
            message,
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
  // Never expose IG secrets to the client bundle
  envPrefix: ['VITE_'],
})
