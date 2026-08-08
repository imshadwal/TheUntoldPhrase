import Seo from '../components/molecules/Seo'
import Reveal from '../components/atoms/Reveal'
import PageIntro from '../components/molecules/PageIntro'
import wallpapers from '../content/wallpapers.json'
import site from '../content/site.json'
import './Wallpapers.css'

export default function Wallpapers() {
  return (
    <>
      <Seo
        title="Wallpapers"
        description="Download The Untold Phrase one-liner wallpapers for your phone."
        path="/wallpapers"
      />
      <section className="page-hero">
        <div className="container">
          <PageIntro
            eyebrow="Collection"
            title="Wallpapers"
            support="Our curated collection of best one-liners — tap download to save."
          />
          <div className="wallpaper-grid">
            {wallpapers.map((item, index) => (
              <Reveal key={item.id} className={`delay-${index % 3}`}>
                <figure className="wallpaper-card">
                  <img src={item.image} alt={item.alt} />
                  <figcaption className="wallpaper-card__meta">
                    <span className="wallpaper-card__title">{item.title}</span>
                    {item.caption ? (
                      <span className="wallpaper-card__caption">{item.caption}</span>
                    ) : null}
                    <a
                      className="wallpaper-card__download"
                      href={item.image}
                      download
                      target="_blank"
                      rel="noreferrer"
                    >
                      Download
                    </a>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
