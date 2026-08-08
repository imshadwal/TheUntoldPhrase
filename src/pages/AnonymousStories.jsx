import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Alert,
  Button,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import Seo from '../components/molecules/Seo'
import Reveal from '../components/atoms/Reveal'
import pages from '../content/pages.json'
import stories from '../content/anonymousStories.json'
import { submitForm } from '../lib/submitForm'
import './AnonymousStories.css'

const MOODS = ['Work', 'Love', 'Family', 'Friendship', 'Life', 'Other']

export default function AnonymousStories() {
  const copy = pages.anonymous
  const location = useLocation()
  const navigate = useNavigate()
  const [sendOpen, setSendOpen] = useState(false)
  const [status, setStatus] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const published = useMemo(
    () => [...stories].sort((a, b) => new Date(b.date) - new Date(a.date)),
    []
  )

  const form = useForm({
    initialValues: {
      title: '',
      mood: 'Life',
      body: '',
      contact: '',
    },
    validate: {
      title: (v) => (!v.trim() ? 'A title helps readers find your story' : null),
      body: (v) => (!v.trim() ? 'Your story is required' : null),
    },
  })

  const openSend = () => {
    setStatus(null)
    setSendOpen(true)
    if (location.hash !== '#send') {
      navigate(`${location.pathname}#send`, { replace: true })
    }
  }

  const closeSend = () => {
    setSendOpen(false)
    if (location.hash === '#send') {
      navigate(location.pathname, { replace: true })
    }
  }

  useEffect(() => {
    if (location.hash === '#send') setSendOpen(true)
  }, [location.hash])

  const onSubmit = form.onSubmit(async (values) => {
    setSubmitting(true)
    setStatus(null)
    try {
      await submitForm({
        subject: `TUP Anonymous Story: ${values.title}`,
        fields: {
          form: 'anonymous-story',
          title: values.title,
          mood: values.mood,
          story: values.body,
          contactOptional: values.contact || '(none)',
          note: 'Publish anonymously — do not credit a name on the site.',
        },
      })
      setStatus({
        type: 'ok',
        message:
          'Thank you — your anonymous story was sent to our inbox. We will read it before anything goes live.',
      })
      form.reset()
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.message || 'Something went wrong. Try again or DM us on Instagram.',
      })
    } finally {
      setSubmitting(false)
    }
  })

  return (
    <>
      <Seo
        title="Anonymous Stories"
        description="True stories shared without a byline — the words you couldn’t say out loud."
        path="/anonymous-stories"
      />

      <section className="anon-hero">
        <div className="container anon-hero__inner">
          <Text className="eyebrow" component="p">
            {copy.eyebrow}
          </Text>
          <Title order={1} className="anon-hero__title">
            Anonymous
            <span>Stories</span>
          </Title>
          <Text className="anon-hero__support" component="p">
            True stories you couldn’t say out loud — shared without a byline.
          </Text>

          {!published.length ? (
            <div className="anon-waiting">
              <p className="anon-waiting__title">{copy.emptyTitle}</p>
              <p className="anon-waiting__support">{copy.emptySupport}</p>
            </div>
          ) : null}

          <div className="btn-row">
            <Button type="button" color="wine" radius="xl" id="send" onClick={openSend}>
              Send yours →
            </Button>
          </div>
        </div>
      </section>

      {published.length ? (
        <section className="anon-stories" id="stories">
          <div className="container anon-stories__wrap">
            <Text className="eyebrow" component="p">
              On the wall
            </Text>
            <Title order={2} className="anon-stories__heading">
              Stories without a byline
            </Title>

            <div className="anon-list">
              {published.map((story, i) => (
                <Reveal key={story.id} className={`delay-${i % 3}`}>
                  <article className="anon-letter">
                    <header className="anon-letter__meta">
                      <span>
                        {story.mood || 'Story'}
                        {story.date
                          ? ` · ${new Date(story.date).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}`
                          : ''}
                      </span>
                      {story.sample ? <span className="anon-letter__sample">Sample</span> : null}
                    </header>
                    <Title order={3} className="anon-letter__title">
                      <Link to={`/anonymous-stories/${story.slug}`}>{story.title}</Link>
                    </Title>
                    <Text className="anon-letter__excerpt" component="p">
                      {story.excerpt}
                    </Text>
                    <Link to={`/anonymous-stories/${story.slug}`} className="anon-letter__read">
                      Read the full story →
                    </Link>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <Modal
        opened={sendOpen}
        onClose={closeSend}
        title="Send yours anonymously"
        centered
        radius="lg"
        size="lg"
        padding="lg"
        classNames={{ content: 'anon-send-modal', header: 'anon-send-modal__header' }}
      >
        <Text size="sm" c="dimmed" mb="md">
          No byline. We review every story before publishing.
        </Text>
        <form onSubmit={onSubmit}>
          <Stack gap="md">
            {status ? (
              <Alert
                color={status.type === 'error' ? 'red' : 'wine'}
                title={status.type === 'error' ? 'Could not send' : 'Sent to our inbox'}
              >
                {status.message}
              </Alert>
            ) : null}
            <TextInput
              label="Title"
              required
              placeholder="A short name for your story"
              {...form.getInputProps('title')}
            />
            <Select label="Mood" data={MOODS} {...form.getInputProps('mood')} />
            <Textarea
              label="Your story"
              required
              minRows={7}
              placeholder="Write what you couldn’t say out loud…"
              {...form.getInputProps('body')}
            />
            <TextInput
              label="Email (optional)"
              type="email"
              description="Only if you want a private reply — never shown on the site."
              placeholder="you@email.com"
              {...form.getInputProps('contact')}
            />
            <details className="anon-send-modal__rules">
              <summary>Guidelines</summary>
              <ul>
                {copy.guidelines.map((item) => (
                  <li key={item.slice(0, 40)}>{item}</li>
                ))}
              </ul>
            </details>
            <Button type="submit" color="wine" radius="xl" loading={submitting} fullWidth>
              Send anonymous story →
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  )
}
