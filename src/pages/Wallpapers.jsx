import { useEffect, useState } from 'react'
import { Modal, Button } from '@mantine/core'
import Seo from '../components/molecules/Seo'
import Reveal from '../components/atoms/Reveal'
import PageIntro from '../components/molecules/PageIntro'
import wallpapers from '../content/wallpapers.json'
import './Wallpapers.css'

export default function Wallpapers() {
  const [active, setActive] = useState(null)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setActive(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

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
            support="Our curated collection of best one-liners — tap a frame to preview, then download."
          />
          <div className="wallpaper-grid">
            {wallpapers.map((item, index) => (
              <Reveal key={item.id} className={`delay-${index % 3}`}>
                <figure className="wallpaper-card">
                  <button
                    type="button"
                    className="wallpaper-card__open"
                    onClick={() => setActive(item)}
                    aria-label={`Preview ${item.title}`}
                  >
                    <img src={item.image} alt={item.alt} />
                  </button>
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

      <Modal
        opened={Boolean(active)}
        onClose={() => setActive(null)}
        title={active?.title || 'Wallpaper'}
        centered
        size="lg"
        radius="lg"
        padding="lg"
      >
        {active ? (
          <div className="wallpaper-lightbox">
            <img src={active.image} alt={active.alt} />
            {active.caption ? <p>{active.caption}</p> : null}
            <p className="wallpaper-lightbox__tip">
              Tip: on your phone, download then set as lock screen or home wallpaper.
            </p>
            <Button
              component="a"
              href={active.image}
              download
              target="_blank"
              rel="noreferrer"
              color="wine"
              radius="xl"
              fullWidth
            >
              Download →
            </Button>
          </div>
        ) : null}
      </Modal>
    </>
  )
}
