import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const site = JSON.parse(readFileSync(join(root, 'src/content/site.json'), 'utf8'))
const writings = JSON.parse(readFileSync(join(root, 'src/content/writings.json'), 'utf8'))
const writers = JSON.parse(readFileSync(join(root, 'src/content/writers.json'), 'utf8'))
const anonymousStories = JSON.parse(
  readFileSync(join(root, 'src/content/anonymousStories.json'), 'utf8')
)

const base = (site.siteUrl || 'https://theuntoldphrase.com').replace(/\/$/, '')
const today = new Date().toISOString().slice(0, 10)

const staticPaths = [
  '/',
  '/writings',
  '/writers',
  '/submit',
  '/about',
  '/enquiry',
  '/wallpapers',
  '/anonymous-stories',
  '/feedback',
  '/privacy',
]

const urls = [
  ...staticPaths.map((path) => ({ loc: `${base}${path}`, priority: path === '/' ? '1.0' : '0.8' })),
  ...writings.map((w) => ({ loc: `${base}/writings/${w.slug}`, priority: '0.7' })),
  ...writers.map((w) => ({ loc: `${base}/writers/${w.slug}`, priority: '0.6' })),
  ...anonymousStories.map((s) => ({
    loc: `${base}/anonymous-stories/${s.slug}`,
    priority: '0.7',
  })),
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`

const publicDir = join(root, 'public')
mkdirSync(publicDir, { recursive: true })
writeFileSync(join(publicDir, 'sitemap.xml'), xml)

const robots = `User-agent: *
Allow: /

Sitemap: ${base}/sitemap.xml
`

writeFileSync(join(publicDir, 'robots.txt'), robots)
console.log(`Wrote sitemap (${urls.length} URLs) and robots.txt → ${base}`)
