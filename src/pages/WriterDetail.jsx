import { Link, useParams } from 'react-router-dom'
import { Button, Group, Text, Title } from '@mantine/core'
import writers from '../content/writers.json'
import writings from '../content/writings.json'
import WritingList from '../components/molecules/WritingList'
import PageIntro from '../components/molecules/PageIntro'
import Seo from '../components/molecules/Seo'
import site from '../content/site.json'
import { absoluteUrl } from '../lib/siteUrl'
import './WriterDetail.css'

export default function WriterDetail() {
  const { slug } = useParams()
  const writer = writers.find((w) => w.slug === slug)

  if (!writer) {
    return (
      <section className="page-hero">
        <div className="container">
          <Title order={1} className="section-title">
            Writer not found
          </Title>
          <Button component={Link} to="/writers" color="wine" radius="xl" mt="md">
            Back to writers
          </Button>
        </div>
      </section>
    )
  }

  const theirWritings = writings.filter((w) => w.authorId === writer.id)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: writer.name,
    description: writer.bio,
    image: absoluteUrl(writer.image),
    jobTitle: writer.craft,
    address: writer.city
      ? { '@type': 'PostalAddress', addressLocality: writer.city }
      : undefined,
    url: absoluteUrl(`/writers/${writer.slug}`),
  }

  return (
    <>
      <Seo
        title={writer.name}
        description={writer.bio}
        path={`/writers/${writer.slug}`}
        image={writer.image}
        jsonLd={jsonLd}
      />
      <section className="writer-detail">
        <div className="container writer-detail__grid">
          <div className="writer-detail__media">
            <img src={writer.image} alt={writer.name} />
          </div>
          <div>
            <PageIntro eyebrow={writer.craft} title={writer.name} />
            <Text className="writer-detail__city" component="p">
              {writer.city}
            </Text>
            <Text className="writer-detail__bio" component="p">
              {writer.bio}
            </Text>
            <ul className="rule-list">
              <li>Select writer for The Untold Phrase</li>
              {writer.instagram ? <li>{writer.instagram}</li> : null}
              <li>
                {theirWritings.length} piece{theirWritings.length === 1 ? '' : 's'} on this site
              </li>
            </ul>
            <Group gap="sm" mt="xl" className="btn-row">
              {writer.instagram ? (
                <Button
                  component="a"
                  href={`https://instagram.com/${writer.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  color="wine"
                  radius="xl"
                >
                  Instagram →
                </Button>
              ) : null}
              <Button component={Link} to="/writers" variant="default" color="wine" radius="xl">
                All writers
              </Button>
            </Group>
          </div>
        </div>

        <div className="container" style={{ marginTop: '3.5rem' }}>
          {theirWritings.length ? (
            <>
              <PageIntro
                as="h2"
                eyebrow="On the phrase"
                title={`Writings by ${writer.name.split(' ')[0]}`}
              />
              <WritingList items={theirWritings} />
            </>
          ) : (
            <div className="writer-detail__empty">
              <PageIntro
                as="h2"
                eyebrow="On the phrase"
                title="Pieces coming soon"
              />
              <Text className="writer-detail__empty-copy" component="p">
                {writer.name.split(' ')[0]} is a select voice for TUP. More of their writing will
                appear here — in the meantime, find them on Instagram or submit your own piece to
                the community.
              </Text>
              <Group gap="sm" mt="lg">
                {writer.instagram ? (
                  <Button
                    component="a"
                    href={`https://instagram.com/${writer.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noreferrer"
                    color="wine"
                    radius="xl"
                  >
                    Featured on Instagram →
                  </Button>
                ) : (
                  <Button
                    component="a"
                    href={site.instagram}
                    target="_blank"
                    rel="noreferrer"
                    color="wine"
                    radius="xl"
                  >
                    Follow {site.instagramHandle}
                  </Button>
                )}
                <Button component={Link} to="/submit" variant="default" color="wine" radius="xl">
                  Submit yours
                </Button>
              </Group>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
