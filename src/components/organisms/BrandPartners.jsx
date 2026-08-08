import Reveal from '../atoms/Reveal'
import brands from '../../content/brands.json'

export default function BrandPartners() {
  if (!brands.length) return null

  return (
    <section className="section section--tight brands-strip">
      <div className="container">
        <Reveal>
          <p className="eyebrow">Collaborations</p>
          <h2 className="section-title">Brands we&apos;ve worked with</h2>
          <p className="section-support">
            Partners from our Instagram story highlights.
          </p>
        </Reveal>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {brands.map((brand, i) => (
            <Reveal key={brand.id} className={`delay-${i % 3}`}>
              <a
                href={brand.href}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-[6rem] items-center justify-center rounded-xl border border-[var(--line)] bg-white px-4 py-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-md"
                title={brand.name}
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-h-12 w-full max-w-[8.5rem] object-contain"
                />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
