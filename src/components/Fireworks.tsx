import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { photos, scrollMax } from '../config'
import { useParty } from '../party-context'
import { scrollState } from '../scroll-store'

const COUNT = 520
const PALETTE = [
  new THREE.Color('#E9C46A'),
  new THREE.Color('#2A9D8F'),
  new THREE.Color('#E76F51'),
  new THREE.Color('#FFF3D6'),
  new THREE.Color('#7CB342'),
]

export function Fireworks() {
  const { wishMade } = useParty()
  const points = useRef<THREE.Points>(null)
  const nextBurst = useRef(0)

  const { positions, colors, velocities, life } = useMemo(() => {
    return {
      positions: new Float32Array(COUNT * 3),
      colors: new Float32Array(COUNT * 3),
      velocities: new Float32Array(COUNT * 3),
      life: new Float32Array(COUNT).fill(-1),
    }
  }, [])

  const spawn = (origin: THREE.Vector3) => {
    let spawned = 0
    for (let i = 0; i < COUNT && spawned < 70; i += 1) {
      if (life[i] > 0) continue
      life[i] = 1
      const i3 = i * 3
      positions[i3] = origin.x
      positions[i3 + 1] = origin.y
      positions[i3 + 2] = origin.z
      const dir = new THREE.Vector3().randomDirection()
      const speed = 2.4 + Math.random() * 3.2
      velocities[i3] = dir.x * speed
      velocities[i3 + 1] = Math.abs(dir.y) * speed + 1.4
      velocities[i3 + 2] = dir.z * speed
      const color = PALETTE[i % PALETTE.length]
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
      spawned += 1
    }
  }

  useFrame((state, delta) => {
    const u = scrollState.offset * scrollMax
    const armed = wishMade || u > photos.length + 1.55
    if (armed && state.clock.elapsedTime > nextBurst.current) {
      nextBurst.current = state.clock.elapsedTime + 0.38
      spawn(
        new THREE.Vector3(
          (Math.random() - 0.5) * 8,
          1.4 + Math.random() * 2.6,
          -2 + Math.random() * 2,
        ),
      )
    }

    const dt = Math.min(delta, 0.033)
    for (let i = 0; i < COUNT; i += 1) {
      if (life[i] < 0) continue
      life[i] -= dt * 0.85
      const i3 = i * 3
      velocities[i3 + 1] -= 4.2 * dt
      positions[i3] += velocities[i3] * dt
      positions[i3 + 1] += velocities[i3 + 1] * dt
      positions[i3 + 2] += velocities[i3 + 2] * dt
      if (life[i] <= 0) {
        life[i] = -1
        positions[i3 + 1] = -99
      }
    }

    const geo = points.current?.geometry
    if (!geo) return
    const posAttr = geo.getAttribute('position')
    const colorAttr = geo.getAttribute('color')
    posAttr.needsUpdate = true
    colorAttr.needsUpdate = true
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}
