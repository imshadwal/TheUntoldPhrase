import { Link } from 'react-router-dom'
import { Button, Group, Stack, Text, Title } from '@mantine/core'
import Logo from '../atoms/Logo'
import site from '../../content/site.json'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <Logo to={null} size={56} className="site-footer__logo" />
          <Title order={2} className="site-footer__brand">
            {site.brand}
          </Title>
          <Text className="site-footer__tagline" component="p">
            {site.tagline}
          </Text>
          <Button
            component="a"
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            color="wine"
            radius="xl"
            mt="md"
          >
            Instagram
          </Button>
        </div>

        <Stack gap="xs">
          <Text className="eyebrow" component="p">
            Discover
          </Text>
          <div className="footer-links">
            <Link to="/writings">Writings</Link>
            <Link to="/anonymous-stories">Anonymous Stories</Link>
            <Link to="/writers">Writers</Link>
            <Link to="/wallpapers">Wallpapers</Link>
          </div>
        </Stack>

        <Stack gap="xs">
          <Text className="eyebrow" component="p">
            House
          </Text>
          <div className="footer-links">
            <Link to="/submit">Submit</Link>
            <Link to="/about">About</Link>
            <Link to="/enquiry">Enquiry</Link>
            <Link to="/feedback">Feedback</Link>
            <Link to="/privacy">Privacy</Link>
          </div>
        </Stack>
      </div>
      <Group className="container site-footer__bottom" justify="space-between">
        <span>
          © {new Date().getFullYear()} The Untold Phrase · {site.tagline}
        </span>
      </Group>
    </footer>
  )
}
