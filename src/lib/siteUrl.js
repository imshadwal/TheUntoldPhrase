import site from '../content/site.json'

/** Absolute URL for path (pathname starting with /). */
export function absoluteUrl(path = '/') {
  const base = (site.siteUrl || '').replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

export function ogImageUrl(path) {
  const img = path || site.ogImage || site.logo
  if (img.startsWith('http')) return img
  return absoluteUrl(img)
}
