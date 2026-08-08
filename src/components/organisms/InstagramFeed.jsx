import { useEffect, useState } from 'react'
import site from '../../content/site.json'
import fallbackFeed from '../../content/instagramFeed.json'
import Reveal from '../atoms/Reveal'
import './InstagramFeed.css'

function IgIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden fill="currentColor">
      <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7zm5 2.8A4.2 4.2 0 1 1 7.8 12 4.2 4.2 0 0 1 12 7.8zm0 2a2.2 2.2 0 1 0 2.2 2.2A2.2 2.2 0 0 0 12 9.8zM17.4 6.4a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" />
    </svg>
  )
}

function formatCount(value) {
  if (value == null || Number.isNaN(value)) return '—'
  const n = Number(value)
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (abs >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`
  return new Intl.NumberFormat('en-IN').format(n)
}

function formatSigned(value) {
  if (value == null || Number.isNaN(value)) return '—'
  const n = Number(value)
  const prefix = n > 0 ? '+' : ''
  return `${prefix}${formatCount(n)}`
}

function ReachSparkline({ points = [] }) {
  if (!points.length) return null
  const values = points.map((p) => p.value)
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const w = 280
  const h = 56
  const pad = 4
  const coords = values.map((v, i) => {
    const x = pad + (i / Math.max(values.length - 1, 1)) * (w - pad * 2)
    const y = h - pad - ((v - min) / Math.max(max - min, 1)) * (h - pad * 2)
    return `${x},${y}`
  })

  return (
    <svg
      className="ig-spark"
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label="Daily reach over the last 30 days"
    >
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={coords.join(' ')}
      />
    </svg>
  )
}

function InsightCard({ label, value, hint, tone }) {
  return (
    <div className={`ig-stat ${tone ? `ig-stat--${tone}` : ''}`}>
      <p className="ig-stat__label">{label}</p>
      <p className="ig-stat__value">{value}</p>
      {hint ? <p className="ig-stat__hint">{hint}</p> : null}
    </div>
  )
}

export default function InstagramFeed() {
  const [posts, setPosts] = useState([])
  const [insights, setInsights] = useState(null)
  const [note, setNote] = useState('')

  useEffect(() => {
    let alive = true

    async function load() {
      try {
        const res = await fetch('/api/instagram-feed')
        const json = await res.json()
        if (!alive) return

        if (json.data?.length) {
          setPosts(json.data)
        } else {
          setPosts(fallbackFeed)
        }

        if (json.insights) setInsights(json.insights)
        setNote(json.message || '')
      } catch {
        if (!alive) return
        setPosts(fallbackFeed)
        setNote('Could not reach Instagram API. Showing curated frames for now.')
      }
    }

    load()
    return () => {
      alive = false
    }
  }, [])

  const netTone =
    insights?.netFollowers == null
      ? null
      : insights.netFollowers < 0
        ? 'down'
        : insights.netFollowers > 0
          ? 'up'
          : null

  return (
    <section className="section ig-feed">
      <div className="container">
        <Reveal>
          <div className="ig-feed__header">
            <div>
              <p className="eyebrow">On Instagram</p>
              <h2 className="section-title ig-feed__handle">{site.instagramHandle}</h2>
              <p className="section-support">
                {insights?.followers != null
                  ? `${formatCount(insights.followers)} followers`
                  : site.followerCount}
                {insights ? ' · Last 30 days insights' : ' · Latest from the phrase'}
              </p>
              {note ? <p className="ig-feed__note">{note}</p> : null}
            </div>
            <a
              className="btn btn--primary ig-feed__follow"
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
            >
              <IgIcon />
              Follow TUP
            </a>
          </div>
        </Reveal>

        {insights ? (
          <Reveal>
            <div className="ig-insights">
              <div className="ig-insights__top">
                <div>
                  <p className="eyebrow">Account pulse</p>
                  <h3 className="ig-insights__title">Last 30 days</h3>
                  <p className="ig-insights__support">
                    Real-time Instagram insights for @{insights.username || 'theuntoldphrase'}.
                    Data can lag up to 48 hours.
                  </p>
                </div>
                <div className="ig-insights__chart">
                  <p className="ig-stat__label">Daily reach</p>
                  <ReachSparkline points={insights.dailyReach || []} />
                </div>
              </div>

              <div className="ig-stats">
                <InsightCard
                  label="Followers"
                  value={formatCount(insights.followers)}
                  hint="Current total"
                />
                <InsightCard
                  label="Net change"
                  value={formatSigned(insights.netFollowers)}
                  hint={`${formatCount(insights.follows)} in · ${formatCount(insights.unfollows)} out`}
                  tone={netTone}
                />
                <InsightCard
                  label="Views"
                  value={formatCount(insights.views)}
                  hint="Content views"
                />
                <InsightCard
                  label="Reach"
                  value={formatCount(insights.reach)}
                  hint="Unique accounts"
                />
                <InsightCard
                  label="Profile visits"
                  value={formatCount(insights.profileViews)}
                />
                <InsightCard
                  label="Accounts engaged"
                  value={formatCount(insights.accountsEngaged)}
                />
                <InsightCard
                  label="Interactions"
                  value={formatCount(insights.interactions)}
                  hint="Likes, comments, shares…"
                />
                <InsightCard
                  label="Posts on profile"
                  value={formatCount(insights.mediaCount)}
                  hint="All-time media"
                />
              </div>
            </div>
          </Reveal>
        ) : null}

        <div className="ig-feed__grid">
          {posts.map((item, index) => (
            <Reveal key={item.id} className={`ig-frame-wrap delay-${index % 3}`}>
              <a
                className="ig-frame"
                href={item.href || site.instagram}
                target="_blank"
                rel="noreferrer"
              >
                <img src={item.image} alt="" />
                <span className="ig-frame__badge" aria-hidden>
                  <IgIcon />
                </span>
                <span className="ig-frame__caption">{item.caption}</span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
