import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { BNode, Blueprint } from '../data/portfolio'
import { Poster } from './Blueprints'
import { GitHubIcon, useDialog } from './ui'
import { EASE } from './Opening'

const KIND: Record<NonNullable<BNode['kind']>, { color: string; label: string }> = {
  client: { color: '#a9a7ae', label: 'Clients' },
  edge: { color: '#3ec7a5', label: 'Edge & gateway' },
  app: { color: '#ff7a1a', label: 'Services' },
  data: { color: '#5aa9ff', label: 'Data' },
  async: { color: '#8f7bff', label: 'Async & jobs' },
  ext: { color: '#ffc94a', label: 'External' },
}
const W = 146, H = 58
const pos = (n: BNode) => ({ x: 85 + n.col * 166, y: 70 + n.row * 130 })

/** shorten a centre-to-centre line so it starts and ends on the node borders */
function clip(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = b.x - a.x, dy = b.y - a.y
  const t = Math.min(dx ? (W / 2 + 4) / Math.abs(dx) : Infinity, dy ? (H / 2 + 4) / Math.abs(dy) : Infinity)
  return { x1: a.x + dx * t, y1: a.y + dy * t, x2: b.x - dx * t, y2: b.y - dy * t }
}

function Diagram({ b, selected, onSelect, step }: { b: Blueprint; selected: string | null; onSelect: (id: string) => void; step: number }) {
  const byId = Object.fromEntries(b.nodes.map((n) => [n.id, n]))
  const steps = b.trace.steps
  const current = step >= 0 ? byId[steps[step].node] : null
  const visited = new Set(step >= 0 ? steps.slice(0, step + 1).map((s) => s.node) : [])
  const hot = (id: string) => selected === id || current?.id === id
  const c = b.hue[2]

  return (
    <svg viewBox="0 0 1000 400" className="block w-full min-w-[720px]" role="img" aria-label={`${b.title} architecture diagram`}>
      <defs>
        <marker id={`arrow-${b.id}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" fill="#4a4a56" />
        </marker>
      </defs>
      {b.edges.map(([f, t], k) => {
        const l = clip(pos(byId[f]), pos(byId[t]))
        const lit = selected && (f === selected || t === selected)
        return <line key={k} {...l} stroke={lit ? c : '#33333d'} strokeWidth={lit ? 2.2 : 1.4} markerEnd={`url(#arrow-${b.id})`} />
      })}
      {/* path traced so far */}
      {step > 0 &&
        steps.slice(1, step + 1).map((s, k) => {
          const l = clip(pos(byId[steps[k].node]), pos(byId[s.node]))
          return (
            <line key={`t${k}`} {...l} stroke={c} strokeWidth={3} strokeDasharray="6 6" strokeLinecap="round">
              <animate attributeName="stroke-dashoffset" from="24" to="0" dur="0.8s" repeatCount="indefinite" />
            </line>
          )
        })}
      {b.nodes.map((n) => {
        const p = pos(n)
        const k = KIND[n.kind ?? 'app']
        return (
          <g
            key={n.id}
            role="button"
            tabIndex={0}
            aria-label={`${n.label}${n.sub ? `, ${n.sub}` : ''}`}
            onClick={() => onSelect(n.id)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect(n.id))}
            className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-[3]"
          >
            <rect
              x={p.x - W / 2}
              y={p.y - H / 2}
              width={W}
              height={H}
              rx={10}
              fill={hot(n.id) ? '#1d1d26' : '#121218'}
              stroke={hot(n.id) ? c : visited.has(n.id) ? k.color : '#2e2e38'}
              strokeWidth={hot(n.id) ? 2.4 : 1.4}
            />
            <rect x={p.x - W / 2} y={p.y - H / 2 + 10} width={3} height={H - 20} rx={1.5} fill={k.color} />
            <text x={p.x + 2} y={n.sub ? p.y - 3 : p.y + 5} textAnchor="middle" fill="#f3efe7" fontSize="14" fontWeight="600" fontFamily="Archivo, sans-serif">{n.label}</text>
            {n.sub && <text x={p.x + 2} y={p.y + 15} textAnchor="middle" fill="#8d8b94" fontSize="11" fontFamily="JetBrains Mono, monospace">{n.sub}</text>}
          </g>
        )
      })}
      {current && (
        <g style={{ transform: `translate(${pos(current).x}px, ${pos(current).y - H / 2 - 12}px)`, transition: 'transform .7s cubic-bezier(.22,1,.36,1)' }}>
          <circle r="9" fill={c} opacity="0.25">
            <animate attributeName="r" values="7;14;7" dur="1.4s" repeatCount="indefinite" />
          </circle>
          <circle r="5.5" fill={c} />
        </g>
      )}
    </svg>
  )
}

export default function BlueprintModal({ b, onClose }: { b: Blueprint; onClose: () => void }) {
  const box = useRef<HTMLDivElement>(null)
  useDialog(box, onClose)
  const [selected, setSelected] = useState<string | null>(null)
  const [step, setStep] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const steps = b.trace.steps

  useEffect(() => {
    if (!playing) return
    if (step >= steps.length - 1) { setPlaying(false); return }
    const t = setTimeout(() => setStep((s) => s + 1), step < 0 ? 100 : 1700)
    return () => clearTimeout(t)
  }, [playing, step, steps.length])

  const play = () => { setSelected(null); setStep(-1); setPlaying(true) }
  const sel = b.nodes.find((n) => n.id === (selected ?? (step >= 0 ? steps[step].node : '')))

  return (
    <motion.div
      className="fixed inset-0 z-[70] overflow-y-auto bg-black/85 backdrop-blur-sm sm:py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        ref={box}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`bp-${b.id}`}
        className="relative mx-auto min-h-full max-w-5xl overflow-hidden bg-ink-2 sm:min-h-0 sm:rounded-xl"
        initial={{ y: 60, scale: 0.96 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.55, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/70 text-bone hover:bg-black">
          <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" fill="none"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <div className="relative h-[34vh] min-h-[240px]">
          <Poster b={b} big />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink-2 to-transparent" />
        </div>

        <div className="space-y-12 px-5 pb-12 sm:px-10">
          {/* brief */}
          <div className="grid gap-8 md:grid-cols-[1.5fr_1fr]">
            <div>
              <h2 id={`bp-${b.id}`} className="sr-only">{b.title}</h2>
              <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
                {b.status === 'built' ? (
                  <span className="rounded-sm bg-emerald-400/15 px-2 py-0.5 font-bold text-emerald-300">Built · open source</span>
                ) : (
                  <span className="rounded-sm bg-amber/15 px-2 py-0.5 font-bold text-amber">Blueprint · reference architecture</span>
                )}
                <span className="text-mist">{b.genre}</span>
              </div>
              <p className="mono mb-2 text-[11px] tracking-[0.2em] text-smoke">THE BRIEF</p>
              <p className="text-lg leading-relaxed text-bone">{b.brief}</p>
              {b.github && (
                <a href={b.github} target="_blank" rel="noreferrer" className="btn btn-play mt-6"><GitHubIcon /> View the code</a>
              )}
            </div>
            <div className="space-y-5 text-sm">
              <div>
                <p className="text-smoke">Stack</p>
                <div className="mt-2 flex flex-wrap gap-1.5">{b.stack.map((s) => <span key={s} className="chip">{s}</span>)}</div>
              </div>
              <div>
                <p className="text-smoke">Runs on</p>
                <div className="mt-2 flex flex-wrap gap-1.5">{b.runsOn.map((s) => <span key={s} className="chip">{s}</span>)}</div>
              </div>
            </div>
          </div>

          {/* architecture */}
          <div>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h3 className="text-2xl font-bold text-bone">Architecture</h3>
                <p className="text-sm text-smoke">Click any component, or trace a request end to end.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={play} className="btn btn-play px-4 py-2 text-sm">▶ {step >= 0 ? 'Replay' : 'Trace'}: {b.trace.name.toLowerCase()}</button>
              </div>
            </div>
            <div className="overflow-x-auto rounded-lg border border-line bg-ink">
              <Diagram b={b} selected={selected} onSelect={(id) => { setPlaying(false); setSelected(id === selected ? null : id) }} step={step} />
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
              {Object.entries(KIND).filter(([k]) => b.nodes.some((n) => (n.kind ?? 'app') === k)).map(([k, v]) => (
                <span key={k} className="flex items-center gap-1.5 text-[11px] text-smoke"><span className="h-2 w-2 rounded-full" style={{ background: v.color }} />{v.label}</span>
              ))}
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-line bg-ink p-4" aria-live="polite">
                <p className="mono text-[11px] tracking-[0.2em] text-smoke">REQUEST TRACE {step >= 0 && `· STEP ${step + 1} / ${steps.length}`}</p>
                <p className="mt-2 min-h-[3rem] text-bone">{step >= 0 ? steps[step].text : `Press “Trace” to follow: ${b.trace.name.toLowerCase()}.`}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => { setPlaying(false); setSelected(null); setStep((s) => Math.max(0, s - 1)) }} disabled={step <= 0} className="rounded border border-line px-3 py-1 text-xs text-mist hover:text-bone disabled:opacity-30">← Prev</button>
                  <button onClick={() => { setPlaying(false); setSelected(null); setStep((s) => Math.min(steps.length - 1, s + 1)) }} disabled={step >= steps.length - 1} className="rounded border border-line px-3 py-1 text-xs text-mist hover:text-bone disabled:opacity-30">Next →</button>
                  {playing && <button onClick={() => setPlaying(false)} className="rounded border border-line px-3 py-1 text-xs text-mist hover:text-bone">❚❚ Pause</button>}
                </div>
              </div>
              <div className="rounded-lg border border-line bg-ink p-4">
                <p className="mono text-[11px] tracking-[0.2em] text-smoke">COMPONENT</p>
                {sel ? (
                  <>
                    <p className="mt-2 font-semibold text-bone">{sel.label}{sel.sub && <span className="ml-2 font-normal text-smoke">{sel.sub}</span>}</p>
                    <p className="mt-1 text-sm leading-relaxed text-mist">{sel.note}</p>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-mist">Select a component in the diagram to see what it does and why it’s there.</p>
                )}
              </div>
            </div>
          </div>

          {/* scaling */}
          <div>
            <h3 className="mb-4 text-2xl font-bold text-bone">{b.status === 'built' ? 'How it was built' : 'How it scales'}</h3>
            <ol className="grid gap-3 md:grid-cols-3">
              {b.stages.map((s, i) => (
                <li key={s.name} className="relative rounded-lg border border-line bg-ink p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="grid h-6 w-6 place-items-center rounded-full text-xs font-bold text-black" style={{ background: b.hue[2] }}>{i + 1}</span>
                    <span className="font-semibold text-bone">{s.name}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-mist">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* decisions + failures */}
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="mb-4 text-2xl font-bold text-bone">Key decisions</h3>
              <div className="space-y-3">
                {b.decisions.map((d) => (
                  <details key={d.title} className="group rounded-lg border border-line bg-ink p-4 open:border-smoke">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-3 font-semibold text-bone">
                      {d.title}
                      <span className="mono text-smoke transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-mist"><span className="text-emerald-300">Why:</span> {d.why}</p>
                    <p className="mt-2 text-sm leading-relaxed text-mist"><span className="text-amber-2">Trade-off:</span> {d.tradeoff}</p>
                  </details>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-2xl font-bold text-bone">When things break</h3>
              <ul className="divide-y divide-line rounded-lg border border-line bg-ink">
                {b.failures.map((f) => (
                  <li key={f.what} className="p-4">
                    <p className="text-sm font-semibold text-red-300">⚠ {f.what}</p>
                    <p className="mt-1 text-sm leading-relaxed text-mist">→ {f.fix}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-amber/40 bg-amber/5 p-5">
            <p className="text-bone">Need something like {b.title} for your product?</p>
            <a href="#contact" onClick={onClose} className="btn btn-play">Start a project</a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
