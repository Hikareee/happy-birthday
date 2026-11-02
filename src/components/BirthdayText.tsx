import { Center, Text3D } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { friend, scrollMax } from '../config'
import { scrollState } from '../scroll-store'

const FONT = '/fonts/helvetiker_bold.typeface.json'

function Gold({ glow = 0.32 }: { glow?: number }) {
  return (
    <meshStandardMaterial
      color="#f4d27a"
      metalness={0.95}
      roughness={0.16}
      emissive="#c4841d"
      emissiveIntensity={glow}
      envMapIntensity={1.8}
    />
  )
}

export function BirthdayText() {
  const group = useRef<THREE.Group>(null)
  const name = useMemo(() => friend.name.toUpperCase(), [])

  useFrame((state, delta) => {
    if (!group.current) return
    const u = scrollState.offset * scrollMax
    const hero = 1 - THREE.MathUtils.smoothstep(u, 0.55, 1.35)
    const finale = THREE.MathUtils.smoothstep(u, scrollMax - 0.55, scrollMax - 0.1)
    const visible = Math.max(hero, finale)
    const targetY = THREE.MathUtils.lerp(0.35, 2.1, finale)
    const targetZ = THREE.MathUtils.lerp(0, -1.4, 1 - hero)
    const targetScale = THREE.MathUtils.lerp(0.22, 1, visible)
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, targetY, 2.5, delta)
    group.current.position.z = THREE.MathUtils.damp(group.current.position.z, targetZ, 2.5, delta)
    const s = THREE.MathUtils.damp(group.current.scale.x, targetScale, 2.5, delta)
    group.current.scale.setScalar(s)
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.12
    group.current.visible = visible > 0.05
  })

  return (
    <group ref={group}>
      <Center position={[0, 0.82, 0]}>
        <Text3D
          font={FONT}
          size={0.54}
          height={0.22}
          bevelEnabled
          bevelThickness={0.04}
          bevelSize={0.018}
          bevelSegments={3}
          curveSegments={8}
        >
          HAPPY
          <Gold />
        </Text3D>
      </Center>
      <Center position={[0, 0.12, 0]}>
        <Text3D
          font={FONT}
          size={0.38}
          height={0.2}
          bevelEnabled
          bevelThickness={0.035}
          bevelSize={0.016}
          bevelSegments={3}
          curveSegments={8}
        >
          BIRTHDAY
          <Gold glow={0.4} />
        </Text3D>
      </Center>
      <Center position={[0, -0.48, 0]}>
        <Text3D
          font={FONT}
          size={0.2}
          height={0.14}
          bevelEnabled
          bevelThickness={0.03}
          bevelSize={0.012}
          bevelSegments={2}
          curveSegments={6}
        >
          {name}
          <meshStandardMaterial
            color="#22f0ff"
            emissive="#22f0ff"
            emissiveIntensity={2.2}
            toneMapped={false}
            metalness={0.3}
            roughness={0.25}
          />
        </Text3D>
      </Center>
    </group>
  )
}
