import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Group } from 'three'

const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

function Board() {
  const g = useRef<Group>(null)
  const [on, setOn] = useState(reduce)
  const [lit, setLit] = useState(reduce ? 99 : 0)
  const tokens = useMemo(() => {
    const styles = getComputedStyle(document.documentElement)
    return {
      bg0: styles.getPropertyValue('--bg-0').trim(),
      bg2: styles.getPropertyValue('--bg-2').trim(),
      ivory: styles.getPropertyValue('--ink-0').trim(),
      copper: styles.getPropertyValue('--accent-copper').trim(),
      ice: styles.getPropertyValue('--accent-ice').trim(),
    }
  }, [])

  useEffect(() => {
    if (reduce) return
    const t = [setTimeout(() => setOn(true), 500)]
    for (let i = 1; i <= 6; i++) t.push(setTimeout(() => setLit(i), 900 + i * 250))
    return () => t.forEach(clearTimeout)
  }, [])

  useFrame((_, dt) => { if (g.current && !reduce) g.current.rotation.y += dt * 0.25 })

  // Fixed pseudo-random nodes: Math.random would reshuffle on every render.
  const nodes = useMemo(() => Array.from({ length: 24 }, (_, i) => [Math.sin(i * 12.9898) * 2.2, 1.2 + (i % 6) * 0.35, Math.cos(i * 78.233) * 1.4] as const), [])

  return (
    <group ref={g} rotation={[0.5, 0.4, 0]}>
      <mesh><boxGeometry args={[3, 0.12, 2]} /><meshStandardMaterial color={tokens.bg2} /></mesh>
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} position={[-0.3, 0.08, -0.8 + i * 0.32]}>
          <boxGeometry args={[2.2, 0.02, 0.05]} />
          <meshStandardMaterial color={lit > i ? tokens.copper : tokens.bg0} />
        </mesh>))}
      <mesh position={[0.4, 0.15, 0]}><boxGeometry args={[0.7, 0.16, 0.7]} /><meshStandardMaterial color={tokens.bg0} /></mesh>
      <mesh position={[1.2, 0.2, 0.7]}><sphereGeometry args={[0.08]} /><meshStandardMaterial color={on ? tokens.ice : tokens.bg0} emissive={on ? tokens.ice : tokens.bg0} /></mesh>
      {nodes.map((p, i) => <mesh key={i} position={[...p]}><sphereGeometry args={[0.04]} /><meshBasicMaterial color={tokens.ivory} /></mesh>)}
    </group>)
}

export default function BoardScene() {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 1.5, 6], fov: 40 }} aria-hidden>
      <ambientLight intensity={0.9} /><directionalLight position={[3, 5, 2]} intensity={1.2} />
      <Board />
    </Canvas>)
}
