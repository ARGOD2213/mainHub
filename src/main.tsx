import { createRoot } from 'react-dom/client'
import './index.css'
import { Hero, Services, Samples, Experience, Skills, Contact } from './sections'
import { profile as p } from './constants/profile'

createRoot(document.getElementById('root')!).render(<>
  <a href="#main" className="btn" style={{ position: 'absolute', left: -999 }}>Skip to content</a>
  <header style={{ position: 'sticky', top: 0, zIndex: 5, background: 'var(--deep)', padding: '8px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span className="mono">{p.name}</span><a className="btn" href="#contact">Hire me</a>
  </header>
  <main id="main"><Hero /><Services /><Samples /><Experience /><Skills /><Contact /></main>
  <div style={{ height: 64 }} />
  <nav aria-label="Quick contact" className="sm:hidden" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', background: 'var(--deep)' }}>
    <a className="btn" style={{ flex: 1, justifyContent: 'center' }} href={`tel:${p.phoneTel}`}>Call</a>
    <a className="btn" style={{ flex: 1, justifyContent: 'center' }} href={p.whatsapp}>WhatsApp</a>
    <a className="btn" style={{ flex: 1, justifyContent: 'center' }} href={`mailto:${p.email}`}>Email</a>
  </nav>
</>);