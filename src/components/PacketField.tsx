import { useEffect, useRef } from 'react'

/** Live "service mesh" behind the hero: nodes are services, glowing packets are requests. */
const NODES = [
  { id: 'client', x: 0.08, y: 0.5 },
  { id: 'gateway', x: 0.28, y: 0.5 },
  { id: 'auth · jwt', x: 0.45, y: 0.2 },
  { id: 'payroll-svc', x: 0.5, y: 0.5 },
  { id: 'rag-svc', x: 0.47, y: 0.8 },
  { id: 'redis', x: 0.72, y: 0.3 },
  { id: 'postgres', x: 0.76, y: 0.62 },
  { id: 'pgvector', x: 0.7, y: 0.9 },
  { id: 'sns', x: 0.93, y: 0.42 },
]
const EDGES: [number, number][] = [
  [0, 1], [1, 2], [1, 3], [1, 4], [3, 5], [3, 6], [4, 7], [4, 2], [3, 8], [2, 6],
]

type Packet = { e: number; t: number; v: number; hot: boolean }

export default function PacketField() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = ref.current!
    const ctx = c.getContext('2d')!
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0, h = 0, raf = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const packets: Packet[] = []

    const resize = () => {
      w = c.clientWidth; h = c.clientHeight
      c.width = w * dpr; c.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(c)

    const pos = (i: number) => ({ x: NODES[i].x * w, y: NODES[i].y * h })
    const spawn = () => packets.push({ e: Math.floor(Math.random() * EDGES.length), t: 0, v: 0.004 + Math.random() * 0.006, hot: Math.random() < 0.18 })
    for (let i = 0; i < 14; i++) { spawn(); packets[i].t = Math.random() }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      // edges
      ctx.lineWidth = 1
      for (const [a, b] of EDGES) {
        const p = pos(a), q = pos(b)
        ctx.strokeStyle = 'rgba(255,255,255,0.07)'
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke()
      }
      // packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const k = packets[i]
        const [a, b] = EDGES[k.e]
        const p = pos(a), q = pos(b)
        const x = p.x + (q.x - p.x) * k.t, y = p.y + (q.y - p.y) * k.t
        const tx = p.x + (q.x - p.x) * Math.max(0, k.t - 0.08), ty = p.y + (q.y - p.y) * Math.max(0, k.t - 0.08)
        const g = ctx.createLinearGradient(tx, ty, x, y)
        const col = k.hot ? '62,199,165' : '255,122,26'
        g.addColorStop(0, `rgba(${col},0)`); g.addColorStop(1, `rgba(${col},0.95)`)
        ctx.strokeStyle = g; ctx.lineWidth = 2
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(x, y); ctx.stroke()
        ctx.fillStyle = `rgba(${col},1)`
        ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fill()
        if (!reduce) k.t += k.v
        if (k.t >= 1) { packets.splice(i, 1); spawn() }
      }
      // nodes
      ctx.font = '600 11px "JetBrains Mono", monospace'
      ctx.textAlign = 'center'
      for (const n of NODES) {
        const x = n.x * w, y = n.y * h
        ctx.fillStyle = '#101015'; ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 1
        ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
        ctx.fillStyle = 'rgba(243,239,231,0.38)'
        ctx.fillText(n.id, x, y - 12)
      }
      if (!reduce) raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [])

  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />
}
