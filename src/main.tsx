import {createRoot} from 'react-dom/client'
import {useEffect} from 'react'
import {gsap} from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import './index.css'
import {Contact,Experience,Hero,Projects,Services} from './sections'
import Skills from './sections/Skills'
import {profile as p} from './constants/profile'
gsap.registerPlugin(ScrollTrigger)
function App(){useEffect(()=>{const headings=gsap.utils.toArray<HTMLElement>('section h2');headings.forEach(h=>gsap.fromTo(h,{y:24,opacity:0},{y:0,opacity:1,duration:.55,ease:'power3.out',scrollTrigger:{trigger:h,start:'top 75%',once:true}}));const sections=gsap.utils.toArray<HTMLElement>('main section[data-section-title]');const triggers=sections.map(s=>ScrollTrigger.create({trigger:s,start:'top 45%',end:'bottom 45%',onEnter:()=>document.title=s.dataset.sectionTitle||'Mahindra · Engineering',onEnterBack:()=>document.title=s.dataset.sectionTitle||'Mahindra · Engineering'}));return()=>{triggers.forEach(t=>t.kill());ScrollTrigger.getAll().forEach(t=>t.kill())}},[]);return <><a href="#main" className="skip-link">Skip to content</a><header className="site-header"><a className="brand" href="#home">{p.name}<span>/</span>ENGINEERING</a><nav aria-label="Primary navigation"><a href="#services">Services</a><a href="#projects">Samples</a><a href="#experience">Experience</a><a href="#skills">Skills</a></nav><a className="btn header-cta" href="#contact">Hire me</a></header><main id="main"><Hero/><Services/><Projects/><Experience/><Skills/><Contact/></main><nav aria-label="Quick contact" className="quick-contact"><a href={`tel:${p.phoneTel}`}>Call</a><a href={p.whatsapp}>WhatsApp</a><a href={`mailto:${p.email}`}>Email</a></nav></>}
createRoot(document.getElementById('root')!).render(<App/>)
