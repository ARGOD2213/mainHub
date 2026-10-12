import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { profile } from '../data/portfolio'

export const EASE = [0.22, 1, 0.36, 1] as const

/** Cold open: studio card → name → series title → play. */
export default function Opening({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const t = [setTimeout(() => setStep(1), 300), setTimeout(() => setStep(2), 1700), setTimeout(() => setStep(3), 3300)]
    const key = (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') onDone() }
    window.addEventListener('keydown', key)
    return () => { t.forEach(clearTimeout); window.removeEventListener('keydown', key) }
  }, [onDone])

  return (
    <motion.div
      className="grain fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-black"
      exit={{ opacity: 0, scale: 1.08 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.p
            key="studio"
            className="mono text-xs tracking-[0.5em] text-mist sm:text-sm"
            initial={{ opacity: 0, letterSpacing: '0.2em' }}
            animate={{ opacity: 1, letterSpacing: '0.5em' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: EASE }}
          >
            {profile.studio}
          </motion.p>
        )}
        {step >= 2 && (
          <motion.div key="title" className="flex flex-col items-center px-4 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="display flex text-[22vw] font-black text-bone sm:text-[15vw]" aria-label={profile.first}>
              {profile.first.split('').map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ delay: i * 0.07, duration: 0.8, ease: EASE }}
                >
                  {ch}
                </motion.span>
              ))}
            </h1>
            <motion.div
              className="mt-2 h-[3px] bg-amber"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.6, duration: 1, ease: EASE }}
            />
            <motion.p
              className="mono mt-4 text-xs tracking-[0.45em] text-amber sm:text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              {profile.series}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {step === 3 && (
        <motion.button
          onClick={onDone}
          className="absolute bottom-[14vh] flex items-center gap-3 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold tracking-wide text-bone hover:border-amber hover:text-amber"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l15 8-15 8z" /></svg>
          PLAY
        </motion.button>
      )}

      <button onClick={onDone} className="mono absolute right-5 top-5 text-xs tracking-widest text-smoke hover:text-bone">
        SKIP INTRO →
      </button>
    </motion.div>
  )
}
