import writers from '../content/writers.json'
import site from '../content/site.json'

const byId = Object.fromEntries(writers.map((w) => [w.id, w]))

export function getWriter(authorId) {
  if (!authorId) return null
  return byId[authorId] || null
}

export function writerAvatarSrc(writer, writing) {
  if (writer?.image) return writer.image
  return site.logo
}

export function writerInitials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return 'T'
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}
