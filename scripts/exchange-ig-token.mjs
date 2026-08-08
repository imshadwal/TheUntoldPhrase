#!/usr/bin/env node
/**
 * Exchange a short-lived token for a long-lived token (~60 days).
 *
 * Instagram Login (no Facebook Page) — default:
 *   npm run ig:exchange -- --token=SHORT --app-secret=SECRET --provider=instagram
 *
 * Legacy Facebook Login / Page path:
 *   npm run ig:exchange -- --token=SHORT --app-id=ID --app-secret=SECRET --provider=facebook
 */

function arg(name) {
  const flag = `--${name}=`
  const hit = process.argv.find((a) => a.startsWith(flag))
  return hit ? hit.slice(flag.length) : ''
}

const token = arg('token') || process.env.SHORT_TOKEN || process.env.IG_ACCESS_TOKEN
const appId = arg('app-id') || process.env.APP_ID || process.env.META_APP_ID
const appSecret = arg('app-secret') || process.env.APP_SECRET || process.env.META_APP_SECRET
const provider = (arg('provider') || process.env.IG_TOKEN_PROVIDER || 'instagram').toLowerCase()

if (!token || !appSecret) {
  console.error(`Missing values.

Instagram Login (recommended — no Facebook Page):
  npm run ig:exchange -- --token=SHORT_TOKEN --app-secret=APP_SECRET --provider=instagram

Facebook Page path (legacy):
  npm run ig:exchange -- --token=SHORT_TOKEN --app-id=APP_ID --app-secret=APP_SECRET --provider=facebook

See INSTAGRAM_SETUP.md
`)
  process.exit(1)
}

let url

if (provider === 'facebook') {
  if (!appId) {
    console.error('Facebook exchange requires --app-id=APP_ID')
    process.exit(1)
  }
  url = new URL('https://graph.facebook.com/v21.0/oauth/access_token')
  url.searchParams.set('grant_type', 'fb_exchange_token')
  url.searchParams.set('client_id', appId)
  url.searchParams.set('client_secret', appSecret)
  url.searchParams.set('fb_exchange_token', token)
} else {
  url = new URL('https://graph.instagram.com/access_token')
  url.searchParams.set('grant_type', 'ig_exchange_token')
  url.searchParams.set('client_secret', appSecret)
  url.searchParams.set('access_token', token)
}

const res = await fetch(url)
const json = await res.json()

if (!res.ok || json.error) {
  console.error('Exchange failed:')
  console.error(JSON.stringify(json, null, 2))
  process.exit(1)
}

console.log(`Long-lived token created (${provider}).\n`)
console.log(`access_token: ${json.access_token}`)
if (json.expires_in) {
  const days = Math.round(Number(json.expires_in) / 86400)
  console.log(`expires_in:  ${json.expires_in} seconds (~${days} days)`)
}
console.log(`
Paste into tup-web/.env:

IG_ACCESS_TOKEN=${json.access_token}
IG_USER_ID=me

Restart: npm run dev
Verify:   npm run ig:verify
`)
