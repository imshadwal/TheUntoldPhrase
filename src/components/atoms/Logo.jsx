import { Link } from 'react-router-dom'
import site from '../../content/site.json'

/** Circular brand mark — Instagram DP / primary logo */
export default function Logo({ className = '', size = 48, to = '/' }) {
  const img = (
    <img
      src={site.logo}
      alt={site.brand}
      width={size}
      height={size}
      className={`logo-mark ${className}`.trim()}
      style={{ width: size, height: size }}
    />
  )

  if (!to) return img
  return (
    <Link to={to} className="logo-link" aria-label={site.brand}>
      {img}
    </Link>
  )
}
