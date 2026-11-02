import { Image, useCursor } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { encorePhotos, encoreStart, photos, scrollMax } from '../config'
import { useParty } from '../party-context'
import { scrollState } from '../scroll-store'
import { unwrapAge, unwrapState } from '../unwrap-store'

function dampVec(current: THREE.Vector3, target: THREE.Vector3, lambda: number, delta: number) {
  current.x = THREE.MathUtils.damp(current.x, target.x, lambda, delta)
  current.y = THREE.MathUtils.damp(current.y, target.y, lambda, delta)
  current.z = THREE.MathUtils.damp(current.z, target.z, lambda, delta)
}

function PhotoCard({
  src,
  index,
  frame,
  stage,
  halo,
}: {
  src: string
  index: number
  frame: [number, number]
  stage: number
  halo: boolean
}) {
  const group = useRef<THREE.Group>(null)
  const spin = useRef(index * 0.35)
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)
  const target = useMemo(() => new THREE.Vector3(), [])
  const orbit = useMemo(() => new THREE.Vector3(), [])
  const riseFrom = useMemo(() => new THREE.Vector3((index - 2.5) * 0.55, -6.4, 0.2), [index])
  const direction = index % 2 === 0 ? 1 : -1
  const { entered } = useParty()

  useFrame((state, delta) => {
    if (!group.current) return
    const u = scrollState.offset * scrollMax
    const time = state.clock.elapsedTime
    const age = entered ? unwrapAge() : 0
    const side = index === 0 ? -1 : 1
    const span = state.viewport.aspect < 1.15 ? 2.42 : 3.2
    orbit.set(side * span, Math.sin(time * 0.32 + index) * 0.08 - 0.12, -1.15)

    let scale = 0.5
    let focused = false
    let hidden = false
    const intro = halo && entered && !unwrapState.done && age < 5.45

    if (!entered) {
      target.copy(riseFrom)
      scale = 0.01
      dampVec(group.current.position, target, 8, delta)
      const hiddenScale = THREE.MathUtils.damp(group.current.scale.x, scale, 8, delta)
      group.current.scale.setScalar(hiddenScale)
      group.current.visible = false
      return
    }

    if (intro) {
      const count = photos.length
      const ring = (index / count) * Math.PI * 2 + age * 1.55
      const radius = 2.48
      const haloX = Math.cos(ring) * radius
      const haloY = 0.14
      const haloZ = Math.sin(ring) * radius * 0.7
      const rise = THREE.MathUtils.smoothstep(age - index * 0.09, 0, 1.05)
      const burst = THREE.MathUtils.smoothstep(age, 4.55, 5.4)

      target.set(
        THREE.MathUtils.lerp(riseFrom.x, haloX * (1 + burst * 3.4), rise),
        THREE.MathUtils.lerp(riseFrom.y, haloY + burst * 2.4, rise),
        THREE.MathUtils.lerp(riseFrom.z, haloZ * (1 + burst * 3.4), rise),
      )
      scale = THREE.MathUtils.lerp(0.06, 0.4, rise) * (1 - burst * 0.92)
      dampVec(group.current.position, target, 7.2, delta)
      const s = THREE.MathUtils.damp(group.current.scale.x, scale, 7.2, delta)
      group.current.scale.setScalar(s)
      group.current.visible = s > 0.03
      spin.current = THREE.MathUtils.damp(spin.current, -ring + Math.PI, 5.5, delta)
      group.current.rotation.y = spin.current
      group.current.rotation.x = 0
      group.current.rotation.z = 0
      return
    }

    if (Math.round(u) === stage) {
      const narrow = state.viewport.aspect < 1.05
      target.set(0, halo ? 0.18 : 0.08, halo ? 1.2 : 1.45)
      scale = halo ? (narrow ? 0.92 : 1.08) : narrow ? 1.18 : 1.38
      focused = true
    } else if (halo && u < 0.85 && index < 2) {
      target.copy(orbit)
      scale = 0.5
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
      position={[0, -6.4, 0]}
      scale={0.01}
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
        <PhotoCard
          key={photo.id}
          src={photo.src}
          index={index}
          frame={photo.frame}
          stage={index + 1}
          halo
        />
      ))}
      {encorePhotos.map((photo, index) => (
        <PhotoCard
          key={photo.id}
          src={photo.src}
          index={index}
          frame={photo.frame}
          stage={encoreStart + index}
          halo={false}
        />
      ))}
    </group>
  )
}
