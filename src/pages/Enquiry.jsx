import { useState } from 'react'
import { Alert, Button, Select, Stack, TextInput, Textarea } from '@mantine/core'
import { useForm } from '@mantine/form'
import site from '../content/site.json'
import PageIntro from '../components/molecules/PageIntro'
import Seo from '../components/molecules/Seo'
import { submitForm } from '../lib/submitForm'

export default function Enquiry() {
  const [status, setStatus] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const form = useForm({
    initialValues: { name: '', email: '', topic: 'Writing', message: '' },
    validate: {
      name: (v) => (!v.trim() ? 'Name is required' : null),
      email: (v) => (/^\S+@\S+$/.test(v) ? null : 'Valid email required'),
      message: (v) => (!v.trim() ? 'Message is required' : null),
    },
  })

  const onSubmit = form.onSubmit(async (values) => {
    setSubmitting(true)
    setStatus(null)
    try {
      await submitForm({
        subject: `TUP Enquiry (${values.topic}) from ${values.name}`,
        fields: {
          form: 'enquiry',
          name: values.name,
          email: values.email,
          topic: values.topic,
          message: values.message,
        },
      })
      setStatus({
        type: 'ok',
        message: 'Thanks — your enquiry was submitted successfully. We will reply when we can.',
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
        title="Enquiry"
        description="Questions, collaborations, or just a hello — write to The Untold Phrase."
        path="/enquiry"
      />
      <section className="page-hero">
        <div className="container about-split">
          <div>
            <PageIntro
              eyebrow="Say hello"
              title="Enquiry"
              support="Questions, collaborations, or just a hello — write to us."
            />
            <ul className="rule-list">
              <li>Submissions via the Submit page or Instagram DM</li>
              <li>Reach the community at {site.instagramHandle}</li>
              <li>{site.followerCount} on Instagram</li>
            </ul>
            <div className="btn-row">
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
            </div>
          </div>

          <form onSubmit={onSubmit} className="form-panel">
            <Stack gap="md">
              {status ? (
                <Alert color={status.type === 'error' ? 'red' : 'wine'}>{status.message}</Alert>
              ) : null}
              <TextInput label="Name" required {...form.getInputProps('name')} />
              <TextInput label="Email" type="email" required {...form.getInputProps('email')} />
              <Select
                label="Topic"
                data={['Collab', 'Writing', 'Other']}
                {...form.getInputProps('topic')}
              />
              <Textarea label="Message" required minRows={5} {...form.getInputProps('message')} />
              <Button type="submit" color="wine" radius="xl" loading={submitting}>
                Send enquiry →
              </Button>
            </Stack>
          </form>
        </div>
      </section>
    </>
  )
}
