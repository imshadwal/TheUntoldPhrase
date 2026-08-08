import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Group, Text, Title, UnstyledButton } from '@mantine/core'
import writings from '../content/writings.json'
import { categoryLabel } from '../components/molecules/WritingList'
import WritingList from '../components/molecules/WritingList'
import Seo from '../components/molecules/Seo'
import site from '../content/site.json'
import { absoluteUrl } from '../lib/siteUrl'
import './WritingDetail.css'

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function WritingDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  const byDate = useMemo(
    () => [...writings].sort((a, b) => new Date(a.date) - new Date(b.date)),
    []
  )
  const index = byDate.findIndex((w) => w.slug === slug)
  const writing = byDate[index]

  if (!writing) {
    return (
      <section className="page-hero">
        <div className="container">
          <Title order={1} className="section-title">
            Writing not found
          </Title>
          <Button component={Link} to="/writings" color="wine" radius="xl" mt="md">
            Back to writings
          </Button>
        </div>
      </section>
    )
  }

  const prev = byDate[index - 1]
  const next = byDate[index + 1]
  const related = writings
    .filter(
      (w) =>
        w.id !== writing.id &&
        (w.category === writing.category ||
          (writing.authorId && w.authorId === writing.authorId))
    )
    .slice(0, 3)

  const pageUrl = absoluteUrl(`/writings/${writing.slug}`)
  const shareText = `${writing.title} — ${site.brand}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const isPoem =
    writing.category === 'poems' ||
    (writing.body.match(/\n/g) || []).length >= 4

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: writing.title,
    description: writing.excerpt,
    datePublished: writing.date,
    author: {
      '@type': 'Person',
      name: writing.authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: site.brand,
      logo: absoluteUrl(site.logo),
    },
    mainEntityOfPage: pageUrl,
  }

  return (
    <>
      <Seo
        title={writing.title}
        description={writing.excerpt}
        path={`/writings/${writing.slug}`}
        type="article"
        jsonLd={jsonLd}
      />
      <article className="writing-detail">
        <div className="container writing-detail__inner">
          <UnstyledButton
            type="button"
            className="writing-detail__back"
            onClick={() => {
              if (window.history.length > 1) navigate(-1)
              else navigate('/writings')
            }}
            aria-label="Go back"
          >
            ← Back
          </UnstyledButton>
          <Text className="eyebrow" component="p">
            {categoryLabel(writing.category)}
          </Text>
          <Title order={1} className="section-title">
            {writing.title}
          </Title>
          <Text className="writing-detail__meta" component="p" c="dimmed">
            {writing.authorId ? (
              <Link to={`/writers/${writing.authorId}`}>{writing.authorName}</Link>
            ) : (
              writing.authorName
            )}
            {writing.date ? ` · ${formatDate(writing.date)}` : ''}
          </Text>

          <div className={`writing-detail__body${isPoem ? ' is-poem' : ''}`}>
            {writing.body.split('\n').map((line, i) =>
              line.trim() === '' ? <br key={i} /> : <p key={i}>{line}</p>
            )}
          </div>

          <div className="writing-detail__share">
            <Text className="eyebrow" component="p">
              Share
            </Text>
            <Group gap="sm">
              <Button variant="default" color="wine" radius="xl" size="compact-md" onClick={copyLink}>
                {copied ? 'Copied' : 'Copy link'}
              </Button>
              <Button
                component="a"
                href={`https://wa.me/?text=${encodeURIComponent(`${shareText}\n${pageUrl}`)}`}
                target="_blank"
                rel="noreferrer"
                variant="default"
                color="wine"
                radius="xl"
                size="compact-md"
              >
                WhatsApp
              </Button>
              <Button
                component="a"
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`}
                target="_blank"
                rel="noreferrer"
                variant="default"
                color="wine"
                radius="xl"
                size="compact-md"
              >
                X
              </Button>
            </Group>
          </div>

          <div className="writing-detail__cta">
            <Text component="p">Have a piece waiting in your notes?</Text>
            <Button component={Link} to="/submit" color="wine" radius="xl">
              Submit yours →
            </Button>
          </div>

          <div className="writing-detail__nav">
            {prev ? <Link to={`/writings/${prev.slug}`}>← {prev.title}</Link> : <span />}
            {next ? <Link to={`/writings/${next.slug}`}>{next.title} →</Link> : <span />}
          </div>

          {related.length ? (
            <div className="writing-detail__related">
              <Text className="eyebrow" component="p">
                Related
              </Text>
              <Title order={2} className="section-title">
                Keep reading
              </Title>
              <WritingList items={related} />
            </div>
          ) : null}
        </div>
      </article>
    </>
  )
}
