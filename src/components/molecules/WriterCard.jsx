import { Link } from 'react-router-dom'
import './WriterCard.css'

export default function WriterCard({ writer }) {
  return (
    <article className="writer-card">
      <Link to={`/writers/${writer.slug}`} className="writer-card__media">
        <img src={writer.image} alt={writer.name} />
      </Link>
      <div className="writer-card__body">
        <p className="eyebrow">{writer.city || 'Select writer'}</p>
        <h3>
          <Link to={`/writers/${writer.slug}`}>{writer.name}</Link>
        </h3>
        <p className="writer-card__craft">{writer.craft}</p>
        <p className="writer-card__ig">{writer.instagram || 'TUP family'}</p>
        <Link className="btn btn--ghost" to={`/writers/${writer.slug}`}>
          View Profile →
        </Link>
      </div>
    </article>
  )
}
