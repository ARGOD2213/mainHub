import { useCallback, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { viewers, type Blueprint, type BriefId, type SectionId } from './data/portfolio'
import { CurrencyProvider } from './lib/currency'
import Opening from './components/Opening'
import ProfileSelect from './components/ProfileSelect'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Trailer from './components/Trailer'
import SystemsLab from './components/SystemsLab'
import Blueprints from './components/Blueprints'
import BlueprintModal from './components/BlueprintModal'
import Platform from './components/Platform'
import { About, FAQ, Finale, Process, Resume, Stack } from './components/Sections'
import Pricing from './components/Pricing'
import Showcase from './components/Showcase'
import Students from './components/Students'

type Id = (typeof viewers)[number]['id']
const KEY = 'mahindra-series-viewer-v3'

function stored(): Id | null {
  try {
    const v = sessionStorage.getItem(KEY)
    return viewers.some((x) => x.id === v) ? (v as Id) : null
  } catch {
    return null
  }
}

export default function App() {
  return (
    <CurrencyProvider>
      <Series />
    </CurrencyProvider>
  )
}

function Series() {
  const first = stored()
  const [stage, setStage] = useState<'opening' | 'profiles' | 'home'>(first ? 'home' : 'opening')
  const [viewer, setViewer] = useState<Id>(first ?? 'business')
  const [trailer, setTrailer] = useState(false)
  const [open, setOpen] = useState<Blueprint | null>(null)
  const [picked, setPicked] = useState<BriefId | ''>('')
  const [toast, setToast] = useState('')

  const endOpening = useCallback(() => setStage('profiles'), [])
  const pick = useCallback((id: Id) => {
    setViewer(id)
    try { sessionStorage.setItem(KEY, id) } catch { /* private mode: fine */ }
    if (stage !== 'home') { window.scrollTo(0, 0); setStage('home') }
    else {
      const v = viewers.find((x) => x.id === id)!
      setToast(`Now watching as ${v.name}`)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setTimeout(() => setToast(''), 2600)
    }
  }, [stage])
  const closeTrailer = useCallback(() => setTrailer(false), [])
  const closeModal = useCallback(() => setOpen(null), [])

  const v = viewers.find((x) => x.id === viewer)!
  const sections: Record<SectionId, ReactNode> = {
    services: <Pricing key={v.track} initial={v.track} onPick={setPicked} />,
    showcase: <Showcase onPick={setPicked} />,
    students: <Students onPick={setPicked} />,
    lab: <SystemsLab />,
    blueprints: <Blueprints onOpen={setOpen} />,
    platform: <Platform />,
    process: <Process />,
    stack: <Stack />,
    about: <About />,
    faq: <FAQ />,
    resume: <Resume />,
  }
  const order = v.order

  return (
    <>
      <AnimatePresence>
        {stage === 'opening' && <Opening key="o" onDone={endOpening} />}
        {stage === 'profiles' && <ProfileSelect key="p" onPick={pick} />}
      </AnimatePresence>

      {stage === 'home' && (
        <>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-bone focus:px-3 focus:py-2 focus:text-black">Skip to content</a>
          <Navbar viewer={viewer} onViewer={pick} />
          <main id="main">
            <Hero onPlay={() => setTrailer(true)} />
            <motion.div key={viewer} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="relative z-10">
              {order.map((id) => <div key={id}>{sections[id]}</div>)}
            </motion.div>
            <Finale picked={picked} />
          </main>
        </>
      )}

      <AnimatePresence>
        {trailer && <Trailer key="t" onClose={closeTrailer} />}
        {open && <BlueprintModal key={open.id} b={open} onClose={closeModal} />}
        {toast && (
          <motion.div
            key="toast"
            className="fixed inset-x-0 bottom-6 z-[60] mx-auto w-fit max-w-[90vw] rounded-full border border-line bg-ink-2/95 px-5 py-2.5 text-sm text-bone shadow-2xl backdrop-blur"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
