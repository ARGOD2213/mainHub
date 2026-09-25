import {useEffect,useRef,useState} from 'react'
import type {PointerEvent} from 'react'
import {gsap} from 'gsap'
import type {ProjectTheme} from '../constants/samples'
import type {Arch} from '../constants/architecture'
import SystemDiagram from './SystemDiagram'

type Project={name:string;problem?:string;bullets:string[];stack:{label:string;items:string[]}[];decisions:string[];theme:ProjectTheme;github?:string;demo?:string;status?:string;note?:string;when?:string;tech?:string}
const icons:Record<ProjectTheme,string>={api:'REST',realtime:'LIVE',ai:'RAG',kit:'KIT'}

export default function ProjectModal({project,architecture,trigger,onClose}:{project:Project;architecture:Arch;trigger:HTMLElement|null;onClose:()=>void}){
  const dialogRef=useRef<HTMLDialogElement>(null)
  const panelRef=useRef<HTMLDivElement>(null)
  const closeRef=useRef<HTMLButtonElement>(null)
  const previousFocus=useRef<HTMLElement|null>(null)
  const [expandedNode,setExpandedNode]=useState<string|null>(null)
  const [hoveredNode,setHoveredNode]=useState<string|null>(null)
  const dragStart=useRef<number|null>(null)
  const reduced=typeof window!=='undefined'&&window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(()=>{
    const d=dialogRef.current,p=panelRef.current
    if(!d||!p)return
    previousFocus.current=trigger
    document.body.style.overflow='hidden'
    d.showModal()
    const from=trigger?.getBoundingClientRect()
    const to=p.getBoundingClientRect()
    if(from&&!reduced){
      const dx=from.left-to.left,dy=from.top-to.top,sx=from.width/to.width,sy=from.height/to.height
      gsap.fromTo(p,{x:dx,y:dy,scaleX:sx,scaleY:sy,borderRadius:0},{x:0,y:0,scaleX:1,scaleY:1,duration:.38,ease:'power3.out',clearProps:'transform'})
    }else if(reduced){gsap.fromTo(p,{opacity:0},{opacity:1,duration:.15})}
    requestAnimationFrame(()=>closeRef.current?.focus())
    if(!reduced){gsap.fromTo(p.querySelectorAll('.modal-stagger'),{y:12,opacity:0},{y:0,opacity:1,duration:.32,stagger:.06,ease:'power3.out',delay:.38,clearProps:'transform,opacity'})}
    return()=>{document.body.style.overflow='';previousFocus.current?.focus()}
  },[trigger,reduced])

  useEffect(()=>{
    const d=dialogRef.current
    if(!d)return
    const key=(e:KeyboardEvent)=>{
      if(e.key==='Escape'){e.preventDefault();close()}
      if(e.key!=='Tab')return
      const items=Array.from(d.querySelectorAll<HTMLElement>('button,a,[tabindex]:not([tabindex="-1"])')).filter(x=>!x.hasAttribute('disabled'))
      if(!items.length)return
      const first=items[0],last=items[items.length-1]
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
    }
    d.addEventListener('keydown',key)
    return()=>d.removeEventListener('keydown',key)
  })

  const close=()=>{
    const d=dialogRef.current,p=panelRef.current
    if(!d||!p)return
    const to=trigger?.getBoundingClientRect()
    const from=p.getBoundingClientRect()
    const finish=()=>{if(d.open)d.close();onClose()}
    if(to&&!reduced){
      const dx=to.left-from.left,dy=to.top-from.top,sx=to.width/from.width,sy=to.height/from.height
      gsap.to(p,{x:dx,y:dy,scaleX:sx,scaleY:sy,duration:.3,ease:'power3.in',onComplete:finish})
    }else{gsap.to(p,{opacity:0,duration:reduced?.15:.15,onComplete:finish})}
  }

  const onGrabPointerDown=(e:PointerEvent)=>{dragStart.current=e.clientY;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)}
  const onGrabPointerMove=(e:PointerEvent)=>{if(dragStart.current===null)return;const dy=Math.max(0,e.clientY-dragStart.current);if(panelRef.current)panelRef.current.style.transform=`translateY(${dy}px)`}
  const onGrabPointerUp=(e:React.PointerEvent)=>{if(dragStart.current===null)return;const dy=Math.max(0,e.clientY-dragStart.current);dragStart.current=null;if(panelRef.current)panelRef.current.style.transform='';if(dy>110)close()}
  return <dialog ref={dialogRef} className={`project-dialog project-dialog--${project.theme}`} aria-modal="true" aria-labelledby="project-dialog-title" onClick={e=>{if(e.target===dialogRef.current)close()}}>
    <div ref={panelRef} className="project-modal-panel">
      <div className="project-grab" role="button" tabIndex={0} aria-label="Drag down to dismiss" onPointerDown={onGrabPointerDown} onPointerMove={onGrabPointerMove} onPointerUp={onGrabPointerUp} />
      <header className="project-modal-head">
        <div><span className="theme-icon">{icons[project.theme]}</span><span className="sample-label">{project.when?'BUILT PROJECT':'SAMPLE BUILD · NOT CLIENT WORK'}</span><h2 id="project-dialog-title">{project.name}</h2></div>
        <div className="modal-head-actions"><span className="status-chip">{project.theme==='realtime'?'LIVE (simulated)':(project.status??(project.when?'Private repository':'Planned'))}</span><button ref={closeRef} className="modal-close" type="button" aria-label={`Close ${project.name} details`} onClick={close}>×</button></div>
      </header>
      <div className="project-modal-body">
        <section className="modal-section modal-intro"><p className="eyebrow">PROBLEM</p><p>{project.problem??project.when}</p>{project.note&&<p className="sample-note">{project.note}</p>}</section>
        <section className="modal-section modal-stagger"><p className="eyebrow">WHAT IT DOES</p><ul>{project.bullets.map(x=><li key={x}>{x}</li>)}</ul></section>
        <section className="modal-section modal-stagger"><div className="modal-section-head"><p className="eyebrow">ARCHITECTURE</p><span>Hover or focus a node</span></div><SystemDiagram architecture={architecture} size="full" interactive expandedNode={expandedNode} onNodeSelect={setExpandedNode} onNodeHover={setHoveredNode}/>{(hoveredNode||expandedNode)&&<div className="modal-node-caption" aria-live="polite"><span>SELECTED NODE</span><strong>{architecture.layers.flatMap(layer=>layer.nodes).find(n=>n.id===(hoveredNode||expandedNode))?.name}</strong><p>{architecture.layers.flatMap(layer=>layer.nodes).find(n=>n.id===(hoveredNode||expandedNode))?.note}</p></div>}</section>
        <section className="modal-section modal-stagger"><p className="eyebrow">STACK</p><div className="stack-groups">{project.stack.map(group=><div className="stack-group" key={group.label}><strong>{group.label}</strong><div>{group.items.length?group.items.map(x=><span className="project-tags" key={x}>{x}</span>):<span className="stack-empty">—</span>}</div></div>)}</div></section>
        <section className="modal-section modal-stagger"><p className="eyebrow">DECISIONS / DESIGN INTENT</p><ul>{project.decisions.map(x=><li key={x}>{x}</li>)}</ul></section>
        {(project.github||project.demo)&&<section className="modal-section modal-stagger"><p className="eyebrow">LINKS</p><div className="hero-actions">{project.github&&<a className="btn" href={project.github} target="_blank" rel="noreferrer">GitHub</a>}{project.demo&&<a className="btn" href={project.demo} target="_blank" rel="noreferrer">Live demo</a>}</div></section>}
        <div className="project-modal-cta modal-stagger"><a href="#contact" onClick={e=>{e.preventDefault();close();window.setTimeout(()=>document.querySelector('#contact')?.scrollIntoView({behavior:reduced?'auto':'smooth'}),320)}}>Want something like this for your product? → Contact</a></div>
      </div>
    </div>
  </dialog>
}
