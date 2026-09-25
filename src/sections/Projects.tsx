import {useRef,useState} from 'react'
import {architectures} from '../constants/architecture'
import {built,samples} from '../constants/samples'
import ProjectModal from '../components/ProjectModal'
import SystemDiagram from '../components/SystemDiagram'
import type {ProjectTheme} from '../constants/samples'

const motif=(theme:ProjectTheme)=><div className={`project-motif motif--${theme}`} aria-hidden>
  {theme==='api'&&<><span className="request-line"/><span className="request-dot"/></>}
  {theme==='realtime'&&<><svg viewBox="0 0 500 150"><polyline points="0,90 55,82 105,96 155,48 205,72 255,35 310,65 360,44 415,80 500,58" fill="none"/></svg><span className="pulse-dot"/></>}
  {theme==='ai'&&<svg viewBox="0 0 500 220"><path d="M70 130 175 70 285 120 405 55M175 70l20 105M285 120l75 55" fill="none"/><circle cx="70" cy="130" r="5"/><circle cx="175" cy="70" r="5"/><circle cx="285" cy="120" r="5"/><circle cx="405" cy="55" r="5"/></svg>}
  {theme==='kit'&&<div className="kit-modules"><span>COUPON ENGINE</span><span>STOCK ALERTS</span><span>WEBHOOK RECEIVER</span></div>}
</div>

export default function Projects(){
  const [open,setOpen]=useState<{name:string;trigger:HTMLElement}|null>(null)
  const refs=useRef(new Map<string,HTMLElement>())
  const openProject=(name:string)=>{const trigger=refs.current.get(name);if(trigger)setOpen({name,trigger})}
  const handleKey=(e:React.KeyboardEvent<HTMLElement>,name:string)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openProject(name)}}
  const all=[...samples.map(s=>({...s,kind:'sample' as const})),...built.map(s=>({...s,kind:'built' as const}))]
  return <section id="projects" className="section-dark projects-section" data-section-title="Mahindra · Samples">
    <div className="wrap">
      <div className="section-heading"><div><h2>Sample builds</h2></div><p>Self-initiated designs, not client work. Each topology shows how I would structure the product before implementation.</p></div>
      <div className="sample-grid">
        {samples.map(s=><article key={s.name} ref={el=>{if(el)refs.current.set(s.name,el)}} className={`project-card project-card--${s.theme}`} role="button" tabIndex={0} aria-haspopup="dialog" aria-label={`Open details for ${s.name}`} onClick={()=>openProject(s.name)} onKeyDown={e=>handleKey(e,s.name)}>
          {motif(s.theme)}
          <div className="project-card-content"><div className="project-card-head"><div><span className="sample-label">Sample build · not client work</span><h3>{s.name}</h3></div><span className="status-chip">{s.status}</span></div><p>{s.problem}</p>{s.note&&<p className="sample-note">{s.note}</p>}<ul className="project-bullets">{s.does.map(x=><li key={x}>{x}</li>)}</ul><div className="project-tags">{s.tech.map(x=><span key={x}>{x}</span>)}</div><SystemDiagram architecture={architectures[s.name]!} size="preview"/><div className="project-card-foot"><span>REST</span><span className="btn">View details</span></div></div>
        </article>)}
      </div>
      <h3 className="built-heading">Built projects</h3>
      <div className="built-grid">
        {built.map(s=><article key={s.name} ref={el=>{if(el)refs.current.set(s.name,el)}} className={`project-card project-card--built project-card--${s.theme}`} role="button" tabIndex={0} aria-haspopup="dialog" aria-label={`Open details for ${s.name}`} onClick={()=>openProject(s.name)} onKeyDown={e=>handleKey(e,s.name)}>
          {motif(s.theme)}
          <div className="project-card-content"><div className="project-card-head"><div><span className="sample-label">Built project</span><h3>{s.name}</h3></div><span className="status-chip">Private repository</span></div><p>{s.when} · {s.tech}</p><ul className="project-bullets">{s.bullets.map(x=><li key={x}>{x}</li>)}</ul><SystemDiagram architecture={architectures[s.name]!} size="preview"/><div className="project-card-foot"><span>{s.theme==='ai'?'RAG':'REST'}</span><span className="btn">View details</span></div></div>
        </article>)}
      </div>
    </div>
    {open&&<ProjectModal project={all.find(x=>x.name===open.name)!} architecture={architectures[open.name]!} trigger={open.trigger} onClose={()=>setOpen(null)}/>}
  </section>
}
