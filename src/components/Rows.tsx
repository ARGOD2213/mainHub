import { motion } from 'framer-motion'
import { comingSoon, credits, profile, skills, topTen } from '../data/portfolio'
import { GitHubIcon, Reveal, SectionHead } from './ui'
import { EASE } from './Opening'

export function ComingSoon() {
  return (
    <section id="coming" className="py-14">
      <SectionHead kicker="COMING SOON" title="Planned builds" note="Designs I've written up and plan to build. Not shipped yet — no numbers claimed." />
      <div className="no-scrollbar gutter flex snap-x gap-4 overflow-x-auto pb-4">
        {comingSoon.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.08} className="w-[82vw] shrink-0 snap-start sm:w-[380px]">
            <article className="h-full overflow-hidden rounded-md border border-line bg-ink-2">
              <div className="relative aspect-video bg-[linear-gradient(135deg,#15151c,#22222c)]">
                <svg className="absolute inset-0 h-full w-full opacity-30" aria-hidden>
                  <pattern id={`cs-${i}`} width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#a9a7ae" /></pattern>
                  <rect width="100%" height="100%" fill={`url(#cs-${i})`} />
                </svg>
                <span className="absolute left-0 top-4 bg-amber px-3 py-1 text-[11px] font-bold tracking-wider text-black">COMING SOON</span>
                <h3 className="display absolute bottom-3 left-4 text-4xl font-black text-bone">{c.title}</h3>
              </div>
              <div className="p-4">
                <p className="mono text-[11px] text-amber">{c.genre}</p>
                <p className="mt-2 text-sm leading-relaxed text-mist">{c.line}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">{c.tech.map((t) => <span key={t} className="chip">{t}</span>)}</div>
              </div>
            </article>
          </Reveal>
        ))}
        <div className="w-px shrink-0" />
      </div>
    </section>
  )
}

export function TopTen() {
  return (
    <section id="top10" className="py-14">
      <SectionHead kicker="TRENDING IN MY STACK" title="Top 10 in my stack today" />
      <div className="no-scrollbar gutter flex snap-x gap-2 overflow-x-auto pb-4">
        {topTen.map((t, i) => (
          <motion.div
            key={t}
            className="group flex shrink-0 snap-start items-end"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.6, ease: EASE }}
          >
            <span
              className="display -mr-5 select-none text-[9rem] font-black leading-[0.75] text-ink sm:text-[11rem]"
              style={{ WebkitTextStroke: '3px #3a3a46' }}
              aria-hidden
            >
              {i + 1}
            </span>
            <div className="relative grid h-40 w-28 place-items-center overflow-hidden rounded-md border border-line bg-[linear-gradient(160deg,#2a1406,#0d0d12)] p-3 text-center transition-transform group-hover:-translate-y-1 sm:h-48 sm:w-32">
              <span className="text-sm font-bold leading-tight text-bone">{t}</span>
              <span className="mono absolute bottom-2 text-[9px] tracking-widest text-amber">#{i + 1} IN STACK</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export function Skills() {
  return (
    <section id="skills" className="py-14">
      <SectionHead kicker="GENRES" title="Skills — and where you'll find them" />
      <div className="gutter grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((s, i) => (
          <Reveal key={s.genre} delay={i * 0.06}>
            <article className="h-full rounded-lg border border-line bg-ink-2/70 p-5 transition-colors hover:border-amber/50">
              <h3 className="display text-3xl font-black text-bone">{s.genre}</h3>
              <div className="mt-3 flex flex-wrap gap-1.5">{s.items.map((x) => <span key={x} className="chip">{x}</span>)}</div>
              <p className="mt-4 border-t border-line pt-3 text-xs text-smoke">
                <span className="mono text-amber">SEEN IN</span> {s.seenIn}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

const Laurel = ({ flip = false }: { flip?: boolean }) => (
  <svg width="26" height="54" viewBox="0 0 26 54" fill="none" stroke="#ffb02e" strokeWidth="1.4" style={{ transform: flip ? 'scaleX(-1)' : undefined }} aria-hidden>
    <path d="M20 52C8 44 4 30 8 4" />
    {[8, 16, 24, 32, 40].map((y) => <ellipse key={y} cx="11" cy={y} rx="5" ry="2.4" transform={`rotate(-40 11 ${y})`} />)}
  </svg>
)

export function Credits() {
  return (
    <section id="credits" className="py-14">
      <SectionHead kicker="AWARDS & CREDITS" title="Certifications" />
      <div className="gutter grid gap-4 md:grid-cols-3">
        {credits.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.08}>
            <article className="flex h-full flex-col items-center rounded-lg border border-line bg-[radial-gradient(circle_at_50%_0%,#2a1606,#101015_70%)] px-5 py-8 text-center">
              <div className="flex items-center gap-2">
                <Laurel />
                <div>
                  <p className="mono text-[10px] tracking-[0.3em] text-amber-2">{c.code.toUpperCase()}</p>
                  <p className="display text-4xl font-black text-bone">{c.year}</p>
                </div>
                <Laurel flip />
              </div>
              <h3 className="mt-4 font-semibold text-bone">{c.title}</h3>
              <p className="mt-1 text-sm text-smoke">{c.org}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function Resume() {
  return (
    <section id="resume" className="py-14">
      <SectionHead kicker="THE SCRIPT" title="Resume" />
      <div className="gutter grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <div className="flex h-full flex-col justify-between rounded-lg border border-line bg-ink-2 p-6">
            <div>
              <p className="display text-5xl font-black text-bone">One page.</p>
              <p className="serif text-3xl italic text-amber-2">Everything on this site, in print.</p>
              <p className="mt-4 text-sm leading-relaxed text-mist">
                Java Backend Engineer · Spring Boot · Microservices · AI Application Integration. Experience at TCS, two projects,
                three certifications.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={profile.resumePdf} download className="btn btn-play">Download PDF</a>
              <a href={profile.resumePdf} target="_blank" rel="noreferrer" className="btn btn-ghost">Open in new tab</a>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="hidden lg:block">
          <div className="overflow-hidden rounded-lg border border-line bg-white">
            <iframe title="Resume preview" src={`${profile.resumePdf}#view=FitH&toolbar=0`} className="h-[560px] w-full" loading="lazy" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function Finale() {
  const links = [
    { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { label: 'Phone', value: profile.phone, href: `tel:${profile.phoneTel}` },
    { label: 'WhatsApp', value: 'Message me', href: profile.whatsapp },
    { label: 'LinkedIn', value: 'chintala-mahindra', href: profile.linkedin },
  ]
  return (
    <section id="contact" className="grain relative overflow-hidden pb-10 pt-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,#3a1a06,transparent_65%)]" />
      <div className="gutter relative text-center">
        <Reveal>
          <p className="mono text-xs tracking-[0.5em] text-amber">SEASON 3</p>
          <h2 className="display mt-3 text-[16vw] font-black text-bone sm:text-[9rem]">To be continued…</h2>
          <p className="serif mx-auto mt-3 max-w-2xl text-2xl italic text-mist sm:text-3xl">The next episode is written with your team. Let's talk.</p>
        </Reveal>
        <Reveal delay={0.1} className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              className="rounded-lg border border-line bg-ink-2/80 p-4 text-left transition-colors hover:border-amber"
            >
              <p className="mono text-[10px] tracking-[0.25em] text-smoke">{l.label.toUpperCase()}</p>
              <p className="mt-1 break-all text-sm font-semibold text-bone">{l.value}</p>
            </a>
          ))}
        </Reveal>
        <Reveal delay={0.15} className="mt-8 flex justify-center gap-3">
          <a href={profile.github} target="_blank" rel="noreferrer" className="btn btn-ghost"><GitHubIcon /> GitHub</a>
          <a href={profile.resumePdf} download className="btn btn-play">Resume</a>
        </Reveal>
        <footer className="mono mt-20 flex flex-col items-center justify-between gap-2 border-t border-line pt-6 text-[11px] text-smoke sm:flex-row">
          <span>© {new Date().getFullYear()} {profile.name} · {profile.location}</span>
          <span>A personal portfolio styled like a series. Not affiliated with any streaming service.</span>
        </footer>
      </div>
    </section>
  )
}
