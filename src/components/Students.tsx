import { useState } from 'react'
import { branches, studentIdeas, type Branch, type BriefId } from '../data/portfolio'
import { Reveal, SectionHead } from './ui'

const STEPS = [
  { t: 'Pick', d: 'Choose an idea that fits your branch, interest and deadline.' },
  { t: 'Plan', d: 'Abstract, architecture diagram and a week-by-week module plan.' },
  { t: 'Build together', d: 'Weekly sessions: you write the code, I guide, review and unblock.' },
  { t: 'Deploy & defend', d: 'A live demo link, a clean repo, and a mock viva before the real one.' },
]

export default function Students({ onPick }: { onPick: (b: BriefId) => void }) {
  const [b, setB] = useState<Branch>('All')
  const list = studentIdeas.filter((i) => b === 'All' || i.branch === b)
  return (
    <section id="students" className="py-16">
      <SectionHead
        kicker="STUDENTS · ENGINEERING PROJECTS"
        title="A project you actually understand"
        note="Real projects that run, get deployed, and hold up in the viva. You build it with guidance, so it’s yours and you learn the skills recruiters ask about."
      />
      <div className="gutter">
        <ol className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.t} className="rounded-xl border border-line bg-ink-2/70 p-4">
              <span className="mono text-[11px] text-amber">STEP {i + 1}</span>
              <p className="mt-1 font-semibold text-bone">{s.t}</p>
              <p className="mt-1 text-sm leading-relaxed text-mist">{s.d}</p>
            </li>
          ))}
        </ol>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="font-semibold text-bone">Project ideas <span className="font-normal text-smoke">({list.length})</span></p>
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1" role="group" aria-label="Filter by branch">
            {branches.map((x) => (
              <button
                key={x}
                onClick={() => setB(x)}
                aria-pressed={b === x}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs transition-colors ${b === x ? 'border-amber bg-amber/15 text-bone' : 'border-line text-mist hover:text-bone'}`}
              >
                {x}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((i, k) => (
            <Reveal key={i.title} delay={(k % 3) * 0.05}>
              <article className="flex h-full flex-col rounded-xl border border-line bg-ink-2/70 p-5 transition-colors hover:border-[#8f7bff]/60">
                <div className="flex items-center justify-between gap-3">
                  <span className="mono text-[10px] tracking-wider text-[#b3a6ff]">{i.branch.toUpperCase()}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${i.level === 'Major' ? 'bg-[#8f7bff]/20 text-[#c8beff]' : 'bg-white/10 text-mist'}`}>{i.level} project</span>
                </div>
                <h3 className="mt-2 text-lg font-bold text-bone">{i.title}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-mist">{i.build}</p>
                <p className="mt-3 text-xs text-smoke"><span className="text-bone">You’ll learn:</span> {i.learn}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">{i.stack.map((s) => <span key={s} className="chip">{s}</span>)}</div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#8f7bff]/40 bg-[#8f7bff]/[0.06] p-5">
          <p className="max-w-[60ch] text-bone">Have your own idea, or need one for your branch? Send your branch, semester and deadline.</p>
          <a href="#contact" onClick={() => onPick('student')} className="btn btn-play">Plan my project</a>
        </div>
      </div>
    </section>
  )
}
