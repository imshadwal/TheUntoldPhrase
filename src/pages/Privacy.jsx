import pages from '../content/pages.json'
import site from '../content/site.json'
import PageIntro from '../components/molecules/PageIntro'
import Seo from '../components/molecules/Seo'

export default function Privacy() {
  const copy = pages.privacy

  return (
    <>
      <Seo
        title="Privacy"
        description="How The Untold Phrase handles form data, Instagram API access, and analytics."
        path="/privacy"
      />
      <section className="page-hero">
        <div className="container" style={{ maxWidth: 720 }}>
          <PageIntro eyebrow={copy.eyebrow} title={copy.title} />
          {copy.body.map((p) => (
            <p key={p.slice(0, 28)} className="about-copy">
              {p}
            </p>
          ))}
          <p className="about-copy">
            Contact us via Enquiry or {site.instagramHandle} if you have questions about your data.
          </p>
        </div>
      </section>
    </>
  )
}
