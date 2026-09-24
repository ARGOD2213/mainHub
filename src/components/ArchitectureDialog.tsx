import { useEffect, useRef } from 'react'
import { architectures, banner } from '../constants/architecture'

export default function ArchitectureDialog({ name, onClose }: { name: string; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const a = architectures[name]
  // showModal gives focus trapping and Escape for free; a div overlay would need both hand-built.
  useEffect(() => { const d = ref.current; if (d && !d.open) d.showModal() }, [])
  if (!a) return null
  return (
    <dialog ref={ref} onClose={onClose} onClick={e => { if (e.target === ref.current) onClose() }} aria-labelledby="arch-title" className="arch">
      <div style={{ padding: 20 }}>
        <h2 id="arch-title" style={{ fontSize: 20 }}>{name}: architecture</h2>
        <p className="chip">{banner(a.kind)}</p>
        <ol className="flow">
          {a.layers.map(l => (<li key={l.label}><h3 style={{ fontSize: 16 }}>{l.label}</h3>
            <div className="nodes">{l.nodes.map(n => <div key={n.name} className="node"><strong>{n.name}</strong><p>{n.note}</p></div>)}</div></li>))}
        </ol>
        {a.hardware && <><h3>How the hardware side works</h3><p>{a.hardware.intro}</p>
          <ol className="flow">{a.hardware.steps.map(s => <li key={s.name}><div className="node"><strong>{s.name}</strong><p>{s.note}</p></div></li>)}</ol></>}
        <h3>Optimisations</h3><ul>{a.optimizations.map(o => <li key={o}>{o}</li>)}</ul>
        {a.unattended.length > 0 && <><h3>Running without a developer</h3><ul>{a.unattended.map(o => <li key={o}>{o}</li>)}</ul>
          {a.needsSomeone && <p><strong>Still needs someone:</strong> {a.needsSomeone}</p>}</>}
        <button className="btn fill" onClick={onClose}>Close</button>
      </div>
    </dialog>)
}