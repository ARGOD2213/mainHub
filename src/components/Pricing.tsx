import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { pricingNotes, tracks, type BriefId, type TrackId } from '../data/portfolio'
import { CurrencyToggle, money, useCurrency } from '../lib/currency'
import { SectionHead } from './ui'
import { EASE } from './Opening'

export default function Pricing({ initial, onPick }: { initial: TrackId; onPick: (b: BriefId) => void }) {
  const [tab, setTab] = useState<TrackId>(initial)
  const { cur } = useCurrency()
  const t = tracks.find((x) => x.id === tab)!
  const first = tracks[0].plans[0]
  const from = money(cur, first.inr, first.usd)

  return (
    <section id="services" className="py-16">
      <SectionHead
        kicker="SERVICES & PRICING"
        title="Something for every size of idea"
        note={`From a ${from} ${first.name.toLowerCase()} to a Kubernetes migration. Every price is a starting point, and you get a fixed quote before any work starts.`}
      />
      <div className="gutter">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1" role="tablist" aria-label="Service tracks">
            {tracks.map((x) => (
              <button
                key={x.id}
                role="tab"
                aria-selected={x.id === tab}
                onClick={() => setTab(x.id)}
                className={`shrink-0 rounded-md border px-4 py-2 text-sm font-semibold transition-colors ${x.id === tab ? 'border-bone bg-bone text-black' : 'border-line text-mist hover:text-bone'}`}
              >
                {x.name}
              </button>
            ))}
          </div>
          <CurrencyToggle />
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, ease: EASE }}>
            <p className="mb-5 max-w-[70ch] text-[15px] leading-relaxed text-mist">{t.who}</p>
            <div className={`grid gap-4 sm:grid-cols-2 ${t.plans.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
              {t.plans.map((p) => {
                const price = money(cur, p.inr, p.usd)
                return (
                  <article
                    key={p.name}
                    className={`relative flex flex-col rounded-xl border p-5 transition-colors ${p.popular ? 'border-amber/70 bg-amber/[0.06]' : 'border-line bg-ink-2/70 hover:border-smoke'}`}
                  >
                    {p.popular && <span className="mono absolute -top-2.5 left-5 rounded-full bg-amber px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-black">MOST CHOSEN</span>}
                    <h3 className="display text-[1.9rem] font-black leading-[0.95] text-bone">{p.name}</h3>
                    <p className="mt-1.5 text-sm text-smoke">{p.for}</p>
                    <div className="mt-4 flex items-baseline gap-1.5">
                      {price ? (
                        <>
                          <span className="text-xs text-smoke">from</span>
                          <span className="text-3xl font-bold tabular-nums text-bone">{price}</span>
                          {p.per && <span className="text-sm text-smoke">/ {p.per}</span>}
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-bone">Custom quote</span>
                      )}
                    </div>
                    <p className="mono mt-1 text-[11px] text-amber">{p.time}</p>
                    <ul className="mt-4 flex-1 space-y-1.5 text-sm text-bone/90">
                      {p.gets.map((g) => <li key={g} className="flex gap-2"><span className="text-amber">✓</span><span>{g}</span></li>)}
                    </ul>
                    <a
                      href="#contact"
                      onClick={() => onPick(p.brief)}
                      className={`btn mt-5 justify-center py-2.5 text-sm ${p.popular ? 'btn-play' : 'btn-ghost'}`}
                    >
                      {p.per ? 'Start the plan' : price ? 'Get a quote' : 'Book a call'}
                    </a>
                  </article>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <ul className="mt-6 grid gap-2 rounded-xl border border-line p-4 text-sm text-smoke md:grid-cols-3">
          {pricingNotes.map((n) => <li key={n} className="flex gap-2"><span className="text-amber">·</span>{n}</li>)}
        </ul>
      </div>
    </section>
  )
}
