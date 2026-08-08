#!/usr/bin/env node
/**
 * Refresh a long-lived Instagram user token for another ~60 days.
 * Token must be at least 24h old and not expired.
 *
 * Usage: npm run ig:refresh
 * Reads IG_ACCESS_TOKEN from .env and writes the new token back.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const envPath = resolve(root, '.env')
const storePath = resolve(root, '.instagram-token.json')

function loadEnv(file) {
  if (!existsSync(file)) return {}
  const out = {}
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const i = trimmed.indexOf('=')
    if (i === -1) continue
    out[trimmed.slice(0, i).trim()] = trimmed.slice(i + 1).trim()
  }
  return out
}

const env = loadEnv(envPath)
const token = env.IG_ACCESS_TOKEN
const userId = env.IG_USER_ID || 'me'

if (!token) {
  console.error('No IG_ACCESS_TOKEN in .env')
  process.exit(1)
}

const url =
  'https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=' +
  encodeURIComponent(token)

const res = await fetch(url)
const json = await res.json()

if (!json.access_token) {
  console.error('Refresh failed:')
  console.error(JSON.stringify(json, null, 2))
  console.error(`
Notes:
- Dashboard "Generate token" values are usually already long-lived (~60 days).
- Use refresh (this command), not ig:exchange, for those tokens.
- Refresh only works if the token is at least 24 hours old and not expired.
`)
  process.exit(1)
}

const expiresAt = new Date(Date.now() + json.expires_in * 1000).toISOString()
const days = Math.round(json.expires_in / 86400)

writeFileSync(
  envPath,
  `# Instagram Login — long-lived token. Refresh monthly: npm run ig:refresh
IG_ACCESS_TOKEN=${json.access_token}
IG_USER_ID=${userId}
IG_TOKEN_EXPIRES_AT=${expiresAt}
`
)

writeFileSync(
  storePath,
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

console.log(`Refreshed. Valid ~${days} more days (until ${expiresAt}).`)
console.log('Updated .env and .instagram-token.json')
console.log('Restart: npm run dev')
