import { useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Project } from '../data/portfolio'
import { Poster } from './Originals'
import { GitHubIcon } from './ui'
import { EASE } from './Opening'

function ArchDiagram({ p }: { p: Project }) {
  const c = p.hue[2]
  return (
    <div className="rounded-lg border border-line bg-ink p-4 sm:p-6">
      {p.arch.map((layer, i) => (
        <div key={layer.label}>
          <div className="grid gap-3 sm:grid-cols-[7rem_1fr] sm:items-center">
            <p className="mono text-[10px] uppercase tracking-[0.25em] text-smoke">{layer.label}</p>
            <div className="flex flex-wrap gap-2.5">
              {layer.nodes.map((n, k) => (
                <motion.div
                  key={n.name}
                  className="min-w-[9rem] flex-1 rounded-md border bg-ink-2 px-3 py-2.5"
                  style={{ borderColor: `${c}55` }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.12 + k * 0.05, duration: 0.5, ease: EASE }}
                >
                  <p className="text-sm font-semibold text-bone">{n.name}</p>
                  <p className="mt-0.5 text-xs text-smoke">{n.note}</p>
                </motion.div>
              ))}
            </div>
          </div>
          {i < p.arch.length - 1 && (
            <div className="flex h-7 pl-8 sm:pl-[9.5rem]">
              <svg width="12" height="28" aria-hidden>
                <line x1="6" y1="0" x2="6" y2="28" stroke={c} strokeWidth="1.5" strokeDasharray="3 4">
                  <animate attributeName="stroke-dashoffset" from="14" to="0" dur="0.8s" repeatCount="indefinite" />
                </line>
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function ProjectModal({ p, onClose }: { p: Project; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const key = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', key)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', key) }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[70] overflow-y-auto bg-black/80 backdrop-blur-sm sm:py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal
      aria-label={p.title}
    >
      <motion.article
        className="relative mx-auto min-h-full max-w-4xl overflow-hidden bg-ink-2 sm:min-h-0 sm:rounded-xl"
        initial={{ y: 60, scale: 0.96 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.55, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-[42vh] min-h-[280px]">
          <Poster p={p} big />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink-2 to-transparent" />
        </div>
        <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-black/70 text-bone hover:bg-black">
          <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" fill="none"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>

        <div className="space-y-10 px-5 pb-10 sm:px-10">
          <div className="grid gap-8 md:grid-cols-[1.5fr_1fr]">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
                <span className="font-bold text-emerald-400">Built by me</span>
                <span className="text-mist">{p.year}</span>
                <span className="rounded-sm border border-mist/50 px-1.5 text-[11px] text-mist">{p.badge}</span>
              </div>
              <p className="text-lg leading-relaxed text-bone">{p.logline}</p>
              {p.github && (
                <a href={p.github} target="_blank" rel="noreferrer" className="btn btn-play mt-6">
                  <GitHubIcon /> View code on GitHub
                </a>
              )}
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-smoke">Stack</p>
                <div className="mt-2 flex flex-wrap gap-1.5">{p.stack.map((s) => <span key={s} className="chip">{s}</span>)}</div>
              </div>
              <div>
                <p className="text-smoke">Highlights</p>
                <ul className="mt-2 space-y-1 text-bone">{p.highlights.map((h) => <li key={h}>— {h}</li>)}</ul>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xl font-bold text-bone">Episodes</h4>
            <ol className="divide-y divide-line border-y border-line">
              {p.episodes.map((e, i) => (
                <li key={i} className="flex gap-5 py-4">
                  <span className="display text-3xl font-black text-smoke">{i + 1}</span>
                  <p className="pt-1 text-sm leading-relaxed text-mist">{e}</p>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h4 className="mb-1 text-xl font-bold text-bone">Behind the scenes</h4>
            <p className="mb-4 text-sm text-smoke">How the system fits together.</p>
            <ArchDiagram p={p} />
          </div>
        </div>
      </motion.article>
    </motion.div>
  )
}
