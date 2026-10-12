import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { viewers } from '../data/portfolio'
import { ViewerGlyph } from './ProfileSelect'

type Id = (typeof viewers)[number]['id']
const LINKS = [
  ['Home', '#top'],
  ['Seasons', '#seasons'],
  ['Originals', '#originals'],
  ['Skills', '#skills'],
  ['Resume', '#resume'],
  ['Contact', '#contact'],
] as const

export default function Navbar({ viewer, onViewer }: { viewer: Id; onViewer: (id: Id) => void }) {
  const [solid, setSolid] = useState(false)
  const [menu, setMenu] = useState(false)
  const [who, setWho] = useState(false)
  const v = viewers.find((x) => x.id === viewer)!

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <header
      className={`gutter fixed inset-x-0 top-0 z-50 flex h-16 items-center gap-6 transition-colors duration-300 ${solid ? 'bg-ink/95 backdrop-blur' : 'bg-gradient-to-b from-black/80 to-transparent'}`}
    >
      <a href="#top" className="display flex items-center gap-2 text-2xl font-black text-amber" aria-label="Home">
        MAHINDRA
      </a>
      <nav className="hidden gap-5 text-sm md:flex">
        {LINKS.map(([l, h]) => (
          <a key={l} href={h} className="text-mist transition-colors hover:text-bone">{l}</a>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-3">
        <a href="#contact" className="hidden rounded bg-amber px-3 py-1.5 text-xs font-bold text-black sm:inline-block">HIRE ME</a>
        <div className="relative">
          <button
            onClick={() => setWho((s) => !s)}
            className="grid h-9 w-9 place-items-center rounded text-black"
            style={{ background: v.color }}
            aria-label={`Watching as ${v.name}. Switch profile`}
            aria-expanded={who}
          >
            <ViewerGlyph id={v.id} size={20} />
          </button>
          <AnimatePresence>
            {who && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="absolute right-0 top-12 w-56 rounded-md border border-line bg-ink-2/95 p-2 shadow-2xl backdrop-blur"
              >
                {viewers.map((x) => (
                  <button
                    key={x.id}
                    onClick={() => { onViewer(x.id); setWho(false) }}
                    className={`flex w-full items-center gap-3 rounded px-2 py-2 text-left text-sm hover:bg-white/5 ${x.id === viewer ? 'text-bone' : 'text-mist'}`}
                  >
                    <span className="grid h-7 w-7 place-items-center rounded text-black" style={{ background: x.color }}><ViewerGlyph id={x.id} size={16} /></span>
                    <span><span className="block font-semibold">{x.name}</span><span className="block text-[11px] text-smoke">{x.blurb}</span></span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button className="md:hidden" onClick={() => setMenu((m) => !m)} aria-label="Menu" aria-expanded={menu}>
          <svg width="26" height="26" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d={menu ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'} /></svg>
        </button>
      </div>
      <AnimatePresence>
        {menu && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute inset-x-0 top-16 overflow-hidden border-b border-line bg-ink/98 md:hidden"
          >
            {LINKS.map(([l, h]) => (
              <a key={l} href={h} onClick={() => setMenu(false)} className="gutter block py-3 text-lg text-mist hover:text-bone">{l}</a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
