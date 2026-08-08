#!/usr/bin/env node
/**
 * Verify IG_ACCESS_TOKEN + IG_USER_ID can load recent media.
 * Reads tup-web/.env (simple KEY=VALUE parser).
 *
 * Usage: npm run ig:verify
 */

import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const envPath = resolve(root, '.env')

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
const token = env.IG_ACCESS_TOKEN || process.env.IG_ACCESS_TOKEN
const userId = env.IG_USER_ID || process.env.IG_USER_ID || 'me'

if (!token) {
  console.error(`No IG_ACCESS_TOKEN in ${envPath}

Follow INSTAGRAM_SETUP.md, then paste the long-lived token into .env
`)
  process.exit(1)
}

const fields = 'id,caption,media_url,permalink,thumbnail_url,media_type,timestamp'
const hosts = [
  `https://graph.instagram.com/v21.0/${userId}/media`,
  `https://graph.facebook.com/v21.0/${userId}/media`,
]

let lastError = null

for (const base of hosts) {
  const url = `${base}?fields=${fields}&limit=6&access_token=${encodeURIComponent(token)}`
  process.stdout.write(`Trying ${base} ... `)
  try {
    const res = await fetch(url)
    const json = await res.json()
    if (res.ok && Array.isArray(json.data)) {
      console.log('OK')
      console.log(`Loaded ${json.data.length} post(s) for IG_USER_ID=${userId}`)
      json.data.slice(0, 3).forEach((item, i) => {
        const cap = (item.caption || '(no caption)').split('\n')[0].slice(0, 60)
        console.log(`  ${i + 1}. ${cap}`)
      })
      console.log('\nHome feed should show “Live from Instagram” after npm run dev.')
      process.exit(0)
    }
    lastError = json.error || json
    console.log('failed')
  } catch (err) {
    lastError = { message: err.message }
    console.log('failed')
  }
}

console.error('\nCould not load media.')
console.error(JSON.stringify(lastError, null, 2))
console.error(`
Tips:
- Confirm the account is Professional and linked to a Facebook Page
- Set IG_USER_ID to the numeric id from Page → instagram_business_account
- Regenerate / exchange the token (npm run ig:exchange)
- See INSTAGRAM_SETUP.md
`)
process.exit(1)
