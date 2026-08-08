import Reveal from '../components/atoms/Reveal'
import WriterCard from '../components/molecules/WriterCard'
import PageIntro from '../components/molecules/PageIntro'
import Seo from '../components/molecules/Seo'
import writers from '../content/writers.json'
import site from '../content/site.json'

export default function Writers() {
  const count = site.writerCount || writers.length

  return (
    <>
      <Seo
        title="Select Writers"
        description={`${count} select voices currently penning their beautiful words for The Untold Phrase.`}
        path="/writers"
      />
      <section className="page-hero">
        <div className="container writers-page">
          <PageIntro
            eyebrow="Community"
            title="Select Writers"
            support={`The Untold Phrase appreciates every writer and selects some of them to be their select writer. ${count} voices are currently penning their beautiful words for TUP.`}
          />
          <div className="writer-grid" style={{ marginTop: '2.5rem' }}>
            {writers.map((writer) => (
              <Reveal key={writer.id}>
                <WriterCard writer={writer} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
