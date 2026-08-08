#!/usr/bin/env node
/**
 * Pull Instagram profile picture into public/images/logos/tup-logo.png
 * Usage: node scripts/sync-ig-logo.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream/promises'
import { Readable } from 'node:stream'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
function loadEnv() {
  const raw = readFileSync(resolve(root, '.env'), 'utf8')
  const out = {}
  for (const line of raw.split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m) out[m[1]] = m[2]
  }
  return out
}

const env = loadEnv()
const token = env.IG_ACCESS_TOKEN
if (!token) {
  console.error('Missing IG_ACCESS_TOKEN in .env')
  process.exit(1)
}

const profile = await fetch(
  `https://graph.instagram.com/v21.0/me?fields=profile_picture_url,username,followers_count&access_token=${encodeURIComponent(token)}`
).then((r) => r.json())

if (!profile.profile_picture_url) {
  console.error(profile)
  process.exit(1)
}

const res = await fetch(profile.profile_picture_url)
const buf = Buffer.from(await res.arrayBuffer())
const dir = resolve(root, 'public/images/logos')
mkdirSync(dir, { recursive: true })
writeFileSync(resolve(dir, 'tup-ig-dp.jpg'), buf)

// Upscale via sharp if available, else write raw and note
try {
  const { default: sharp } = await import('sharp')
  await sharp(buf).resize(512, 512, { fit: 'cover' }).png().toFile(resolve(dir, 'tup-logo.png'))
  console.log('Wrote tup-logo.png (512px) from @' + profile.username)
} catch {
  writeFileSync(resolve(dir, 'tup-logo.png'), buf)
  console.log('Wrote tup-logo.png (raw API size) from @' + profile.username)
}
console.log('Followers:', profile.followers_count)
