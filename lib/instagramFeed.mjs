/**
 * Shared Instagram Graph helpers for Vite middleware + Vercel serverless.
 */

export async function igGet(path, token) {
  const url = `https://graph.instagram.com/v21.0/${path}${
    path.includes('?') ? '&' : '?'
  }access_token=${encodeURIComponent(token)}`
  const res = await fetch(url)
  const json = await res.json()
  return { ok: res.ok && !json.error, json }
}

export async function fetchInstagramMedia(userId, token) {
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

export function mapMedia(items) {
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
  const results = metricBlock?.total_value?.breakdowns?.[0]?.results || []
  const out = {}
  for (const row of results) {
    const key = row.dimension_values?.[0]
    if (key) out[key] = row.value ?? 0
  }
  return out
}

export async function fetchInstagramInsights(userId, token) {
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

export async function buildInstagramFeedResponse({
  token,
  userId = 'me',
  fallbackData = [],
}) {
  if (!token) {
    return {
      status: 200,
      body: {
        source: fallbackData.length ? 'fallback' : 'empty',
        message: null,
        softNote: fallbackData.length
          ? 'A few frames from the phrase — follow us for the live feed.'
          : null,
        data: fallbackData,
        insights: null,
      },
    }
  }

  const [mediaResult, insightsResult] = await Promise.all([
    fetchInstagramMedia(userId, token),
    fetchInstagramInsights(userId, token),
  ])

  let data = []
  let source = 'instagram'
  let softNote = null

  if (mediaResult.ok) {
    data = mapMedia(mediaResult.data)
  } else if (fallbackData.length) {
    data = fallbackData
    source = 'fallback'
    softNote = 'Showing curated frames while Instagram catches up.'
  } else {
    source = 'empty'
    softNote = 'Visit Instagram for the latest from The Untold Phrase.'
  }

  const insights =
    insightsResult.ok && insightsResult.insights ? insightsResult.insights : null

  return {
    status: 200,
    body: {
      source,
      message: null,
      softNote,
      data,
      insights,
    },
  }
}
