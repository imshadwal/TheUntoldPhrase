import { writerAvatarSrc, writerInitials } from '../../lib/writers'
import './WriterAvatar.css'

export default function WriterAvatar({ writer, name, size = 'md', className = '' }) {
  const label = writer?.name || name || 'Writer'
  const src = writerAvatarSrc(writer)
  const hasPhoto = Boolean(writer?.image)
  const dim = size === 'lg' ? 52 : size === 'sm' ? 28 : 36

  return (
    <span
      className={`writer-avatar writer-avatar--${size}${className ? ` ${className}` : ''}`}
      style={{ width: dim, height: dim }}
      aria-hidden={!hasPhoto}
    >
      {hasPhoto ? (
        <img src={src} alt="" width={dim} height={dim} loading="lazy" decoding="async" />
      ) : (
        <span className="writer-avatar__fallback">{writerInitials(label)}</span>
      )}
    </span>
  )
}
