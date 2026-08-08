import { Chip, Group } from '@mantine/core'

const TAGS = [
  { label: 'All', value: 'all' },
  { label: 'Poems', value: 'poems' },
  { label: 'Stories', value: 'stories' },
  { label: 'Quotes', value: 'quotes' },
  { label: 'Open Letters', value: 'openletters' },
  { label: 'Love', value: 'love-relationship' },
  { label: 'Life', value: 'life' },
]

export { TAGS }

export default function TagFilter({ value, onChange }) {
  return (
    <Chip.Group multiple={false} value={value} onChange={onChange}>
      <Group gap="sm" my="xl" role="tablist" aria-label="Filter writings by tag">
        {TAGS.map((tag) => (
          <Chip
            key={tag.value}
            value={tag.value}
            color="wine"
            variant="outline"
            radius="xl"
            size="md"
            styles={{
              label: {
                fontSize: '0.7rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                paddingInline: '1.1rem',
              },
            }}
          >
            {tag.label}
          </Chip>
        ))}
      </Group>
    </Chip.Group>
  )
}
