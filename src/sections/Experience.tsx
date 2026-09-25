import { certs, education, tcs } from '../constants/experience'

export default function Experience() {
  return (
    <section id="experience" className="section-light">
      <div className="wrap experience-grid">
        <div>
          <p className="eyebrow">05 / EXPERIENCE</p>
          <h2>Engineering experience, without the résumé wall of text.</h2>
        </div>
        <div className="timeline">
          <article className="timeline-item">
            <div className="timeline-marker">01</div>
            <div><p className="eyebrow">CURRENT</p><h3>{tcs.role}</h3><p>{tcs.when}</p>
              <ul>{tcs.bullets.map(item => <li key={item}>{item}</li>)}</ul>
            </div>
          </article>
          <article className="timeline-item">
            <div className="timeline-marker">02</div>
            <div><p className="eyebrow">CERTIFICATIONS</p><ul>{certs.map(item => <li key={item}>{item}</li>)}</ul></div>
          </article>
          <article className="timeline-item">
            <div className="timeline-marker">03</div>
            <div><p className="eyebrow">EDUCATION</p><p>{education}</p></div>
          </article>
        </div>
      </div>
    </section>
  )
}
