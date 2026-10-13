import { useRef } from 'react'
import { motion } from 'framer-motion'
import { blueprints, type Blueprint } from '../data/portfolio'
import { Arrow, SectionHead } from './ui'
import { EASE } from './Opening'

export function Poster({ b, big = false }: { b: Blueprint; big?: boolean }) {
  const [a, mid, c] = b.hue
  const pid = `g-${b.id}-${big ? 'b' : 's'}`
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: `radial-gradient(120% 80% at 80% 10%, ${mid} 0%, ${a} 55%, #050507 100%)` }}>
      <svg className="absolute inset-0 h-full w-full opacity-25" aria-hidden>
        <defs>
          <pattern id={pid} width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M28 0H0V28" fill="none" stroke={c} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pid})`} />
      </svg>
      {/* mini topology made from the blueprint's own nodes */}
      <svg className="absolute inset-x-0 top-[12%] h-[48%] w-full opacity-60" viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet" aria-hidden>
        {b.edges.map(([f, t], k) => {
          const A = b.nodes.find((n) => n.id === f)!, B = b.nodes.find((n) => n.id === t)!
          return <line key={k} x1={85 + A.col * 166} y1={70 + A.row * 130} x2={85 + B.col * 166} y2={70 + B.row * 130} stroke={c} strokeWidth="3" opacity="0.6" />
        })}
        {b.nodes.map((n) => <circle key={n.id} cx={85 + n.col * 166} cy={70 + n.row * 130} r="16" fill={a} stroke={c} strokeWidth="4" />)}
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />
      <div className="absolute left-3 top-3 flex items-center gap-1.5">
        <span className="display rounded-sm bg-amber px-1 text-sm font-black text-black">M</span>
        <span className="mono text-[9px] tracking-[0.3em] text-white/80">ORIGINAL</span>
      </div>
      {!big && (
        <span className="mono absolute right-3 top-3 rounded-sm px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-black" style={{ background: c }}>
          {b.status === 'built' ? 'OPEN SOURCE' : 'BLUEPRINT'}
        </span>
      )}
      <div className={`absolute inset-x-0 bottom-0 p-4 ${big ? 'pb-20 sm:px-10' : ''}`}>
        <h3 className={`display font-black text-white ${big ? 'text-6xl sm:text-8xl' : 'text-[2.6rem]'}`} style={{ textShadow: `0 0 30px ${c}55` }}>
          {b.title}
        </h3>
        <p className={`mt-1.5 text-white/80 ${big ? 'text-base' : 'text-[13px] leading-snug'}`}>{b.tagline}</p>
        <p className="mono mt-1.5 text-[10px] tracking-wide" style={{ color: c }}>{b.genre}</p>
      </div>
    </div>
  )
}

export default function Blueprints({ onOpen }: { onOpen: (b: Blueprint) => void }) {
  const rail = useRef<HTMLDivElement>(null)
  const go = (d: number) => rail.current?.scrollBy({ left: d * rail.current.clientWidth * 0.8, behavior: 'smooth' })

  return (
    <section id="blueprints" className="py-16">
      <SectionHead
        kicker="ORIGINALS · SYSTEM DESIGN"
        title="Architectures I design and build"
        note="Open any title for an interactive diagram: click a component, trace a live request, see how it scales and what happens when parts fail. Blueprints are reference designs; TenantForge, SwiftCart Flash and ARGUS are built and open source."
      />
      <div className="group/rail relative">
        <div ref={rail} className="no-scrollbar gutter flex snap-x gap-4 overflow-x-auto pb-4">
          {blueprints.map((b, i) => (
            <motion.button
              key={b.id}
              onClick={() => onOpen(b)}
              className="group relative aspect-[2/3] w-[64vw] max-w-[300px] shrink-0 snap-start overflow-hidden rounded-md text-left ring-amber transition-shadow hover:ring-2 sm:w-[250px] lg:w-[270px]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.7, ease: EASE }}
              whileHover={{ y: -6 }}
              aria-label={`Open ${b.title}: ${b.tagline}`}
            >
              <Poster b={b} />
              <span className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <span className="mono rounded-full bg-bone px-4 py-2 text-xs font-semibold text-black">▶ EXPLORE</span>
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
