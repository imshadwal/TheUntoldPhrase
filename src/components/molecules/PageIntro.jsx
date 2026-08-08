import { Stack, Text, Title } from '@mantine/core'

export default function PageIntro({ eyebrow, title, support, children, as = 'h1' }) {
  return (
    <Stack gap="sm" mb={children ? 'xl' : 0}>
      {eyebrow ? (
        <Text className="eyebrow" component="p">
          {eyebrow}
        </Text>
      ) : null}
      <Title order={as === 'h1' ? 1 : 2} className="section-title">
        {title}
      </Title>
      {support ? (
        <Text className="section-support" component="p">
          {support}
        </Text>
      ) : null}
      {children}
    </Stack>
  )
}
