import { useEffect, useMemo, useRef, useState } from 'react'
import { simulate, toRps, toSlider, type LabInput } from '../lib/sim'
import { Reveal, SectionHead } from './ui'

const fmt = (n: number) => n.toLocaleString('en-IN')
const loadColor = (u: number) => (u >= 1 ? '#ff4d5e' : u >= 0.8 ? '#ffb02e' : '#3ec7a5')

const PRESETS = [
  { label: 'Launch day', rps: 200 },
  { label: 'Viral post', rps: 3000 },
  { label: 'Big sale', rps: 12000 },
  { label: 'Flash drop', rps: 40000 },
]

const TOGGLES: { key: Exclude<keyof LabInput, 'rps'>; label: string; hint: string }[] = [
  { key: 'hpa', label: 'Autoscaling', hint: 'Kubernetes HPA adds pods as load grows' },
  { key: 'cdn', label: 'CDN edge cache', hint: 'CloudFront answers cacheable reads' },
  { key: 'cache', label: 'Redis cache', hint: 'Hot reads skip the database' },
  { key: 'queue', label: 'Write queue', hint: 'SQS + workers smooth write bursts' },
  { key: 'replicas', label: 'Read replicas', hint: 'Reads move off the primary' },
]

export default function SystemsLab() {
  const [input, setInput] = useState<LabInput>({ rps: 3000, cdn: false, cache: false, replicas: false, queue: false, hpa: true })
  const [spiking, setSpiking] = useState(false)
  const raf = useRef(0)
  const r = useMemo(() => simulate(input), [input])

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  const spike = () => {
    if (spiking) return
    setSpiking(true)
    const base = input.rps
    const peak = Math.min(50000, base * 6)
    const t0 = performance.now()
    const step = (t: number) => {
      const e = (t - t0) / 1000
      // ramp up 1s, hold 2.5s, ramp down 1.5s
      const k = e < 1 ? e : e < 3.5 ? 1 : e < 5 ? 1 - (e - 3.5) / 1.5 : 0
      setInput((s) => ({ ...s, rps: Math.round(base + (peak - base) * k) }))
      if (e < 5) raf.current = requestAnimationFrame(step)
      else { setInput((s) => ({ ...s, rps: base })); setSpiking(false) }
    }
    raf.current = requestAnimationFrame(step)
  }

  const statusCls = r.status === 'Healthy' ? 'bg-emerald-400/15 text-emerald-300' : r.status === 'Degraded' ? 'bg-amber-2/15 text-amber-2' : 'bg-red-500/15 text-red-300'

  return (
    <section id="lab" className="py-16">
      <SectionHead
        kicker="SYSTEMS LAB · INTERACTIVE"
        title="Break it, then fix it"
        note="Push traffic up and switch on the building blocks I use. Watch where the bottleneck moves. It’s a simplified model meant to show trade-offs, not a benchmark."
      />
      <Reveal className="gutter">
        <div className="grid gap-4 rounded-xl border border-line bg-ink-2/70 p-4 sm:p-6 lg:grid-cols-[1fr_320px]">
          {/* left: diagram + traffic */}
          <div className="min-w-0 space-y-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="mono text-[11px] tracking-[0.2em] text-smoke">INCOMING TRAFFIC</p>
                <p className="display text-5xl font-black text-bone tabular-nums sm:text-6xl">
                  {fmt(input.rps)} <span className="mono text-base font-normal tracking-normal text-mist">req/s</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button key={p.label} onClick={() => setInput((s) => ({ ...s, rps: p.rps }))} disabled={spiking} className="rounded-full border border-line px-3 py-1.5 text-xs text-mist hover:border-amber hover:text-bone disabled:opacity-40">
                    {p.label} · {fmt(p.rps)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label htmlFor="rps" className="sr-only">Requests per second</label>
              <input
                id="rps"
                type="range"
                min={0}
                max={1000}
                value={toSlider(input.rps)}
                disabled={spiking}
                onChange={(e) => setInput((s) => ({ ...s, rps: toRps(+e.target.value) }))}
                className="lab-range w-full"
              />
              <button onClick={spike} disabled={spiking} className="btn shrink-0 bg-amber px-4 py-2 text-sm text-black hover:bg-amber-2 disabled:opacity-60">
                {spiking ? 'Spiking…' : '⚡ Spike ×6'}
              </button>
            </div>

            <div>
              <div className="overflow-x-auto rounded-lg border border-line bg-ink">
                <LabDiagram input={input} r={r} />
              </div>
              <p className="mono mt-2 text-[11px] text-smoke md:hidden">← swipe the diagram to see the data tier →</p>
            </div>
          </div>

          {/* right: controls + readout */}
          <div className="space-y-4">
            <div className={`rounded-lg px-4 py-3 ${statusCls}`} aria-live="polite">
              <p className="text-sm font-bold">● {r.status}</p>
              <p className="mt-1 text-sm leading-snug text-bone/90">{r.advice}</p>
            </div>
            <dl className="grid grid-cols-2 gap-2">
              <Stat label="p95 latency" value={r.p95 >= 1000 ? `${(r.p95 / 1000).toFixed(1)} s` : `${r.p95} ms`} bad={r.p95 > 600} />
              <Stat label="Errors" value={`${r.errorPct.toFixed(r.errorPct > 0 && r.errorPct < 10 ? 1 : 0)}%`} bad={r.errorPct > 0} />
              <Stat label="API pods" value={`${r.pods}`} sub={input.hpa ? `max ${r.maxPods}` : 'fixed'} />
              <Stat label="DB primary" value={`${Math.round(r.uDb * 100)}%`} bad={r.uDb >= 1} />
              <Stat label="Cache hit" value={`${Math.round(r.hitRate * 100)}%`} />
              <Stat label="Infra / month" value={`~$${fmt(r.cost)}`} sub="rough, excl. bandwidth" />
            </dl>
            <fieldset className="space-y-2">
              <legend className="mono mb-2 text-[11px] tracking-[0.2em] text-smoke">BUILDING BLOCKS</legend>
              {TOGGLES.map((t) => (
                <button
                  key={t.key}
                  role="switch"
                  aria-checked={input[t.key]}
                  onClick={() => setInput((s) => ({ ...s, [t.key]: !s[t.key] }))}
                  className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors ${input[t.key] ? 'border-amber/60 bg-amber/10' : 'border-line hover:border-smoke'}`}
                >
                  <span className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${input[t.key] ? 'bg-amber' : 'bg-line'}`}>
                    <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-bone transition-all ${input[t.key] ? 'left-[18px]' : 'left-0.5'}`} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-bone">{t.label}</span>
                    <span className="block text-xs text-smoke">{t.hint}</span>
                  </span>
                </button>
              ))}
            </fieldset>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function Stat({ label, value, sub, bad }: { label: string; value: string; sub?: string; bad?: boolean }) {
  return (
    <div className="rounded-lg border border-line bg-ink px-3 py-2.5">
      <dt className="text-[11px] text-smoke">{label}</dt>
      <dd className={`text-lg font-bold tabular-nums ${bad ? 'text-red-300' : 'text-bone'}`}>{value}</dd>
      {sub && <dd className="text-[10px] text-smoke">{sub}</dd>}
    </div>
  )
}

/* ── live diagram ── */

function Box({ x, y, w = 120, h = 46, title, sub, on = true, color = '#3a3a46' }: { x: number; y: number; w?: number; h?: number; title: string; sub?: string; on?: boolean; color?: string }) {
  return (
    <g opacity={on ? 1 : 0.28}>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={8} fill="#101015" stroke={color} strokeWidth={on ? 1.6 : 1} strokeDasharray={on ? undefined : '4 4'} />
      <text x={x} y={sub ? y - 3 : y + 4} textAnchor="middle" fill="#f3efe7" fontSize="13" fontWeight="600" fontFamily="Archivo, sans-serif">{title}</text>
      {sub && <text x={x} y={y + 13} textAnchor="middle" fill="#a9a7ae" fontSize="10.5" fontFamily="JetBrains Mono, monospace">{sub}</text>}
    </g>
  )
}

function Flow({ d, u, rps, on = true }: { d: string; u: number; rps: number; on?: boolean }) {
  if (!on) return <path d={d} fill="none" stroke="#26262f" strokeWidth={1.2} strokeDasharray="3 5" />
  const dur = Math.max(0.35, 2.4 - Math.log10(Math.max(rps, 10)) * 0.45)
  const w = 1.2 + Math.min(4, Math.log10(Math.max(rps, 10)) - 1)
  return (
    <path d={d} fill="none" stroke={loadColor(u)} strokeWidth={w} strokeLinecap="round" strokeDasharray="2 10" opacity={0.9}>
      <animate attributeName="stroke-dashoffset" from="24" to="0" dur={`${dur}s`} repeatCount="indefinite" />
    </path>
  )
}

function LabDiagram({ input, r }: { input: LabInput; r: ReturnType<typeof simulate> }) {
  const shown = Math.min(r.pods, 60)
  const reads = input.rps * 0.85
  return (
    <svg viewBox="0 0 900 340" className="block w-full min-w-[640px]" role="img" aria-label={`Diagram: ${r.pods} API pods, database at ${Math.round(r.uDb * 100)} percent`}>
      {/* flows */}
      <Flow d="M95 170 C140 170 140 70 185 70" u={0} rps={reads * 0.6} on={input.cdn} />
      <Flow d="M95 170 L185 170" u={r.uApp} rps={r.originRps} />
      <Flow d="M245 170 L300 170" u={r.uApp} rps={r.originRps} />
      <Flow d="M560 130 C610 130 620 62 660 62" u={0} rps={r.originRps * 0.85} on={input.cache} />
      <Flow d="M560 170 L660 170" u={r.uDb} rps={r.originRps * (1 - r.hitRate)} />
      <Flow d="M560 210 C610 210 620 272 660 272" u={r.uRep} rps={r.originRps} on={input.replicas} />
      <Flow d="M430 250 L430 290" u={0} rps={input.rps * 0.15} on={input.queue} />
      <Flow d="M490 305 C600 305 640 200 668 186" u={r.uDb} rps={input.rps * 0.15} on={input.queue} />

      {/* users */}
      <circle cx={70} cy={170} r={26} fill="#101015" stroke="#ff7a1a" strokeWidth={1.6} />
      <text x={70} y={174} textAnchor="middle" fill="#f3efe7" fontSize="12" fontWeight="600" fontFamily="Archivo, sans-serif">Users</text>

      <Box x={215} y={70} w={90} title="CDN" sub="edge" on={input.cdn} color="#3ec7a5" />
      <Box x={215} y={170} w={60} title="ALB" />

      {/* pod pool */}
      <g>
        <rect x={300} y={90} width={260} height={160} rx={12} fill="#0c0c11" stroke={loadColor(r.uApp)} strokeWidth={1.6} />
        <text x={314} y={110} fill="#a9a7ae" fontSize="10.5" fontFamily="JetBrains Mono, monospace">EKS · API pods</text>
        <text x={546} y={110} textAnchor="end" fill="#f3efe7" fontSize="12" fontWeight="700" fontFamily="JetBrains Mono, monospace">{r.pods}{r.pods > shown ? ` (showing ${shown})` : ''}</text>
        {Array.from({ length: shown }).map((_, k) => (
          <rect key={k} x={314 + (k % 12) * 19.5} y={122 + Math.floor(k / 12) * 23} width={15} height={17} rx={3} fill={loadColor(r.uApp)} opacity={0.85} />
        ))}
        <text x={314} y={242} fill="#6f6d77" fontSize="10" fontFamily="JetBrains Mono, monospace">load {Math.round(r.uApp * 100)}%{input.hpa ? ' · HPA on' : ' · fixed size'}</text>
      </g>

      <Box x={720} y={62} title="Redis" sub={input.cache ? `${Math.round(r.hitRate * 100)}% hits` : 'off'} on={input.cache} color="#3ec7a5" />
      <Box x={720} y={170} w={130} title="DB primary" sub={`${Math.round(r.uDb * 100)}% load`} color={loadColor(r.uDb)} />
      <Box x={720} y={272} w={130} title={`Replicas ×${r.replicas}`} sub={input.replicas ? `${Math.round(r.uRep * 100)}% load` : 'off'} on={input.replicas} color={loadColor(r.uRep)} />
      <Box x={430} y={305} w={130} title="SQS + workers" sub="write queue" on={input.queue} color="#8f7bff" />

      {/* status on the DB if it's on fire */}
      {r.uDb >= 1 && (
        <text x={720} y={210} textAnchor="middle" fill="#ff4d5e" fontSize="11" fontWeight="700" fontFamily="JetBrains Mono, monospace">SATURATED</text>
      )}
      <text x={850} y={330} textAnchor="end" fill="#6f6d77" fontSize="10" fontFamily="JetBrains Mono, monospace">green ok · amber hot · red saturated</text>
    </svg>
  )
}
