import { motion } from 'framer-motion'
import { viewers } from '../data/portfolio'
import { EASE } from './Opening'

type Id = (typeof viewers)[number]['id']

export function ViewerGlyph({ id, size = 40 }: { id: Id; size?: number }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  if (id === 'hiring') return <svg {...p}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M3 13h18" /></svg>
  if (id === 'cto') return <svg {...p}><path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" /></svg>
  return <svg {...p}><path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M9 12a12 12 0 016-8c2 0 5 0 5 0s0 3 0 5a12 12 0 01-8 6zM9 12l3 3M15 9h.01" /></svg>
}

export default function ProfileSelect({ onPick }: { onPick: (id: Id) => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-ink px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <motion.h2
        className="text-center text-3xl font-semibold text-bone sm:text-5xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        Who's watching?
      </motion.h2>
      <p className="mt-3 text-center text-sm text-smoke">Pick a profile. It changes the order of the show, not the facts.</p>
      <div className="mt-10 grid grid-cols-3 gap-4 sm:gap-10">
        {viewers.map((v, i) => (
          <motion.button
            key={v.id}
            onClick={() => onPick(v.id)}
            className="group flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.1, duration: 0.6, ease: EASE }}
          >
            <span
              className="grid aspect-square w-[24vw] max-w-[150px] place-items-center rounded-md text-black ring-0 ring-bone transition-all duration-200 group-hover:scale-105 group-hover:ring-4 group-focus-visible:ring-4"
              style={{ background: `linear-gradient(140deg, ${v.color}, ${v.color}99)` }}
            >
              <ViewerGlyph id={v.id} size={44} />
            </span>
            <span className="text-sm text-mist group-hover:text-bone sm:text-lg">{v.name}</span>
            <span className="hidden text-xs text-smoke sm:block">{v.blurb}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
