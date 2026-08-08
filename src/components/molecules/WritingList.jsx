import { Link } from 'react-router-dom'
import { Button, Text, Title } from '@mantine/core'
import { getWriter } from '../../lib/writers'
import WriterAvatar from './WriterAvatar'
import './WritingList.css'

const labels = {
  poems: 'Poems',
  stories: 'Stories',
  quotes: 'Quotes',
  openletters: 'Open Letters',
  'love-relationship': 'Love',
  life: 'Life',
  other: 'Other',
}

export function categoryLabel(slug) {
  return labels[slug] || slug
}

export default function WritingList({ items, emptyMessage }) {
  if (!items.length) {
    return (
      <Text className="writing-empty" fs="italic" c="dimmed">
        {emptyMessage || 'No writings match your filters yet. Try another tag or clear search.'}
      </Text>
    )
  }

  return (
    <div className="writing-list">
      {items.map((item) => {
        const writer = getWriter(item.authorId)
        return (
          <article key={item.id} className="writing-row">
            <div className="writing-row__accent" aria-hidden />
            <div className="writing-row__content">
              <Text className="eyebrow" component="p">
                {categoryLabel(item.category)}
              </Text>
              <Title order={3}>
                <Link to={`/writings/${item.slug}`}>{item.title}</Link>
              </Title>
              <div className="writing-row__meta">
                <WriterAvatar writer={writer} name={item.authorName} size="sm" />
                <Text component="p" c="dimmed" size="sm" className="writing-row__meta-text">
                  {item.authorId ? (
                    <Link className="writing-row__author" to={`/writers/${item.authorId}`}>
                      {item.authorName}
                    </Link>
                  ) : (
                    item.authorName
                  )}
                  {item.date
                    ? ` · ${new Date(item.date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}`
                    : ''}
                </Text>
              </div>
              <Text className="writing-row__excerpt" component="p">
                {item.excerpt}
              </Text>
            </div>
            <Button
              component={Link}
              to={`/writings/${item.slug}`}
              variant="default"
              color="wine"
              radius="xl"
            >
              Read →
            </Button>
          </article>
        )
      })}
    </div>
  )
}
