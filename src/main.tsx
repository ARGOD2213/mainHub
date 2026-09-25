import { createRoot } from 'react-dom/client'
import './index.css'
import { About, Contact, Experience, Hero, Projects, Services } from './sections'
import { profile as p } from './constants/profile'

createRoot(document.getElementById('root')!).render(
  <>
    <a href="#main" className="skip-link">Skip to content</a>
    <header className="site-header">
      <a className="brand" href="#main" aria-label={p.name}>{p.name}<span>/</span>ENGINEERING</a>
      <nav aria-label="Primary navigation">
        <a href="#about">About</a>
        <a href="#services">Services</a>
        <a href="#projects">Systems</a>
        <a href="#experience">Experience</a>
      </nav>
      <a className="btn header-cta" href="#contact">Hire me</a>
    </header>

    <main id="main">
      <Hero />
      <About />
      <Services />
      <Projects />
      <Experience />
      <Contact />
    </main>

    <nav aria-label="Quick contact" className="quick-contact">
      <a href={`tel:${p.phoneTel}`}>Call</a>
      <a href={p.whatsapp}>WhatsApp</a>
      <a href={`mailto:${p.email}`}>Email</a>
    </nav>
  </>,
)
