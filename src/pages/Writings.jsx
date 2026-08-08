import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Group, Pagination, Select, Text, TextInput } from '@mantine/core'
import Seo from '../components/molecules/Seo'
import TagFilter from '../components/molecules/TagFilter'
import WritingList from '../components/molecules/WritingList'
import PageIntro from '../components/molecules/PageIntro'
import writings from '../content/writings.json'
import './Writings.css'

const PAGE_SIZE = 9

export default function Writings() {
  const [params, setParams] = useSearchParams()
  const tag = params.get('tag') || 'all'
  const page = Math.max(1, Number(params.get('page')) || 1)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('newest')

  const items = useMemo(() => {
    let list = [...writings]
    if (tag !== 'all') list = list.filter((item) => item.category === tag)

    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.authorName.toLowerCase().includes(q) ||
          (item.excerpt || '').toLowerCase().includes(q)
      )
    }

    list.sort((a, b) => {
      if (sort === 'title') return a.title.localeCompare(b.title)
      if (sort === 'oldest') return new Date(a.date) - new Date(b.date)
      return new Date(b.date) - new Date(a.date)
    })
    return list
  }, [tag, query, sort])

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageItems = items.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const from = items.length ? (safePage - 1) * PAGE_SIZE + 1 : 0
  const to = Math.min(safePage * PAGE_SIZE, items.length)

  useEffect(() => {
    if (page !== safePage) {
      const next = new URLSearchParams(params)
      if (safePage <= 1) next.delete('page')
      else next.set('page', String(safePage))
      setParams(next, { replace: true })
    }
  }, [page, safePage, params, setParams])

  function updateParams(mutator) {
    const next = new URLSearchParams(params)
    mutator(next)
    setParams(next)
  }

  function setPage(value) {
    updateParams((next) => {
      if (value <= 1) next.delete('page')
      else next.set('page', String(value))
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function setTag(value) {
    updateParams((next) => {
      if (value === 'all') next.delete('tag')
      else next.set('tag', value)
      next.delete('page')
    })
  }

  return (
    <>
      <Seo
        title="Writings"
        description="Poems, stories, letters, and the lines in between from The Untold Phrase library."
        path={tag === 'all' ? '/writings' : `/writings?tag=${tag}`}
      />
      <section className="page-hero">
        <div className="container">
          <PageIntro
            eyebrow="Library"
            title="Writings"
            support="Poems, stories, letters, and the lines in between."
          />
          <TagFilter value={tag} onChange={setTag} />
          <Group gap="md" mt="lg" mb="sm" align="flex-end" wrap="wrap" className="writings-toolbar">
            <TextInput
              label="Search"
              placeholder="Title or author"
              value={query}
              onChange={(e) => {
                setQuery(e.currentTarget.value)
                updateParams((next) => next.delete('page'))
              }}
              style={{ flex: '1 1 220px' }}
            />
            <Select
              label="Sort"
              data={[
                { value: 'newest', label: 'Newest' },
                { value: 'oldest', label: 'Oldest' },
                { value: 'title', label: 'Title' },
              ]}
              value={sort}
              onChange={(v) => {
                setSort(v || 'newest')
                updateParams((next) => next.delete('page'))
              }}
              w={160}
            />
          </Group>
          <Text size="sm" c="dimmed" mb="md" className="writings-count">
            {items.length
              ? `Showing ${from}–${to} of ${items.length} piece${items.length === 1 ? '' : 's'}`
              : 'No pieces match'}
            {tag !== 'all' || query ? ' matching' : ''}
          </Text>
          <WritingList items={pageItems} />

          {totalPages > 1 ? (
            <div className="writings-pagination">
              <Pagination
                total={totalPages}
                value={safePage}
                onChange={setPage}
                color="wine"
                radius="xl"
                size="md"
                withEdges
              />
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}
