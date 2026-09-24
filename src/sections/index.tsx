import { lazy, Suspense, useMemo, useState } from 'react'
import ArchitectureDialog from '../components/ArchitectureDialog'
import BoardFallback from '../components/BoardFallback'
import { profile as p } from '../constants/profile'
import { services, steps } from '../constants/services'
import { samples, built } from '../constants/samples'
import { tcs, certs, education, skills } from '../constants/experience'

const BoardScene = lazy(() => import('../components/models/BoardScene'))

// Pure so it can be tested without a browser: WebGL absence must yield the SVG, not a blank hero.
export function hasWebGL(doc: Pick<Document, 'createElement'>): boolean {
  try { return !!(doc.createElement('canvas') as HTMLCanvasElement).getContext('webgl') } catch { return false }
}
export const mailto = (subject: string) => `mailto:${p.email}?subject=${encodeURIComponent(subject)}`

export function Hero() {
  const gl = useMemo(() => hasWebGL(document), [])
  return (
    <section className="wrap" style={{ padding: '48px 20px' }}>
      <span className="chip"><span aria-hidden style={{ color: 'var(--led)' }}>● </span>Open to freelance projects</span>
      <h1 style={{ fontSize: 'clamp(28px,6vw,48px)', margin: '16px 0' }}>{p.name}</h1>
      <p style={{ maxWidth: '60ch', fontSize: 18 }}>{p.tagline}</p>
      <p style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <a className="btn fill" href={mailto('Project enquiry')}>Email me</a>
        <a className="btn" href={`tel:${p.phoneTel}`}>Call me</a>
        <a className="btn" href="#samples">See sample builds</a>
      </p>
      <div style={{ height: 320 }}>
        <Suspense fallback={<BoardFallback />}>{gl ? <BoardScene /> : <BoardFallback />}</Suspense>
      </div>
    </section>)
}

export function Services() {
  return (
    <section id="services" className="field"><div className="wrap">
      <h2>What I can build for you</h2>
      {services.map(s => (<article key={s.t} style={{ borderTop: '2px solid var(--silk)', padding: '16px 0' }}>
        <h3 style={{ fontSize: 18 }}>{s.t}</h3><p>{s.d}</p><p><strong>You get:</strong> {s.g}</p></article>))}
      <h3 style={{ fontSize: 18, marginTop: 24 }}>How I work</h3>

export function Samples() {
  const [open, setOpen] = useState<string | null>(null)
  const view = (n: string) => <button className="btn" onClick={() => setOpen(n)}>View architecture</button>
  return (
    <section id="samples" className="wrap" style={{ padding: '48px 20px' }}>
      <h2>Sample builds</h2>
      <p>Self-initiated builds. Not client work.</p>
      {samples.map(s => (<article key={s.name} style={{ border: '2px solid var(--silk)', padding: 20, margin: '16px 0' }}>
        <h3 style={{ fontSize: 18 }}>{s.name}</h3>
        <span className="chip">Sample build · not client work</span> <span className="chip">{s.status}</span>
        {s.note && <> <span className="chip">{s.note}</span></>}
        <p>{s.problem}</p><ul>{s.does.map(d => <li key={d}>{d}</li>)}</ul>
        <p style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{s.tech.map(t => <span className="chip" key={t}>{t}</span>)}</p>
        {view(s.name)} {s.github && <a className="btn" href={s.github}>GitHub</a>}{s.demo && <a className="btn" href={s.demo}>Live demo</a>}
      </article>))}
      <h3>Built projects</h3>
      {built.map(b => (<article key={b.name} style={{ border: '2px solid var(--silk)', padding: 20, margin: '16px 0' }}>
        <h4 className="mono">{b.name}</h4><p>{b.when} · {b.tech}</p>
        <ul>{b.bullets.map(x => <li key={x}>{x}</li>)}</ul><span className="chip">Private repository</span> {view(b.name)}</article>))}
      {open && <ArchitectureDialog key={open} name={open} onClose={() => setOpen(null)} />}
    </section>)
}
export function Experience() {
  return (
    <section className="field"><div className="wrap">
      <h2>Experience</h2>
      <h3 style={{ fontSize: 18 }}>{tcs.role}</h3><p>{tcs.when}</p>
      <ul>{tcs.bullets.map(b => <li key={b}>{b}</li>)}</ul>
      <h3 style={{ fontSize: 18 }}>Certifications</h3><ul>{certs.map(c => <li key={c}>{c}</li>)}</ul>
      <h3 style={{ fontSize: 18 }}>Education</h3><p>{education}</p>
    </div></section>)
}

export function Skills() {
  return (
    <section className="wrap" style={{ padding: '48px 20px' }}>
      <h2>Skills</h2>
      {Object.entries(skills).map(([k, v]) => (<div key={k} style={{ borderTop: '2px solid var(--silk)', padding: '12px 0' }}><h3 style={{ fontSize: 16 }}>{k}</h3><p>{v}</p></div>))}
    </section>)
}

export function Contact() {
  const intents = ['Feature sprint', 'New MVP', 'AI assistant', 'IoT project', 'Something else']
  const btn = { background: 'var(--deep)', color: 'var(--silk)', border: '2px solid var(--deep)' }
  return (
    <section id="contact" style={{ background: 'var(--copper)', color: 'var(--deep)', padding: '48px 20px' }}><div className="wrap">
      <h2>Tell me what you are building</h2>
      <p>What helps me quote fast: what you are building, what exists today, and your deadline.</p>
      <p style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {intents.map(i => <a key={i} className="btn" style={{ ...btn }} href={mailto(i)}>{i}</a>)}
      </p>
      <p><a href={`mailto:${p.email}`} style={{ color: 'inherit' }}>{p.email}</a> · <a href={`tel:${p.phoneTel}`} style={{ color: 'inherit' }}>{p.phone}</a></p>
      <p style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <a className="btn" style={btn} href={p.whatsapp}>WhatsApp</a>
        <a className="btn" style={btn} href={p.github}>GitHub</a>
        <a className="btn" style={btn} href={p.linkedin}>LinkedIn</a>
        <a className="btn" style={btn} href={p.resumePdf} download>Resume PDF</a>
        {p.calendar && <a className="btn" style={btn} href={p.calendar}>Book a call</a>}
      </p>
    </div></section>)
}