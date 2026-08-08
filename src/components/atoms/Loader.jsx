import './Loader.css'

export default function Loader({ label = 'Loading' }) {
  return (
    <div className="tup-loader" role="status" aria-live="polite" aria-label={label}>
      <div className="tup-loader__ring" aria-hidden>
        <span />
        <span />
      </div>
      <p className="tup-loader__label">{label}</p>
    </div>
  )
}
