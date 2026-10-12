import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { introSlides, profile } from '../data/portfolio'
import { EASE } from './Opening'

const DUR = 3800

/** ▶ Play trailer: a story-style highlight reel. Tap sides or use ← → , Space pauses, Esc closes. */
export default function Trailer({ onClose }: { onClose: () => void }) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const n = introSlides.length

  const next = useCallback(() => setI((x) => (x + 1 < n ? x + 1 : x)), [n])
  const prev = useCallback(() => setI((x) => Math.max(0, x - 1)), [])

  useEffect(() => {
    if (paused || i === n - 1) return
    const t = setTimeout(next, DUR)
    return () => clearTimeout(t)
  }, [i, paused, n, next])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === ' ') { e.preventDefault(); setPaused((p) => !p) }
    }
    window.addEventListener('keydown', key)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', key) }
  }, [onClose, next, prev])

  const s = introSlides[i]
  const last = i === n - 1

  return (
    <motion.div
      className="grain fixed inset-0 z-[80] flex items-center justify-center bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-label="Trailer"
    >
      <div className="absolute inset-x-0 top-0 flex gap-1.5 p-4">
        {introSlides.map((_, k) => (
          <div key={k} className="h-[3px] flex-1 overflow-hidden rounded bg-white/20">
            <div
              className="h-full bg-amber"
              style={{
                width: k < i ? '100%' : k > i ? '0%' : undefined,
                animation: k === i ? `fill ${DUR}ms linear forwards` : undefined,
                animationPlayState: paused ? 'paused' : 'running',
              }}
            />
          </div>
        ))}
      </div>
      <style>{`@keyframes fill{from{width:0}to{width:100%}}`}</style>

      <button className="absolute inset-y-0 left-0 w-1/3" onClick={prev} aria-label="Previous" />
      <button className="absolute inset-y-0 right-0 w-1/3" onClick={next} aria-label="Next" />

      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          className="gutter pointer-events-none max-w-4xl text-center"
          initial={{ opacity: 0, scale: 1.06, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <p className="mono mb-6 text-xs tracking-[0.4em] text-amber sm:text-sm">{s.kicker.toUpperCase()}</p>
          <p className="serif text-4xl leading-tight text-bone sm:text-6xl">{s.text}</p>
        </motion.div>
      </AnimatePresence>

      {last && (
        <motion.div className="absolute bottom-[12vh] z-10 flex gap-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <a href="#contact" onClick={onClose} className="btn btn-play">Get in touch</a>
          <a href={profile.resumePdf} download className="btn btn-ghost">Resume</a>
        </motion.div>
      )}

      <div className="absolute bottom-5 right-5 z-10 flex gap-2">
        <button onClick={() => setPaused((p) => !p)} className="mono rounded border border-white/20 px-3 py-1.5 text-xs text-mist hover:text-bone">
          {paused ? '▶ PLAY' : '❚❚ PAUSE'}
        </button>
        <button onClick={onClose} className="mono rounded border border-white/20 px-3 py-1.5 text-xs text-mist hover:text-bone">✕ CLOSE</button>
      </div>
    </motion.div>
  )
}
