import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Text, Title, UnstyledButton } from '@mantine/core'
import Seo from '../components/molecules/Seo'
import stories from '../content/anonymousStories.json'
import './AnonymousStoryDetail.css'

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function AnonymousStoryDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const story = stories.find((s) => s.slug === slug)

  if (!story) {
    return (
      <section className="page-hero">
        <div className="container">
          <Title order={1} className="section-title">
            Story not found
          </Title>
          <Button component={Link} to="/anonymous-stories" color="wine" radius="xl" mt="md">
            Back to anonymous stories
          </Button>
        </div>
      </section>
    )
  }

  return (
    <>
      <Seo
        title={story.title}
        description={story.excerpt}
        path={`/anonymous-stories/${story.slug}`}
        type="article"
      />
      <article className="anon-detail">
        <div className="container anon-detail__inner">
          <UnstyledButton
            type="button"
            className="anon-detail__back"
            onClick={() => {
              if (window.history.length > 1) navigate(-1)
              else navigate('/anonymous-stories')
            }}
            aria-label="Go back"
          >
            ← Back
          </UnstyledButton>

          {story.sample ? (
            <Text className="anon-detail__sample" component="p">
              Sample story — for layout preview
            </Text>
          ) : null}

          <Text className="eyebrow" component="p">
            {story.mood || 'Anonymous'} · No byline
          </Text>
          <Title order={1} className="section-title">
            {story.title}
          </Title>
          <Text className="anon-detail__meta" component="p" c="dimmed">
            Anonymous
            {story.date ? ` · ${formatDate(story.date)}` : ''}
          </Text>

          <div className="anon-detail__body">
            {story.body.split('\n').map((line, i) =>
              line.trim() === '' ? <br key={i} /> : <p key={i}>{line}</p>
            )}
          </div>

          <div className="anon-detail__cta">
            <Text component="p">Have a story you can’t put your name on?</Text>
            <Button component={Link} to="/anonymous-stories#send" color="wine" radius="xl">
              Send yours anonymously →
            </Button>
          </div>
        </div>
      </article>
    </>
  )
}
