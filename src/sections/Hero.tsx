import { lazy, Suspense, useMemo } from 'react'
import BoardFallback from '../components/BoardFallback'
import { profile as p } from '../constants/profile'

const BoardScene = lazy(() => import('../components/models/BoardScene'))

export function hasWebGL(doc: Pick<Document, 'createElement'>): boolean {
  try { return !!(doc.createElement('canvas') as HTMLCanvasElement).getContext('webgl') } catch { return false }
}

const mailto = (subject: string) => `mailto:${p.email}?subject=${encodeURIComponent(subject)}`

export default function Hero() {
  const gl = useMemo(() => hasWebGL(document), [])
  return (
    <section className="hero wrap">
      <div className="hero-copy">
        <p className="eyebrow"><span className="live-dot" aria-hidden /> OPEN TO FREELANCE PROJECTS</p>
        <h1>{p.name}</h1>
        <p className="hero-title">Java backend engineer building APIs, cloud systems and controlled AI applications.</p>
        <p className="hero-description">{p.tagline}</p>
        <div className="hero-actions">
          <a className="btn fill" href={mailto('Project enquiry')}>Start a project</a>
          <a className="btn" href={p.resumePdf} download>Resume</a>
          <a className="text-link" href="#projects">Explore systems →</a>
        </div>
      </div>

      <div className="hero-art" aria-label="Interactive engineering board visualization">
        <div className="hero-art-label"><span>ENGINEERING ARTIFACT</span><span>WEBGL / 3D</span></div>
        <div className="hero-canvas">
          <Suspense fallback={<BoardFallback />}>{gl ? <BoardScene /> : <BoardFallback />}</Suspense>
        </div>
        <div className="hero-art-footer">
          <span>JAVA / SPRING / AWS / AI</span>
          <span>01</span>
        </div>
      </div>

      <div className="hero-metrics">
        <div><span>FOCUS</span><strong>Backend + AI integration</strong></div>
        <div><span>STACK</span><strong>Java 21 · Spring Boot 3</strong></div>
        <div><span>DATA</span><strong>PostgreSQL · Redis · Kafka</strong></div>
        <div className="metric-accent"><span>STATUS</span><strong>Available</strong></div>
      </div>
    </section>
  )
}
