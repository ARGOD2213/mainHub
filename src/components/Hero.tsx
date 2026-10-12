import { motion } from 'framer-motion'
import { profile } from '../data/portfolio'
import PacketField from './PacketField'
import { EASE } from './Opening'

const rise = (d: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: d, duration: 0.9, ease: EASE },
})

export default function Hero({ onPlay }: { onPlay: () => void }) {
  return (
    <section id="top" className="grain relative flex min-h-[100svh] items-end overflow-hidden pb-[12vh] pt-24">
      {/* backdrop */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,#3a1a06_0%,#120a05_35%,#08080b_70%)]" />
        <div className="absolute inset-y-0 right-0 w-full opacity-90 md:w-[62%]">
          <PacketField />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-transparent md:via-ink/40" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <div className="gutter relative z-10 w-full max-w-4xl">
        <motion.p {...rise(0.1)} className="mono mb-4 flex items-center gap-2 text-xs tracking-[0.35em] text-mist">
          <span className="display rounded-sm bg-amber px-1.5 py-0.5 text-base font-black tracking-normal text-black">M</span>
          S E R I E S
        </motion.p>
        <motion.h1 {...rise(0.2)} className="display text-[17vw] font-black text-bone sm:text-[13vw] lg:text-[10.5rem]">
          {profile.first}
        </motion.h1>
        <motion.p {...rise(0.3)} className="serif -mt-1 text-3xl italic text-amber-2 sm:text-5xl">
          The Backend Series
        </motion.p>

        <motion.div {...rise(0.4)} className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
          <span className="rounded-sm bg-amber/15 px-2 py-0.5 font-bold text-amber">New season</span>
          <span className="text-mist">2024 – now</span>
          <span className="rounded-sm border border-mist/50 px-1.5 text-[11px] font-semibold text-mist">JAVA 21</span>
          <span className="text-mist">3 seasons</span>
          <span className="text-smoke">·</span>
          {profile.genres.map((g, i) => (
            <span key={g} className="text-bone">{g}{i < profile.genres.length - 1 && <span className="ml-3 text-smoke">•</span>}</span>
          ))}
        </motion.div>

        <motion.p {...rise(0.5)} className="mt-5 max-w-2xl text-base leading-relaxed text-bone/85 sm:text-lg">
          {profile.logline}
        </motion.p>

        <motion.div {...rise(0.6)} className="mt-8 flex flex-wrap gap-3">
          <button onClick={onPlay} className="btn btn-play">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l15 8-15 8z" /></svg>
            Play trailer
          </button>
          <a href="#originals" className="btn btn-ghost">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5v.01" /></svg>
            See projects
          </a>
          <a href={profile.resumePdf} download className="btn btn-ghost">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14" /></svg>
            Resume
          </a>
        </motion.div>

        <motion.p {...rise(0.75)} className="mono mt-8 text-xs text-smoke">
          <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400 align-middle" />
          Open to: {profile.lookingFor}
        </motion.p>
      </div>
    </section>
  )
}
