import { profile } from '../data/portfolio'
import { Reveal, SectionHead } from './ui'

const FACTS: [string, string][] = [
  ['Now playing', 'Software Engineer – Java Backend, TCS'],
  ['Set in', profile.location],
  ['Since', 'Aug 2024'],
  ['Trained at', 'VIT Vellore · B.Tech ECE'],
  ['Certified', 'AWS Cloud Practitioner'],
  ['Language', 'Java 21 · SQL'],
]

export default function Pilot() {
  return (
    <section id="pilot" className="py-14">
      <SectionHead kicker="S0 · E0" title="The Pilot" />
      <div className="gutter grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <p className="serif text-3xl leading-snug text-bone sm:text-[2.6rem]">
            I build the part of the product nobody sees — <em className="text-amber-2">and everybody depends on.</em>
          </p>
          <div className="mt-6 space-y-4 text-[1.02rem] leading-relaxed text-mist">
            <p>
              At Tata Consultancy Services I work on enterprise HRMS and finance microservices: Spring Boot 3 on Java 21, REST APIs over
              PostgreSQL and SQL Server, Spring Security with JWT and role-based access, and Redis where lookups run hot.
            </p>
            <p>
              The plot twist is AI. I've integrated Spring AI into existing services for document and policy Q&A — retrieval, embeddings
              and LLM calls — with one rule I don't bend: <span className="text-bone">the model only sees what the user is allowed to see.</span>
            </p>
            <p>
              Outside work I ship my own Originals, most recently ARGUS, an event-driven industrial IoT platform on AWS built sprint by
              sprint with architecture decisions written down before the code.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <dl className="divide-y divide-line rounded-lg border border-line bg-ink-2/60">
            {FACTS.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 px-5 py-3.5 text-sm">
                <dt className="text-smoke">{k}</dt>
                <dd className="text-right text-bone">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
