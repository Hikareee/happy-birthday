import { useCursor } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useParty } from '../party-context'
import { scrollState } from '../scroll-store'

function Flame({ lit, offset }: { lit: boolean; offset: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    const flicker = lit ? 1 + Math.sin(t * 18 + offset) * 0.12 : 0
    ref.current.scale.set(0.7 * flicker, 1.15 * flicker, 0.7 * flicker)
    ref.current.visible = lit || ref.current.scale.y > 0.05
  })
  return (
    <mesh ref={ref} position={[0, 0.18, 0]}>
      <sphereGeometry args={[0.045, 10, 10]} />
      <meshStandardMaterial
        color="#ffd27a"
        emissive="#ff9a1f"
        emissiveIntensity={lit ? 5 : 0}
        toneMapped={false}
      />
    </mesh>
  )
}

function Candle({
  position,
  lit,
  offset,
}: {
  position: [number, number, number]
  lit: boolean
  offset: number
}) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.028, 0.03, 0.28, 12]} />
        <meshStandardMaterial color="#f2f0e6" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.05, 6]} />
        <meshStandardMaterial color="#1a1208" />
      </mesh>
      <Flame lit={lit} offset={offset} />
      {lit ? <pointLight color="#ffb020" intensity={0.45} distance={1.8} position={[0, 0.22, 0]} /> : null}
    </group>
  )
}

export function Cake() {
  const group = useRef<THREE.Group>(null)
  const { wishMade, makeWish } = useParty()
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)
  const candles = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const a = (i / 7) * Math.PI * 2
      return [Math.cos(a) * 0.38, 1.12, Math.sin(a) * 0.38] as [number, number, number]
    })
  }, [])

  useFrame((state, delta) => {
    if (!group.current) return
    const u = scrollState.offset * 6
    const show = THREE.MathUtils.smoothstep(u, 4.45, 5.05)
    const finale = THREE.MathUtils.smoothstep(u, 5.5, 6)
    const y = THREE.MathUtils.lerp(-4.5, -0.95, show)
    const z = THREE.MathUtils.lerp(1.4, 0.2, show) - finale * 1.8
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, y, 2.8, delta)
    group.current.position.z = THREE.MathUtils.damp(group.current.position.z, z, 2.8, delta)
    const s = THREE.MathUtils.damp(group.current.scale.x, THREE.MathUtils.lerp(0.2, 1, show), 2.8, delta)
    group.current.scale.setScalar(s)
    group.current.rotation.y += delta * 0.25
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.7) * 0.04
    group.current.visible = show > 0.04
  })

  return (
    <group
      ref={group}
      position={[0, -4.5, 1.4]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={(event) => {
        event.stopPropagation()
        makeWish()
      }}
    >
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[1.25, 1.32, 0.48, 40]} />
        <meshStandardMaterial color="#6b3a1f" roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.25, 0.08, 10, 40]} />
        <meshStandardMaterial color="#fff5ea" roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.98, 1.05, 0.42, 40]} />
        <meshStandardMaterial color="#8a4a24" roughness={0.42} />
      </mesh>
      <mesh position={[0, 0.84, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.98, 0.07, 10, 40]} />
        <meshStandardMaterial color="#ffd76a" metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.72, 0.78, 0.34, 40]} />
        <meshStandardMaterial color="#ffd7de" roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.72, 0.06, 10, 40]} />
        <meshStandardMaterial color="#ff2d95" emissive="#ff2d95" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, 1.28, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#ff2d95" emissive="#ff2d95" emissiveIntensity={0.8} />
      </mesh>
      {candles.map((pos, i) => (
        <Candle key={i} position={pos} lit={!wishMade} offset={i} />
      ))}
    </group>
  )
}
