import { useCallback, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { viewers, type Project, type SectionId } from './data/portfolio'
import Opening from './components/Opening'
import ProfileSelect from './components/ProfileSelect'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Trailer from './components/Trailer'
import Pilot from './components/Pilot'
import Seasons from './components/Seasons'
import Originals from './components/Originals'
import ProjectModal from './components/ProjectModal'
import { ComingSoon, Credits, Finale, Resume, Skills, TopTen } from './components/Rows'

type Id = (typeof viewers)[number]['id']
const KEY = 'mahindra-series-viewer'

function stored(): Id | null {
  try {
    const v = sessionStorage.getItem(KEY)
    return viewers.some((x) => x.id === v) ? (v as Id) : null
  } catch {
    return null
  }
}

export default function App() {
  const first = stored()
  const [stage, setStage] = useState<'opening' | 'profiles' | 'home'>(first ? 'home' : 'opening')
  const [viewer, setViewer] = useState<Id>(first ?? 'recruiter')
  const [trailer, setTrailer] = useState(false)
  const [project, setProject] = useState<Project | null>(null)
  const [toast, setToast] = useState('')

  const endOpening = useCallback(() => setStage('profiles'), [])
  const pick = useCallback((id: Id) => {
    setViewer(id)
    try { sessionStorage.setItem(KEY, id) } catch { /* private mode: fine */ }
    if (stage !== 'home') { window.scrollTo(0, 0); setStage('home') }
    else {
      const v = viewers.find((x) => x.id === id)!
      setToast(`Now watching as ${v.name} — ${v.blurb.toLowerCase()}`)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setTimeout(() => setToast(''), 2600)
    }
  }, [stage])

  const sections: Record<SectionId, ReactNode> = {
    pilot: <Pilot />,
    seasons: <Seasons />,
    originals: <Originals onOpen={setProject} />,
    coming: <ComingSoon />,
    top: <TopTen />,
    skills: <Skills />,
    credits: <Credits />,
    resume: <Resume />,
  }
  const order = viewers.find((v) => v.id === viewer)!.order

  return (
    <>
      <AnimatePresence>
        {stage === 'opening' && <Opening key="o" onDone={endOpening} />}
        {stage === 'profiles' && <ProfileSelect key="p" onPick={pick} />}
      </AnimatePresence>

      {stage === 'home' && (
        <>
          <Navbar viewer={viewer} onViewer={pick} />
          <main>
            <Hero onPlay={() => setTrailer(true)} />
            <motion.div key={viewer} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="relative z-10 -mt-[6vh]">
              {order.map((id) => <div key={id}>{sections[id]}</div>)}
            </motion.div>
            <Finale />
          </main>
        </>
      )}

      <AnimatePresence>
        {trailer && <Trailer key="t" onClose={() => setTrailer(false)} />}
        {project && <ProjectModal key="m" p={project} onClose={() => setProject(null)} />}
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
