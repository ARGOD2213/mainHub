import { useState } from 'react'
import { architectures, banner } from '../constants/architecture'
import { built, samples } from '../constants/samples'
import ArchitectureDialog from '../components/ArchitectureDialog'
import SystemDiagram from '../components/SystemDiagram'

export default function Projects() {
  const [open, setOpen] = useState<string | null>(null)
  const allSamples = samples.map(sample => ({ ...sample, architecture: architectures[sample.name]! }))
  const allBuilt = built.map(project => ({ ...project, architecture: architectures[project.name]! }))

  return (
    <section id="projects" className="section-dark projects-section">
      <div className="wrap">
        <div className="section-heading">
          <div><p className="eyebrow">04 / SYSTEMS</p><h2>Projects as engineering systems</h2></div>
          <p>Open a topology to inspect the request path, data dependencies and release pipeline. Planned work is labeled as design; built work stays tied to the stated stack.</p>
        </div>

        <div className="project-grid">
          {allSamples.map(project => (
            <article className="project-card" key={project.name}>
              <div className="project-card-head">
                <div><span className="project-number">DESIGN</span><h3>{project.name}</h3></div>
                <span className="status-chip">{project.status}</span>
              </div>
              <p>{project.problem}</p>
              <div className="project-tags">{project.tech.map(item => <span key={item}>{item}</span>)}</div>
              <div className="project-diagram"><SystemDiagram architecture={project.architecture} size="preview" /></div>
              <div className="project-card-foot"><span>{banner(project.architecture.kind)}</span><button className="btn" type="button" onClick={() => setOpen(project.name)}>View topology</button></div>
            </article>
          ))}

          {allBuilt.map(project => (
            <article className="project-card project-card--built" key={project.name}>
              <div className="project-card-head">
                <div><span className="project-number">BUILT</span><h3>{project.name}</h3></div>
                <span className="status-chip">Private repository</span>
              </div>
              <p>{project.when} · {project.tech}</p>
              <ul className="project-bullets">{project.bullets.map(item => <li key={item}>{item}</li>)}</ul>
              <div className="project-diagram"><SystemDiagram architecture={project.architecture} size="preview" /></div>
              <div className="project-card-foot"><span>Architecture follows the stated project stack.</span><button className="btn" type="button" onClick={() => setOpen(project.name)}>View topology</button></div>
            </article>
          ))}
        </div>
      </div>
      {open && <ArchitectureDialog key={open} name={open} onClose={() => setOpen(null)} />}
    </section>
  )
}
