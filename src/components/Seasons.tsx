import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { seasons } from '../data/portfolio'
import { SectionHead } from './ui'
import { EASE } from './Opening'

const STATUS = {
  complete: { label: 'Complete', cls: 'bg-white/10 text-mist' },
  airing: { label: 'Now airing', cls: 'bg-amber text-black' },
  next: { label: 'Coming next', cls: 'border border-amber/60 text-amber' },
} as const

export default function Seasons() {
  const [sel, setSel] = useState(1)
  const s = seasons[sel]

  return (
    <section id="seasons" className="py-14">
      <SectionHead kicker="MY JOURNEY" title="Seasons & Episodes" />
      <div className="gutter">
        <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto" role="tablist">
          {seasons.map((x, i) => (
            <button
              key={x.n}
              role="tab"
              aria-selected={i === sel}
              onClick={() => setSel(i)}
              className={`shrink-0 rounded-md border px-4 py-2 text-sm font-semibold transition-colors ${i === sel ? 'border-bone bg-bone text-black' : 'border-line text-mist hover:text-bone'}`}
            >
              Season {x.n} <span className="ml-1 font-normal opacity-70">· {x.title}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={sel}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className={`rounded-sm px-2 py-0.5 text-xs font-bold ${STATUS[s.status].cls}`}>{STATUS[s.status].label}</span>
              <span className="text-sm text-bone">{s.org}</span>
              <span className="mono text-xs text-smoke">{s.when}</span>
            </div>
            <ol className="divide-y divide-line border-y border-line">
              {s.episodes.map((e, i) => (
                <li key={e.n} className="group grid grid-cols-[2.2rem_1fr] items-start gap-4 py-5 sm:grid-cols-[3rem_9rem_1fr] sm:gap-6">
                  <span className="display pt-1 text-3xl font-black text-smoke group-hover:text-amber">{i + 1}</span>
                  <div
                    className="relative hidden aspect-video overflow-hidden rounded sm:block"
                    style={{ background: `linear-gradient(135deg, #1d1208, ${s.status === 'next' ? '#2a2550' : '#5a2a06'})` }}
                  >
                    <span className="mono absolute left-2 top-2 text-[10px] text-white/60">S{s.n}·{e.n}</span>
                    <span className="absolute inset-0 grid place-items-center opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="grid h-9 w-9 place-items-center rounded-full border border-white/70 bg-black/40">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M6 4l15 8-15 8z" /></svg>
                      </span>
                    </span>
                  </div>
                  <div className="col-start-2 sm:col-start-auto">
                    <h3 className="font-semibold text-bone">{e.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-mist">{e.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
