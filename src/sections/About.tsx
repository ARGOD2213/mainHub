import { profile as p } from '../constants/profile'
import { skills } from '../constants/experience'

export default function About() {
  return (
    <section id="about" className="section-dark">
      <div className="wrap about-grid">
        <div>
          <p className="eyebrow">02 / POSITIONING</p>
          <h2>Backend systems with an AI layer that stays controlled.</h2>
        </div>
        <div>
          <p className="lead">I work across the API, persistence, security, cloud and AI-integration layers of a product — keeping the system understandable enough to operate after the first release.</p>
          <p>My core work is Java and Spring Boot, with PostgreSQL, Redis, Kafka, AWS and production-oriented AI application patterns such as RAG, embeddings and structured outputs.</p>
          <p className="mono small-note">{p.name.toUpperCase()} / HYDERABAD</p>
        </div>
      </div>
      <div className="wrap skill-lines">
        {Object.entries(skills).map(([key, value]) => (
          <div className="skill-line" key={key}><span>{key}</span><strong>{value}</strong></div>
        ))}
      </div>
    </section>
  )
}
