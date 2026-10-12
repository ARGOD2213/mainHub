import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { showcase, type BriefId, type Sample } from '../data/portfolio'
import { SectionHead } from './ui'
import { EASE } from './Opening'

const FONT: Record<Sample['font'], string> = {
  serif: "'Instrument Serif', Georgia, serif",
  sans: "'Archivo', system-ui, sans-serif",
  display: "'Big Shoulders Display', Impact, sans-serif",
}

/** Renders children at a fixed design width and scales them to fit the available width. */
function Scaled({ width, children, max = 1 }: { width: number; children: ReactNode; max?: number }) {
  const outer = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const [s, setS] = useState(0.5)
  const [h, setH] = useState(0)
  useLayoutEffect(() => {
    const o = outer.current!, i = inner.current!
    const fit = () => {
      const k = Math.min(max, o.clientWidth / width)
      setS(k)
      setH(i.offsetHeight * k)
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(o)
    ro.observe(i)
    return () => ro.disconnect()
  }, [width, max])
  return (
    <div ref={outer} className="w-full" style={{ height: h }}>
      <div ref={inner} style={{ width, transform: `scale(${s})`, transformOrigin: 'top left' }}>{children}</div>
    </div>
  )
}

function Art({ c }: { c: Sample['colors'] }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl" style={{ background: c.soft }}>
      <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full" style={{ background: c.accent, opacity: 0.85 }} />
      <div className="absolute bottom-6 left-8 h-24 w-24 rounded-full border-[10px]" style={{ borderColor: c.fg, opacity: 0.12 }} />
      <div className="absolute bottom-10 right-12 h-16 w-28 rounded-xl" style={{ background: c.bg, boxShadow: '0 10px 30px rgba(0,0,0,.15)' }} />
      <div className="absolute left-10 top-10 h-3 w-20 rounded-full" style={{ background: c.fg, opacity: 0.2 }} />
      <div className="absolute left-10 top-16 h-3 w-12 rounded-full" style={{ background: c.fg, opacity: 0.12 }} />
    </div>
  )
}

function Website({ x }: { x: Sample }) {
  const c = x.colors
  const head: CSSProperties = { fontFamily: FONT[x.font], textTransform: x.font === 'display' ? 'uppercase' : undefined, letterSpacing: x.font === 'display' ? '0.01em' : undefined }
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 shadow-2xl">
      <div className="flex items-center gap-2 bg-[#1e1e24] px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" /><span className="h-3 w-3 rounded-full bg-[#febc2e]" /><span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="mono ml-4 flex-1 rounded-md bg-[#2b2b33] px-3 py-1 text-[12px] text-[#a9a7ae]">yourbusiness.in</span>
      </div>
      <div style={{ background: c.bg, color: c.fg }} className="px-10 pb-8 pt-6">
        <nav className="flex items-center justify-between">
          <span style={{ ...head, fontSize: 26, fontWeight: 900 }}>{x.brand}</span>
          <div className="flex items-center gap-7 text-[14px]" style={{ opacity: 0.8 }}>
            {x.nav.map((n) => <span key={n}>{n}</span>)}
            <span className="rounded-full px-4 py-2 text-[13px] font-semibold" style={{ background: c.accent, color: c.bg }}>{x.cta[0]}</span>
          </div>
        </nav>
        <div className="mt-10 grid grid-cols-[1.1fr_1fr] items-center gap-10">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em]" style={{ color: c.accent }}>{x.kind}</p>
            <h4 style={{ ...head, fontSize: x.font === 'display' ? 64 : 50, lineHeight: 1.02, fontWeight: 900 }} className="mt-3">{x.tagline}</h4>
            <div className="mt-7 flex gap-3">
              <span className="rounded-full px-5 py-3 text-[14px] font-semibold" style={{ background: c.accent, color: c.bg }}>{x.cta[0]}</span>
              <span className="rounded-full border px-5 py-3 text-[14px] font-semibold" style={{ borderColor: c.fg + '33' }}>{x.cta[1]}</span>
            </div>
          </div>
          <div className="h-[260px]"><Art c={c} /></div>
        </div>
        <div className="mt-10">
          <p style={{ ...head, fontSize: 24, fontWeight: 700 }}>{x.listTitle}</p>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {x.items.map((it) => (
              <div key={it.name} className="rounded-xl p-4" style={{ background: c.soft }}>
                <p className="text-[15px] font-semibold">{it.name}</p>
                <p className="mt-1 text-[12.5px]" style={{ opacity: 0.65 }}>{it.meta}</p>
                {it.price && <p className="mt-3 text-[16px] font-bold" style={{ color: c.accent }}>{it.price}</p>}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex items-center justify-between rounded-xl px-5 py-4 text-[13px]" style={{ background: c.fg, color: c.bg }}>
          <span>Find us on Google Maps · Call · WhatsApp</span>
          <span style={{ opacity: 0.7 }}>© {x.brand}</span>
        </div>
      </div>
    </div>
  )
}

function Phone({ x }: { x: Sample }) {
  const c = x.colors
  const head: CSSProperties = { fontFamily: FONT[x.font], textTransform: x.font === 'display' ? 'uppercase' : undefined }
  return (
    <div className="mx-auto w-[300px] rounded-[44px] border-[10px] border-[#1c1c22] bg-[#1c1c22] shadow-2xl">
      <div className="relative overflow-hidden rounded-[34px]" style={{ background: c.bg, color: c.fg, height: 600 }}>
        <div className="flex items-center justify-between px-6 pb-1 pt-3 text-[11px] font-semibold">
          <span>9:41</span>
          <span className="h-5 w-20 rounded-full bg-black" />
          <span>●●●</span>
        </div>
        <div className="px-5 pt-3">
          <p className="text-[11px] uppercase tracking-[0.18em]" style={{ color: c.accent }}>{x.brand}</p>
          <p style={{ ...head, fontSize: 30, fontWeight: 900, lineHeight: 1.05 }}>{x.app.title}</p>
          <div className="mt-3 rounded-full px-4 py-2.5 text-[12px]" style={{ background: c.soft, opacity: 0.9 }}>Search…</div>
          <div className="mt-3 flex gap-2">
            {['Today', 'Tomorrow', 'This week'].map((d, i) => (
              <span key={d} className="rounded-full px-3 py-1.5 text-[11px] font-semibold" style={i === 0 ? { background: c.accent, color: c.bg } : { background: c.soft }}>{d}</span>
            ))}
          </div>
          <div className="mt-4 space-y-2.5">
            {x.items.map((it) => (
              <div key={it.name} className="flex items-center gap-3 rounded-2xl p-3" style={{ background: c.soft }}>
                <span className="h-11 w-11 shrink-0 rounded-xl" style={{ background: c.accent, opacity: 0.85 }} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold">{it.name}</span>
                  <span className="block truncate text-[11px]" style={{ opacity: 0.65 }}>{it.meta}</span>
                </span>
                {it.price && <span className="text-[12px] font-bold" style={{ color: c.accent }}>{it.price}</span>}
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-x-5 bottom-[74px] rounded-2xl py-3.5 text-center text-[14px] font-bold" style={{ background: c.accent, color: c.bg }}>{x.app.action}</div>
        <div className="absolute inset-x-0 bottom-0 flex justify-around border-t px-2 pb-5 pt-2.5 text-[10px]" style={{ borderColor: c.fg + '18', background: c.bg }}>
          {x.app.tabs.map((t, i) => (
            <span key={t} className="flex flex-col items-center gap-1" style={{ opacity: i === 0 ? 1 : 0.5, color: i === 0 ? c.accent : undefined }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'currentColor' }} />{t}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

const briefFor = (plan: string): BriefId => (/mobile/i.test(plan) ? 'mobile' : /store|booking/i.test(plan) ? 'store' : 'website')

export default function Showcase({ onPick }: { onPick: (b: BriefId) => void }) {
  const [id, setId] = useState(showcase[0].id)
  const x = showcase.find((s) => s.id === id)!
  return (
    <section id="showcase" className="py-16">
      <SectionHead
        kicker="SHOWCASE · WEBSITES & APPS"
        title="See what yours could look like"
        note="Sample designs for made-up businesses, so you can picture yours: a website, plus the matching iOS and Android app. Pick a business type."
      />
      <div className="gutter">
        <div className="no-scrollbar -mx-1 mb-6 flex gap-2 overflow-x-auto px-1" role="tablist" aria-label="Business type">
          {showcase.map((s) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={s.id === id}
              onClick={() => setId(s.id)}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${s.id === id ? 'border-bone bg-bone font-semibold text-black' : 'border-line text-mist hover:text-bone'}`}
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.colors.accent }} />
              {s.kind}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45, ease: EASE }}>
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
              <div className="min-w-0">
                <p className="mono mb-2 text-[11px] tracking-[0.2em] text-smoke">WEBSITE · SAMPLE DESIGN</p>
                <Scaled width={900} max={1.3}><Website x={x} /></Scaled>
              </div>
              <div className="mx-auto w-[220px] lg:w-[260px]">
                <p className="mono mb-2 text-[11px] tracking-[0.2em] text-smoke">APP · iOS + ANDROID</p>
                <Scaled width={300}><Phone x={x} /></Scaled>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-ink-2/70 p-5">
              <div>
                <p className="text-sm text-smoke">Suggested for a {x.kind.toLowerCase()}</p>
                <p className="font-semibold text-bone">{x.plan}</p>
              </div>
              <a href="#contact" onClick={() => onPick(briefFor(x.plan))} className="btn btn-play">Get this for my business</a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
