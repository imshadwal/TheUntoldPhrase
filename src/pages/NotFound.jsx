import { Link } from 'react-router-dom'
import { Button, Group, Text, Title } from '@mantine/core'
import Seo from '../components/molecules/Seo'
import './NotFound.css'

export default function NotFound() {
  return (
    <>
      <Seo
        title="Page not found"
        description="This page isn’t part of The Untold Phrase."
        path="/404"
        noIndex
      />
      <section className="page-hero not-found">
        <div className="container not-found__inner">
          <Text className="eyebrow" component="p">
            404
          </Text>
          <Title order={1} className="section-title">
            This page was left unsaid.
          </Title>
          <Text className="not-found__support" component="p">
            The route you’re looking for doesn’t exist — or the words moved elsewhere.
          </Text>
          <Group gap="sm" mt="xl" className="btn-row">
            <Button component={Link} to="/" color="wine" radius="xl">
              Back home →
            </Button>
            <Button component={Link} to="/writings" variant="default" color="wine" radius="xl">
              Browse writings
            </Button>
            <Button component={Link} to="/enquiry" variant="default" color="wine" radius="xl">
              Enquiry
            </Button>
          </Group>
        </div>
      </section>
    </>
  )
}
