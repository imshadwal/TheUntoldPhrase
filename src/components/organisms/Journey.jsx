import Reveal from '../atoms/Reveal'
import journey from '../../content/journey.json'
import './Journey.css'

export default function Journey() {
  return (
    <section className="section journey" aria-labelledby="journey-title">
      <div className="container journey__intro">
        <Reveal>
          <p className="eyebrow">Our path</p>
          <h2 id="journey-title" className="section-title">
            The journey
          </h2>
          <p className="section-support">
            From a small Instagram corner to a home for budding writers — milestones along the way.
          </p>
        </Reveal>
      </div>

      <div className="journey__viewport">
        <div className="journey__fade journey__fade--start" aria-hidden />
        <div className="journey__fade journey__fade--end" aria-hidden />

        <div className="journey__rail">
          <span className="journey__spine" aria-hidden />

          <ol className="journey__stops">
            {journey.map((step, index) => {
              const isLast = index === journey.length - 1
              const n = String(index + 1).padStart(2, '0')
              const yearAttr = /^\d{4}$/.test(step.year) ? step.year : undefined

              return (
                <li
                  key={step.year + step.title}
                  className={`journey__stop${isLast ? ' is-current' : ''}${
                    index % 2 === 0 ? ' is-left' : ' is-right'
                  }`}
                >
                  <Reveal className={`delay-${index % 3}`}>
                    <div className="journey__marker">
                      <span className="journey__dot" aria-hidden />
                      <span className="journey__index">{n}</span>
                    </div>
                    <div className="journey__panel">
                      <time className="journey__year" dateTime={yearAttr}>
                        {step.year}
                      </time>
                      <h3 className="journey__stop-title">{step.title}</h3>
                      <p className="journey__detail">{step.detail}</p>
                    </div>
                  </Reveal>
                </li>
              )
            })}
          </ol>
        </div>
      </div>

      <p className="journey__hint" aria-hidden>
        Drag or scroll sideways to explore →
      </p>
    </section>
  )
}
