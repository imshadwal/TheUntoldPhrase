import { Link } from 'react-router-dom'
import { Button, Text, Title } from '@mantine/core'
import Hero from '../components/organisms/Hero'
import Journey from '../components/organisms/Journey'
import InstagramFeed from '../components/organisms/InstagramFeed'
import BrandPartners from '../components/organisms/BrandPartners'
import Reveal from '../components/atoms/Reveal'
import WriterCard from '../components/molecules/WriterCard'
import Seo from '../components/molecules/Seo'
import { categoryLabel } from '../components/molecules/WritingList'
import writings from '../content/writings.json'
import writers from '../content/writers.json'
import site from '../content/site.json'
import { absoluteUrl } from '../lib/siteUrl'
import { getWriter } from '../lib/writers'
import WriterAvatar from '../components/molecules/WriterAvatar'
import './Home.css'

/** Prefer featured pieces, at most one per category for the desk. */
function pickDeskWritings(items, count = 4) {
  const ranked = [...items].sort((a, b) => {
    if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1
    return new Date(b.date) - new Date(a.date)
  })

  const picked = []
  const usedCategories = new Set()

  for (const item of ranked) {
    if (picked.length >= count) break
    if (usedCategories.has(item.category)) continue
    picked.push(item)
    usedCategories.add(item.category)
  }

  return picked
}

export default function Home() {
  const desk = pickDeskWritings(writings, 4)
  const lead = desk[0]
  const companions = desk.slice(1)
  const spotlight = writers.slice(0, 3)
  const writerCount = site.writerCount || writers.length
  const leadWriter = lead ? getWriter(lead.authorId) : null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: site.brand,
        url: site.siteUrl,
        description: site.supportLine,
        publisher: { '@id': `${site.siteUrl}/#organization` },
      },
      {
        '@type': 'Organization',
        '@id': `${site.siteUrl}/#organization`,
        name: site.brand,
        url: site.siteUrl,
        logo: absoluteUrl(site.logo),
        sameAs: [site.instagram],
        description: site.supportLine,
      },
    ],
  }

  return (
    <div className="home-page">
      <Seo
        title={`${site.brand} · ${site.tagline}`}
        description={site.supportLine}
        path="/"
        jsonLd={jsonLd}
      />

      <Hero />

      {lead ? (
        <section className="section from-desk home-band home-band--paper">
          <div className="container">
            <Reveal>
              <Text className="eyebrow" component="p">
                From the desk
              </Text>
              <Title order={2} className="section-title">
                Featured writings
              </Title>
              <Text className="section-support" component="p">
                A lead piece from the library, with companions from different corners of the phrase.
              </Text>
            </Reveal>

            <div className="featured-desk">
              <Reveal>
                <Link to={`/writings/${lead.slug}`} className="featured-lead">
                  <Text className="eyebrow" component="p">
                    {categoryLabel(lead.category)} · Today’s read
                  </Text>
                  <Title order={3}>{lead.title}</Title>
                  <Text component="p">{lead.excerpt}</Text>
                  <span className="featured-author">
                    <WriterAvatar
                      writer={leadWriter}
                      name={lead.authorName}
                      size="sm"
                      className="writer-avatar--on-dark"
                    />
                    {lead.authorName} →
                  </span>
                </Link>
              </Reveal>

              {companions.length ? (
                <div className="featured-companions">
                  {companions.map((item, i) => {
                    const writer = getWriter(item.authorId)
                    return (
                      <Reveal key={item.id} className={`delay-${i % 3}`}>
                        <Link to={`/writings/${item.slug}`} className="featured-side">
                          <Text className="eyebrow" component="p">
                            {categoryLabel(item.category)}
                          </Text>
                          <Title order={4}>{item.title}</Title>
                          <span className="featured-author">
                            <WriterAvatar writer={writer} name={item.authorName} size="sm" />
                            {item.authorName}
                          </span>
                        </Link>
                      </Reveal>
                    )
                  })}
                </div>
              ) : null}
            </div>

            <div className="btn-row">
              <Button component={Link} to="/writings" color="wine" radius="xl">
                Browse all writings →
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      <section className="section writers-teaser home-band home-band--mist">
        <div className="container">
          <Reveal>
            <Text className="eyebrow" component="p">
              Community
            </Text>
            <Title order={2} className="section-title">
              Select writers
            </Title>
            <Text className="section-support" component="p">
              {writerCount} voices currently penning their beautiful words for TUP.
            </Text>
          </Reveal>
          <div className="writer-grid writers-teaser__grid">
            {spotlight.map((writer) => (
              <Reveal key={writer.id}>
                <WriterCard writer={writer} />
              </Reveal>
            ))}
          </div>
          <div className="btn-row">
            <Button component={Link} to="/writers" variant="default" color="wine" radius="xl">
              Meet the writers →
            </Button>
          </div>
        </div>
      </section>

      <Journey />

      <InstagramFeed />

      <BrandPartners />

      <section className="submit-band home-band">
        <div className="container submit-band__inner">
          <Reveal>
            <Text className="eyebrow" component="p">
              Your turn
            </Text>
            <Title order={2} className="section-title">
              Submit the piece still sitting in your notes.
            </Title>
            <Text className="submit-band__hindi" component="p">
              {site.tagline}
            </Text>
            <div className="btn-row">
              <Button component={Link} to="/submit" color="wine" radius="xl">
                Submit yours →
              </Button>
              <Button
                component={Link}
                to="/anonymous-stories#send"
                variant="default"
                color="wine"
                radius="xl"
              >
                Send anonymously
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
