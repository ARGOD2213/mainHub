import {createRoot} from 'react-dom/client'
import './index.css'
import {Contact,Experience,Hero,Projects,Services} from './sections'
import Skills from './sections/Skills'
import {profile as p} from './constants/profile'
createRoot(document.getElementById('root')!).render(<><a href="#main" className="skip-link">Skip to content</a><header className="site-header"><a className="brand" href="#home">{p.name}<span>/</span>ENGINEERING</a><nav aria-label="Primary navigation"><a href="#services">Services</a><a href="#projects">Samples</a><a href="#experience">Experience</a><a href="#skills">Skills</a></nav><a className="btn header-cta" href="#contact">Hire me</a></header><main id="main"><Hero/><Services/><Projects/><Experience/><Skills/><Contact/></main><nav aria-label="Quick contact" className="quick-contact"><a href={`tel:${p.phoneTel}`}>Call</a><a href={p.whatsapp}>WhatsApp</a><a href={`mailto:${p.email}`}>Email</a></nav></>)