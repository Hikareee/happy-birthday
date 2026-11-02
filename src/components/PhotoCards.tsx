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
  const spin = useRef(0)
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)
  const target = useMemo(() => new THREE.Vector3(), [])
  const orbit = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, delta) => {
    if (!group.current) return
    const u = scrollState.offset * scrollMax
    const time = state.clock.elapsedTime
    const slots = [
      [-3.6, 0.85, -1.2],
      [3.6, 0.85, -1.2],
      [-3.8, -0.75, -1.85],
      [3.8, -0.75, -1.85],
      [0, -1.35, -2.25],
    ]
    const slot = slots[index] ?? [0, 0, -2]
    orbit.set(
      slot[0] + Math.sin(time * 0.6 + index) * 0.12,
      slot[1] + Math.cos(time * 0.8 + index) * 0.18,
      slot[2],
    )

    let scale = 0.7
    if (u < 0.85) {
      target.copy(orbit)
      scale = 0.7
    } else if (u < photos.length + 0.8) {
      const active = THREE.MathUtils.clamp(Math.round(u) - 1, 0, photos.length - 1)
      if (active === index) {
        const narrow = state.viewport.aspect < 1.05
        target.set(narrow ? 0.15 : 1.6, narrow ? -0.05 : 0.2, 1.2)
        scale = narrow ? 0.92 : 1.12
      } else {
        target.set(index % 2 === 0 ? -6.4 : 6.4, (index - 1.5) * 0.35, -4)
        scale = 0.34
      }
    } else {
      const arc = (index / photos.length) * Math.PI * 1.35 - 0.7
      target.set(Math.sin(arc) * 4.8, 1.2 + Math.sin(time + index) * 0.1, -3.4 + Math.cos(arc) * 1.1)
      scale = 0.55
    }

    dampVec(group.current.position, target, 3.2, delta)
    const s = THREE.MathUtils.damp(group.current.scale.x, scale, 3.2, delta)
    group.current.scale.setScalar(s)
    spin.current = THREE.MathUtils.damp(spin.current, hovered ? 0.35 : 0, 4, delta)
    group.current.rotation.y = spin.current + (u < 0.85 ? Math.sin(time + index) * 0.05 : 0)
    group.current.rotation.z = Math.sin(time * 0.4 + index) * 0.03
  })

  const [w, h] = frame

  return (
    <group
      ref={group}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={(event) => {
        event.stopPropagation()
        spin.current += Math.PI
      }}
    >
      <mesh position={[0, 0, -0.045]} castShadow>
        <boxGeometry args={[w + 0.16, h + 0.16, 0.09]} />
        <meshStandardMaterial color="#f4d27a" metalness={0.95} roughness={0.22} envMapIntensity={1.6} />
      </mesh>
      <mesh position={[0, 0, -0.09]}>
        <boxGeometry args={[w + 0.08, h + 0.08, 0.04]} />
        <meshStandardMaterial color="#160c08" metalness={0.4} roughness={0.5} />
      </mesh>
      <Image url={src} scale={[w, h]} radius={0.05} position={[0, 0, 0.01]} />
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
