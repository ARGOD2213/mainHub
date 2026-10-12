import { useEffect, useRef, useState, type ReactNode } from 'react'
import { configs, pipeline } from '../data/configs'
import { Reveal, SectionHead, copyText } from './ui'

type State = 'idle' | 'run' | 'ok' | 'fail' | 'rollback'

export default function Platform() {
  return (
    <section id="platform" className="py-16">
      <SectionHead
        kicker="PLATFORM · DOCKER · KUBERNETES · CI/CD"
        title="Every merge ships itself, safely"
        note="The delivery setup every project gets: tested, scanned, deployed by GitOps and released by canary. Run it, then break the canary to watch the automatic rollback."
      />
      <div className="gutter grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Reveal><Pipeline /></Reveal>
        <Reveal delay={0.08}><Configs /></Reveal>
      </div>
    </section>
  )
}

function Pipeline() {
  const [states, setStates] = useState<State[]>(pipeline.map(() => 'idle'))
  const [failCanary, setFailCanary] = useState(false)
  const [running, setRunning] = useState(false)
  const [outcome, setOutcome] = useState<'' | 'shipped' | 'rolledback'>('')
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const run = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setOutcome('')
    setRunning(true)
    setStates(pipeline.map(() => 'idle'))
    const at = (ms: number, f: () => void) => timers.current.push(window.setTimeout(f, ms))
    let t = 150
    for (let i = 0; i < pipeline.length; i++) {
      const isCanary = !!pipeline[i].canary
      at(t, () => setStates((s) => s.map((v, k) => (k === i ? 'run' : v))))
      t += isCanary ? 1600 : 650
      if (isCanary && failCanary) {
        at(t, () => setStates((s) => s.map((v, k) => (k === i ? 'fail' : v))))
        at(t + 900, () => setStates((s) => s.map((v, k) => (k === i ? 'rollback' : k > i ? 'idle' : v))))
        at(t + 1000, () => { setRunning(false); setOutcome('rolledback') })
        return
      }
      at(t, () => setStates((s) => s.map((v, k) => (k === i ? 'ok' : v))))
    }
    at(t + 100, () => { setRunning(false); setOutcome('shipped') })
  }

  const dot = (s: State) =>
    s === 'ok' ? 'bg-emerald-400 border-emerald-400' : s === 'run' ? 'bg-amber border-amber animate-pulse' : s === 'fail' ? 'bg-red-500 border-red-500' : s === 'rollback' ? 'bg-amber-2 border-amber-2' : 'bg-ink border-line'

  return (
    <div className="h-full rounded-xl border border-line bg-ink-2/70 p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="font-semibold text-bone">Release pipeline</p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            role="switch"
            aria-checked={failCanary}
            disabled={running}
            onClick={() => setFailCanary((f) => !f)}
            className={`rounded-full border px-3 py-1.5 text-xs disabled:opacity-40 ${failCanary ? 'border-red-400/60 bg-red-500/10 text-red-300' : 'border-line text-mist hover:text-bone'}`}
          >
            {failCanary ? '✕ Canary will fail' : 'Make the canary fail'}
          </button>
          <button onClick={run} disabled={running} className="btn bg-amber px-4 py-1.5 text-sm text-black hover:bg-amber-2 disabled:opacity-50">
            {running ? 'Running…' : '▶ Run pipeline'}
          </button>
        </div>
      </div>
      <ol className="relative space-y-0">
        {pipeline.map((p, i) => (
          <li key={p.id} className="relative flex gap-3 pb-3 last:pb-0">
            {i < pipeline.length - 1 && <span className="absolute left-[7px] top-4 h-full w-px bg-line" aria-hidden />}
            <span className={`relative mt-1 h-[15px] w-[15px] shrink-0 rounded-full border-2 transition-colors ${dot(states[i])}`} />
            <div className="min-w-0">
              <p className={`text-sm font-semibold ${states[i] === 'idle' ? 'text-mist' : 'text-bone'}`}>
                {p.name}
                {states[i] === 'fail' && <span className="ml-2 text-xs font-normal text-red-300">error rate 4.8% &gt; 1% threshold</span>}
                {states[i] === 'rollback' && <span className="ml-2 text-xs font-normal text-amber-2">rolled back: 100% traffic on previous version</span>}
              </p>
              <p className="text-xs text-smoke">{p.detail}</p>
            </div>
          </li>
        ))}
      </ol>
      <div aria-live="polite" className="mt-4 min-h-[2.5rem]">
        {outcome === 'shipped' && <p className="rounded-lg bg-emerald-400/10 px-3 py-2 text-sm text-emerald-300">Shipped. Nobody had to be online for it.</p>}
        {outcome === 'rolledback' && <p className="rounded-lg bg-amber-2/10 px-3 py-2 text-sm text-amber-2">Bad release caught at 10% of traffic and rolled back automatically. Users on the canary saw a short blip; everyone else saw nothing.</p>}
      </div>
    </div>
  )
}

function highlight(line: string, lang: string): ReactNode {
  const m = line.match(/(^|\s)(#|\/\/).*$/)
  const isComment = m && !(lang === 'dockerfile' && line.startsWith('# syntax'))
  const code = isComment ? line.slice(0, m!.index! + m![1].length) : line
  const comment = isComment ? line.slice(m!.index! + m![1].length) : ''
  const parts: ReactNode[] = []
  const re = lang === 'yaml' ? /^(\s*-?\s*)([\w.-]+)(:)/ : lang === 'hcl' ? /^(\s*)([\w]+)(\s*=)/ : /^(\s*)(FROM|RUN|COPY|WORKDIR|EXPOSE|ENTRYPOINT|AS)(\b)/
  const k = code.match(re)
  if (k) {
    parts.push(k[1], <span key="k" className="text-[#ff9a4d]">{k[2]}</span>, k[3])
    parts.push(...strings(code.slice(k[0].length)))
  } else parts.push(...strings(code))
  if (comment) parts.push(<span key="c" className="text-[#6f6d77]">{comment}</span>)
  return parts
}
function strings(s: string): ReactNode[] {
  return s.split(/("[^"]*"|'[^']*')/).map((p, i) => (i % 2 ? <span key={i} className="text-[#7fd8be]">{p}</span> : p))
}

function Configs() {
  const [tab, setTab] = useState(configs[0].id)
  const [copied, setCopied] = useState(false)
  const c = configs.find((x) => x.id === tab)!
  return (
    <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-line bg-[#0b0b0f]">
      <div className="no-scrollbar flex overflow-x-auto border-b border-line" role="tablist">
        {configs.map((x) => (
          <button
            key={x.id}
            role="tab"
            aria-selected={x.id === tab}
            onClick={() => { setTab(x.id); setCopied(false) }}
            className={`shrink-0 border-b-2 px-4 py-3 text-sm ${x.id === tab ? 'border-amber text-bone' : 'border-transparent text-smoke hover:text-mist'}`}
          >
            {x.label}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <span className="mono text-xs text-smoke">{c.file}</span>
        <button
          onClick={async () => setCopied(await copyText(c.code))}
          className="mono rounded border border-line px-2 py-0.5 text-[11px] text-mist hover:text-bone"
        >
          {copied ? 'COPIED' : 'COPY'}
        </button>
      </div>
      <pre className="mono max-h-[560px] flex-1 overflow-auto p-4 text-[12.5px] leading-[1.65] text-[#d8d4cc]" tabIndex={0} aria-label={`${c.label} configuration`}>
        <code>
          {c.code.split('\n').map((l, i) => (
            <span key={i} className="block">
              <span className="mr-4 inline-block w-6 select-none text-right text-[#3d3d48]">{i + 1}</span>
              {highlight(l, c.lang)}
            </span>
          ))}
        </code>
      </pre>
    </div>
  )
}
