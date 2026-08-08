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
import './Home.css'

export default function Home() {
  const featured = writings.filter((w) => w.featured).slice(0, 4)
  const spotlight = writers.slice(0, 3)
  const writerCount = site.writerCount || writers.length

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
    <>
      <Seo
        title={`${site.brand} · ${site.tagline}`}
        description={site.supportLine}
        path="/"
        jsonLd={jsonLd}
      />

      <Hero />

      <section className="section from-desk">
        <div className="container">
          <Reveal>
            <Text className="eyebrow" component="p">
              From the desk
            </Text>
            <Title order={2} className="section-title">
              Featured writings
            </Title>
            <Text className="section-support" component="p">
              A few pieces from the TUP library — poems, letters, and lines that linger.
            </Text>
          </Reveal>
          <div className="featured-grid">
            {featured.map((item, i) => (
              <Reveal key={item.id} className={`delay-${i % 3}`}>
                <Link to={`/writings/${item.slug}`} className="featured-card">
                  <Text className="eyebrow" component="p">
                    {categoryLabel(item.category)}
                  </Text>
                  <Title order={3}>{item.title}</Title>
                  <Text component="p">{item.excerpt}</Text>
                  <span>{item.authorName}</span>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="btn-row">
            <Button component={Link} to="/writings" color="wine" radius="xl">
              Browse all writings →
            </Button>
          </div>
        </div>
      </section>

      <section className="section writers-teaser">
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

      <section className="submit-band">
        <div className="container submit-band__inner">
          <Reveal>
            <Text className="eyebrow" component="p">
              Your turn
            </Text>
            <Title order={2} className="section-title">
              Submit the piece still sitting in your notes.
            </Title>
            <div className="btn-row">
              <Button component={Link} to="/submit" color="wine" radius="xl">
                Submit yours →
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
