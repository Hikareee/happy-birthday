import { useCursor, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { photos, scrollMax } from '../config'
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

function Basketball({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <sphereGeometry args={[0.13, 32, 32]} />
        <meshStandardMaterial color="#d35400" roughness={0.5} />
      </mesh>
      <mesh>
        <torusGeometry args={[0.131, 0.008, 8, 48]} />
        <meshStandardMaterial color="#1a1208" />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.131, 0.008, 8, 48]} />
        <meshStandardMaterial color="#1a1208" />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.131, 0.008, 8, 48]} />
        <meshStandardMaterial color="#1a1208" />
      </mesh>
    </group>
  )
}

function BasketballHoop() {
  const net = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2
        return {
          angle,
          position: [Math.cos(angle) * 0.09, -0.09, Math.sin(angle) * 0.09] as [number, number, number],
          rotation: [Math.sin(angle) * 0.5, 0, -Math.cos(angle) * 0.5] as [number, number, number],
        }
      }),
    [],
  )

  return (
    <group position={[0.46, 1.17, 0.22]} rotation={[0, -0.7, 0]}>
      <mesh position={[0, 0.22, -0.16]}>
        <cylinderGeometry args={[0.018, 0.022, 0.44, 8]} />
        <meshStandardMaterial color="#cfd3d8" metalness={0.75} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.44, -0.06]} rotation={[1.12, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.24, 8]} />
        <meshStandardMaterial color="#cfd3d8" metalness={0.75} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.56, 0.04]}>
        <boxGeometry args={[0.58, 0.38, 0.03]} />
        <meshStandardMaterial color="#E76F51" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.56, 0.058]}>
        <boxGeometry args={[0.5, 0.3, 0.008]} />
        <meshStandardMaterial color="#f7f9fc" roughness={0.38} />
      </mesh>
      <mesh position={[0, 0.56, 0.022]}>
        <boxGeometry args={[0.5, 0.3, 0.008]} />
        <meshStandardMaterial color="#f7f9fc" roughness={0.38} />
      </mesh>
      <mesh position={[0, 0.48, 0.066]}>
        <boxGeometry args={[0.2, 0.15, 0.006]} />
        <meshStandardMaterial color="#E76F51" roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.48, 0.014]}>
        <boxGeometry args={[0.2, 0.15, 0.006]} />
        <meshStandardMaterial color="#E76F51" roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.36, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.12, 0.014, 8, 28]} />
        <meshStandardMaterial color="#E76F51" metalness={0.45} roughness={0.28} />
      </mesh>
      <group position={[0, 0.36, 0.2]}>
        {net.map((strand) => (
          <mesh key={strand.angle} position={strand.position} rotation={strand.rotation}>
            <cylinderGeometry args={[0.0045, 0.003, 0.2, 5]} />
            <meshStandardMaterial color="#fff6e4" roughness={0.55} />
          </mesh>
        ))}
        <mesh position={[0, -0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.07, 0.004, 6, 16]} />
          <meshStandardMaterial color="#fff6e4" roughness={0.55} />
        </mesh>
      </group>
      <Basketball position={[0.02, 0.22, 0.22]} rotation={[0.4, 0.7, 0.15]} />
    </group>
  )
}

function ValorantTopper() {
  const texture = useTexture('/photos/valorant-bronze.png')
  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true
  return (
    <group position={[-0.28, 1.18, 0.04]} rotation={[0, 0.4, 0]}>
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.012, 0.014, 0.28, 8]} />
        <meshStandardMaterial color="#b08d57" metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.42, 0.01]}>
        <planeGeometry args={[0.58, 0.58]} />
        <meshStandardMaterial
          map={texture}
          transparent
          alphaTest={0.12}
          side={THREE.DoubleSide}
          metalness={0.85}
          roughness={0.22}
          emissive="#8a5a20"
          emissiveIntensity={0.55}
          emissiveMap={texture}
        />
      </mesh>
    </group>
  )
}

export function Cake() {
  const group = useRef<THREE.Group>(null)
  const { wishMade, makeWish } = useParty()
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)
  const candles = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => {
      const a = (i / 5) * Math.PI * 2 + 0.35
      return [Math.cos(a) * 0.52, 1.12, Math.sin(a) * 0.52] as [number, number, number]
    })
  }, [])

  useFrame((state, delta) => {
    if (!group.current) return
    const u = scrollState.offset * scrollMax
    const show = THREE.MathUtils.smoothstep(u, photos.length + 1.4, photos.length + 1.95)
    const y = THREE.MathUtils.lerp(-4.5, -0.95, show)
    const z = THREE.MathUtils.lerp(1.4, 0.2, show)
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, y, 2.8, delta)
    group.current.position.z = THREE.MathUtils.damp(group.current.position.z, z, 2.8, delta)
    const s = THREE.MathUtils.damp(group.current.scale.x, THREE.MathUtils.lerp(0.2, 1, show), 2.8, delta)
    group.current.scale.setScalar(s)
    group.current.rotation.y += delta * 0.08
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.35) * 0.02
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
        <meshStandardMaterial color="#E9C46A" metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.72, 0.78, 0.34, 40]} />
        <meshStandardMaterial color="#ffe8c8" roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.72, 0.06, 10, 40]} />
        <meshStandardMaterial color="#E76F51" emissive="#E76F51" emissiveIntensity={0.6} />
      </mesh>
      <ValorantTopper />
      <BasketballHoop />
      {candles.map((pos, i) => (
        <Candle key={i} position={pos} lit={!wishMade} offset={i} />
      ))}
    </group>
  )
}
