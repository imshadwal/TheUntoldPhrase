import { Link } from 'react-router-dom'
import { Button, Group, Text } from '@mantine/core'
import pages from '../content/pages.json'
import site from '../content/site.json'
import PageIntro from '../components/molecules/PageIntro'
import Seo from '../components/molecules/Seo'
import Reveal from '../components/atoms/Reveal'
import { absoluteUrl } from '../lib/siteUrl'
import './About.css'

export default function About() {
  const copy = pages.about
  const founder = copy.founder

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: `About ${site.brand}`,
    description: copy.body[0],
    url: absoluteUrl('/about'),
    mainEntity: {
      '@type': 'Organization',
      name: site.brand,
      url: site.siteUrl,
      sameAs: [site.instagram],
      founder: founder
        ? {
            '@type': 'Person',
            name: founder.name,
            jobTitle: founder.title,
          }
        : undefined,
    },
  }

  return (
    <>
      <Seo
        title="About"
        description={copy.body[0]}
        path="/about"
        image={copy.image}
        jsonLd={jsonLd}
      />

      <section className="page-hero about-story">
        <div className="container about-story__grid">
          <div className="about-story__copy">
            <PageIntro eyebrow={copy.eyebrow} title={copy.title} />
            {copy.pullQuote ? (
              <p className="about-story__quote">{copy.pullQuote}</p>
            ) : null}
            {copy.body.map((p) => (
              <p key={p.slice(0, 24)} className="about-copy">
                {p}
              </p>
            ))}
            <ul className="about-story__tags">
              {copy.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Group gap="sm" mt="xl" className="btn-row">
              <Button component={Link} to="/submit" color="wine" radius="xl">
                Submit yours →
              </Button>
              <Button component={Link} to="/writers" variant="default" color="wine" radius="xl">
                Meet writers
              </Button>
            </Group>
          </div>

          <Reveal className="about-story__visual-wrap">
            <figure className="about-story__visual">
              <img src={copy.image} alt={copy.imageAlt || ''} />
              <figcaption className="about-story__caption">
                <span>{site.shortBrand}</span>
                <span>A home for unsaid words</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {copy.stats?.length ? (
        <section className="section section--band about-stats">
          <div className="container about-stats__grid">
            {copy.stats.map((stat) => (
              <Reveal key={stat.label}>
                <div className="about-stat">
                  <p className="about-stat__value">{stat.value}</p>
                  <p className="about-stat__label">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {founder ? (
        <section className="section about-founder">
          <div className="container about-split about-founder__grid">
            <div>
              <PageIntro eyebrow="Behind TUP" title={founder.name} />
              <Text className="about-founder__role" component="p">
                {founder.title}
              </Text>
              {founder.instagramHandle ? (
                <Text className="about-founder__handle" component="p">
                  <a href={founder.instagram} target="_blank" rel="noreferrer">
                    {founder.instagramHandle}
                  </a>
                </Text>
              ) : null}
              {founder.bio.map((p) => (
                <p key={p.slice(0, 28)} className="about-copy">
                  {p}
                </p>
              ))}
              <Group gap="sm" mt="xl" className="btn-row">
                {founder.instagram ? (
                  <Button
                    component="a"
                    href={founder.instagram}
                    target="_blank"
                    rel="noreferrer"
                    color="wine"
                    radius="xl"
                  >
                    {founder.instagramHandle || 'Instagram'} →
                  </Button>
                ) : null}
                <Button component={Link} to="/enquiry" variant="default" color="wine" radius="xl">
                  Enquiry
                </Button>
              </Group>
            </div>
            <Reveal>
              <div className="about-founder__portrait">
                <img src={founder.image || site.logo} alt={founder.name} />
                <div className="about-founder__caption">
                  <span>{founder.name}</span>
                  <span>{founder.instagramHandle || founder.title}</span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      {copy.publish?.length ? (
        <section className="section about-publish-section">
          <div className="container about-publish__inner">
            <PageIntro
              as="h2"
              eyebrow="What we publish"
              title="Words that were left unsaid"
              support="From micro tales to open letters — original work from the community."
            />
            <ul className="about-story__tags about-publish-tags">
              {copy.publish.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Group gap="sm" mt="xl" className="btn-row">
              <Button component={Link} to="/submit" color="wine" radius="xl">
                Submit yours →
              </Button>
              <Button component={Link} to="/writers" variant="default" color="wine" radius="xl">
                Meet writers
              </Button>
              <Button
                component="a"
                href={site.instagram}
                target="_blank"
                rel="noreferrer"
                variant="default"
                color="wine"
                radius="xl"
              >
                {site.instagramHandle}
              </Button>
            </Group>
          </div>
        </section>
      ) : null}
    </>
  )
}
