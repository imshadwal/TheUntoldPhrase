import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Group } from '@mantine/core'
import site from '../../content/site.json'
import oneLiners from '../../content/oneLiners.json'
import './Hero.css'

const ROTATING_WORDS = [
  'Microtales',
  'Stories',
  'Poems',
  'Quotes',
  'Open Letters',
  'One-liners',
]

function pickOneLiner(list) {
  if (!list?.length) {
    return { line: site.tagline, credit: site.shortBrand }
  }
  const day = Math.floor(Date.now() / 86400000)
  return list[day % list.length]
}

export default function Hero() {
  const featured = useMemo(() => pickOneLiner(oneLiners), [])
  const [wordIndex, setWordIndex] = useState(0)
  const [wordVisible, setWordVisible] = useState(true)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return undefined

    const id = setInterval(() => {
      setWordVisible(false)
      window.setTimeout(() => {
        setWordIndex((i) => (i + 1) % ROTATING_WORDS.length)
        setWordVisible(true)
      }, 280)
    }, 2400)

    return () => clearInterval(id)
  }, [])

  return (
    <section className="hero" aria-label={site.brand}>
      <div className="hero__bg" aria-hidden>
        <span className="hero__orb hero__orb--a" />
        <span className="hero__orb hero__orb--b" />
        <span className="hero__orb hero__orb--c" />
        <span className="hero__grain" />
      </div>

      <div className="hero__shell">
        <header className="hero__brand-block">
          <p className="hero__name">{site.brand}</p>
          <p className="hero__tag">{site.tagline}</p>
          <p className="hero__rotate" aria-live="polite">
            <span className="hero__rotate-prefix">Home for </span>
            <span className="hero__rotate-slot">
              <span
                key={ROTATING_WORDS[wordIndex]}
                className={`hero__rotate-word${wordVisible ? ' is-in' : ' is-out'}`}
              >
                {ROTATING_WORDS[wordIndex]}
              </span>
            </span>
          </p>
        </header>

        <Link to="/wallpapers" className="hero__story">
          <span className="hero__quote-mark" aria-hidden>
            “
          </span>
          <p className="hero__story-text">{featured.line}</p>
          <footer className="hero__story-meta">
            <span>One-liner</span>
            <span aria-hidden>·</span>
            <span>{featured.credit || site.shortBrand}</span>
            <span className="hero__story-cue">More lines →</span>
          </footer>
        </Link>

        <p className="hero__support">{site.supportLine}</p>

        <Group gap="sm" className="hero__actions">
          <Button component={Link} to="/writings" color="wine" radius="xl">
            Read writings →
          </Button>
          <Button component={Link} to="/submit" variant="default" color="wine" radius="xl">
            Submit yours
          </Button>
        </Group>
      </div>
    </section>
  )
}
