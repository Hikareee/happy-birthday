import { Image, useCursor } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { photos, scrollMax } from '../config'
import { scrollState } from '../scroll-store'

function dampVec(current: THREE.Vector3, target: THREE.Vector3, lambda: number, delta: number) {
  current.x = THREE.MathUtils.damp(current.x, target.x, lambda, delta)
  current.y = THREE.MathUtils.damp(current.y, target.y, lambda, delta)
  current.z = THREE.MathUtils.damp(current.z, target.z, lambda, delta)
}

function PhotoCard({
  src,
  index,
  frame,
}: {
  src: string
  index: number
  frame: [number, number]
}) {
  const group = useRef<THREE.Group>(null)
  const spin = useRef(index * 0.35)
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)
  const target = useMemo(() => new THREE.Vector3(), [])
  const orbit = useMemo(() => new THREE.Vector3(), [])
  const direction = index % 2 === 0 ? 1 : -1

  useFrame((state, delta) => {
    if (!group.current) return
    const u = scrollState.offset * scrollMax
    const time = state.clock.elapsedTime
    const side = index === 0 ? -1 : 1
    const span = state.viewport.aspect < 1.15 ? 2.42 : 3.2
    orbit.set(side * span, Math.sin(time * 0.32 + index) * 0.08 - 0.12, -1.15)

    let scale = 0.5
    let focused = false
    let hidden = false
    if (u < 0.85) {
      if (index < 2) {
        target.copy(orbit)
        scale = 0.5
      } else {
        target.set(side * 9, 0, -8)
        scale = 0.01
        hidden = true
      }
    } else if (u < photos.length + 0.28) {
      const active = THREE.MathUtils.clamp(Math.round(u) - 1, 0, photos.length - 1)
      if (active === index) {
        const narrow = state.viewport.aspect < 1.05
        target.set(0, 0.18, 1.2)
        scale = narrow ? 0.92 : 1.08
        focused = true
      } else {
        target.set(side * 8, (index - 2) * 0.15, -6)
        scale = 0.01
        hidden = true
      }
    } else {
      target.set(side * 9, 0, -8)
      scale = 0.01
      hidden = true
    }

    const ease = hidden ? 6.4 : 3.2
    dampVec(group.current.position, target, ease, delta)
    const s = THREE.MathUtils.damp(group.current.scale.x, scale, ease, delta)
    group.current.scale.setScalar(s)
    group.current.visible = s > 0.04

    if (focused) {
      spin.current = THREE.MathUtils.damp(spin.current, hovered ? 0.18 : 0.08, 3.2, delta)
    } else if (!hidden) {
      spin.current += delta * 0.22 * direction
    }
    group.current.rotation.y = spin.current
    group.current.rotation.x = focused ? 0 : Math.sin(time * 0.2 + index) * 0.02
    group.current.rotation.z = 0
  })

  const [w, h] = frame

  return (
    <group
      ref={group}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh>
        <boxGeometry args={[w + 0.14, h + 0.14, 0.07]} />
        <meshStandardMaterial color="#E9C46A" metalness={0.55} roughness={0.38} envMapIntensity={0.8} />
      </mesh>
      <mesh>
        <boxGeometry args={[w + 0.03, h + 0.03, 0.05]} />
        <meshStandardMaterial color="#160c08" roughness={0.7} />
      </mesh>
      <Image url={src} scale={[w, h]} radius={0.04} position={[0, 0, 0.038]} />
      <Image url={src} scale={[w, h]} radius={0.04} position={[0, 0, -0.038]} rotation={[0, Math.PI, 0]} />
    </group>
  )
}

export function PhotoCards() {
  return (
    <group>
      {photos.map((photo, index) => (
        <PhotoCard key={photo.id} src={photo.src} index={index} frame={photo.frame} />
      ))}
    </group>
  )
}
