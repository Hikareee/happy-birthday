import { Sparkles } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

function Starfield({
  count,
  radius,
  size,
  color,
  speed,
}: {
  count: number
  radius: number
  size: number
  color: string
  speed: number
}) {
  const points = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i += 1) {
      const r = radius * (0.4 + Math.random() * 0.6)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [count, radius])

  useFrame((_, delta) => {
    if (!points.current) return
    points.current.rotation.y += delta * speed
    points.current.rotation.x += delta * speed * 0.12
  })

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={0.95}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  )
}

export function Atmosphere() {
  return (
    <>
      <fog attach="fog" args={['#07140c', 28, 110]} />
      <ambientLight intensity={0.38} color="#d7ead0" />
      <spotLight
        position={[5, 9, 7]}
        angle={0.48}
        penumbra={0.92}
        intensity={1.45}
        color="#ffe7a8"
      />
      <pointLight position={[-5, 2, 4]} intensity={0.55} color="#2A9D8F" />
      <pointLight position={[4, 0, 3]} intensity={0.4} color="#E76F51" />
      <Starfield count={4200} radius={70} size={0.12} color="#f4ffe8" speed={0.012} />
      <Starfield count={900} radius={48} size={0.22} color="#fff3c4" speed={0.018} />
      <Starfield count={220} radius={36} size={0.38} color="#E9C46A" speed={0.01} />
      <Sparkles count={60} scale={20} size={3} speed={0.2} color="#E9C46A" opacity={0.7} />
      <Sparkles count={40} scale={16} size={2} speed={0.14} color="#fff8e0" opacity={0.5} />
    </>
  )
}
