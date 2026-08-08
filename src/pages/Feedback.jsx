import { useState } from 'react'
import { Alert, Button, Stack, TextInput, Textarea } from '@mantine/core'
import { useForm } from '@mantine/form'
import pages from '../content/pages.json'
import site from '../content/site.json'
import PageIntro from '../components/molecules/PageIntro'
import Seo from '../components/molecules/Seo'
import { submitForm } from '../lib/submitForm'

export default function Feedback() {
  const copy = pages.feedback
  const [status, setStatus] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const form = useForm({
    initialValues: { name: '', email: '', feedback: '' },
    validate: {
      name: (v) => (!v.trim() ? 'Name is required' : null),
      email: (v) => (/^\S+@\S+$/.test(v) ? null : 'Valid email required'),
      feedback: (v) => (!v.trim() ? 'Feedback is required' : null),
    },
  })

  const onSubmit = form.onSubmit(async (values) => {
    setSubmitting(true)
    setStatus(null)
    try {
      await submitForm({
        subject: `TUP Feedback from ${values.name}`,
        fields: {
          form: 'feedback',
          name: values.name,
          email: values.email,
          feedback: values.feedback,
        },
      })
      setStatus({
        type: 'ok',
        message: 'Thanks — your feedback was submitted successfully.',
      })
      form.reset()
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Something went wrong.' })
    } finally {
      setSubmitting(false)
    }
  })

  return (
    <>
      <Seo
        title="Feedback"
        description={copy.support}
        path="/feedback"
      />
      <section className="page-hero">
        <div className="container" style={{ maxWidth: 560 }}>
          <PageIntro eyebrow={copy.eyebrow} title={copy.title} support={copy.support} />
          <form onSubmit={onSubmit} className="form-panel" style={{ marginTop: '1.75rem' }}>
            <Stack gap="md">
              {status ? (
                <Alert color={status.type === 'error' ? 'red' : 'wine'}>{status.message}</Alert>
              ) : null}
              <TextInput label="Name" required {...form.getInputProps('name')} />
              <TextInput label="Email" type="email" required {...form.getInputProps('email')} />
              <Textarea label="Feedback" required minRows={5} {...form.getInputProps('feedback')} />
              <Button type="submit" color="wine" radius="xl" loading={submitting}>
                Send feedback →
              </Button>
            </Stack>
          </form>
        </div>
      </section>
    </>
  )
}
