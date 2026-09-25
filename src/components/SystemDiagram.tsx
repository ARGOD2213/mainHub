import { useEffect, useMemo, useRef, useState } from 'react'
import type { Arch, Node } from '../constants/architecture'

type Size = 'preview' | 'full'

type Point = {
  node: Node
  x: number
  y: number
  width: number
  height: number
  row: number
}

type Edge = {
  parent: Point
  child: Point
  label?: string
}

type Props = {
  architecture: Arch
  size: Size
  interactive?: boolean
  expandedNode?: string | null
  onNodeSelect?: (id: string | null) => void
}

const DESKTOP_BREAKPOINT = 680
const NODE_WIDTH = 180
const NODE_HEIGHT = 72
const ROW_GAP = 116
const MOBILE_GAP = 92
const PAD = 28

function flatten(arch: Arch) {
  return arch.layers.flatMap(layer => layer.nodes.map(node => ({ node, row: layer.row })))
}

function layoutDesktop(arch: Arch, width: number): Point[] {
  return arch.layers.flatMap(layer => {
    const count = layer.nodes.length
    const usable = Math.max(width - PAD * 2, NODE_WIDTH)
    const gap = count > 1 ? Math.max(18, (usable - count * NODE_WIDTH) / (count - 1)) : 0
    const total = count * NODE_WIDTH + Math.max(0, count - 1) * gap
    const start = Math.max(PAD, (width - total) / 2)
    return layer.nodes.map((node, index) => ({
      node,
      x: start + index * (NODE_WIDTH + gap),
      y: PAD + layer.row * ROW_GAP,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      row: layer.row,
    }))
  })
}

function layoutMobile(arch: Arch, width: number): Point[] {
  const nodeWidth = Math.min(NODE_WIDTH, Math.max(0, width - PAD * 2))
  let cursor = PAD
  const points: Point[] = []
  for (const layer of [...arch.layers].sort((a, b) => a.row - b.row)) {
    for (const node of layer.nodes) {
      points.push({ node, x: (width - nodeWidth) / 2, y: cursor, width: nodeWidth, height: NODE_HEIGHT, row: layer.row })
      cursor += NODE_HEIGHT + 18
    }
    cursor += MOBILE_GAP - 18
  }
  return points
}

function connectorPath(parent: Point, child: Point) {
  const x1 = parent.x + parent.width / 2
  const y1 = parent.y + parent.height
  const x2 = child.x + child.width / 2
  const y2 = child.y
  const midY = y1 + (y2 - y1) / 2
  return `M ${x1} ${y1} V ${midY} H ${x2} V ${y2}`
}

function wrapLabel(value: string, max = 22) {
  if (value.length <= max) return [value]
  const words = value.split(' ')
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (next.length > max && line) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines.slice(0, 3)
}

function buildEdges(points: Point[]): Edge[] {
  const byId = new Map(points.map(point => [point.node.id, point]))
  const edges: Edge[] = []
  for (const child of points) {
    for (const parentId of child.node.parentIds ?? []) {
      const parent = byId.get(parentId)
      if (!parent) continue
      edges.push({ parent, child, label: child.node.edgeLabels?.[parentId] })
    }
  }
  return edges
}

export default function SystemDiagram({
  architecture,
  size,
  interactive = false,
  expandedNode = null,
  onNodeSelect,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(760)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const observer = new ResizeObserver(entries => {
      const next = Math.floor(entries[0]?.contentRect.width ?? 760)
      if (next > 0) setWidth(next)
    })
    observer.observe(host)
    return () => observer.disconnect()
  }, [])

  const mobile = width < DESKTOP_BREAKPOINT
  const points = useMemo(
    () => mobile ? layoutMobile(architecture, width) : layoutDesktop(architecture, width),
    [architecture, mobile, width],
  )
  const edges = useMemo(() => buildEdges(points), [points])

  useEffect(() => {
    if (import.meta.env.DEV) {
      const ids = new Set(flatten(architecture).map(({ node }) => node.id))
      for (const { node } of flatten(architecture)) {
        if ((node.parentIds?.length ?? 0) > 0 && (node.parentIds ?? []).some(parent => !ids.has(parent))) {
          console.warn(`[SystemDiagram] Node "${node.id}" references a missing parent.`)
        }
      }
    }
  }, [architecture])

  const height = mobile
    ? Math.max(260, points.length * (NODE_HEIGHT + 18) + architecture.layers.length * (MOBILE_GAP - 18) + PAD)
    : Math.max(260, (Math.max(...architecture.layers.map(layer => layer.row)) + 1) * ROW_GAP + PAD)

  const rootIds = useMemo(() => new Set(points.filter(p => !p.node.parentIds?.length).map(p => p.node.id)), [points])

  useEffect(() => {
    if (import.meta.env.DEV) {
      for (const point of points) {
        if (!rootIds.has(point.node.id) && !edges.some(edge => edge.child.node.id === point.node.id)) {
          console.warn(`[SystemDiagram] Non-root node "${point.node.id}" has no incoming connector.`)
        }
      }
    }
  }, [edges, points, rootIds])

  return (
    <div ref={hostRef} className={`system-diagram system-diagram--${size}`}>
      <svg
        className={interactive ? 'system-svg system-svg--interactive' : 'system-svg'}
        viewBox={`0 0 ${Math.max(width, 320)} ${height}`}
        role={interactive ? 'group' : 'img'}
        aria-label={`${size === 'full' ? 'Full' : 'Preview'} architecture topology`}
      >
        <defs>
          <linearGradient id="diagram-flow" x1="0" x2="1">
            <stop offset="0%" stopColor="var(--accent-copper)" />
            <stop offset="55%" stopColor="var(--accent-violet)" />
            <stop offset="100%" stopColor="var(--accent-ice)" />
          </linearGradient>
        </defs>

        {edges.map((edge, index) => (
          <g key={`${edge.parent.node.id}-${edge.child.node.id}-${index}`}>
            <path className={interactive ? 'flow-path' : 'topology-path'} d={connectorPath(edge.parent, edge.child)} fill="none" stroke="url(#diagram-flow)" strokeWidth="2" />
            {edge.label && (
              <text
                className="edge-label"
                x={(edge.parent.x + edge.parent.width / 2 + edge.child.x + edge.child.width / 2) / 2}
                y={(edge.parent.y + edge.parent.height + edge.child.y) / 2 - 6}
                textAnchor="middle"
              >
                {edge.label}
              </text>
            )}
          </g>
        ))}

        {points.map(point => {
          const selected = point.node.id === expandedNode
          const lines = wrapLabel(point.node.name)
          const activate = () => interactive && onNodeSelect?.(selected ? null : point.node.id)
          return (
            <g
              key={point.node.id}
              className={`system-node ${selected ? 'is-selected' : ''}`}
              transform={`translate(${point.x},${point.y})`}
              tabIndex={interactive ? 0 : -1}
              role={interactive ? 'button' : undefined}
              aria-label={interactive ? `${point.node.name}. Activate to show details.` : undefined}
              onClick={activate}
              onKeyDown={event => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  activate()
                }
              }}
            >
              <rect width={point.width} height={point.height} rx="0" />
              <rect className="node-accent" width="5" height={point.height} />
              <text x={16} y={24}>
                {lines.map((line, index) => <tspan key={line} x={16} dy={index === 0 ? 0 : 17}>{line}</tspan>)}
              </text>
              {size === 'full' && <text className="node-id" x={16} y={point.height - 12}>{point.node.id}</text>}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
