import { useRef } from 'react'
import { motion } from 'framer-motion'
import { originals, type Project } from '../data/portfolio'
import { Arrow, SectionHead } from './ui'
import { EASE } from './Opening'

export function Poster({ p, big = false }: { p: Project; big?: boolean }) {
  const [a, b, c] = p.hue
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background: `radial-gradient(120% 80% at 80% 10%, ${b} 0%, ${a} 55%, #050507 100%)` }}
    >
      {/* blueprint grid motif */}
      <svg className="absolute inset-0 h-full w-full opacity-25" aria-hidden>
        <defs>
          <pattern id={`g-${p.id}-${big}`} width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M28 0H0V28" fill="none" stroke={c} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#g-${p.id}-${big})`} />
      </svg>
      <svg className="absolute -right-10 top-8 h-2/3 opacity-40" viewBox="0 0 200 200" aria-hidden>
        <circle cx="100" cy="100" r="80" fill="none" stroke={c} strokeWidth="1" strokeDasharray="4 6" />
        <circle cx="100" cy="100" r="50" fill="none" stroke={c} strokeWidth="1" />
        <circle cx="100" cy="100" r="6" fill={c} />
        {[0, 60, 120, 180, 240, 300].map((d) => (
          <circle key={d} cx={100 + 80 * Math.cos((d * Math.PI) / 180)} cy={100 + 80 * Math.sin((d * Math.PI) / 180)} r="4" fill={c} />
        ))}
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 to-transparent" />
      <div className="absolute left-3 top-3 flex items-center gap-1.5">
        <span className="display rounded-sm bg-amber px-1 text-sm font-black text-black">M</span>
        <span className="mono text-[9px] tracking-[0.3em] text-white/80">ORIGINAL</span>
      </div>
      <div className={`absolute inset-x-0 bottom-0 p-4 ${big ? 'pb-24 sm:px-10' : ''}`}>
        <h3 className={`display font-black text-white ${big ? 'text-6xl sm:text-8xl' : 'text-4xl'}`} style={{ textShadow: `0 0 30px ${c}55` }}>
          {p.title}
        </h3>
        <p className="mt-2 text-[11px] text-white/70">{p.genre}</p>
      </div>
      {!big && <span className="absolute right-3 top-3 rounded-sm px-1.5 py-0.5 text-[10px] font-bold text-black" style={{ background: c }}>{p.badge}</span>}
    </div>
  )
}

export default function Originals({ onOpen }: { onOpen: (p: Project) => void }) {
  const rail = useRef<HTMLDivElement>(null)
  const go = (d: number) => rail.current?.scrollBy({ left: d * rail.current.clientWidth * 0.8, behavior: 'smooth' })

  return (
    <section id="originals" className="py-14">
      <SectionHead kicker="ORIGINALS" title="Projects I built" note="Open any title for the full story and its architecture diagram." />
      <div className="group/rail relative">
        <div ref={rail} className="no-scrollbar gutter flex snap-x gap-4 overflow-x-auto pb-4">
          {originals.map((p, i) => (
            <motion.button
              key={p.id}
              onClick={() => onOpen(p)}
              className="group relative aspect-[2/3] w-[64vw] shrink-0 snap-start overflow-hidden rounded-md text-left ring-amber transition-shadow hover:ring-2 sm:w-[260px] lg:w-[300px]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.7, ease: EASE }}
              whileHover={{ y: -6 }}
            >
              <Poster p={p} />
              <span className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="mono rounded-full bg-bone px-4 py-2 text-xs font-semibold text-black">▶ OPEN</span>
              </span>
            </motion.button>
          ))}
          <div className="w-px shrink-0" />
        </div>
        <button onClick={() => go(-1)} aria-label="Scroll left" className="absolute inset-y-0 left-0 hidden w-12 place-items-center bg-gradient-to-r from-ink/90 opacity-0 transition-opacity group-hover/rail:opacity-100 md:grid"><Arrow dir="left" /></button>
        <button onClick={() => go(1)} aria-label="Scroll right" className="absolute inset-y-0 right-0 hidden w-12 place-items-center bg-gradient-to-l from-ink/90 opacity-0 transition-opacity group-hover/rail:opacity-100 md:grid"><Arrow /></button>
      </div>
    </section>
  )
}
