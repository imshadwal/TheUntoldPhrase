import { Link } from 'react-router-dom'
import { Button, Group, Text } from '@mantine/core'
import pages from '../content/pages.json'
import site from '../content/site.json'
import PageIntro from '../components/molecules/PageIntro'
import Seo from '../components/molecules/Seo'
import Reveal from '../components/atoms/Reveal'
import { absoluteUrl } from '../lib/siteUrl'
import './About.css'

function PersonSection({ person, index }) {
  const socialHref = person.instagram || person.linkedin
  const socialLabel = person.instagramHandle || person.linkedinHandle || 'Profile'
  const captionSub = person.instagramHandle || person.linkedinHandle || person.title

  return (
    <section className={`section about-founder${index % 2 === 1 ? ' about-founder--alt' : ''}`}>
      <div className="container about-split about-founder__grid">
        <div className="about-founder__copy">
          <PageIntro eyebrow="Behind TUP" title={person.name} />
          <Text className="about-founder__role" component="p">
            {person.title}
          </Text>
          {socialHref ? (
            <Text className="about-founder__handle" component="p">
              <a href={socialHref} target="_blank" rel="noreferrer">
                {socialLabel}
              </a>
            </Text>
          ) : null}
          {person.bio.map((p) => (
            <p key={p.slice(0, 28)} className="about-copy">
              {p}
            </p>
          ))}
          <Group gap="sm" mt="xl" className="btn-row">
            {person.instagram ? (
              <Button
                component="a"
                href={person.instagram}
                target="_blank"
                rel="noreferrer"
                color="wine"
                radius="xl"
              >
                {person.instagramHandle || 'Instagram'} →
              </Button>
            ) : null}
            {person.linkedin ? (
              <Button
                component="a"
                href={person.linkedin}
                target="_blank"
                rel="noreferrer"
                variant={person.instagram ? 'default' : undefined}
                color="wine"
                radius="xl"
              >
                LinkedIn →
              </Button>
            ) : null}
            <Button component={Link} to="/enquiry" variant="default" color="wine" radius="xl">
              Enquiry
            </Button>
          </Group>
        </div>
        <Reveal className="about-founder__media">
          <div className="about-founder__portrait">
            <img
              src={person.image || site.logo}
              alt={person.name}
              style={
                person.imagePosition
                  ? { objectPosition: person.imagePosition }
                  : undefined
              }
            />
            <div className="about-founder__caption">
              <span>{person.name}</span>
              <span>{captionSub}</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default function About() {
  const copy = pages.about
  const team = copy.team?.length ? copy.team : copy.founder ? [copy.founder] : []

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
      founder: team.map((person) => ({
        '@type': 'Person',
        name: person.name,
        jobTitle: person.title,
      })),
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

      {team.length ? (
        <section className="section about-team-intro">
          <div className="container">
            <PageIntro
              as="h2"
              eyebrow={copy.teamIntro?.eyebrow || 'People'}
              title={copy.teamIntro?.title || 'Who keeps the phrase going'}
              support={
                copy.teamIntro?.support ||
                'Founder and creative partner — the hands behind the community.'
              }
            />
          </div>
        </section>
      ) : null}

      {team.map((person, index) => (
        <PersonSection key={person.name} person={person} index={index} />
      ))}

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
