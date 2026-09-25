import { useEffect, useRef, useState } from 'react'
import { architectures, banner } from '../constants/architecture'
import SystemDiagram from './SystemDiagram'

export default function ArchitectureDialog({ name, onClose }: { name: string; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const [expandedNode, setExpandedNode] = useState<string | null>(null)
  const a = architectures[name]

  useEffect(() => {
    const d = ref.current
    if (d && !d.open) d.showModal()
    return () => {
      if (d?.open) d.close()
    }
  }, [])

  useEffect(() => {
    const d = ref.current
    if (!d) return
    const handleClose = () => onClose()
    d.addEventListener('close', handleClose)
    return () => d.removeEventListener('close', handleClose)
  }, [onClose])

  if (!a) return null

  const selected = expandedNode
    ? a.layers.flatMap(layer => layer.nodes).find(node => node.id === expandedNode)
    : undefined

  return (
    <dialog
      ref={ref}
      className="arch"
      aria-labelledby="arch-title"
      onClick={event => { if (event.target === ref.current) ref.current?.close() }}
    >
      <div className="arch-inner">
        <header className="arch-header">
          <div>
            <p className="eyebrow">SYSTEM TOPOLOGY / {a.kind.toUpperCase()}</p>
            <h2 id="arch-title">{name}</h2>
            <p className="arch-banner">{banner(a.kind)}</p>
          </div>
          <button className="icon-button" type="button" aria-label="Close architecture dialog" onClick={() => ref.current?.close()}>×</button>
        </header>

        <SystemDiagram
          architecture={a}
          size="full"
          interactive
          expandedNode={expandedNode}
          onNodeSelect={setExpandedNode}
        />

        {selected && (
          <section className="node-detail" aria-live="polite">
            <p className="eyebrow">SELECTED NODE</p>
            <h3>{selected.name}</h3>
            <p>{selected.note}</p>
          </section>
        )}

        {a.releasePipeline.length > 0 && (
          <section className="release-strip" aria-label="Release pipeline">
            <div>
              <p className="eyebrow">RELEASE PIPELINE</p>
              <h3>Release pipeline</h3>
              <p>Deployment infrastructure is shown separately from the live request-path topology.</p>
            </div>
            {a.releasePipeline.flatMap(layer => layer.nodes).map(node => (
              <div className="release-node" key={node.id}>
                <strong>{node.name}</strong>
                <span>{node.note}</span>
              </div>
            ))}
          </section>
        )}

        {a.hardware && (
          <section className="hardware-panel">
            <p className="eyebrow">HARDWARE CONTRACT</p>
            <h3>How the hardware side works</h3>
            <p>{a.hardware.intro}</p>
            <ol className="hardware-flow">
              {a.hardware.steps.map(step => (
                <li key={step.id}>
                  <strong>{step.name}</strong>
                  <span>{step.note}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        <div className="arch-copy-grid">
          <section>
            <p className="eyebrow">OPTIMISATIONS</p>
            <ul>{a.optimizations.map(item => <li key={item}>{item}</li>)}</ul>
          </section>
          {a.unattended.length > 0 && (
            <section>
              <p className="eyebrow">UNATTENDED OPERATIONS</p>
              <ul>{a.unattended.map(item => <li key={item}>{item}</li>)}</ul>
              {a.needsSomeone && <p><strong>Still needs someone:</strong> {a.needsSomeone}</p>}
            </section>
          )}
        </div>

        <button className="btn fill" type="button" onClick={() => ref.current?.close()}>Close architecture</button>
      </div>
    </dialog>
  )
}
