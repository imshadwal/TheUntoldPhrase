import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Alert, Button, Select, Stack, TextInput, Textarea, Text, Anchor } from '@mantine/core'
import { useForm } from '@mantine/form'
import pages from '../content/pages.json'
import site from '../content/site.json'
import PageIntro from '../components/molecules/PageIntro'
import Seo from '../components/molecules/Seo'
import { submitForm } from '../lib/submitForm'
import './Submit.css'

const CATEGORIES = [
  'Poems',
  'Stories',
  'Quotes',
  'Open Letters',
  'Love',
  'Life',
  'Tiny Tales',
  'Other',
]

export default function Submit() {
  const copy = pages.submit
  const [status, setStatus] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      title: '',
      category: 'Poems',
      body: '',
      instagram: '',
    },
    validate: {
      name: (v) => (!v.trim() ? 'Name is required' : null),
      email: (v) => (/^\S+@\S+$/.test(v) ? null : 'Valid email required'),
      title: (v) => (!v.trim() ? 'Title is required' : null),
      body: (v) => (!v.trim() ? 'Writing is required' : null),
    },
  })

  const onSubmit = form.onSubmit(async (values) => {
    setSubmitting(true)
    setStatus(null)
    try {
      await submitForm({
        subject: `TUP Submission: ${values.title}`,
        fields: {
          form: 'submit',
          name: values.name,
          email: values.email,
          title: values.title,
          category: values.category,
          writing: values.body,
          instagram: values.instagram,
        },
      })
      setStatus({
        type: 'ok',
        message:
          'Thank you — your piece was submitted successfully. We will read it and be in touch when we can.',
      })
      form.reset()
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Something went wrong. Try again or DM us.' })
    } finally {
      setSubmitting(false)
    }
  })

  return (
    <>
      <Seo
        title="Submit"
        description="Share your poem, story, or letter with The Untold Phrase community."
        path="/submit"
      />
      <section className="page-hero submit-page">
        <div className="container">
          <PageIntro eyebrow={copy.eyebrow} title={copy.title} support={copy.support} />

          <div className="submit-layout">
            <aside className="submit-aside form-panel">
              <Text className="eyebrow" component="p">
                We welcome
              </Text>
              <ul className="submit-tags">
                {copy.accepted.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              {copy.guidelines?.length ? (
                <>
                  <Text className="eyebrow" component="p">
                    Guidelines
                  </Text>
                  <ul className="rule-list submit-guidelines">
                    {copy.guidelines.map((item) => (
                      <li key={item.slice(0, 40)}>{item}</li>
                    ))}
                  </ul>
                </>
              ) : null}

              <Text c="dimmed" size="sm" mt="lg" className="submit-note">
                {copy.note}{' '}
                <Anchor href={site.instagram} target="_blank" rel="noreferrer" c="wine">
                  {site.instagramHandle}
                </Anchor>
              </Text>
            </aside>

            <form onSubmit={onSubmit} className="form-panel submit-form">
              <Stack gap="md">
                {status ? (
                  <Alert
                    color={status.type === 'error' ? 'red' : 'wine'}
                    title={status.type === 'error' ? 'Could not send' : 'Successfully submitted'}
                  >
                    {status.message}
                  </Alert>
                ) : null}
                <TextInput label="Name" required {...form.getInputProps('name')} />
                <TextInput label="Email" type="email" required {...form.getInputProps('email')} />
                <TextInput label="Title" required {...form.getInputProps('title')} />
                <Select label="Category" data={CATEGORIES} {...form.getInputProps('category')} />
                <Textarea label="Your writing" required minRows={6} {...form.getInputProps('body')} />
                <TextInput
                  label="Instagram (optional)"
                  placeholder="@you"
                  {...form.getInputProps('instagram')}
                />
                <Button type="submit" color="wine" radius="xl" loading={submitting}>
                  Send submission →
                </Button>
                <Button component={Link} to="/enquiry" variant="default" color="wine" radius="xl">
                  Or send an enquiry
                </Button>
              </Stack>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
