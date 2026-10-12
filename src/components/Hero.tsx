import { motion } from 'framer-motion'
import { profile, tracks } from '../data/portfolio'
import { money, useCurrency } from '../lib/currency'
import PacketField from './PacketField'
import { EASE } from './Opening'

const rise = (d: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: d, duration: 0.9, ease: EASE },
})

export default function Hero({ onPlay }: { onPlay: () => void }) {
  const { cur } = useCurrency()
  const first = tracks[0].plans[0]
  return (
    <section id="top" className="grain relative flex min-h-[92svh] items-end overflow-hidden pb-[10vh] pt-28">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,#3a1a06_0%,#120a05_35%,#08080b_70%)]" />
        <div className="absolute inset-y-0 right-0 w-full opacity-90 md:w-[60%]">
          <PacketField />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-transparent md:via-ink/45" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <div className="gutter relative z-10 w-full max-w-5xl">
        <motion.p {...rise(0.1)} className="mono mb-4 flex items-center gap-2 text-xs tracking-[0.35em] text-mist">
          <span className="display rounded-sm bg-amber px-1.5 py-0.5 text-base font-black tracking-normal text-black">M</span>
          S E R I E S
        </motion.p>
        <motion.h1 {...rise(0.2)} className="display text-[17vw] font-black text-bone sm:text-[13vw] lg:text-[10.5rem]">
          {profile.first}
        </motion.h1>
        <motion.p {...rise(0.3)} className="serif -mt-1 text-3xl italic text-amber-2 sm:text-5xl">
          {profile.headline}
        </motion.p>

        <motion.div {...rise(0.4)} className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
          <span className="flex items-center gap-1.5 rounded-sm bg-emerald-400/15 px-2 py-0.5 font-bold text-emerald-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />{profile.availability}
          </span>
          <span className="text-mist">Remote · {profile.timezone}</span>
          <span className="rounded-sm border border-amber/60 px-1.5 text-[11px] font-semibold text-amber-2">SITES FROM {money(cur, first.inr, first.usd)}</span>
          <span className="text-smoke">·</span>
          {profile.genres.map((g, i) => (
            <span key={g} className="text-bone">{g}{i < profile.genres.length - 1 && <span className="ml-3 text-smoke">•</span>}</span>
          ))}
        </motion.div>

        <motion.p {...rise(0.5)} className="mt-5 max-w-[62ch] text-base leading-relaxed text-bone/85 sm:text-lg">
          {profile.logline}
        </motion.p>

        <motion.div {...rise(0.6)} className="mt-8 flex flex-wrap gap-3">
          <a href="#contact" className="btn btn-play">
            Start a project
          </a>
          <a href="#services" className="btn btn-ghost">See prices</a>
          <button onClick={onPlay} className="btn btn-ghost">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l15 8-15 8z" /></svg>
            Trailer
          </button>
        </motion.div>
      </div>
    </section>
  )
}
