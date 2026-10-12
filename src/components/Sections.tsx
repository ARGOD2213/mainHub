import { useState } from 'react'
import { basics, briefTypes, credentials, faq, process, profile, stack, standards, type BriefId } from '../data/portfolio'
import { GitHubIcon, Reveal, SectionHead, copyText } from './ui'

export function Process() {
  return (
    <section id="process" className="py-16">
      <SectionHead kicker="HOW WE WORK" title="From first call to handover" />
      <div className="gutter">
        <ol className="grid gap-3 md:grid-cols-5">
          {process.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.06}>
              <li className="relative h-full rounded-xl border border-line bg-ink-2/70 p-5">
                <span className="display text-5xl font-black text-[#2c2c36]">{i + 1}</span>
                <p className="mt-1 font-semibold text-bone">{p.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-mist">{p.text}</p>
                <p className="mono mt-3 text-[10px] tracking-wider text-amber">→ {p.out.toUpperCase()}</p>
              </li>
            </Reveal>
          ))}
        </ol>
        <Reveal className="mt-10">
          <div className="mb-6 rounded-xl border border-line bg-ink-2/70 p-5">
            <h3 className="font-bold text-bone">Every project, however small</h3>
            <ul className="mt-3 grid gap-2 text-sm text-mist sm:grid-cols-2 lg:grid-cols-5">
              {basics.map((b) => <li key={b} className="flex gap-2"><span className="text-amber">✓</span>{b}</li>)}
            </ul>
          </div>
          <h3 className="mb-4 text-xl font-bold text-bone">What product and platform builds add</h3>
          <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {standards.map((s) => (
              <div key={s.area} className="bg-ink-2 p-5">
                <p className="mono text-[11px] tracking-[0.2em] text-amber">{s.area.toUpperCase()}</p>
                <ul className="mt-2 space-y-1 text-sm text-mist">
                  {s.items.map((x) => <li key={x}>· {x}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function Stack() {
  return (
    <section id="stack" className="py-16">
      <SectionHead kicker="STACK" title="The tools behind the work" />
      <div className="gutter grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stack.map((g, i) => (
          <Reveal key={g.group} delay={(i % 3) * 0.05}>
            <div className="h-full rounded-xl border border-line bg-ink-2/70 p-5">
              <p className="display text-2xl font-black text-bone">{g.group}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">{g.items.map((x) => <span key={x} className="chip">{x}</span>)}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function About() {
  return (
    <section id="about" className="py-16">
      <SectionHead kicker="S0 · E0 · THE PILOT" title="Who’s building it" />
      <div className="gutter grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <p className="serif text-3xl leading-snug text-bone [text-wrap:balance] sm:text-[2.6rem]">
            I like the part of the product nobody sees, <em className="text-amber-2">because everybody depends on it.</em>
          </p>
          <div className="mt-6 max-w-[65ch] space-y-4 text-[1.02rem] leading-relaxed text-mist">
            <p>
              I’m Mahindra, a full-stack engineer in Hyderabad. I build websites for small businesses and personal brands, mobile apps
              in React Native, and the backends and cloud setups that let a startup grow without a rewrite.
            </p>
            <p>
              I care about the boring things that make products survive: idempotent writes, sensible caches, queues in front of
              anything slow, autoscaling that’s been tested, and a deploy pipeline that rolls itself back when something looks wrong.
            </p>
            <p>
              I write the architecture down before I write the code, so you always know what you’re getting, why, and what it will cost to run.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <dl className="divide-y divide-line rounded-xl border border-line bg-ink-2/60">
            {[
              ['Role', profile.role],
              ['Based in', `${profile.location} · ${profile.timezone}`],
              ['Core', 'React · Next.js · React Native · Spring Boot'],
              ['Cloud', 'AWS · Docker · Kubernetes · CI/CD'],
              ['Status', profile.availability],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 px-5 py-3.5 text-sm">
                <dt className="text-smoke">{k}</dt>
                <dd className="text-right text-bone">{v}</dd>
              </div>
            ))}
            <div className="px-5 py-3.5">
              <dt className="text-sm text-smoke">Credentials</dt>
              <dd className="mt-2 space-y-1 text-sm text-bone">{credentials.map((c) => <p key={c}>— {c}</p>)}</dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  )
}

export function FAQ() {
  return (
    <section id="faq" className="py-16">
      <SectionHead kicker="BEFORE YOU ASK" title="Questions clients usually have" />
      <div className="gutter mx-auto grid max-w-5xl gap-3 md:grid-cols-2">
        {faq.map((f) => (
          <details key={f.q} className="group h-fit rounded-xl border border-line bg-ink-2/70 p-5 open:border-smoke">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-3 font-semibold text-bone">
              {f.q}
              <span className="mono text-smoke transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-mist">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

export function Resume() {
  return (
    <section id="resume" className="py-16">
      <SectionHead kicker="THE SCRIPT" title="Resume" />
      <div className="gutter grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <Reveal>
          <div className="flex h-full flex-col justify-between rounded-xl border border-line bg-ink-2 p-6">
            <div>
              <p className="display text-5xl font-black text-bone">Two pages.</p>
              <p className="serif text-3xl italic text-amber-2">The whole series, in print.</p>
              <p className="mt-4 max-w-[60ch] text-sm leading-relaxed text-mist">
                Services, core expertise, system design case studies, open source, experience and credentials, formatted for clients,
                agencies and procurement teams.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={profile.resumePdf} download className="btn btn-play">Download PDF</a>
              <a href={profile.resumePdf} target="_blank" rel="noreferrer" className="btn btn-ghost">Open in new tab</a>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="hidden lg:block">
          <div className="overflow-hidden rounded-xl border border-line bg-[#e9e6df]">
            <iframe title="Resume preview" src={`${profile.resumePdf}#view=FitH&toolbar=0`} className="h-[600px] w-full" loading="lazy" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

const STAGES = ['Just an idea', 'Have an old site or design', 'Live product', 'College project']
const WHEN = ['As soon as possible', 'Within 1–3 months', 'Flexible']

export function Finale({ picked }: { picked: BriefId | '' }) {
  const [type, setType] = useState<BriefId>(picked || 'website')
  const [stage, setStage] = useState(STAGES[0])
  const [when, setWhen] = useState(WHEN[1])
  const [desc, setDesc] = useState('')
  const [copied, setCopied] = useState('')
  const [lastPicked, setLastPicked] = useState(picked)
  if (picked !== lastPicked) { setLastPicked(picked); if (picked) { setType(picked); if (picked === 'student') setStage(STAGES[3]) } }

  const name = briefTypes.find((t) => t.id === type)!.name
  const body = `Hi Mahindra,\n\nProject: ${name}\nStage: ${stage}\nTimeline: ${when}\n\n${desc || '(a few lines about the product and the problem)'}\n`
  const mail = `mailto:${profile.email}?subject=${encodeURIComponent(`Project enquiry: ${name}`)}&body=${encodeURIComponent(body)}`
  const wa = `${profile.whatsapp}?text=${encodeURIComponent(body)}`
  const copy = async (k: string, v: string) => { if (await copyText(v)) { setCopied(k); setTimeout(() => setCopied(''), 1600) } }

  const pill = (on: boolean) => `rounded-full border px-3 py-1.5 text-xs transition-colors ${on ? 'border-amber bg-amber/15 text-bone' : 'border-line text-mist hover:text-bone'}`

  return (
    <section id="contact" className="grain relative overflow-hidden pb-10 pt-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,#3a1a06,transparent_65%)]" />
      <div className="gutter relative">
        <Reveal className="text-center">
          <p className="mono text-xs tracking-[0.5em] text-amber">NEXT EPISODE</p>
          <h2 className="display mt-3 text-[15vw] font-black text-bone sm:text-[8.5rem]">To be continued…</h2>
          <p className="serif mx-auto mt-3 max-w-2xl text-2xl italic text-mist sm:text-3xl">The next episode is your product. Tell me about it.</p>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-12 grid max-w-5xl gap-4 lg:grid-cols-[1.4fr_1fr]">
          <form className="space-y-5 rounded-xl border border-line bg-ink-2/90 p-6" onSubmit={(e) => { e.preventDefault(); window.location.href = mail }}>
            <p className="font-semibold text-bone">Project brief</p>
            <fieldset>
              <legend className="mb-2 text-xs text-smoke">What do you need?</legend>
              <div className="flex flex-wrap gap-2">
                {briefTypes.map((t) => <button type="button" key={t.id} onClick={() => setType(t.id)} className={pill(type === t.id)} aria-pressed={type === t.id}>{t.name}</button>)}
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-2 text-xs text-smoke">Where is the product today?</legend>
              <div className="flex flex-wrap gap-2">
                {STAGES.map((t) => <button type="button" key={t} onClick={() => setStage(t)} className={pill(stage === t)} aria-pressed={stage === t}>{t}</button>)}
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-2 text-xs text-smoke">When do you want to start?</legend>
              <div className="flex flex-wrap gap-2">
                {WHEN.map((t) => <button type="button" key={t} onClick={() => setWhen(t)} className={pill(when === t)} aria-pressed={when === t}>{t}</button>)}
              </div>
            </fieldset>
            <div>
              <label htmlFor="brief" className="mb-2 block text-xs text-smoke">A few lines about it</label>
              <textarea
                id="brief"
                rows={4}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Your business or idea, who it’s for, and anything you already have (logo, photos, old site). Students: branch, semester, deadline."
                className="w-full resize-y rounded-lg border border-line bg-ink px-3 py-2 text-sm text-bone placeholder:text-smoke focus:border-amber focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="submit" className="btn btn-play">Send by email</button>
              <a href={wa} target="_blank" rel="noreferrer" className="btn btn-ghost">Send on WhatsApp</a>
            </div>
          </form>

          <div className="space-y-3">
            {[
              { k: 'email', label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
              { k: 'phone', label: 'Phone / WhatsApp', value: profile.phone, href: `tel:${profile.phoneTel}` },
            ].map((c) => (
              <div key={c.k} className="rounded-xl border border-line bg-ink-2/80 p-4">
                <p className="mono text-[10px] tracking-[0.25em] text-smoke">{c.label.toUpperCase()}</p>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <a href={c.href} className="min-w-0 break-all text-sm font-semibold text-bone hover:text-amber">{c.value}</a>
                  <button onClick={() => copy(c.k, c.value)} className="mono shrink-0 rounded border border-line px-2 py-0.5 text-[10px] text-mist hover:text-bone">
                    {copied === c.k ? 'COPIED' : 'COPY'}
                  </button>
                </div>
              </div>
            ))}
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="block rounded-xl border border-line bg-ink-2/80 p-4 hover:border-amber">
              <p className="mono text-[10px] tracking-[0.25em] text-smoke">LINKEDIN</p>
              <p className="mt-1 text-sm font-semibold text-bone">chintala-mahindra</p>
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl border border-line bg-ink-2/80 p-4 hover:border-amber">
              <GitHubIcon />
              <span>
                <span className="mono block text-[10px] tracking-[0.25em] text-smoke">GITHUB</span>
                <span className="block text-sm font-semibold text-bone">ARGOD2213</span>
              </span>
            </a>
            <p className="px-1 text-xs text-smoke">Replies within one working day, {profile.timezone}.</p>
          </div>
        </Reveal>

        <footer className="mono mt-20 flex flex-col items-center justify-between gap-2 border-t border-line pt-6 text-[11px] text-smoke sm:flex-row">
          <span>© {new Date().getFullYear()} {profile.name} · {profile.location}</span>
          <span>Blueprints are reference designs. A personal portfolio styled like a series; not affiliated with any streaming service.</span>
        </footer>
      </div>
    </section>
  )
}
