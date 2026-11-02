import { ContactShadows, Sparkles, Stars } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { scrollState } from '../scroll-store'

function NeonRing({
  radius,
  color,
  speed,
  tilt,
}: {
  radius: number
  color: string
  speed: number
  tilt: number
}) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.z += delta * speed
  })

  return (
    <mesh ref={ref} rotation={[tilt, 0.2, 0]}>
      <torusGeometry args={[radius, 0.018, 12, 128]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={3.4}
        toneMapped={false}
        roughness={0.2}
        metalness={0.1}
      />
    </mesh>
  )
}

export function Atmosphere() {
  const rings = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (!rings.current) return
    const hide = THREE.MathUtils.smoothstep(scrollState.offset * 6, 4.35, 5.05)
    const s = THREE.MathUtils.damp(rings.current.scale.x, 1 - hide * 0.92, 3, delta)
    rings.current.scale.setScalar(s)
    rings.current.visible = s > 0.08
  })

  return (
    <>
      <fog attach="fog" args={['#05010c', 10, 32]} />
      <ambientLight intensity={0.35} color="#9aa4ff" />
      <spotLight
        position={[6, 10, 8]}
        angle={0.55}
        penumbra={0.8}
        intensity={2.4}
        color="#ffe7a8"
      />
      <pointLight position={[-6, 2, 4]} intensity={1.6} color="#22f0ff" />
      <pointLight position={[5, -1, 3]} intensity={1.4} color="#ff2d95" />
      <Stars radius={60} depth={30} count={1800} factor={3.2} saturation={0} fade speed={0.6} />
      <Sparkles count={70} scale={14} size={2.8} speed={0.35} color="#ffd76a" opacity={0.7} />
      <group ref={rings} position={[0, 0.2, 0]}>
        <NeonRing radius={3.4} color="#22f0ff" speed={0.18} tilt={1.2} />
        <NeonRing radius={3.9} color="#ff2d95" speed={-0.12} tilt={1.45} />
        <NeonRing radius={4.5} color="#ffd76a" speed={0.08} tilt={1.05} />
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.25, 0]}>
        <circleGeometry args={[11, 64]} />
        <meshStandardMaterial color="#07040f" metalness={0.92} roughness={0.28} envMapIntensity={1.2} />
      </mesh>
      <ContactShadows position={[0, -2.24, 0]} opacity={0.55} scale={18} blur={2.4} far={5} />
    </>
  )
}
