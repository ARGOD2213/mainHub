import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Group } from 'three'

const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

function Board() {
  const g = useRef<Group>(null)
  const [on, setOn] = useState(reduce)
  const [lit, setLit] = useState(reduce ? 99 : 0)
  // Timers only run once: a re-render must not restart the power-on sequence.
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
      <mesh><boxGeometry args={[3, 0.12, 2]} /><meshStandardMaterial color="#0F5B3F" /></mesh>
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} position={[-0.3, 0.08, -0.8 + i * 0.32]}>
          <boxGeometry args={[2.2, 0.02, 0.05]} />
          <meshStandardMaterial color={lit > i ? '#D0853A' : '#08281D'} />
        </mesh>))}
      <mesh position={[0.4, 0.15, 0]}><boxGeometry args={[0.7, 0.16, 0.7]} /><meshStandardMaterial color="#08281D" /></mesh>
      <mesh position={[1.2, 0.2, 0.7]}><sphereGeometry args={[0.08]} /><meshStandardMaterial color={on ? '#FFC933' : '#08281D'} emissive={on ? '#FFC933' : '#000'} /></mesh>
      {nodes.map((p, i) => <mesh key={i} position={[...p]}><sphereGeometry args={[0.04]} /><meshBasicMaterial color="#F2F0E4" /></mesh>)}
    </group>)
}

export default function BoardScene() {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 1.5, 6], fov: 40 }} aria-hidden>
      <ambientLight intensity={0.9} /><directionalLight position={[3, 5, 2]} intensity={1.2} />
      <Board />
    </Canvas>)
}